/**
 * Client configuration for API requests.
 * @module api/client
 */

import axios from 'axios';
import { API_BASE_URL } from '../constants/apiBaseUrl';

/**
 * Axios instance configured for backend communication.
 *
 * This pre-configured axios client provides consistent settings
 * for all API requests to the backend server.
 *
 * @property {string} baseURL - Base URL for all requests from API_BASE_URL
 * @property {Object} headers - Default headers for all requests
 * @property {number} timeout - Request timeout in milliseconds (10 seconds)
 * @property {boolean} withCredentials - Includes cookies with cross-origin requests
 *
 * @see https://axios-http.com/docs/config_defaults
 */
const axiosConfig = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

export default axiosConfig;
