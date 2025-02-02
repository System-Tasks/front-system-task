"use client"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import { useState } from "react";
import { getCommentsRequest } from "@/api/comments";
import Modal from "./Modal";
import Cookies from "js-cookie";

dayjs.extend(utc)

export default function TaskCard({ task, deleteTask }) {

    const [modalEditTask, setModalEditTask] = useState(false)

    const [comments, setComments] = useState([])

    const token = Cookies.get('token')

    const getComments = async () => {
        const commentsData = await getCommentsRequest(task.id, token)
        setComments(commentsData.data)
    }


    const handleEditTask = () => {
        setModalEditTask(true)
        getComments() 
    }

    return (
        <div className="flex flex-col items-center py-5 bg-slate-300 rounded-xl">
            <h5 className="mb-1 text-xl font-medium text-gray-900">
                {task.title}
            </h5>
            <span className="text-sm text-gray-500">
                {task.description}
            </span>
            <span
                className={`text-sm mt-2 p-2 rounded-xl ${
                    task.status == 'PENDING' ? 'bg-orange-500' : task.status == 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                {task.status == 'PENDING' ? 'Pendiente' : task.status == 'COMPLETED' ? 'Completa' : 'En progreso'}
            </span>
            <span className="text-sm mt-8 text-gray-500">
                Fecha limite: {dayjs(task.dateLimit).utc().format('DD/MM/YYYY')}
            </span>

            <div className="mt-4 flex space-x-3 lg:mt-6">
                <button
                    className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    onClick={() => handleEditTask(task)}
                >
                    Comentarios
                </button>
                <button
                    className="inline-flex items-center rounded-lg  bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700  "
                    onClick={() => deleteTask(task.id)}
                >
                    Eliminar
                </button>
            </div>

            <Modal isOpen={modalEditTask} title="Detalle" closable={true} closeModal={() => setModalEditTask(false)}>
                
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Comentarios:
                </h1>
                {
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-xl shadow-lg">
                            <h2 className="text-xl text-gray-800">
                                {comment.description}
                            </h2>
                            <h5 className="text-end text-sm font-semibold text-gray-500">
                                Usuario: {comment.userId}
                            </h5>
                        </div>
                    ))
                }
            </Modal>

        </div>
    )
};