import axios from "./axios"

export const getTasksRequest = (token, projectId) => axios.get(`/tasks/project/${projectId}`, { headers: { Authorization: `Bearer ${token}` } })

export const getTaskRequest = (id, token) => axios.get(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })

export const createTaskRequest = (task, token) => axios.post(`/tasks`, task, { headers: { Authorization: `Bearer ${token}` } })

export const updateTaskRequest = (id, task, token) => axios.put(`/tasks/${id}`, task, { headers: { Authorization: `Bearer ${token}` } })

export const deleteTasksRequest = (id, token) => axios.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })