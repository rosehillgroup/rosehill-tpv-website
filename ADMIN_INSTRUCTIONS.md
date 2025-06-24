# Admin Interface Instructions

## Adding New Installations

Your assistant can easily add new installations to the website using the admin interface.

### Step-by-Step Instructions:

1. **Open the Admin Page**
   - Navigate to: `admin-add-installation.html` in your web browser
   - This page is not linked from the main website (it's private for admin use)

2. **Fill in the Installation Details**
   - **Installation Title**: Enter a descriptive title (e.g., "New Playground at Central Park")
   - **Location**: Enter the city, state/region, and country
   - **Installation Date**: Select the date when the installation was completed
   - **Application Type**: Choose from the dropdown (Playground, MUGA, Running Track, etc.)

3. **Add Description Paragraphs**
   - Write detailed paragraphs describing the installation
   - Click "+ Add Another Paragraph" to add more paragraphs if needed
   - Each paragraph should be substantial content (2-3 sentences minimum)
   - You can remove paragraphs by clicking the "×" button

4. **Upload Images**
   - Drag and drop images into the upload area, or click "Choose Files"
   - Multiple images can be uploaded at once
   - Supported formats: JPG, JPEG, PNG
   - Images should be high quality and show the installation clearly
   - You can remove images by clicking the "×" on each image preview

5. **Submit the Installation**
   - Click "Create Installation Page"
   - The system will:
     - Upload all images to the correct folder
     - Add the installation to the main database
     - Generate a new installation page automatically
     - Update the website's sitemap

6. **Confirmation**
   - A success message will appear when completed
   - The installation will immediately appear on the main installations page
   - The form will reset for the next installation

### Requirements:
- All fields marked with a red asterisk (*) are required
- At least one description paragraph is required
- At least one image is required
- The web server must support PHP for the backend processing

### Technical Notes:
- Images are automatically renamed with timestamps to avoid conflicts
- The installation pages are generated using a template for consistency
- Backups of the database are created automatically
- The newest installations appear first on the main page

### Troubleshooting:
- If upload fails, check that images are under 10MB each
- Ensure the web server has write permissions to the necessary folders
- Contact the developer if you encounter any errors

This admin interface makes it simple to add installations without needing to edit any code or JSON files manually.