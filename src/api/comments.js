import axios from "./axios"

export const getCommentsRequest = (taskId, token) => axios.get(`/tasks/comment/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })

export const createCommentRequest = (comment, token) => axios.post(`/tasks/comment`, comment, { headers: { Authorization: `Bearer ${token}` } })
