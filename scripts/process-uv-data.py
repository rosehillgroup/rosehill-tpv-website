#!/usr/bin/env python3
"""
NASA UV Index Data Processing Pipeline
Processes AURA_UVI_CLIM_M data for the Rosehill TPV UV Fade Visualiser

Requirements:
    pip install requests numpy rasterio rio-cogeo
    brew install gdal

Usage:
    python3 process-uv-data.py [--year 2024] [--output-dir output]
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
import requests
import numpy as np

try:
    import rasterio
    from rasterio.transform import from_bounds
    from rasterio.enums import Resampling
    from rio_cogeo.cogeo import cog_translate
    from rio_cogeo.profiles import cog_profiles
except ImportError:
    print("ERROR: Missing required packages.")
    print("Install with: pip install rasterio rio-cogeo requests numpy")
    sys.exit(1)


class UVDataProcessor:
    """Process NASA UV Index data for web visualization"""

    # NASA NEO AURA UV Index data URLs
    NASA_BASE_URL = "https://neo.gsfc.nasa.gov/archive/geotiff.float/AURA_UVI_CLIM_M"

    # UV Index color ramp (for reference - tiles will use this)
    UV_COLORS = {
        'low': (0, 2, '#C5E1A5'),
        'moderate': (3, 5, '#FFF59D'),
        'high': (6, 7, '#FFB74D'),
        'very_high': (8, 10, '#EF5350'),
        'extreme': (11, 16, '#AB47BC')
    }

    def __init__(self, output_dir='output', year=None):
        self.output_dir = Path(output_dir)
        self.year = year or datetime.now().year
        self.downloads_dir = self.output_dir / 'downloads'
        self.tiles_dir = self.output_dir / 'tiles' / 'uv'
        self.data_dir = self.output_dir / 'data'

        # Create directories
        for dir_path in [self.downloads_dir, self.tiles_dir, self.data_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

    def download_monthly_data(self):
        """Download 12 monthly GeoTIFF files from NASA NEO"""
        print("\n=== Step 1: Downloading NASA Monthly UV Data ===")

        monthly_files = []
        for month in range(1, 13):
            # NASA file naming: AURA_UVI_CLIM_M_YYYY-MM.FLOAT.TIFF
            filename = f"AURA_UVI_CLIM_M_{self.year}-{month:02d}.FLOAT.TIFF"
            url = f"{self.NASA_BASE_URL}/{filename}"
            local_path = self.downloads_dir / filename

            if local_path.exists():
                print(f"✓ Month {month:02d}: Already downloaded")
                monthly_files.append(local_path)
                continue

            print(f"⬇ Month {month:02d}: Downloading from {url}")
            try:
                response = requests.get(url, stream=True, timeout=60)
                response.raise_for_status()

                with open(local_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)

                file_size = local_path.stat().st_size / (1024 * 1024)
                print(f"  ✓ Downloaded {file_size:.1f} MB")
                monthly_files.append(local_path)

            except requests.RequestException as e:
                print(f"  ✗ Failed to download: {e}")
                print(f"  Try manual download from: {url}")
                return None

        print(f"\n✓ Downloaded {len(monthly_files)} monthly files")
        return monthly_files

    def calculate_annual_mean(self, monthly_files):
        """Calculate annual mean UV Index from monthly files"""
        print("\n=== Step 2: Calculating Annual Mean UV Index ===")

        monthly_arrays = []
        profile = None

        for i, filepath in enumerate(monthly_files, 1):
            print(f"Reading month {i:02d}...", end=' ')
            with rasterio.open(filepath) as src:
                data = src.read(1)
                monthly_arrays.append(data)
                if profile is None:
                    profile = src.profile.copy()
            print("✓")

        print("\nCalculating mean across 12 months...")
        annual_mean = np.mean(monthly_arrays, axis=0)

        # Clip to reasonable UV Index range (0-16)
        annual_mean = np.clip(annual_mean, 0, 16)

        print(f"UV Index range: {annual_mean.min():.2f} - {annual_mean.max():.2f}")
        print(f"Global mean UV: {annual_mean.mean():.2f}")

        # Save as regular GeoTIFF first
        output_path = self.output_dir / 'uv_mean.tif'
        profile.update(dtype=rasterio.float32, count=1, compress='lzw', nodata=-9999)

        with rasterio.open(output_path, 'w', **profile) as dst:
            dst.write(annual_mean.astype(rasterio.float32), 1)

        print(f"✓ Saved annual mean to: {output_path}")
        return output_path

    def create_cog(self, input_tif):
        """Convert to Cloud Optimized GeoTIFF"""
        print("\n=== Step 3: Creating Cloud Optimized GeoTIFF ===")

        output_path = self.output_dir / 'uv_mean_cog.tif'

        # COG profile with web optimization
        profile = cog_profiles.get('lzw')
        profile.update({
            'TILED': 'YES',
            'BLOCKXSIZE': 512,
            'BLOCKYSIZE': 512,
            'COMPRESS': 'LZW'
        })

        print(f"Converting to COG...")
        cog_translate(
            str(input_tif),
            str(output_path),
            profile,
            in_memory=False,
            quiet=False
        )

        file_size = output_path.stat().st_size / (1024 * 1024)
        print(f"✓ Created COG: {output_path} ({file_size:.1f} MB)")
        return output_path

    def load_uv_classes_config(self):
        """Load UV classes configuration from JSON"""
        config_path = Path(__file__).parent / 'uv_classes.json'
        with open(config_path, 'r') as f:
            return json.load(f)

    def create_class_raster(self, mean_tif):
        """Convert Float32 UV values (0-16) to Byte classes (0-4)"""
        print("\n=== Step 4: Creating Class-Based Raster ===")

        config = self.load_uv_classes_config()
        output_path = self.output_dir / 'uv_class.tif'

        # Build gdal_calc expression from config
        # Classes: 0=Low(0-3), 1=Moderate(3-6), 2=High(6-8), 3=VeryHigh(8-11), 4=Extreme(11-16)
        calc_expr = "(A<3)*0 + ((A>=3)*(A<6))*1 + ((A>=6)*(A<8))*2 + ((A>=8)*(A<11))*3 + (A>=11)*4"

        cmd = [
            'gdal_calc.py',
            '-A', str(mean_tif),
            '--outfile', str(output_path),
            '--NoDataValue', str(config['nodata']),
            '--type', 'Byte',
            '--calc', calc_expr,
            '--overwrite',
            '--quiet'
        ]

        print(f"Converting UV values to classes...")
        print(f"  0 = Low (0-2.9 UVI)")
        print(f"  1 = Moderate (3-5.9 UVI)")
        print(f"  2 = High (6-7.9 UVI)")
        print(f"  3 = Very High (8-10.9 UVI)")
        print(f"  4 = Extreme (11-16 UVI)")

        try:
            subprocess.run(cmd, check=True, capture_output=True)
            file_size = output_path.stat().st_size / (1024 * 1024)
            print(f"✓ Created class raster: {output_path} ({file_size:.1f} MB)")
            return output_path
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to create class raster: {e.stderr.decode()}")
            return None
        except FileNotFoundError:
            print("✗ gdal_calc.py not found. Install with: brew install gdal")
            return None

    def warp_to_z6_grid(self, class_tif):
        """Warp class raster to Web Mercator Z6 grid (16384x16384)"""
        print("\n=== Step 5: Warping to Web Mercator Z6 Grid ===")

        config = self.load_uv_classes_config()
        output_path = self.output_dir / 'uv_class_3857_z6.tif'

        # Web Mercator world bounds
        MINX = MINY = -20037508.34
        MAXX = MAXY = 20037508.34

        cmd = [
            'gdalwarp',
            '-t_srs', 'EPSG:3857',
            '-te', str(MINX), str(MINY), str(MAXX), str(MAXY),
            '-ts', '16384', '16384',
            '-srcnodata', str(config['nodata']),
            '-dstnodata', str(config['nodata']),
            '-r', 'near',
            str(class_tif),
            str(output_path),
            '-co', 'COMPRESS=LZW',
            '-co', 'TILED=YES',
            '-overwrite'
        ]

        print(f"Target: EPSG:3857, 16384x16384 pixels")
        print(f"Bounds: ±20037508.34")
        print(f"Resampling: nearest neighbor")

        try:
            subprocess.run(cmd, check=True, capture_output=True)

            # Verify the output
            verify_cmd = ['gdalinfo', str(output_path)]
            result = subprocess.run(verify_cmd, check=True, capture_output=True, text=True)

            # Parse size and pixel size
            for line in result.stdout.split('\n'):
                if 'Size is' in line:
                    print(f"✓ {line.strip()}")
                elif 'Pixel Size' in line:
                    print(f"✓ {line.strip()}")

            file_size = output_path.stat().st_size / (1024 * 1024)
            print(f"✓ Created Z6-aligned raster: {output_path} ({file_size:.1f} MB)")
            return output_path
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to warp to Z6 grid: {e.stderr.decode()}")
            return None

    def build_mode_overviews(self, z6_tif):
        """Build MODE overviews for consistent zoom-out behavior"""
        print("\n=== Step 6: Building MODE Overviews ===")

        # Overview factors for Z6→Z0: 2, 4, 8, 16, 32, 64
        cmd = [
            'gdaladdo',
            '-r', 'mode',
            str(z6_tif),
            '2', '4', '8', '16', '32', '64'
        ]

        print(f"Building overviews with MODE resampling...")
        print(f"  Factors: 2, 4, 8, 16, 32, 64 (for Z5→Z0)")

        try:
            subprocess.run(cmd, check=True, capture_output=True)

            # Verify overviews
            verify_cmd = ['gdalinfo', str(z6_tif)]
            result = subprocess.run(verify_cmd, check=True, capture_output=True, text=True)

            if 'Overviews:' in result.stdout:
                for line in result.stdout.split('\n'):
                    if 'Overviews:' in line:
                        print(f"✓ {line.strip()}")
                        break

            print(f"✓ Built MODE overviews successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to build overviews: {e.stderr.decode()}")
            return False

    def create_palette_file(self):
        """Create GDAL color palette file from UV classes config"""
        config = self.load_uv_classes_config()
        palette_path = self.output_dir / 'uv_palette.txt'

        palette_lines = []
        for class_id, rgb in config['palette'].items():
            palette_lines.append(f"{class_id} {rgb.replace(',', ' ')} 255")

        # Add transparent NoData
        palette_lines.append(f"{config['nodata']} 0 0 0 0")

        with open(palette_path, 'w') as f:
            f.write('\n'.join(palette_lines))

        print(f"✓ Created palette file: {palette_path}")
        return palette_path

    def apply_palette_to_classes(self, z6_tif):
        """Apply color palette to class raster"""
        print("\n=== Step 7: Applying Color Palette ===")

        palette_path = self.create_palette_file()
        output_path = self.output_dir / 'uv_pal_3857_z6.tif'

        cmd = [
            'gdaldem', 'color-relief',
            str(z6_tif),
            str(palette_path),
            str(output_path),
            '-alpha',
            '-nearest_color_entry'
        ]

        print(f"Applying 5-color UV Index palette...")

        try:
            subprocess.run(cmd, check=True, capture_output=True)
            file_size = output_path.stat().st_size / (1024 * 1024)
            print(f"✓ Created paletted GeoTIFF: {output_path} ({file_size:.1f} MB)")
            return output_path
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to apply palette: {e.stderr.decode()}")
            return None

    def create_color_ramp_file(self):
        """Create GDAL color ramp file for UV Index visualization"""
        color_ramp_path = self.output_dir / 'uv_color_ramp.txt'

        # UV Index color ramp mapping byte values (0-255) to RGB colors
        # 0-16 UVI scaled to 0-255 byte range
        color_ramp_content = """# UV Index Color Ramp (Byte values 0-255)
