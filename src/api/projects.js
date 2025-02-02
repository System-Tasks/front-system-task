import axios from "./axios"

export const getProjectsRequest = (token, teamId) => axios.get(`/projects/team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } })

export const getProjectRequest = (id, token) => axios.get(`/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })

export const createProjectRequest = (project, token) => axios.post(`/projects`, project, { headers: { Authorization: `Bearer ${token}` } })

export const updateProjectRequest = (id, project, token) => axios.patch(`/projects/${id}`, project, { headers: { Authorization: `Bearer ${token}` } })

export const deleteProjectRequest = (id, token) => axios.delete(`/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })