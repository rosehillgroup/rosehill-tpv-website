/**
 * Form Validation Utility for Sanity Admin Forms
 * Provides real-time validation, error display, and form state management
 */

class SanityFormValidation {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            validateOnBlur: true,
            validateOnInput: true,
            showErrorsInline: true,
            scrollToFirstError: true,
            ...options
        };
        this.validators = new Map();
        this.errors = new Map();
        this.init();
    }

    /**
     * Initialize form validation
     */
    init() {
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.validateField(e.target);
                }
            }, true);
        }

        if (this.options.validateOnInput) {
            this.form.addEventListener('input', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    // Debounce input validation
                    clearTimeout(e.target._validationTimeout);
                    e.target._validationTimeout = setTimeout(() => {
                        this.validateField(e.target);
                    }, 300);
                }
            });
        }

        // Form submission validation
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                if (this.options.scrollToFirstError) {
                    this.scrollToFirstError();
                }
            }
        });
    }

    /**
     * Add validator for a field
     */
    addValidator(fieldName, validator) {
        if (!this.validators.has(fieldName)) {
            this.validators.set(fieldName, []);
        }
        this.validators.get(fieldName).push(validator);
        return this;
    }

    /**
     * Add required field validator
     */
    required(fieldName, message = 'This field is required') {
        return this.addValidator(fieldName, {
            validate: (value) => {
                if (typeof value === 'string') {
                    return value.trim().length > 0;
                }
                return value != null && value !== '';
            },
            message
        });
    }

    /**
     * Add minimum length validator
     */
    minLength(fieldName, minLength, message) {
        return this.addValidator(fieldName, {
            validate: (value) => {
                return !value || value.length >= minLength;
            },
            message: message || `Minimum ${minLength} characters required`
        });
    }

    /**
     * Add maximum length validator
     */
    maxLength(fieldName, maxLength, message) {
        return this.addValidator(fieldName, {
            validate: (value) => {
                return !value || value.length <= maxLength;
            },
            message: message || `Maximum ${maxLength} characters allowed`
        });
    }

    /**
     * Add email validator
     */
    email(fieldName, message = 'Please enter a valid email address') {
        return this.addValidator(fieldName, {
            validate: (value) => {
                if (!value) return true; // Optional email field
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message
        });
    }

    /**
     * Add URL validator
     */
    url(fieldName, message = 'Please enter a valid URL') {
        return this.addValidator(fieldName, {
            validate: (value) => {
                if (!value) return true; // Optional URL field
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            message
        });
    }

    /**
     * Add date validator
     */
    date(fieldName, message = 'Please enter a valid date') {
        return this.addValidator(fieldName, {
            validate: (value) => {
                if (!value) return true; // Optional date field
                const date = new Date(value);
                return !isNaN(date.getTime());
            },
            message
        });
    }

    /**
     * Add custom validator
     */
    custom(fieldName, validateFn, message) {
        return this.addValidator(fieldName, {
            validate: validateFn,
            message
        });
    }

    /**
     * Validate a single field
     */
    validateField(field) {
        const fieldName = field.name;
        const fieldValue = this.getFieldValue(field);
        const validators = this.validators.get(fieldName) || [];
        
        // Clear previous errors for this field
        this.clearFieldError(fieldName);

        // Run all validators for this field
        for (const validator of validators) {
            if (!validator.validate(fieldValue, field)) {
                this.setFieldError(fieldName, validator.message);
                this.showFieldError(field, validator.message);
                return false;
            }
        }

        this.hideFieldError(field);
        return true;
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;
        this.errors.clear();

        // Get all form fields
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        for (const field of fields) {
            if (!this.validateField(field)) {
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Get field value based on field type
     */
    getFieldValue(field) {
        switch (field.type) {
            case 'checkbox':
                return field.checked;
            case 'radio':
                const radioGroup = this.form.querySelectorAll(`input[name="${field.name}"]`);
                const checked = Array.from(radioGroup).find(r => r.checked);
                return checked ? checked.value : '';
            case 'select-multiple':
                return Array.from(field.selectedOptions).map(option => option.value);
            case 'file':
                return field.files;
            default:
                return field.value;
        }
    }

    /**
     * Set error for a field
     */
    setFieldError(fieldName, message) {
        this.errors.set(fieldName, message);
    }

    /**
     * Clear error for a field
     */
    clearFieldError(fieldName) {
        this.errors.delete(fieldName);
    }

    /**
     * Show error message for a field
     */
    showFieldError(field, message) {
        if (!this.options.showErrorsInline) return;

        // Remove existing error message
        this.hideFieldError(field);

        // Add error class to field
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('data-field', field.name);

        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);

        // Also mark the field container if it exists
        const fieldContainer = field.closest('.form-group, .field-group');
        if (fieldContainer) {
            fieldContainer.classList.add('has-error');
        }
    }

    /**
     * Hide error message for a field
     */
    hideFieldError(field) {
        // Remove error class from field
        field.classList.remove('error');

        // Remove error message
        const errorElement = this.form.querySelector(`.field-error-message[data-field="${field.name}"]`);
        if (errorElement) {
            errorElement.remove();
        }

        // Remove error class from field container
        const fieldContainer = field.closest('.form-group, .field-group');
        if (fieldContainer) {
            fieldContainer.classList.remove('has-error');
        }
    }

    /**
     * Get all current errors
     */
    getErrors() {
        return Object.fromEntries(this.errors);
    }

    /**
     * Check if form has errors
     */
    hasErrors() {
        return this.errors.size > 0;
    }

    /**
     * Scroll to first error field
     */
    scrollToFirstError() {
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstErrorField.focus();
        }
    }

    /**
     * Clear all errors
     */
    clearAllErrors() {
        this.errors.clear();
        
        // Remove error classes and messages
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            this.hideFieldError(field);
        });

        // Remove error messages
        const errorMessages = this.form.querySelectorAll('.field-error-message');
        errorMessages.forEach(msg => msg.remove());

        // Remove error classes from containers
        const errorContainers = this.form.querySelectorAll('.has-error');
        errorContainers.forEach(container => {
            container.classList.remove('has-error');
        });
    }

    /**
     * Show form-level error message
     */
    showFormError(message) {
        let errorElement = this.form.querySelector('.form-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error-message';
            this.form.insertBefore(errorElement, this.form.firstChild);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Hide form-level error message
     */
    hideFormError() {
        const errorElement = this.form.querySelector('.form-error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Show form-level success message
     */
    showFormSuccess(message) {
        let successElement = this.form.querySelector('.form-success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-success-message';
            this.form.insertBefore(successElement, this.form.firstChild);
        }
        
        successElement.textContent = message;
        successElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Reset form validation state
     */
    reset() {
        this.clearAllErrors();
        this.hideFormError();
        
        const successElement = this.form.querySelector('.form-success-message');
        if (successElement) {
            successElement.style.display = 'none';
        }
    }

    /**
     * Setup common installation form validators
     */
    setupInstallationValidators() {
        return this
            .required('title', 'Installation title is required')
            .minLength('title', 3, 'Title must be at least 3 characters')
            .maxLength('title', 100, 'Title must not exceed 100 characters')
            .required('overview', 'Project overview is required')
            .minLength('overview', 50, 'Overview must be at least 50 characters')
            .maxLength('overview', 2000, 'Overview must not exceed 2000 characters')
            .required('city', 'City is required')
            .required('country', 'Country is required')
            .required('installationDate', 'Installation date is required')
            .date('installationDate')
            .required('application', 'Application type is required')
            .url('thanksToUrl', 'Please enter a valid URL for the company website')
            .custom('images', (value, field) => {
                // Custom validation for image uploads
                const uploadedAssets = window.imageUpload ? window.imageUpload.getUploadedAssets() : [];
                return uploadedAssets.length > 0;
            }, 'At least one image is required');
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanityFormValidation;
} else if (typeof window !== 'undefined') {
    window.SanityFormValidation = SanityFormValidation;
}