# Low (0-2 UVI → Byte 0-32)
0   197 225 165
32  197 225 165

# Moderate (3-5 UVI → Byte 48-80)
48  255 245 157
80  255 245 157

# High (6-7 UVI → Byte 96-112)
96  255 183 77
112 255 183 77

# Very High (8-10 UVI → Byte 128-160)
128 239 83 80
160 239 83 80

# Extreme (11-16 UVI → Byte 176-255)
176 171 71 188
255 171 71 188
"""

        with open(color_ramp_path, 'w') as f:
            f.write(color_ramp_content)

        print(f"✓ Created color ramp file: {color_ramp_path}")
        return color_ramp_path

    def apply_color_to_data(self, cog_path):
        """Convert grayscale UV data to colored imagery before tiling"""
        print("\n=== Step 4: Applying Color Ramp to UV Data ===")

        # Step 4a: Create color ramp file
        color_ramp_path = self.create_color_ramp_file()

        # Step 4b: Scale float32 (0-16) to 8-bit (0-255)
        print("Converting to 8-bit for color application...")
        eight_bit_path = self.output_dir / 'uv_mean_8bit.tif'

        try:
            subprocess.run([
                'gdal_translate',
                '-ot', 'Byte',
                '-scale', '0', '16', '0', '255',
                str(cog_path),
                str(eight_bit_path)
            ], check=True, capture_output=True)
            print(f"✓ Created 8-bit version: {eight_bit_path}")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to create 8-bit version: {e.stderr.decode()}")
            return None

        # Step 4c: Apply color ramp using gdaldem
        print("Applying UV color ramp...")
        colored_path = self.output_dir / 'uv_mean_colour.tif'

        try:
            subprocess.run([
                'gdaldem', 'color-relief',
                str(eight_bit_path),
                str(color_ramp_path),
                str(colored_path),
                '-alpha',
                '-nearest_color_entry'
            ], check=True, capture_output=True)

            file_size = colored_path.stat().st_size / (1024 * 1024)
            print(f"✓ Created colored GeoTIFF: {colored_path} ({file_size:.1f} MB)")
            return colored_path
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to apply colors: {e.stderr.decode()}")
            return None
        except FileNotFoundError:
            print("✗ gdaldem not found. Install with: brew install gdal")
            return None

    def build_rgb_overviews(self, pal_z6_path):
        """Build overviews on RGB paletted file to preserve discrete colors across zooms"""
        print("\n=== Step 7b: Building Overviews on Paletted RGB ===")

        # Build overviews with NEAREST to preserve discrete colors
        # Can't use MODE on RGB, but NEAREST on properly colored categorical data works
        cmd = [
            'gdaladdo',
            '-r', 'nearest',
            str(pal_z6_path),
            '2', '4', '8', '16', '32', '64'
        ]

        print(f"Building NEAREST overviews on RGB file...")
        print(f"  Factors: 2, 4, 8, 16, 32, 64 (for Z5→Z0)")
        print(f"  Method: NEAREST (preserves discrete colors from MODE-aggregated classes)")

        try:
            subprocess.run(cmd, check=True, capture_output=True)

            # Verify overviews
            verify_cmd = ['gdalinfo', str(pal_z6_path)]
            result = subprocess.run(verify_cmd, check=True, capture_output=True, text=True)

            overview_sizes = []
            for line in result.stdout.split('\n'):
                if 'Overviews:' in line:
                    # Extract overview dimensions
                    sizes = line.split('Overviews:')[1].strip()
                    overview_sizes = sizes.split(', ')
                    break

            if overview_sizes:
                print(f"✓ Overviews: {', '.join(overview_sizes)}")
            print(f"✓ Built NEAREST overviews on RGB file")
            return True

        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to build RGB overviews: {e.stderr.decode()}")
            return False

    def generate_tiles(self, pal_z6_path):
        """Generate XYZ raster tiles from Z6-aligned paletted imagery"""
        print("\n=== Step 8: Generating XYZ Tiles (zoom 0-6) ===")
        print("This may take 10-15 minutes...")

        # Use gdal2tiles.py with nearest neighbor to preserve discrete colors
        # gdal2tiles will use the MODE overviews for consistent zoom-out behavior
        cmd = [
            'gdal2tiles.py',
            '--zoom=0-6',
            '--processes=4',
            '--resampling=near',  # CRITICAL: nearest neighbor to preserve colors
            '--tilesize=256',
            '--xyz',  # CRITICAL: Use XYZ tile scheme (not TMS) for MapLibre
            '--webviewer=none',
            str(pal_z6_path),
            str(self.tiles_dir)
        ]

        print(f"Using nearest neighbor resampling with MODE overviews")
        print(f"Running: {' '.join(cmd)}")

        try:
            result = subprocess.run(
                cmd,
                check=True,
                capture_output=True,
                text=True
            )

            # Count generated tiles
            tile_count = sum(1 for _ in self.tiles_dir.rglob('*.png'))
            print(f"\n✓ Generated {tile_count} tiles")
            print(f"  Tiles directory: {self.tiles_dir}")

            return True

        except subprocess.CalledProcessError as e:
            print(f"\n✗ Tile generation failed: {e}")
            print(f"STDOUT: {e.stdout}")
            print(f"STDERR: {e.stderr}")
            return False
        except FileNotFoundError:
            print("\n✗ gdal2tiles.py not found")
            print("Install with: brew install gdal")
            return False

    def generate_gradient_tiles(self, mean_tif_path):
        """Generate smooth gradient tiles from float UV raster with Z6 alignment"""
        print("\n=== Generating Gradient Tiles (Smooth) ===")
        print("This process creates smooth color gradients while maintaining zoom stability")

        # Output paths
        mean_z6_path = self.output_dir / 'uv_mean_3857_z6.tif'
        grad_z6_path = self.output_dir / 'uv_grad_3857_z6.tif'
        grad_tiles_dir = self.output_dir / 'tiles' / 'uv-gradient'
        grad_ramp_path = Path(__file__).parent / 'uv_gradient_ramp.txt'

        # Ensure tiles directory exists
        grad_tiles_dir.mkdir(parents=True, exist_ok=True)

        # Step 1: Warp float raster to Z6 grid with bilinear
        print("\n--- Step 1: Warping float UV raster to Z6 grid ---")
        print(f"  Source: {mean_tif_path}")
        print(f"  Target: {mean_z6_path}")
        print(f"  Method: Bilinear (smooth for continuous data)")

        # Web Mercator bounds at Z6
        MINX = -20037508.3427892
        MINY = -20037508.3427892
        MAXX = 20037508.3427892
        MAXY = 20037508.3427892

        cmd_warp = [
            'gdalwarp',
            '-t_srs', 'EPSG:3857',
            '-te', str(MINX), str(MINY), str(MAXX), str(MAXY),
            '-ts', '16384', '16384',  # Z6 grid: 256px tiles × 64 tiles
            '-r', 'bilinear',  # Smooth resampling for continuous data
            '-srcnodata', 'nan',
            '-dstnodata', 'nan',
            str(mean_tif_path),
            str(mean_z6_path)
        ]

        try:
            subprocess.run(cmd_warp, check=True, capture_output=True)
            print(f"✓ Warped to Z6 grid: {mean_z6_path}")
        except subprocess.CalledProcessError as e:
            print(f"✗ Warping failed: {e.stderr.decode()}")
            return False

        # Step 2: Build AVERAGE overviews on float raster
        print("\n--- Step 2: Building AVERAGE overviews on float raster ---")
        print("  Factors: 2, 4, 8, 16, 32, 64 (for Z5→Z0)")
        print("  Method: AVERAGE (appropriate for continuous float data)")

        cmd_addo = [
            'gdaladdo',
            '-r', 'average',
            str(mean_z6_path),
            '2', '4', '8', '16', '32', '64'
        ]

        try:
            subprocess.run(cmd_addo, check=True, capture_output=True)
            print(f"✓ Built AVERAGE overviews on float raster")
        except subprocess.CalledProcessError as e:
            print(f"✗ Overview generation failed: {e.stderr.decode()}")
            return False

        # Step 3: Apply gradient color relief
        print("\n--- Step 3: Applying gradient color relief ---")
        print(f"  Gradient ramp: {grad_ramp_path}")
        print(f"  Output: {grad_z6_path}")

        if not grad_ramp_path.exists():
            print(f"✗ Gradient ramp file not found: {grad_ramp_path}")
            return False

        cmd_relief = [
            'gdaldem',
            'color-relief',
            str(mean_z6_path),
            str(grad_ramp_path),
            str(grad_z6_path),
            '-alpha'  # Add alpha channel
        ]

        try:
            subprocess.run(cmd_relief, check=True, capture_output=True)
            print(f"✓ Applied gradient colors: {grad_z6_path}")
        except subprocess.CalledProcessError as e:
            print(f"✗ Color relief failed: {e.stderr.decode()}")
            return False

        # Step 4: Generate tiles with bilinear resampling
        print("\n--- Step 4: Generating gradient tiles (bilinear) ---")
        print("This may take 10-15 minutes...")

        cmd_tiles = [
            'gdal2tiles.py',
            '--zoom=0-6',
            '--processes=4',
            '--resampling=bilinear',  # Smooth resampling for gradients
            '--tilesize=256',
            '--xyz',  # XYZ tile scheme for MapLibre
            '--webviewer=none',
            str(grad_z6_path),
            str(grad_tiles_dir)
        ]

        print(f"Running: {' '.join(cmd_tiles)}")

        try:
            subprocess.run(cmd_tiles, check=True, capture_output=True, text=True)

            # Count generated tiles
            tile_count = sum(1 for _ in grad_tiles_dir.rglob('*.png'))
            print(f"\n✓ Generated {tile_count} gradient tiles")
            print(f"  Tiles directory: {grad_tiles_dir}")

            return True

        except subprocess.CalledProcessError as e:
            print(f"\n✗ Gradient tile generation failed: {e}")
            print(f"STDOUT: {e.stdout}")
            print(f"STDERR: {e.stderr}")
            return False
        except FileNotFoundError:
            print("\n✗ gdal2tiles.py not found")
            print("Install with: brew install gdal")
            return False

    def create_lookup_grid(self, cog_path, resolution=0.25):
        """Create JSON lookup grid for client-side queries"""
        print(f"\n=== Step 6: Creating Lookup Grid ({resolution}° resolution) ===")

        with rasterio.open(cog_path) as src:
            # Define grid sampling points
            lats = np.arange(-90, 90 + resolution, resolution)
            lons = np.arange(-180, 180 + resolution, resolution)

            lookup_data = {}
            total_points = len(lats) * len(lons)
            print(f"Sampling {total_points:,} grid points...")

            processed = 0
            for lat in lats:
                for lon in lons:
                    # Sample raster at this point
                    try:
                        row, col = src.index(lon, lat)
                        value = src.read(1, window=((row, row+1), (col, col+1)))[0, 0]

                        if not np.isnan(value) and value > 0:
                            # Categorize UV Index
                            if value < 3:
                                category = 'Low'
                            elif value < 6:
                                category = 'Moderate'
                            elif value < 8:
                                category = 'High'
                            elif value < 11:
                                category = 'Very High'
                            else:
                                category = 'Extreme'

                            key = f"{lat:.2f},{lon:.2f}"
                            lookup_data[key] = {
                                'uvi': round(float(value), 2),
                                'category': category
                            }

                    except (IndexError, ValueError):
                        pass  # Out of bounds

                    processed += 1
                    if processed % 10000 == 0:
                        progress = (processed / total_points) * 100
                        print(f"  Progress: {progress:.1f}% ({processed:,} / {total_points:,})")

            print(f"✓ Sampled {len(lookup_data):,} valid grid points")

        # Save lookup JSON
        output_file = self.data_dir / 'uv_lookup_full.json'
        lookup_json = {
            'version': f'uv-v{self.year}',
            'resolution': resolution,
            'description': f'Global UV Index lookup grid - {resolution}° resolution',
            'generated': datetime.now().isoformat(),
            'data': lookup_data
        }

        with open(output_file, 'w') as f:
            json.dump(lookup_json, f, separators=(',', ':'))

        file_size = output_file.stat().st_size / (1024 * 1024)
        print(f"✓ Created lookup JSON: {output_file} ({file_size:.2f} MB)")

        return output_file

    def generate_statistics(self, cog_path):
        """Generate statistics about the UV data"""
        print("\n=== UV Index Statistics ===")

        with rasterio.open(cog_path) as src:
            data = src.read(1)
            valid_data = data[~np.isnan(data) & (data > 0)]

            print(f"Valid pixels: {len(valid_data):,}")
            print(f"Min UV Index: {valid_data.min():.2f}")
            print(f"Max UV Index: {valid_data.max():.2f}")
            print(f"Mean UV Index: {valid_data.mean():.2f}")
            print(f"Median UV Index: {np.median(valid_data):.2f}")

            print("\nUV Index Distribution:")
            for category, (min_val, max_val, color) in self.UV_COLORS.items():
                count = np.sum((valid_data >= min_val) & (valid_data <= max_val))
                percent = (count / len(valid_data)) * 100
                print(f"  {category.replace('_', ' ').title():15s} ({min_val:2d}-{max_val:2d}): {percent:5.1f}%")

    def create_upload_script(self):
        """Create bash script for uploading to Supabase"""
        print("\n=== Creating Upload Script ===")

        script_path = self.output_dir / 'upload-to-supabase.sh'

        script_content = f"""#!/bin/bash
