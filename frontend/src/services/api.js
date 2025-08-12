import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const photoAPI = {
  // Create a new photo session
  createSession: async (layoutData) => {
    const response = await axios.post(`${API}/sessions/create`, layoutData);
    return response.data;
  },

  // Get session details
  getSession: async (sessionId) => {
    const response = await axios.get(`${API}/sessions/${sessionId}`);
    return response.data;
  },

  // Capture and upload a photo
  capturePhoto: async (photoData) => {
    const response = await axios.post(`${API}/photos/capture`, photoData);
    return response.data;
  },

  // Generate photo strip
  generateStrip: async (sessionId) => {
    const response = await axios.post(`${API}/photos/generate-strip`, {
      session_id: sessionId
    });
    return response.data;
  },

  // Get download URL for strip
  getDownloadURL: (sessionId) => {
    return `${API}/photos/download/${sessionId}`;
  }
};