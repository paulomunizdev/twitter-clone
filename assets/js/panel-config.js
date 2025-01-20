document.addEventListener('DOMContentLoaded', function() {
    // Get all form elements
    const form = document.querySelector('.panel-section');
    const saveButton = document.querySelector('.btn-primary');
    
    // Store initial form state
    const initialFormState = getFormState();
    let formChanged = false;

    // Function to get current form state
    function getFormState() {
        const state = {
            interactions: document.querySelector('input[name="interactions"]:checked')?.value,
            followers: document.querySelector('input[name="followers"]:checked')?.value,
            content: document.querySelector('input[name="content"]:checked')?.value,
            email_news: document.querySelector('input[name="email_news"]').checked,
            email_activity: document.querySelector('input[name="email_activity"]').checked,
            email_marketing: document.querySelector('input[name="email_marketing"]').checked
        };
        return state;
    }

    // Function to compare form states
    function hasFormChanged() {
        const currentState = getFormState();
        return JSON.stringify(currentState) !== JSON.stringify(initialFormState);
    }

    // Function to update save button state
    function updateSaveButton() {
        const changed = hasFormChanged();
        saveButton.disabled = !changed;
        saveButton.style.opacity = changed ? '1' : '0.5';
        saveButton.style.cursor = changed ? 'pointer' : 'not-allowed';
        formChanged = changed;
    }

    // Add change event listeners to all form inputs
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', updateSaveButton);
    });

    // Handle form submission
    saveButton.addEventListener('click', async function(e) {
        e.preventDefault();
        if (!formChanged) return;

        // Show loading state
        const originalContent = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update initial state after successful save
            const newState = getFormState();
            Object.assign(initialFormState, newState);
            formChanged = false;
            
            // Show success message
            saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveButton.style.backgroundColor = '#4CAF50';
            
            // Reset button after delay
            setTimeout(() => {
                saveButton.innerHTML = originalContent;
                saveButton.style.backgroundColor = '';
                saveButton.disabled = true;
                saveButton.style.opacity = '0.5';
                saveButton.style.cursor = 'not-allowed';
            }, 2000);

        } catch (error) {
            // Handle error
            saveButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            saveButton.style.backgroundColor = '#dc3545';
            
            setTimeout(() => {
                saveButton.innerHTML = originalContent;
                saveButton.style.backgroundColor = '';
                saveButton.disabled = false;
            }, 2000);
        }
    });

    // Handle window beforeunload event
    window.addEventListener('beforeunload', function(e) {
        if (formChanged) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Initialize save button state
    updateSaveButton();
});