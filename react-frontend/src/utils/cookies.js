/**
 * Cookie utility functions for managing authentication and user data
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days (default: 7)
 * @param {object} options - Additional cookie options
 */
export const setCookie = (name, value, days = 7, options = {}) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  
  const defaults = {
    expires: date.toUTCString(),
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  };
  
  const cookieOptions = { ...defaults, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (cookieOptions.expires) {
    cookieString += `; expires=${cookieOptions.expires}`;
  }
  
  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`;
  }
  
  if (cookieOptions.sameSite) {
    cookieString += `; SameSite=${cookieOptions.sameSite}`;
  }
  
  if (cookieOptions.secure) {
    cookieString += '; Secure';
  }
  
  document.cookie = cookieString;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 */
export const deleteCookie = (name, options = {}) => {
  setCookie(name, '', -1, options);
};

/**
 * Get user data from cookie
 * @returns {object|null} User object or null
 */
export const getUserFromCookie = () => {
  const userCookie = getCookie('user_data');
  
  if (!userCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

/**
 * Set user data in cookie
 * @param {object} user - User object
 * @param {number} days - Expiration in days (default: 7)
 */
export const setUserCookie = (user, days = 7) => {
  const userData = JSON.stringify(user);
  setCookie('user_data', userData, days);
};

/**
 * Remove user data from cookie
 */
export const removeUserCookie = () => {
  deleteCookie('user_data');
};

/**
 * Check if user is authenticated (has valid cookie)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getUserFromCookie() !== null;
};

/**
 * Get authentication token from cookie
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return getCookie('auth_token');
};

/**
 * Set authentication token in cookie
 * @param {string} token - Authentication token
 * @param {number} days - Expiration in days (default: 7)
 */
export const setAuthToken = (token, days = 7) => {
  setCookie('auth_token', token, days, {
    secure: true,
    sameSite: 'Strict'
  });
};

/**
 * Remove authentication token from cookie
 */
export const removeAuthToken = () => {
  deleteCookie('auth_token');
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = () => {
  removeUserCookie();
  removeAuthToken();
};

export default {
  setCookie,
  getCookie,
  deleteCookie,
  getUserFromCookie,
  setUserCookie,
  removeUserCookie,
  isAuthenticated,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  clearAuthCookies
};
