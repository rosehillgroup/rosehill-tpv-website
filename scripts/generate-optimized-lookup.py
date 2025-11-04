#!/usr/bin/env python3
"""
Generate optimized 0.5° UV Index lookup grid
Reduces from 48MB/1M points to ~12MB/260k points (1-2MB gzipped)
"""

import json
import sys
import numpy as np
import rasterio
from pathlib import Path

def generate_lookup_grid(cog_path, resolution=0.5, output_path=None):
    """
    Generate 0.5° lookup grid with 1-decimal UVI precision

    Args:
        cog_path: Path to input GeoTIFF
        resolution: Grid resolution in degrees (default 0.5)
        output_path: Output JSON path (default: ../output/data/uv_lookup_v1.json)

    Returns:
        dict: Lookup grid with metadata
    """
    print(f"Generating {resolution}° lookup grid...")
    print(f"Input: {cog_path}")

    with rasterio.open(cog_path) as src:
        # Generate grid coordinates
        # 721 rows × 1441 cols at 0.5°
        lats = np.arange(90, -90.5, -resolution)
        lons = np.arange(-180, 180.5, resolution)

        print(f"Grid dimensions: {len(lats)} rows × {len(lons)} cols")
        print(f"Total points: {len(lats) * len(lons):,}")

        grid = []
        processed = 0
        total_points = len(lats) * len(lons)

        for i, lat in enumerate(lats):
            row = []
            for j, lon in enumerate(lons):
                try:
                    # Sample raster at this point
                    py, px = src.index(lon, lat)
                    val = src.read(1, window=((py, py+1), (px, px+1)))[0, 0]

                    # Handle NaN/invalid data (oceans, poles)
                    if np.isnan(val) or val < 0:
                        val = 0.0

                    # Round to 1 decimal place
                    uvi = round(float(val), 1)

                    # Clamp to valid UVI range [0, 16]
                    uvi = max(0.0, min(16.0, uvi))

                    row.append(uvi)

                except (IndexError, ValueError):
                    # Out of bounds → ocean or edge
                    row.append(0.0)

                processed += 1
                if processed % 50000 == 0:
                    progress = (processed / total_points) * 100
                    print(f"  Progress: {progress:.1f}% ({processed:,} / {total_points:,})")

            grid.append(row)

        print(f"✓ Sampled {processed:,} grid points")

        # Create lookup structure
        lookup = {
            "meta": {
                "resolution_deg": resolution,
                "domain": [-90, 90, -180, 180],
                "uviMin": 0,
                "uviMax": 16,
                "version": "uv-v1",
                "rows": len(lats),
                "cols": len(lons),
                "generated": "2025-11-03",
                "source": "NASA AURA_UVI_CLIM_M 2010 Annual Mean"
            },
            "grid": grid
        }

        # Write JSON (compact, no whitespace)
        if output_path is None:
            output_path = Path(cog_path).parent / 'data' / 'uv_lookup_v1.json'

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        print(f"Writing JSON to {output_path}...")
        with open(output_path, 'w') as f:
            json.dump(lookup, f, separators=(',', ':'))

        # Report file size
        import os
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✓ Generated {output_path} ({size_mb:.2f} MB uncompressed)")
        print(f"  Expected gzipped size: ~{size_mb * 0.15:.2f} MB")
        print(f"  Grid: {lookup['meta']['rows']} × {lookup['meta']['cols']} = {processed:,} points")

        return lookup


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Generate optimized UV Index lookup grid'
    )
    parser.add_argument(
        '--input',
        type=str,
        default='../output/uv_mean.tif',
        help='Input GeoTIFF path'
    )
    parser.add_argument(
        '--resolution',
        type=float,
        default=0.5,
        help='Grid resolution in degrees (default: 0.5)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='../output/data/uv_lookup_v1.json',
        help='Output JSON path'
    )

    args = parser.parse_args()

    # Resolve paths
    script_dir = Path(__file__).parent
    input_path = (script_dir / args.input).resolve()
    output_path = (script_dir / args.output).resolve()

    if not input_path.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    # Generate lookup grid
    print("╔════════════════════════════════════════════════╗")
    print("║   UV Index Lookup Grid Generator              ║")
    print("╚════════════════════════════════════════════════╝")
    print()

    try:
        lookup = generate_lookup_grid(input_path, args.resolution, output_path)

        print()
        print("╔════════════════════════════════════════════════╗")
        print("║             GENERATION COMPLETE ✓              ║")
        print("╚════════════════════════════════════════════════╝")
        print()
        print("Next steps:")
        print("  1. Upload to Supabase Storage")
        print("  2. CDN will serve with gzip/brotli compression")
        print("  3. Update UV visualiser to use new lookup URL")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
