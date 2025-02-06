/**
 * Storage module for managing local storage operations
 */

const RECENT_CONVERSIONS_KEY = 'cgpa-converter-history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Represents a conversion record
 * @typedef {Object} ConversionRecord
 * @property {number} input - Input value (CGPA or Percentage)
 * @property {number} result - Converted result
 * @property {string} type - Type of conversion ('cgpa-to-percent' or 'percent-to-cgpa')
 * @property {string} timestamp - ISO string of when conversion was made
 */

/**
 * Save a conversion to history
 * @param {ConversionRecord} conversion
 */
export const saveConversion = (conversion) => {
    const history = getConversionHistory();
    history.unshift({
        ...conversion,
        timestamp: new Date().toISOString()
    });

    // Keep only the most recent conversions
    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }

    localStorage.setItem(RECENT_CONVERSIONS_KEY, JSON.stringify(history));
    
    // Dispatch storage update event
    window.dispatchEvent(new CustomEvent('historyUpdated', { detail: { history } }));
};

/**
 * Get conversion history
 * @returns {ConversionRecord[]}
 */
export const getConversionHistory = () => {
    const history = localStorage.getItem(RECENT_CONVERSIONS_KEY);
    return history ? JSON.parse(history) : [];
};

/**
 * Clear conversion history
 */
export const clearHistory = () => {
    localStorage.removeItem(RECENT_CONVERSIONS_KEY);
    window.dispatchEvent(new CustomEvent('historyUpdated', { detail: { history: [] } }));
};

/**
 * Export conversion history
 * @returns {string} JSON string of conversion history
 */
export const exportHistory = () => {
    const history = getConversionHistory();
    return JSON.stringify(history, null, 2);
};

/**
 * Import conversion history
 * @param {string} jsonString - JSON string of conversion history
 * @returns {boolean} Success status
 */
export const importHistory = (jsonString) => {
    try {
        const history = JSON.parse(jsonString);
        if (!Array.isArray(history)) return false;
        
        localStorage.setItem(RECENT_CONVERSIONS_KEY, JSON.stringify(history));
        window.dispatchEvent(new CustomEvent('historyUpdated', { detail: { history } }));
        return true;
    } catch (error) {
        console.error('Failed to import history:', error);
        return false;
    }
};