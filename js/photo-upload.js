// Photo Upload Handler for TPV Installations
(function() {
    'use strict';

    // Configuration
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    // State
    let selectedFiles = [];
    let uploading = false;

    // DOM Elements
    const form = document.getElementById('photo-upload-form');
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('photo-upload-area');
    const photoPreviews = document.getElementById('photo-previews');
    const submitButton = document.getElementById('submit-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Initialize
    function init() {
        if (!form || !fileInput || !uploadArea) {
            console.error('Required elements not found');
            return;
        }

        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            if (!uploading) {
                fileInput.click();
            }
        });

        // File input change
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);

        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Prevent default drag behaviors on document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, preventDefaults, false);
        });
    }

    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle drag over
    function handleDragOver(e) {
        preventDefaults(e);
        uploadArea.classList.add('dragging');
    }

    // Handle drag leave
    function handleDragLeave(e) {
        preventDefaults(e);
        uploadArea.classList.remove('dragging');
    }

    // Handle drop
    function handleDrop(e) {
        preventDefaults(e);
        uploadArea.classList.remove('dragging');

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }

    // Handle file selection
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }

    // Process selected files
    function processFiles(files) {
        // Filter valid files
        const validFiles = files.filter(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                showError(`${file.name} is not a supported image type`);
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                showError(`${file.name} exceeds 5MB file size limit`);
                return false;
            }
            return true;
        });

        // Check total file count
        if (selectedFiles.length + validFiles.length > MAX_FILES) {
            showError(`You can only upload up to ${MAX_FILES} photos`);
            return;
        }

        // Add files to selection
        validFiles.forEach(file => {
            file.id = Date.now() + Math.random(); // Unique ID for tracking
            selectedFiles.push(file);
            displayPreview(file);
        });

        updateUploadArea();
    }

    // Display preview of uploaded file
    function displayPreview(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'photo-preview';
            preview.dataset.fileId = file.id;

            preview.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button type="button" class="remove-photo" data-file-id="${file.id}" aria-label="Remove photo">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            `;

            photoPreviews.appendChild(preview);

            // Add remove listener
            preview.querySelector('.remove-photo').addEventListener('click', () => {
                removeFile(file.id);
            });
        };

        reader.readAsDataURL(file);
    }

    // Remove file from selection
    function removeFile(fileId) {
        selectedFiles = selectedFiles.filter(file => file.id !== fileId);
        const preview = document.querySelector(`[data-file-id="${fileId}"]`);
        if (preview) {
            preview.remove();
        }
        updateUploadArea();
    }

    // Update upload area appearance
    function updateUploadArea() {
        if (selectedFiles.length > 0) {
            uploadArea.classList.add('has-photos');
            uploadArea.innerHTML = `
                <svg class="upload-icon" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                <p><strong>${selectedFiles.length} photo${selectedFiles.length !== 1 ? 's' : ''} selected</strong></p>
                <p>Click to add more (max ${MAX_FILES} total)</p>
            `;
        } else {
            uploadArea.classList.remove('has-photos');
            uploadArea.innerHTML = `
                <svg class="upload-icon" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <p><strong>Click to upload or drag and drop</strong></p>
                <p>JPEG, PNG or WebP (max 5MB each)</p>
            `;
        }
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate files
        if (selectedFiles.length === 0) {
            showError('Please upload at least one photo');
            return;
        }

        // Client-side file validation
        for (const file of selectedFiles) {
            if (file.size > 20 * 1024 * 1024) { // 20 MB limit
                showError(`File "${file.name}" is too large. Maximum size is 20MB.`);
                return;
            }
            if (!/^image\/(jpe?g|png|webp|heic)$/i.test(file.type)) {
                showError(`File "${file.name}" is not a supported image format.`);
                return;
            }
        }

        if (!form.checkValidity()) {
            showError('Please fill in all required fields');
            return;
        }

        // Hide any previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Show loading state
        uploading = true;
        submitButton.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        submitButton.textContent = 'Uploading...';

        try {
            await uploadFilesDirectly();
        } catch (error) {
            console.error('Upload error:', error);
            showError('There was an error uploading your photos. Please try again.');
        } finally {
            // Reset loading state
            uploading = false;
            submitButton.disabled = false;
            loadingSpinner.style.display = 'none';
            submitButton.textContent = 'Submit Photos';
        }
    }

    // Direct upload to Supabase using signed URLs
    async function uploadFilesDirectly() {
        // Generate unique install ID (could also come from QR code)
        const installId = `TPV-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Prepare file metadata
        const fileMetadata = selectedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
        }));

        submitButton.textContent = 'Getting upload URLs...';

        // Step 1: Get signed upload URLs
        const urlResponse = await fetch('/.netlify/functions/create-upload-urls', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                installId,
                files: fileMetadata,
                qrToken: null // TODO: Get from QR code if available
            })
        });

        if (!urlResponse.ok) {
            const errorText = await urlResponse.text();
            throw new Error(`Failed to get upload URLs: ${errorText}`);
        }

        const { uploads } = await urlResponse.json();

        // Step 2: Upload files directly to Supabase
        submitButton.textContent = 'Uploading files...';
        const uploadedFiles = [];

        // Import Supabase client
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabase = createClient(
            window.SUPABASE_URL || 'https://rgtaaqkbubzjrczrtdbu.supabase.co',
            window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJndGFhcWtidWJ6anJjenJ0ZGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3MzY5MjksImV4cCI6MjA0MjMxMjkyOX0.fQhI8fq7aaGRMfh11r8Bfk-A2BsNzPP_pFuMVyHSLEo'
        );

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const upload = uploads[i];

            submitButton.textContent = `Uploading ${i + 1}/${selectedFiles.length}...`;

            const { data, error } = await supabase.storage
                .from(upload.bucket)
                .uploadToSignedUrl(upload.path, upload.token, file, {
                    contentType: upload.contentType || file.type
                });

            if (error) {
                throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }

            uploadedFiles.push({
                bucket: upload.bucket,
                path: upload.path,
                name: file.name,
                size: file.size
            });
        }

        // Step 3: Record submission metadata
        submitButton.textContent = 'Recording submission...';

        // Get form data
        const formData = new FormData(form);
        const productsUsed = Array.from(
            document.querySelectorAll('input[name="products_used"]:checked')
        ).map(input => input.value);

        const submissionResponse = await fetch('/.netlify/functions/record-submission', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                installId,
                files: uploadedFiles,
                uploaderMeta: {
                    userAgent: navigator.userAgent,
                    when: new Date().toISOString()
                },
                // Form fields
                installer_name: formData.get('installer_name'),
                company_name: formData.get('company_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location_city: formData.get('location_city'),
                location_country: formData.get('location_country'),
                installation_date: formData.get('installation_date'),
                project_name: formData.get('project_name'),
                project_description: formData.get('project_description'),
                tpv_products_used: productsUsed,
                square_meters: formData.get('square_meters'),
                terms_accepted: true
            })
        });

        if (!submissionResponse.ok) {
            const errorText = await submissionResponse.text();
            throw new Error(`Failed to record submission: ${errorText}`);
        }

        const result = await submissionResponse.json();
        console.log('Submission recorded:', result);

        // Success!
        showSuccess();
        resetForm();
    }

    // Show success message
    function showSuccess() {
        successMessage.style.display = 'block';
        form.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        window.scrollTo({ top: errorMessage.offsetTop - 100, behavior: 'smooth' });

        // Hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Reset form
    function resetForm() {
        form.reset();
        selectedFiles = [];
        photoPreviews.innerHTML = '';
        updateUploadArea();
        fileInput.value = '';
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();