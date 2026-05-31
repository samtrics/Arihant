import DOMPurify from 'dompurify';

/**
 * Sanitizes an input string to prevent Cross-Site Scripting (XSS) attacks.
 * Should be used whenever rendering user-provided content (e.g. descriptions, comments).
 *
 * @param {string} dirty - The potentially unsafe HTML string.
 * @returns {string} - The sanitized, safe HTML string.
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

/**
 * Validates whether an email address format is strictly correct.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
