# Rosehill TPV Colour Mixer

A modern, secure React application for creating custom color blends for TPV rubber granules. This replaces the legacy WordPress plugin with a static site suitable for Netlify deployment.

## Features

- Interactive color mixing interface with 22 TPV rubber granule colors
- Real-time visual preview of color blends
- Percentage-based color distribution
- PDF generation for saving/printing designs
- Fully responsive design
- Client-side only - no server required
- Secure and modern codebase

## Tech Stack

- **React 18** - Modern component-based UI
- **Vite** - Fast build tool and dev server
- **jsPDF** - Client-side PDF generation
- **html2canvas** - SVG to canvas conversion for PDFs
- **Netlify** - Static site hosting with CI/CD

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd rosehill-tpv-mixer

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

### Colors Configuration

Edit `src/data/colors.json` to:
- Add/remove colors
- Update color names, codes, or hex values
- Enable/disable specific colors
- Update company information and branding

### Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```env
VITE_COMPANY_NAME=Your Company Name
VITE_LOGO_URL=https://your-logo-url.com
VITE_PHONE=Your Phone Number
VITE_WEBSITE=your-website.com
```

## Deployment to Netlify

### Option 1: Git-based deployment

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Netlify will auto-deploy on push

### Option 2: Manual deployment

```bash
# Build for production
npm run build

# Deploy to Netlify (requires Netlify CLI)
netlify deploy --prod --dir=dist
```

### Option 3: Drag and drop

1. Run `npm run build`
2. Drag the `dist` folder to Netlify's web interface

## Security Improvements

This modern implementation addresses all security issues from the legacy WordPress plugin:

- ✅ No jQuery vulnerabilities
- ✅ No SQL injection risks (no database)
- ✅ Input validation and sanitization
- ✅ No exposed AJAX endpoints
- ✅ Content Security Policy headers
- ✅ Modern dependency management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ColorMixer.jsx       # Main component
│   ├── ColorSelector.jsx    # Individual color control
│   ├── SVGVisualization.jsx # Visual preview
│   ├── ProgressBar.jsx      # Percentage display
│   └── PDFGenerator.jsx     # PDF generation
├── data/
│   └── colors.json          # Color configuration
└── App.jsx                  # Root component
```

## Customization

### Adding New Colors

1. Edit `src/data/colors.json`
2. Add new color object with id, name, hex, and enabled properties
3. Colors will automatically appear in the interface

### Styling

- Global styles: `src/App.css`
- Component styles: `src/components/[Component].css`
- Color scheme uses CSS variables for easy theming

## License

Private - All rights reserved

## Support

For issues or questions, contact Rosehill Sports & Play support.
