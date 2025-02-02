"use client";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function RegisterPage() {

    const { register, handleSubmit, formState: {
        errors
    } } = useForm()

    const { user, signUp, error: registerErrors } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
        router.push('/dashboard');
        }
    }, [router]);

    
    const [success, setSuccess] = useState('')

    const onSubmit = handleSubmit(async (values) => {
        const res = await signUp(values)

        setSuccess(res.message)

        if(res.success) {
            setTimeout(() => {
                router.push('/login');
            }, 3000)
        } 
    })



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <form  onSubmit={onSubmit}>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro de usuario</h2>

                    {
                        registerErrors.map((err, i) => (
                            <div key={i} className='bg-red-500 rounded-md p-2 my-0.5 text-white text-center'>
                                {err}
                            </div>
                        ))
                    }

                    {
                        success && <div className='bg-green-500 rounded-md p-2 my-0.5 text-white text-center'>
                            {success}
                        </div>
                    }

                    <div className="space-y-4">
                        

                        <div>
                            <label className="block text-gray-700 font-medium">Nombre de Usuario</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu nombre"
                                {...register("name", { required: true })}
                            />

                            {
                                errors.name && <p className='text-red-500'>El nombre de usuario es obligatorio</p>
                            }

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Correo Electrónico</label>
                            <input
                                type="email"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu correo"
                                {...register("email", { required: true })}
                            />
                            {
                                errors.email && <p className='text-red-500'>El email es obligatorio</p>
                            }

                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Contraseña</label>
                            <input
                                type="password"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu contraseña"
                                {...register("password", { required: true })}
                            />
                            {
                                errors.password && <p className='text-red-500'>La contraseña es obligatoria</p>
                            }
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Registro
                        </button>
                    </div>

                </form>
                <p className="text-center text-gray-600 mt-4">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-blue-500 hover:underline">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
