"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

function LoginPage() {

    const { register, handleSubmit, formState: {
        errors
    }, watch } = useForm()

    const router = useRouter();
    const { user, login, error: loginError } = useAuth();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const onSubmit = handleSubmit(async (data) => {
        const res = await login(data);

        if(res.success) {
            router.push('/dashboard');
        } 
    })

    const getPasswordValue = () => {
        const passwordValue = watch("password");
        return passwordValue || '';
    };
    


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <form className="space-y-4" onSubmit={onSubmit}>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

                    {
                        loginError.map((err, i) => (
                            <p key={i} className='bg-red-500 p-2 text-center text-white rounded-md'>
                                {err}
                            </p>
                        ))
                    }

                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
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
                            errors.password && <p className='text-red-500'>La contraseña es requerida</p>
                        }
                    </div>
                    <button
                        type="submit" disabled={getPasswordValue().length < 6}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:hover:bg-blue-500"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    ¿No tienes una cuenta? <Link href="/register" className="text-blue-500 hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage