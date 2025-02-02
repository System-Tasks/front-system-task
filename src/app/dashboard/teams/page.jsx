"use client"
import { getAllUsers } from "@/api/auth";
import { createTeamRequest } from "@/api/teams";
import Modal from "@/components/Modal";
import Cookies from "js-cookie";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeamsPage() {

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const [modalCreateTeam, setModalCreateTeam] = useState(false)
  const [error, setError] = useState([])


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {

    if (user) {
      getUsers()
    }

  }, [user])


  const getUsers = async () => {
    const token = Cookies.get('token')

    try {
      const res = await getAllUsers(token)

      const users = user.team ? 
        res.data.data.filter(m => m.role != 'USER' && m.teamId == user.team.id)
      : res.data.data.filter(m => m.role == 'USER' && m.id != user.id)

      setUsers(users)
    } catch (error) {
      console.log(error)
    }
}

  const openModalCreateTeam = () => {
    setModalCreateTeam(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token')

    selectedUsers.push(user.id)

    const request = {
      users: selectedUsers,
      id: user.id
    }
    try {
      const res = await createTeamRequest(request, token);

      const users = res.data.users;

      const userSession = users.find(u => u.id == user.id)

      setUser({ ...user, role: userSession.role, team: {id:res.data.id} })

      setUsers(users)


      const userLocalStorage = JSON.parse(localStorage.getItem("user"))

      userLocalStorage.role = userSession.role
      userLocalStorage.team = {id:res.data.id}

      localStorage.setItem("user", JSON.stringify(userLocalStorage))

    } catch (error) {
      
      setError(error.response.data.message)
    }
    setModalCreateTeam(false)
    setSelectedUsers([])
    setIsOpen(false)
  }

  if (!user) return <p>Cargando usuario...</p>;

  return (

    <>
      <div>
        <h1 className="text-2xl font-bold">👥 Equipos</h1>
        <p className="mt-2">Aquí puedes gestionar tu equipo.</p>
      </div>

      {
        user?.role == 'USER' ?
          (
            <div className="mt-4 p-4 bg-white rounded-xl flex-1">

              <div className="flex justify-between item-center my-4">
                <h2 className="text-xl font-semibold">Equipo</h2>

                <button className="py-2 rounded-full px-4 text-slate-800 bg-purple-300 hover:text-purple-500
                      hover:bg-slate-800 transition-all duration-200 flex items-center gap-3"
                  onClick={openModalCreateTeam}>

                  <p className="text-lg">Crear </p>
                  <Plus size={22} strokeWidth={1.25} />
                </button>
              </div>
              <div className="flex justify-center items-center p-4">
                  <p className="text-lg">No tienes equipo</p>
              </div>
            </div>

            
            
          ) : 
          
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Información del equipo</h2>

            <div className="mt-4 p-6 rounded-md bg-slate-300">
              <h3 className="text-xl font-semibold">Miembros del equipo</h3>
              {
                users.map((u) => {
                  return <p key={u.id} className="text-lg">{u.name}</p>
                })
              }
            </div>
          </div>
      }


      <Modal
        isOpen={modalCreateTeam}
        title="Crear Equipo"
        closable={true}
        closeModal={() => {
          setSelectedUsers([])
          setIsOpen(false)
          setModalCreateTeam(false)
        }}
      >

        <form onSubmit={onSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Equipo</h2>
          <div className="space-y-4">



            <div className="w-full">
              <button
                className="flex w-full items-center justify-between border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
              >
                <span>
                  {selectedUsers.length > 0
                    ? users
                      .filter((user) => selectedUsers.includes(user.id))
                      .map((user) => user.name)
                      .join(", ")
                    : "Selecciona usuarios"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleUser(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        readOnly
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span>{user.name}</span>
                    </div>
                  ))}

                  {users.length == 0 && (<span>No hay usuarios disponibles</span>) }
                </div>
              )}

              <div className="mt-2 text-sm text-gray-700">
                <strong>Seleccionados: </strong> 
                  {
                  selectedUsers.length > 0 ? 
                    users.filter(user => selectedUsers.includes(user.id))
                      .map((user, index, array) => (
                        <span key={user.id}>
                          {user.name}
                          {index < array.length - 1 ? ", " : "."}
                        </span> 
                      ))
                  : " Ninguno"
                  }
              </div>
            </div>



            <button
              type="submit" disabled={selectedUsers.length == 0}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:hover:bg-blue-500"
            >
              Aceptar
            </button>
          </div>
        </form>
      </Modal>

    </>
  );
}