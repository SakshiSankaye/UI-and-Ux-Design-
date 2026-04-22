import axios from "axios";

// baseURL = http://localhost:5000
// All API calls: API.get("/api/events") → http://localhost:5000/api/events
const API = axios.create({
    baseURL: "http://localhost:5000"
});

// Attach JWT token automatically to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
