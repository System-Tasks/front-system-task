// "use client";
// import { createContext, useContext, useState } from 'react'
// import Cookies from 'js-cookie'
// import { createProjectRequest, deleteProjectRequest, getProjectRequest, getProjectsRequest, updateProjectRequest } from '@/api/projects';

// const ProjectsContext = createContext()

// export const useProjects = () => {
//     const context = useContext(ProjectsContext)

//     if (!context) {
//         throw new Error("useProjects debe utilizarse dentro de un ProjectsProvider")
//     }
//     return context;

// }

// export const ProjectsProvider = ({ children }) => {

//     const [projects, setProjects] = useState([])
//     const {token} = Cookies.get()

//     const getProjects = async () => {
//         try {
//             const res = await getProjectsRequest(token)
//             setProjects(res.data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const createProject = async (task) => {
//         try {
//             const res = await createProjectRequest(task, token)
//             console.log(res)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const deleteProject = async (id) => {
//         try {
//             const res = await deleteProjectRequest(id, token)

//             const tasksFiltered = projects.filter(task => task._id != id);

//             if (res.status == 204) {
//                 setProjects(tasksFiltered)
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getProject = async (id) => {
//         try {
//             const res = await getProjectRequest(id, token)
//             return res.data
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const updateProject = async (id, task) => {
//         try {
//             const res = await updateProjectRequest(id, task, token)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <ProjectsContext.Provider value={{ projects, createProject, getProjects, deleteProject, getProject, updateProject }}>
//             {children}
//         </ProjectsContext.Provider>
//     )
// }