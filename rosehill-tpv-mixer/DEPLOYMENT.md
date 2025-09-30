# Glooloop Mixer Deployment Instructions

## Deployment Folder Ready

The `glooloop-mixer` folder contains the production-ready build of the Rosehill TPV® Colour Mixer for Glooloop.

## How to Deploy to Your TPV Netlify Site

1. **Copy the folder**: Copy the entire `glooloop-mixer` folder to the root of your TPV repository (where your index.html is located)

2. **Commit and push**:
   ```bash
   git add glooloop-mixer
   git commit -m "Add Glooloop colour mixer tool"
   git push
   ```

3. **Access the mixer**: Once deployed, the mixer will be available at:
   ```
   https://your-tpv-site.netlify.app/glooloop-mixer/
   ```

## Folder Contents

- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS files
- All logo images (Surface Designs, Glooloop, Rosehill)
- SVG visualization assets

## Notes

- All paths are configured to work under `/glooloop-mixer/`
- The build is optimized for production with minified assets
- Images and assets are included and will load correctly from the subdirectory

## Testing Locally

If you want to test before deploying:
1. Use a local server to serve your TPV site root
2. Access `http://localhost:[port]/glooloop-mixer/`

## Updating

To update the mixer in the future:
1. Make changes in the source project
2. Run `npm run build`
3. Replace the `glooloop-mixer` folder in your TPV repo
4. Commit and push