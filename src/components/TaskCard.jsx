"use client"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from "react";
import { createCommentRequest, getCommentsRequest } from "@/api/comments";
import Modal from "./Modal";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { updateTaskRequest } from "@/api/tasks";

dayjs.extend(utc)

export default function TaskCard({ taskProp, deleteTask, updateTasks, users }) {

    const [modalEditTask, setModalEditTask] = useState(false)
    const [modalDetails, setModalDetails] = useState(false)

    const [comments, setComments] = useState([])

    const [error, setError] = useState([])


    const [task, setTask] = useState(taskProp)

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError([])
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [error])

    const {
        register: registerForm1,
        handleSubmit: handleSubmitForm1,
        formState: { errors: errorsForm1 },
        reset: resetForm1
    } = useForm();

    const {
        register: registerForm2,
        handleSubmit: handleSubmitForm2,
        formState: { errors: errorsForm2 },
        reset: resetForm2
    } = useForm();

    const token = Cookies.get('token')

    const getComments = async () => {
        const commentsData = await getCommentsRequest(task.id, token)
        setComments(commentsData.data)
    }


    const handleViewComments = () => {
        setModalDetails(true)
        getComments()
    }

    const onCreateComment = handleSubmitForm1(async (values) => {

        const user = JSON.parse(localStorage.getItem('user'))

        const comment = {
            description: values.comment,
            taskId: task.id,
            userId: user.id
        }

        try {
            const res = await createCommentRequest(comment, token)
            setComments([...comments, res.data])

            setTimeout(() => {
                resetForm1();
            }, 50)

        } catch (error) {
            setError(error.response.data.message)
            resetForm1();

        }


    })

    const handleEditTask = handleSubmitForm2(async (values) => {

        const request = {
            description: values.description,
            title: values.title,
            status: values.status,
            dateLimit: values.dateLimit
        }

        try {

            const res = await updateTaskRequest(task.id, request, token);

            setTask(res.data)

            setModalEditTask(false)

            updateTasks()

        } catch (e) {
            setError(e.response.data.message)

        }
        resetForm2();
    })



    if (!task) return <p>Cargando tarea...</p>;


    return (
        <div className="flex flex-col items-center py-5 bg-slate-300 rounded-xl">

            <div>
                <button
                    className="inline-flex mb-2 items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    onClick={() => setModalEditTask(true)}
                >
                    <Edit size={22} strokeWidth={1.25} />
                </button>
            </div>

            <h5 className="mb-1 text-xl font-medium text-gray-900">
                {task.title}
            </h5>
            <span className="text-sm text-gray-500">
                {task.description}
            </span>
            <span
                className={`text-sm mt-2 p-2 rounded-xl ${task.status == 'PENDING' ? 'bg-orange-500' : task.status == 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                {task.status == 'PENDING' ? 'Pendiente' : task.status == 'COMPLETED' ? 'Completa' : 'En progreso'}
            </span>
            <span className="text-sm mt-8 text-gray-500">
                Fecha limite: {dayjs(task.dateLimit).utc().format('DD/MM/YYYY')}
            </span>

            <div className="mt-4 flex space-x-3 lg:mt-6">
                <button
                    className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    onClick={handleViewComments}
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

            <Modal isOpen={modalDetails} title="Detalle" closable={true} closeModal={() => {
                setModalDetails(false)
                resetForm1()
            }}>



                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Comentarios:
                </h1>

                <div className="overflow-y-auto h-96">

                    {
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-white p-4 rounded-xl shadow-lg my-2">
                                <h2 className="text-xl text-gray-800">
                                    {comment.description}
                                </h2>
                                <h5 className="text-end text-sm font-semibold text-gray-500">
                                    Usuario: {users.find(i => i.id == comment.userId)?.name}
                                </h5>
                            </div>
                        ))


                    }
                    {
                        comments.length == 0 && <p className="text-center text-lg font-semibold my-4">No hay comentarios</p>
                    }

                </div>

                <div className="flex items-center space-x-2 mt-4">
                    <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...registerForm1('comment', { required: true })}
                    />
                    <button onClick={onCreateComment} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Comentar
                    </button>


                </div>
                {
                    errorsForm1.comment && <p className="text-red-500">El comentario es obligatorio</p>
                }

                {
                    error.map((err, i) => (
                        <div key={i} className='text-red-500 rounded-md p-2 my-0.5 text-center'>
                            {err}
                        </div>
                    ))
                }

            </Modal>

            <Modal isOpen={modalEditTask} title="Editar tarea" closable={true} closeModal={() => {
                setModalEditTask(false)
                resetForm2()
            }}>


                <form onSubmit={handleEditTask}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Titulo *</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa el titulo de la tarea"
                                defaultValue={task.title}
                                {...registerForm2("title", { required: true })}
                            />

                            {
                                errorsForm1.title && <p className='text-red-500'>El titulo es obligatorio</p>
                            }

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Descripción *</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa la descripción"
                                defaultValue={task.description}
                                {...registerForm2("description", { required: true })}
                            />
                            {
                                errorsForm2.description && <p className='text-red-500'>La descripción es obligatoria</p>
                            }

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium">Fecha limite *</label>

                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue={task.dateLimit ? new Date(task.dateLimit).toISOString().split("T")[0] : ""}
                                {...registerForm2("dateLimit", { required: true })}
                            />
                            {
                                errorsForm2.dateLimit && <p className='text-red-500'>La fecha limite es obligatoria</p>
                            }

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium">Estado *</label>

                            <select
                                {...registerForm2("status", { required: true })}
                                defaultValue={task.status}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="PENDING">PENDIENTE</option>
                                <option value="PROGRESS">EN PROGRESO</option>
                                <option value="COMPLETED">COMPLETADO</option>
                            </select>
                            {
                                errorsForm2.status && <p className='text-red-500'>El estado es obligatorio</p>
                            }

                        </div>






                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Aceptar
                        </button>
                    </div>
                    {
                        error.map((err, i) => (
                            <div key={i} className='text-red-500 rounded-md p-2 my-0.5 text-center'>
                                {err}
                            </div>
                        ))
                    }
                </form>
            </Modal>

        </div>
    )
};