// "use client";
// import { createContext, useContext, useState } from 'react'
// import { createTaskRequest, deleteTasksRequest, getTaskRequest, getTasksRequest, updateTaskRequest } from '../api/tasks'
// import Cookies from 'js-cookie'

// const TaskContext = createContext()

// export const useTasks = () => {
//     const context = useContext(TaskContext)

//     if (!context) {
//         throw new Error("useTasks debe utilizarse dentro de un TaskProvider")
//     }
//     return context;

// }

// export const TaskProvider = ({ children }) => {

//     const [tasks, setTasks] = useState([])
//     const {token} = Cookies.get()

//     const getTasks = async () => {
//         try {
//             const res = await getTasksRequest(token)
//             setTasks(res.data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const createTask = async (task) => {
//         try {
//             const res = await createTaskRequest(task, token)
//             console.log(res)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const deleteTask = async (id) => {
//         try {
//             const res = await deleteTasksRequest(id, token)

//             const tasksFiltered = tasks.filter(task => task._id != id);

//             setTasks(tasksFiltered)

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getTask = async (id) => {
//         try {
//             const res = await getTaskRequest(id, token)
//             return res.data
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const updateTask = async (id, task) => {
//         try {
//             const res = await updateTaskRequest(id, task, token)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <TaskContext.Provider value={{ tasks, createTask, getTasks, deleteTask, getTask, updateTask }}>
//             {children}
//         </TaskContext.Provider>
//     )
// }