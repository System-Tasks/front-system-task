"use client";

import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    
    const { user } = useAuth()
    const [token, setToken] = useState(null)

    useEffect(() => {
        const tok = Cookies.get('token');
        setToken(tok)
        console.log("useefefc t")
    }, [token])

    return (
        
        <>
            { 
                token ? <></> 
                :
                (

                    <nav className="flex items-center justify-between p-4" >
                        <div className="flex items-center cursor-pointer">
                            <img
                                alt="Logo"
                                className="mr-3 "
                                src={'/next.svg'}
                            />
                            <span className="self-center whitespace-nowrap text-2xl font-semibold text-black">
                                Tasks Manager
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <li className="cursor-pointer list-none hover:underline hover:underline-offset-2 hover:font-semibold">
                                <Link href="/login">
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li className="cursor-pointer list-none hover:underline hover:underline-offset-2 hover:font-semibold">

                                <Link href="/register">
                                    Registro
                                </Link>
                            </li>

                        </div>
                    </nav>
                )
            }


        </>

    )
}