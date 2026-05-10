import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const scanApi = {
  scan: async (url, depth, cookie, maxPage) => {
    const payload = { url, max_depth: depth, max_pages: maxPage };
    if (cookie && cookie.trim()) {
      payload.dvwa_cookie = {
        phpsessid: cookie.trim(),
        security: 'low',
      };
    }
    const response = await axios.post(
      `${BACKEND_URL}/scanner/full-scan`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  },

  health: async () => {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return response.data;
  },
};

export default scanApi;
