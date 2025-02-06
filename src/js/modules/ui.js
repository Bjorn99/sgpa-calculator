export function updateResult(element, value) {
    if (!element) return;
    element.textContent = value;
}

export function showError(inputElement, message) {
    const courseRow = inputElement.closest('.course-row');
    if (courseRow) {
        inputElement.classList.add('border-red-500');
        
        // Remove any existing error message
        const existingError = courseRow.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1 col-span-full';
        errorDiv.textContent = message;
        courseRow.appendChild(errorDiv);
    }
}

export function hideError(inputElement) {
    const courseRow = inputElement.closest('.course-row');
    if (courseRow) {
        inputElement.classList.remove('border-red-500');
        const errorMessage = courseRow.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

export function validateCourseInput(credits, gradePoints) {
    if (!credits || isNaN(credits) || credits < 1 || credits > 6) {
        return {
            isValid: false,
            message: 'Credits must be between 1 and 6'
        };
    }
    
    if (!gradePoints || isNaN(gradePoints) || gradePoints < 0 || gradePoints > 10) {
        return {
            isValid: false,
            message: 'Grade points must be between 0 and 10'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}