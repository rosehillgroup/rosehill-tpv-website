// Common utilities for admin pages

const AdminUtils = {
    /**
     * Show toast notification
     */
    showToast: function(message, type = 'info', duration = 3000) {
        // Remove existing toast
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        
        // Add styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .toast-success { background: #16a34a; }
                .toast-error { background: #dc2626; }
                .toast-warning { background: #f59e0b; }
                .toast-info { background: #3b82f6; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    /**
     * Show loading overlay
     */
    showLoading: function(message = 'Loading...') {
        // Remove existing overlay
        this.hideLoading();
        
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9998;
                }
                .loading-content {
                    background: white;
                    padding: 32px;
                    border-radius: 12px;
                    text-align: center;
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #ff6b35;
                    border-radius: 50%;
                    margin: 0 auto 16px;
                    animation: spin 0.8s linear infinite;
                }
                .loading-message {
                    color: #64748b;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
    },
    
    /**
     * Hide loading overlay
     */
    hideLoading: function() {
        const overlay = document.querySelector('#loading-overlay');
        if (overlay) overlay.remove();
    },
    
    /**
     * Format date for display
     */
    formatDate: function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },
    
    /**
     * Generate slug from text
     */
    generateSlug: function(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .slice(0, 96);
    },
    
    /**
     * Validate form data
     */
    validateForm: function(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            // Required check
            if (rule.required && (!value || value === '')) {
                errors[field] = `${rule.label || field} is required`;
                continue;
            }
            
            // Min length check
            if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
                continue;
            }
            
            // Max length check
            if (rule.maxLength && value && value.length > rule.maxLength) {
                errors[field] = `${rule.label || field} must be no more than ${rule.maxLength} characters`;
                continue;
            }
            
            // Pattern check
            if (rule.pattern && value && !rule.pattern.test(value)) {
                errors[field] = rule.message || `${rule.label || field} is invalid`;
                continue;
            }
            
            // Custom validation
            if (rule.validate && value) {
                const error = rule.validate(value, formData);
                if (error) errors[field] = error;
            }
        }
        
        return errors;
    },
    
    /**
     * Handle image upload
     */
    handleImageUpload: async function(file) {
        // Validate file
        const maxSize = 12 * 1024 * 1024; // 12MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload JPG, PNG, GIF or WebP images.');
        }
        
        if (file.size > maxSize) {
            throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
        }
        
        // Create FormData for v2 API
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload to server with FormData (v2 API compatible)
        const response = await adminAuth.apiCall('/.netlify/functions/upload-image', {
            method: 'POST',
            body: formData
            // DO NOT set Content-Type - browser will set it with boundary for FormData
        });
        
        if (!response.ok) {
            // Always read as text first since error might not be JSON
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || 'Upload failed');
            } catch {
                throw new Error(`Upload failed (${response.status}): ${errorText}`);
            }
        }
        
        return await response.json();
    },
    
    /**
     * Setup drag and drop for file uploads
     */
    setupDragDrop: function(element, onDrop) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('dragover');
        });
        
        element.addEventListener('dragleave', () => {
            element.classList.remove('dragover');
        });
        
        element.addEventListener('drop', async (e) => {
            e.preventDefault();
            element.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                onDrop(imageFiles);
            } else {
                this.showToast('Please drop image files only', 'error');
            }
        });
    },
    
    /**
     * Debounce function for search inputs
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    /**
     * Parse query parameters
     */
    getQueryParams: function() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },
    
    /**
     * Update URL query parameters
     */
    updateQueryParams: function(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
        });
        window.history.replaceState({}, '', url);
    }
};