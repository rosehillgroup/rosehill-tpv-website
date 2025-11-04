# Rosehill TPV® UV Fade Visualiser
**Version:** 1.0  
**Last updated:** 2025-11-02  
**Status:** In development  
**Mode:** NASA-data-driven  

---

## 1. Overview
The UV Fade Visualiser demonstrates how ultraviolet radiation intensity varies globally and how that affects colour stability of EPDM granules versus Rosehill TPV®.  
It integrates NASA’s global UV Index climatology into an interactive web map that computes expected colour loss by location and duration (12 m / 3 y).

Primary users: specifiers, architects, distributors, and engineers.  
Technical users: internal developers, AI-coders (Claude Code / Codex), and data engineers.

---

## 2. Key message
> EPDM fades dramatically under UV exposure; Rosehill TPV® retains its colour stability even in extreme sunlight.

---

## 3. Objectives
- Display continuous global UV Index gradients using NASA climatology.
- Allow users to click or search any location and obtain its mean UV Index.
- Compute and display predicted EPDM colour loss (vs. TPV baseline).
- Provide transparent data citations and a clear “Methodology” explanation.
- Achieve smooth client-side performance (sub-3 s initial load).

---

## 4. Stack summary
| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (App Router) + React + TypeScript + Tailwind |
| **Map engine** | MapLibre GL JS (raster source) |
| **Backend/API** | Next.js route handlers (serverless on Vercel or Netlify) |
| **Data processing** | Python (GDAL, rasterio, rio-cogeo) |
| **Storage** | AWS S3 or Netlify Large Media (Cloud Optimised GeoTIFF or XYZ tiles) |
| **CMS** | Sanity (for copy, case studies, and methodology text) |
| **Analytics** | GA4 + Tag Manager |
| **Versioning** | GitHub Actions / uv-data-pipeline workflow |

---

## 5. Data sources and citations
| Dataset | Provider | Description / Use | Citation |
|----------|-----------|------------------|-----------|
| **AURA_UVI_CLIM_M** | NASA Earth Observations (GSFC) | Global UV Index climatology – 12 monthly means, 0–16 scale, WGS84. | https://neo.gsfc.nasa.gov/view.php?datasetId=AURA_UVI_CLIM_M |
| **WHO GHO UV Radiation** | World Health Organization | Population-weighted daily ambient UV R (J/m²). Reference for methodology tab. | https://www.who.int/data/gho/data/indicators/indicator-details/GHO/uv-radiation |
| **Regional QA** | NIWA (NZ), BoM (AU), NEA (SG), BfS (DE) | Used for regional verification of climatology results. | national sources |

---

## 6. Reference UV bands
| Category | Peak UVI | Colour ramp hex | Typical example |
|-----------|-----------|----------------|----------------|
| Extreme | ≥ 11 | #93000A | La Paz, Lima, Singapore |
| Very High | 8 – 10 | #D32F2F | Sydney, Dubai, Cape Town |
| High | 6 – 7 | #F57C00 | Los Angeles, Madrid, Tokyo |
| Moderate | 3 – 5 | #FBC02D | London, Berlin |
| Low | 0 – 2 | #C5E1A5 | Reykjavik, Tromsø |

---

## 7. Fade model
**Purpose:** map UV exposure to expected EPDM colour loss after 12 months.

L_12(D) = L_max * (1 - e^(-kD))

Where:  
- D = normalised annual mean UVI (0 – 1)  
- L_max = 0.85 (max 85 % loss)  
- k ≈ 2.4 calibrated so D = 0.9 → L ≈ 0.8  
- TPV loss = 0 (default), adjustable via TPV_LOSS_FRACTION (0–0.1).

**Extended duration**
L_t(D) = L_max * (1 - e^(-k D t))
for t in years (1 or 3).

---

## 8. Data-processing workflow (ETL)
1. Download 12 monthly GeoTIFFs from NASA NEO (AURA_UVI_CLIM_M).  
2. Merge and average to compute annual mean.  
3. Convert to Cloud Optimised GeoTIFF (COG).  
4. Upload to S3 / Netlify.  
5. Optionally create XYZ tiles with gdal2tiles for MapLibre.

---

## 9. API design
### /api/uv/lookup
Returns UV Index at lat/lon and derived fade values.

Example:
```
/api/uv/lookup?lat=51.5074&lon=-0.1278&years=1
```

Response:
```json
{
  "uviAnnualMean": 6.7,
  "uviPeak": 7.1,
  "bucket": "High",
  "epdmLoss12m": 0.50,
  "tpvLoss12m": 0.00,
  "citations": [
    {"label":"NASA NEO AURA_UVI_CLIM_M","href":"https://neo.gsfc.nasa.gov/view.php?datasetId=AURA_UVI_CLIM_M"},
    {"label":"WHO GHO UV Radiation","href":"https://www.who.int/data/gho/data/indicators/indicator-details/GHO/uv-radiation"}
  ]
}
```

---

## 10. Front-end architecture
- Page: `/uv-fade-visualiser`
- Map source: raster layer from COG/tiles.
- Legend: fixed bottom-left; 5 bands (Low→Extreme).
- Drawer: right-side panel with location info, bucket, UVI, fade summary, colour picker, swatches, duration toggle.
- Mobile: map top half, drawer slides up.

---

## 11. Colour transform
- Convert sRGB → OKLCH.  
- Reduce chroma by lossFraction, increase lightness by 0.1 × lossFraction, convert back to sRGB.  
- Clamp to gamut.  
- Fallback HSL approximation for low-power devices.

---

## 12. Data-update workflow
Annual update:
1. Pull latest NASA monthly files.  
2. Recompute uv_mean_cog.tif.  
3. Upload to S3 with version tag (e.g. uv-v2).  
4. Update .env and redeploy.

---

## 13. Environment variables
| Key | Example | Purpose |
|-----|----------|----------|
| UV_DATA_URL | https://cdn.rosehill.group/uv/uv_mean_cog.tif | Raster source |
| UV_DATA_VERSION | uv-v1 | Cache busting |
| TPV_LOSS_FRACTION | 0.0 | Adjustable constant |
| FADE_K | 2.4 | Model parameter |
| FADE_LMAX | 0.85 | Model parameter |

---

## 14. Disclaimer
UV values are climatological averages (2005–2018 NASA AURA OMI).  
They represent long-term typical conditions, not live forecasts.  
The fade model expresses comparative performance only.

---

## 15. Credits
Developed by Rosehill Group Digital Team.  
Data courtesy of NASA Goddard Space Flight Center NEO, WHO GHO, NIWA, BoM, NEA, and BfS.
