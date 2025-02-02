"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    router.replace("/login")
  }, [])

  return (

    <p className="text-4xl text-center text-gray-700">
      Panel principal
    </p>
    
  );
}