# Upload processed UV data to Supabase Storage
#
# Prerequisites:
#   1. Install Supabase CLI: npm install -g supabase
#   2. Login: supabase login
#   3. Link project: supabase link --project-ref okakomwfikxmwllvliva

set -e

PROJECT_REF="okakomwfikxmwllvliva"
BUCKET_NAME="uv-data"

echo "=== Uploading UV Data to Supabase ==="
echo "Project: $PROJECT_REF"
echo "Bucket: $BUCKET_NAME"
echo ""

# Upload tiles directory (recursive)
echo "📦 Uploading tiles..."
supabase storage cp \\
  --project-ref $PROJECT_REF \\
  --recursive \\
  tiles/uv/ \\
  "storage://$BUCKET_NAME/tiles/uv/" \\
  --cache-control "public, max-age=31536000, immutable"

echo "✓ Tiles uploaded"

# Upload lookup JSON
echo "📦 Uploading lookup grid..."
supabase storage cp \\
  --project-ref $PROJECT_REF \\
  data/uv_lookup_full.json \\
  "storage://$BUCKET_NAME/data/uv_lookup_full.json" \\
  --cache-control "public, max-age=604800"

echo "✓ Lookup grid uploaded"

# Upload colored GeoTIFF (optional - for reference)
echo "📦 Uploading colored GeoTIFF..."
supabase storage cp \\
  --project-ref $PROJECT_REF \\
  uv_mean_colour.tif \\
  "storage://$BUCKET_NAME/data/uv_mean_colour.tif" \\
  --cache-control "public, max-age=2592000"

