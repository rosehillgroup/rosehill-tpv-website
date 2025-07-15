/**
 * Client-side Image Optimization for Admin Upload
 * 
 * This script optimizes images before uploading to Supabase:
 * - Compresses images to reduce file size
 * - Resizes large images to reasonable dimensions
 * - Converts to modern formats when possible
 * - Provides progress feedback
 */

class ImageOptimizer {
    constructor() {
        this.maxWidth = 1920;
        this.maxHeight = 1080;
        this.quality = 0.85;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
    }

    /**
     * Optimize a single image file
     * @param {File} file - The image file to optimize
     * @returns {Promise<File>} - The optimized image file
     */
    async optimizeImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File is not an image'));
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                const { width, height } = this.calculateDimensions(img.width, img.height);
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Create new file with optimized blob
                            const optimizedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(optimizedFile);
                        } else {
                            reject(new Error('Failed to optimize image'));
                        }
                    },
                    'image/jpeg',
                    this.quality
                );
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Calculate optimal dimensions for image
     * @param {number} originalWidth - Original image width
     * @param {number} originalHeight - Original image height
     * @returns {Object} - New width and height
     */
    calculateDimensions(originalWidth, originalHeight) {
        let { width, height } = { width: originalWidth, height: originalHeight };

        // Scale down if too large
        if (width > this.maxWidth || height > this.maxHeight) {
            const ratio = Math.min(this.maxWidth / width, this.maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }

        return { width, height };
    }

    /**
     * Optimize multiple image files
     * @param {FileList} files - The image files to optimize
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<File[]>} - Array of optimized image files
     */
    async optimizeImages(files, onProgress) {
        const optimizedFiles = [];
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            
            try {
                // Skip if file is already small enough
                if (file.size < this.maxFileSize && file.type === 'image/jpeg') {
                    optimizedFiles.push(file);
                } else {
                    const optimizedFile = await this.optimizeImage(file);
                    optimizedFiles.push(optimizedFile);
                }
                
                // Report progress
                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total: totalFiles,
                        percentage: Math.round(((i + 1) / totalFiles) * 100)
                    });
                }
            } catch (error) {
                console.error(`Failed to optimize ${file.name}:`, error);
                // Include original file if optimization fails
                optimizedFiles.push(file);
            }
        }

        return optimizedFiles;
    }

    /**
     * Get compression stats for reporting
     * @param {File[]} originalFiles - Original files
     * @param {File[]} optimizedFiles - Optimized files
     * @returns {Object} - Compression statistics
     */
    getCompressionStats(originalFiles, optimizedFiles) {
        const originalSize = Array.from(originalFiles).reduce((sum, file) => sum + file.size, 0);
        const optimizedSize = optimizedFiles.reduce((sum, file) => sum + file.size, 0);
        const savings = originalSize - optimizedSize;
        const percentage = Math.round((savings / originalSize) * 100);

        return {
            originalSize,
            optimizedSize,
            savings,
            percentage,
            originalCount: originalFiles.length,
            optimizedCount: optimizedFiles.length
        };
    }

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the optimizer
const imageOptimizer = new ImageOptimizer();

/**
 * Integration with existing admin form
 */
function setupImageOptimization() {
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!fileInput || !imagePreview) {
        console.warn('Image optimization: Required elements not found');
        return;
    }

    fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        // Show optimization progress
        const progressDiv = document.createElement('div');
        progressDiv.className = 'optimization-progress';
        progressDiv.innerHTML = `
            <div class="progress-header">
                <h4>🔄 Optimizing Images...</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">0%</div>
            </div>
        `;
        
        imagePreview.innerHTML = '';
        imagePreview.appendChild(progressDiv);

        try {
            // Optimize images
            const optimizedFiles = await imageOptimizer.optimizeImages(files, (progress) => {
                const progressFill = progressDiv.querySelector('.progress-fill');
                const progressText = progressDiv.querySelector('.progress-text');
                
                progressFill.style.width = progress.percentage + '%';
                progressText.textContent = `${progress.percentage}% (${progress.current}/${progress.total})`;
            });

            // Get compression stats
            const stats = imageOptimizer.getCompressionStats(files, optimizedFiles);

            // Update file input with optimized files
            const dataTransfer = new DataTransfer();
            optimizedFiles.forEach(file => dataTransfer.items.add(file));
            fileInput.files = dataTransfer.files;

            // Show results
            progressDiv.innerHTML = `
                <div class="optimization-results">
                    <h4>✅ Optimization Complete!</h4>
                    <div class="stats">
                        <div class="stat">
                            <span class="label">Original Size:</span>
                            <span class="value">${imageOptimizer.formatFileSize(stats.originalSize)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Optimized Size:</span>
                            <span class="value">${imageOptimizer.formatFileSize(stats.optimizedSize)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Savings:</span>
                            <span class="value">${imageOptimizer.formatFileSize(stats.savings)} (${stats.percentage}%)</span>
                        </div>
                        <div class="stat">
                            <span class="label">Images:</span>
                            <span class="value">${stats.optimizedCount} files ready for upload</span>
                        </div>
                    </div>
                </div>
            `;

            // Show image previews
            setTimeout(() => {
                showImagePreviews(optimizedFiles);
            }, 2000);

        } catch (error) {
            console.error('Image optimization failed:', error);
            progressDiv.innerHTML = `
                <div class="optimization-error">
                    <h4>⚠️ Optimization Failed</h4>
                    <p>Using original images. Error: ${error.message}</p>
                </div>
            `;
        }
    });
}

/**
 * Show image previews
 */
function showImagePreviews(files) {
    const imagePreview = document.getElementById('imagePreview');
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview-grid';
    
    Array.from(files).forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = `Preview ${index + 1}`;
        img.className = 'preview-image';
        
        const info = document.createElement('div');
        info.className = 'preview-info';
        info.innerHTML = `
            <div class="preview-filename">${file.name}</div>
            <div class="preview-size">${imageOptimizer.formatFileSize(file.size)}</div>
        `;
        
        previewItem.appendChild(img);
        previewItem.appendChild(info);
        previewContainer.appendChild(previewItem);
    });
    
    imagePreview.appendChild(previewContainer);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupImageOptimization);

// Export for use in other scripts
window.ImageOptimizer = ImageOptimizer;