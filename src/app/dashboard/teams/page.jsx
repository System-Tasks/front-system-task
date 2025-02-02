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

    const token = Cookies.get('token')
    const userLocal = JSON.parse(localStorage.getItem('user'))
    console.log(userLocal)
    setUser(userLocal)

    const getUsers = async () => {
      try {
        const res = await getAllUsers(token)

        const usersRoleUser = res.data.data.filter(m => m.role == 'USER' && m.id != userLocal.id)
        const usersRoleMember = res.data.data.filter(m => m.role != 'USER' && m.teamId == userLocal.team.id)

        const users = userLocal.team ? usersRoleMember : usersRoleUser
        console.log("ANDNANDADNAS", users)

        setUsers(users)
      } catch (error) {
        console.log(error)
      }
    }

    getUsers()

  }, [])


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
      //CREAR TEAM
      const res = await createTeamRequest(request, token);
      console.log(res.data.id)

      const users = res.data.users;

      const userSession = users.find(u => u.id == user.id)

      setUser({ ...user, role: userSession.role, team: {id:res.data.id} })

    } catch (error) {
      
      setError(error.response.data.message)
    }
    setModalCreateTeam(false)
    setSelectedUsers([])
    setIsOpen(false)
  }

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
                </div>
              )}

              <div className="mt-2 text-sm text-gray-700">
                <strong>Seleccionados:</strong>{" "}
                {selectedUsers.length > 0 ? selectedUsers.join(", ") : "Ninguno"}
              </div>
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

    </>
  );
}