echo "✓ Colored GeoTIFF uploaded"

echo ""
echo "🎉 Upload complete!"
echo ""
echo "Access URLs:"
echo "  Tiles: https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/$BUCKET_NAME/tiles/uv/{{z}}/{{x}}/{{y}}.png"
echo "  Lookup: https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/$BUCKET_NAME/data/uv_lookup_full.json"
"""

        with open(script_path, 'w') as f:
            f.write(script_content)

        # Make executable
        os.chmod(script_path, 0o755)

        print(f"✓ Created upload script: {script_path}")
        print(f"  Run with: cd {self.output_dir} && ./upload-to-supabase.sh")

        return script_path

    def run_full_pipeline(self):
        """Execute complete data processing pipeline"""
        print("╔════════════════════════════════════════════════╗")
        print("║   NASA UV Index Data Processing Pipeline      ║")
        print("║   For Rosehill TPV UV Fade Visualiser         ║")
        print("╚════════════════════════════════════════════════╝")
        print(f"\nYear: {self.year}")
        print(f"Output directory: {self.output_dir.absolute()}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        # Step 1: Download data
        monthly_files = self.download_monthly_data()
        if not monthly_files or len(monthly_files) != 12:
            print("\n❌ Failed to download all monthly files")
            return False

        # Step 2: Calculate annual mean
        mean_tif = self.calculate_annual_mean(monthly_files)

        # Step 3: Create COG
        cog_path = self.create_cog(mean_tif)

        # Step 4: Create class-based raster (0-4 classes)
        class_path = self.create_class_raster(mean_tif)
        if not class_path:
            print("\n❌ Failed to create class raster")
            return False

        # Step 5: Warp to Web Mercator Z6 grid (16384x16384)
        z6_path = self.warp_to_z6_grid(class_path)
        if not z6_path:
            print("\n❌ Failed to warp to Z6 grid")
            return False

        # Step 6: Build MODE overviews for consistent zoom behavior
        overviews_success = self.build_mode_overviews(z6_path)
        if not overviews_success:
            print("\n❌ Failed to build overviews")
            return False

        # Step 7: Apply color palette to classes
        pal_z6_path = self.apply_palette_to_classes(z6_path)
        if not pal_z6_path:
            print("\n❌ Failed to apply palette")
            return False

        # Step 7b: Build overviews on RGB paletted file
        rgb_overviews_success = self.build_rgb_overviews(pal_z6_path)
        if not rgb_overviews_success:
            print("\n❌ Failed to build RGB overviews")
            return False

        # Step 8: Generate tiles from Z6-aligned paletted imagery
        tiles_success = self.generate_tiles(pal_z6_path)
        if not tiles_success:
            print("\n⚠️  Tile generation failed, but continuing...")

        # Step 6: Create lookup grid
        lookup_file = self.create_lookup_grid(cog_path)

        # Step 7: Generate statistics
        self.generate_statistics(cog_path)

        # Step 8: Create upload script
        upload_script = self.create_upload_script()

        print("\n╔════════════════════════════════════════════════╗")
        print("║             PIPELINE COMPLETE ✓                ║")
        print("╚════════════════════════════════════════════════╝")
        print(f"\nFinished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\nGenerated files:")
        print(f"  • COG (grayscale): {cog_path}")
        print(f"  • Class raster: {class_path}")
        print(f"  • Z6-aligned (EPSG:3857): {z6_path}")
        print(f"  • Paletted Z6: {pal_z6_path}")
        print(f"  • Tiles: {self.tiles_dir} (zoom 0-6)")
        print(f"  • Lookup: {lookup_file}")
        print(f"  • Upload script: {upload_script}")
        print(f"\nNext steps:")
        print(f"  1. Review the output files")
        print(f"  2. Ensure Supabase storage bucket 'uv-data' exists")
        print(f"  3. Run upload script: cd {self.output_dir} && ./upload-to-supabase.sh")
        print(f"  4. Verify tiles show consistent colors at all zoom levels")

        return True


def main():
    parser = argparse.ArgumentParser(
        description='Process NASA UV Index data for web visualization'
    )
    parser.add_argument(
        '--year',
        type=int,
        default=datetime.now().year,
        help='Year to process (default: current year)'
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default='output',
        help='Output directory (default: output)'
    )
    parser.add_argument(
        '--resolution',
        type=float,
        default=0.25,
        help='Lookup grid resolution in degrees (default: 0.25)'
    )

    args = parser.parse_args()

    # Create processor and run pipeline
    processor = UVDataProcessor(
        output_dir=args.output_dir,
        year=args.year
    )

    success = processor.run_full_pipeline()
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
