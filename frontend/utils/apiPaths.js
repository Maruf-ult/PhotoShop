export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    GET_USER_BY_ID: (userId) => `/api/auth/${userId}`,
    UPDATE_USER_BY_ID: (id) => `/api/auth/${id}`,
    GET_ALL_USERS:"/api/auth/users",
    DELETE_USER_BY_ID:(id)=>`/api/auth/${id}`
  },

  COMMENTS: {
    ADD_COMMENT: (imageId) => `/api/comments/add-comment/${imageId}`,
    LIKE_COMMENT: (imageId) => `/api/comments/like-comment/${imageId}`,
  },

  DOWNLOADS: {
    DOWNLOAD_PHOTO: "/api/downloads/download",
    GET_DOWNLOAD_HISTORY: "/api/downloads/history",
    GET_DOWNLOAD_HISTORY_COUNT:(id)=>`/api/downloads/historycount/${id}`,
    ALL_DOWNLOAD_HISTORY:"/api/downloads/allhistorycount",
    ALL_DOWNLOADS:"/api/downloads/all-downloads"
  },

  IMAGES: {
    UPLOAD_IMAGE: "/api/images/upload-image",
    UPDATE_IMAGE: (id) => `/api/images/${id}`,
    GET_IMAGES: "/api/images/images",
    GET_IMAGE_BY_ID: (id) => `/api/images/${id}`,
    DELETE_IMAGE: (id) => `/api/images/${id}`,
    GET_IMAGE_BY_USERID: (userId) => `/api/images/myphotos/${userId}`,
    DELETE_ALL_IMAGE_BY_ID: (userId) => `/api/images/myphotos/${userId}`,
  },
};
