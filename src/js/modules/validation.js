/**
 * Validation module for input handling
 */

/**
 * Input validation result
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the input is valid
 * @property {string} error - Error message if invalid
 */

/**
 * Validate CGPA input
 * @param {string|number} value - Input value to validate
 * @returns {ValidationResult}
 */
export const validateCGPA = (value) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: 'Please enter a valid number'
        };
    }

    if (numValue < 0 || numValue > 10) {
        return {
            isValid: false,
            error: 'CGPA must be between 0 and 10'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

/**
 * Validate percentage input
 * @param {string|number} value
 * @returns {ValidationResult}
 */
export const validatePercentage = (value) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: 'Please enter a valid number'
        };
    }

    if (numValue < 0 || numValue > 100) {
        return {
            isValid: false,
            error: 'Percentage must be between 0 and 100'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

/**
 * Sanitize numeric input
 * @param {string} value - Input value to sanitize
 * @returns {string} Sanitized value
 */
export const sanitizeNumericInput = (value) => {
    return value.replace(/[^\d.]/g, '')
        // Remove extra decimal points
        .replace(/(\..*)\./g, '$1')
        // Limit to 2 decimal places
        .replace(/(\.\d\d).*/g, '$1');
};

/**
 * Format number to fixed decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
};

export function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

export function validateNumber(num) {
    return !isNaN(num) && isFinite(num);
}

export function sanitizeCourseData(data) {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
        name: sanitizeInput(item.name || ''),
        credits: validateNumber(item.credits) ? item.credits : 0,
        gradePoint: validateNumber(item.gradePoint) ? item.gradePoint : 0
    }));
}