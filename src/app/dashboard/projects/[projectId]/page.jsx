"use client"

import { createTaskRequest, deleteTasksRequest, getTasksRequest } from "@/api/tasks"
import Modal from "@/components/Modal";
import TaskCard from "@/components/TaskCard";
import Cookies from "js-cookie";
import { Plus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react"
import { set, useForm } from "react-hook-form";

function ProjectDetailPage() {

    const token = Cookies.get('token')

    const { register, handleSubmit, formState: {
        errors
    }, reset } = useForm()
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const params = useParams();
    const [isOpenModal, setIsOpenModal] = useState(false)

    const getTasks = async () => {
        try {
            const res = await getTasksRequest(token, params.projectId)
            console.log(res)
            setTasks(res.data)
            setFilteredTasks(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        console.log("TOKEN : ", token)

        getTasks();

    }, [])

    const openModalCreateTask = () => {
        console.log("openModalCreateProject")
        setIsOpenModal(true);

    }

    const onSubmit = handleSubmit(async (values) => {
        const request = {
            title: values.title,
            description: values.description,
            dateLimit: values.dateLimit,
            projectId: params.projectId
        }

        try {
            const res = await createTaskRequest(request, token);
            console.log(res.data)
            reset();
            getTasks();


        } catch (error) {
            console.log(error)
        }
        setIsOpenModal(false);
    });

    const deleteTask = async (id) => {
        try {
            const res = await deleteTasksRequest(id, token)

            const tasksFiltered = tasks.filter(task => task.id != id);

            setTasks(tasksFiltered)
            setFilteredTasks(tasksFiltered)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Detalles del proyecto</h1>
            <p className="mt-2">Aquí puedes ver los detalles del proyecto.</p>

            <div className="mt-4 p-4 bg-white rounded-xl flex-1">

                <div className="flex justify-between item-center my-4">
                    <h2 className="text-xl font-semibold">Tareas</h2>

                    <button className="py-2 rounded-full px-4 text-slate-800 bg-purple-300 hover:text-purple-500
                    hover:bg-slate-800 transition-all duration-200 flex items-center gap-3"
                        onClick={openModalCreateTask}>

                        <p className="text-lg">Crear </p>
                        <Plus size={22} strokeWidth={1.25} />
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {
                    tasks.length > 0 ?

                        <div>

                            <input
                                type="text"
                                placeholder="Buscar tarea..."
                                className="p-2 border rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                
                                onChange={(e) => {
                                    setFilteredTasks(
                                        tasks.filter(task => {
                                            return task.title.toLowerCase().includes(e.target.value.toLowerCase()) || 
                                            task.description.toLowerCase().includes(e.target.value.toLowerCase())
                                        })
                                    )
                                }}
                            />

                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {
                                    filteredTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} deleteTask={deleteTask}>

                                        </TaskCard>
                                    ))
                                }
                            </div>
                        </div>

                        :
                        <p className="text-center text-2xl font-semibold">No hay tareas</p>
                }

            </div>


            <Modal isOpen={isOpenModal} title="Crear tarea" closable={true}
                closeModal={() => {
                    setIsOpenModal(false)
                    reset()
                }}
            >
                <form onSubmit={onSubmit}>
                    <div className="space-y-4">


                        <div>
                            <label className="block text-gray-700 font-medium">Titulo *</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa el titulo de la tarea"
                                {...register("title", { required: true })}
                            />

                            {
                                errors.title && <p className='text-red-500'>El titulo es obligatorio</p>
                            }

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Descripción *</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa la descripción"
                                {...register("description", { required: true })}
                            />
                            {
                                errors.description && <p className='text-red-500'>La descripción es obligatoria</p>
                            }

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Fecha limite *</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa la fecha limite"
                                {...register("dateLimit", { required: true })}
                            />
                            {
                                errors.dateLimit && <p className='text-red-500'>La fecha limite es obligatoria</p>
                            }

                        </div>



                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Aceptar
                        </button>
                    </div>
                </form>
            </Modal>


        </div>
    )
}

export default ProjectDetailPage