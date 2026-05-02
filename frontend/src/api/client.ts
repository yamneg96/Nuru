import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nuru_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap the { data: ... } envelope from the backend
// Backend always responds with { data: payload }, so after Axios unwraps
// the HTTP response body into response.data, the actual payload is at
// response.data.data. This interceptor hoists it so callers get it directly.
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nuru_token")
      localStorage.removeItem("nuru_anonymous_id")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
