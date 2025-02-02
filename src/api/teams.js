import axios from "./axios"

export const createTeamRequest = (team, token) => axios.post(`/auth/team`, team, { headers: { Authorization: `Bearer ${token}` } })

// userId: string, teamId: string
export const patchTeamRequest = (request, token) => axios.patch(`/auth`, request, { headers: { Authorization: `Bearer ${token}` } })
