/**
 * Image Upload Utility for Sanity Assets
 * Handles file selection, preview, upload progress, and asset management
 */

class SanityImageUpload {
    constructor(sanityClient, options = {}) {
        this.client = sanityClient;
        this.options = {
            maxFiles: 10,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            previewWidth: 150,
            previewHeight: 100,
            ...options
        };
        this.uploadedAssets = [];
        this.pendingUploads = [];
    }

    /**
     * Initialize file drop zone
     */
    initializeDropZone(dropZoneElement, previewContainer) {
        this.dropZone = dropZoneElement;
        this.previewContainer = previewContainer;

        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            this.handleFiles(Array.from(e.dataTransfer.files));
        });

        // Click to select files
        this.dropZone.addEventListener('click', () => {
            this.selectFiles();
        });
    }

    /**
     * Open file selection dialog
     */
    selectFiles() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = this.options.allowedTypes.join(',');
        
        input.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
        });

        input.click();
    }

    /**
     * Handle selected files
     */
    async handleFiles(files) {
        // Validate file count
        if (this.uploadedAssets.length + files.length > this.options.maxFiles) {
            throw new Error(`Maximum ${this.options.maxFiles} images allowed`);
        }

        // Validate each file
        const validFiles = [];
        for (const file of files) {
            const validation = this.validateFile(file);
            if (validation.isValid) {
                validFiles.push(file);
            } else {
                console.warn(`File ${file.name} rejected: ${validation.error}`);
                this.showError(`${file.name}: ${validation.error}`);
            }
        }

        // Create previews and upload
        for (const file of validFiles) {
            const preview = await this.createPreview(file);
            await this.uploadFile(file, preview);
        }
    }

    /**
     * Validate a single file
     */
    validateFile(file) {
        if (!this.options.allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP allowed.' };
        }

        if (file.size > this.options.maxFileSize) {
            const maxSizeMB = this.options.maxFileSize / (1024 * 1024);
            return { isValid: false, error: `File too large. Maximum size is ${maxSizeMB}MB.` };
        }

        return { isValid: true };
    }

    /**
     * Create image preview element
     */
    async createPreview(file) {
        const previewElement = document.createElement('div');
        previewElement.className = 'image-preview';
        previewElement.innerHTML = `
            <div class="preview-image">
                <img src="" alt="Preview" />
                <div class="upload-overlay">
                    <div class="upload-progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <div class="upload-status">Uploading...</div>
                </div>
            </div>
            <div class="preview-actions">
                <button type="button" class="btn-remove" title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                <button type="button" class="btn-retry" title="Retry" style="display: none;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                </button>
            </div>
            <div class="preview-filename">${file.name}</div>
        `;

        // Create object URL for preview
        const img = previewElement.querySelector('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src);

        // Add remove functionality
        const removeBtn = previewElement.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            this.removePreview(previewElement);
        });

        // Add retry functionality
        const retryBtn = previewElement.querySelector('.btn-retry');
        retryBtn.addEventListener('click', () => {
            this.retryUpload(file, previewElement);
        });

        this.previewContainer.appendChild(previewElement);
        return previewElement;
    }

    /**
     * Upload a file to Sanity
     */
    async uploadFile(file, previewElement) {
        const progressBar = previewElement.querySelector('.progress-bar');
        const statusElement = previewElement.querySelector('.upload-status');
        const retryBtn = previewElement.querySelector('.btn-retry');

        try {
            statusElement.textContent = 'Uploading...';
            progressBar.style.width = '10%';

            // Generate filename with timestamp and slug
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const baseName = file.name.replace(/\.[^/.]+$/, '').toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            const filename = `${timestamp}_${baseName}.${fileExt}`;

            progressBar.style.width = '50%';

            // Upload to Sanity
            const asset = await this.client.uploadImage(file, filename);
            
            progressBar.style.width = '100%';
            statusElement.textContent = 'Complete';

            // Create asset reference
            const assetRef = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset.document._id
                }
            };

            this.uploadedAssets.push(assetRef);

            // Update preview to show success
            setTimeout(() => {
                previewElement.querySelector('.upload-overlay').style.display = 'none';
                previewElement.classList.add('upload-complete');
            }, 500);

            return assetRef;

        } catch (error) {
            console.error('Upload failed:', error);
            
            // Show error state
            statusElement.textContent = 'Upload failed';
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = '#ef4444';
            retryBtn.style.display = 'block';
            previewElement.classList.add('upload-error');

            throw error;
        }
    }

    /**
     * Retry failed upload
     */
    async retryUpload(file, previewElement) {
        previewElement.classList.remove('upload-error');
        const retryBtn = previewElement.querySelector('.btn-retry');
        retryBtn.style.display = 'none';
        
        const progressBar = previewElement.querySelector('.progress-bar');
        progressBar.style.backgroundColor = '#10b981';
        
        previewElement.querySelector('.upload-overlay').style.display = 'block';

        try {
            await this.uploadFile(file, previewElement);
        } catch (error) {
            // Error handling is done in uploadFile
        }
    }

    /**
     * Remove preview and associated asset
     */
    removePreview(previewElement) {
        // Find and remove from uploaded assets array
        const index = Array.from(this.previewContainer.children).indexOf(previewElement);
        if (index !== -1 && this.uploadedAssets[index]) {
            // Optionally delete from Sanity (if you want immediate cleanup)
            // this.client.deleteAsset(this.uploadedAssets[index].asset._ref);
            this.uploadedAssets.splice(index, 1);
        }

        previewElement.remove();
    }

    /**
     * Load existing images for edit mode
     */
    async loadExistingImages(images) {
        this.uploadedAssets = [...images];
        
        for (const [index, imageAsset] of images.entries()) {
            const imageUrl = this.client.getImageUrl(imageAsset.asset, { 
                width: this.options.previewWidth * 2, 
                height: this.options.previewHeight * 2 
            });
            
            if (imageUrl) {
                const previewElement = document.createElement('div');
                previewElement.className = 'image-preview upload-complete';
                previewElement.innerHTML = `
                    <div class="preview-image">
                        <img src="${imageUrl}" alt="Existing image" />
                    </div>
                    <div class="preview-actions">
                        <button type="button" class="btn-remove" title="Remove">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="preview-filename">Existing image</div>
                `;

                // Add remove functionality
                const removeBtn = previewElement.querySelector('.btn-remove');
                removeBtn.addEventListener('click', () => {
                    this.removePreview(previewElement);
                });

                this.previewContainer.appendChild(previewElement);
            }
        }
    }

    /**
     * Get all uploaded assets for form submission
     */
    getUploadedAssets() {
        return this.uploadedAssets;
    }

    /**
     * Clear all uploads
     */
    clear() {
        this.uploadedAssets = [];
        this.previewContainer.innerHTML = '';
    }

    /**
     * Show error message
     */
    showError(message) {
        // Create or update error display
        let errorElement = document.querySelector('.image-upload-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'image-upload-error';
            this.dropZone.parentNode.insertBefore(errorElement, this.dropZone.nextSibling);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Set cover image (first image in gallery)
     */
    setCoverImage() {
        return this.uploadedAssets.length > 0 ? this.uploadedAssets[0] : null;
    }

    /**
     * Get gallery images (all except cover)
     */
    getGalleryImages() {
        return this.uploadedAssets.slice(1);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanityImageUpload;
} else if (typeof window !== 'undefined') {
    window.SanityImageUpload = SanityImageUpload;
}