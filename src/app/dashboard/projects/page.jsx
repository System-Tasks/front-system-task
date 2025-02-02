"use client"
import { createProjectRequest, getProjectsRequest } from "@/api/projects";
import Modal from "@/components/Modal";
import Cookies from "js-cookie";
import { Plus, ZoomIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


function ProjectsPage() {

    const headerTable = [
        "Id", "Nombre", "Descripción", "Acciones"
    ];

    const { register, handleSubmit, formState: {
        errors
    }, reset } = useForm()

    const [projects, setProjects] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [error, setError] = useState([])
    const [user, setUser] = useState(null)

    const token = Cookies.get('token')

    const router = useRouter();

    const getProjects = async () => {

        console.log(user)

        try {
            const res = await getProjectsRequest(token, user.team.id)
            setProjects(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    useEffect(() => {
        if (user && user.team) {
            getProjects();
        }
    }, [user]);



    const openModalCreateProject = () => {
        console.log("openModalCreateProject")
        setIsOpenModal(true);

    }

    const selectProject = (item) => {
        console.log("item: ", item)
        router.push(`/dashboard/projects/${item.id}`)
    }

    const onSubmit = handleSubmit(async (values) => {

        const request = {
            name: values.name,
            description: values.description,
            teamId: user.team.id || null
        }

        try {
            const res = await createProjectRequest(request, token);
            console.log(res.data)
            reset();
            getProjects();


        } catch (error) {
            console.log(error)
        }
        setIsOpenModal(false);

    });

    if (!user) return <p>Cargando usuario...</p>;

    return (
        <div>
            <div className="sticky top-20 w-full bg-gray-100 pb-4 z-20">
                <h1 className="text-[22px] font-semibold">Gestión Proyectos</h1>
                <p className="text-sm leading-tight">Módulo para la gestión de proyectos.</p>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl flex-1">

                <div className="flex justify-between item-center my-4">
                    <h2 className="text-xl font-semibold">Registros</h2>

                    <button className="py-2 rounded-full px-4 text-slate-800 bg-purple-300 hover:text-purple-500
                    hover:bg-slate-800 transition-all duration-200 flex items-center gap-3"
                        onClick={openModalCreateProject}>

                        <p className="text-lg">Crear </p>
                        <Plus size={22} strokeWidth={1.25} />
                    </button>
                </div>


                {
                    projects.length > 0

                        ?

                        (
                            <div className="w-full">

                                <div className="pb-4 border-t border-gray-100"></div>

                                <div className="w-full p-6">
                                    <table className="w-full p-4 table-auto border-collapse">
                                        <thead>
                                            <tr className="text-xl text-gray-500 ">
                                                {
                                                    headerTable.map((item, index) => (
                                                        <th key={index} className="pb-2 text-left font-semibold">
                                                            {item}
                                                        </th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                projects.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 border-t border-gray-100 text-sm">
                                                        <td className="py-3 font-normal">
                                                            {item.id}
                                                        </td>
                                                        <td className="py-3 font-normal">
                                                            {item.name}
                                                        </td>
                                                        <td className="py-3 font-normal">
                                                            {item.description}
                                                        </td>
                                                        <td>
                                                            <button onClick={() => selectProject(item)} className="hover:font-bold"><ZoomIn size={20} strokeWidth={1.25} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )

                        :

                        (
                            <div className="flex justify-center items-center p-4">
                                <p className="text-lg">No hay proyectos registrados</p>
                            </div>
                        )
                }
            </div>


            {/* Modal */}
            <Modal
                isOpen={isOpenModal}
                title="Crear Proyecto"
                closable={true}
                closeModal={() => {
                    setIsOpenModal(false)
                    reset()
                }}
            >

                <form onSubmit={onSubmit}>
                    {
                        error.map((err, i) => (
                            <div key={i} className='bg-red-500 rounded-md p-2 my-0.5 text-white text-center'>
                                {err}
                            </div>
                        ))
                    }
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Proyecto</h2>
                    <div className="space-y-4">


                        <div>
                            <label className="block text-gray-700 font-medium">Nombre</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa nombre del proyecto"
                                {...register("name", { required: true })}
                            />

                            {
                                errors.name && <p className='text-red-500'>El nombre de usuario es obligatorio</p>
                            }

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Descripción</label>
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

export default ProjectsPage