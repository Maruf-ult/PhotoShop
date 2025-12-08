export const BASE_URL = "http://localhost:8000"

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",        // POST (with image upload)
    LOGIN: "/api/auth/login", 
    PROFILE:"/api/auth/profile",             // POST
    GET_USER_BY_ID: (userId) => `/api/auth/${userId}`, // GET (protected)
    UPDATE_USER_BY_ID: (userId) => `/api/auth/${userId}`, // PUT (protected)
  },

  COMMENTS: {
    ADD_COMMENT: "/api/comments/add-comment",   // POST (protected)
    LIKE_COMMENT: "/api/comments/like-comment", // POST (protected)
  },

  DOWNLOADS: {
    DOWNLOAD_PHOTO: "/api/downloads/download",          // POST (protected)
    GET_DOWNLOAD_HISTORY: "/api/downloads/history", // GET (protected)
  },

  IMAGES: {
    UPLOAD_IMAGE: "/api/images/upload-image",   // POST (protected)
    UPDATE_IMAGE: (id) => `/api/images/${id}`,  // PUT (protected)
    GET_IMAGES: "/api/images/images",           // POST (public)
    GET_IMAGE_BY_ID: (id) => `/api/images/${id}`, // GET (protected)
    DELETE_IMAGE: (id) => `/api/images/${id}`,    // DELETE (protected)
  },
};