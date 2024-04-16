
import { Link } from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi'
import {useContext} from 'react'
import {AuthContext} from '../../components/context/AuthContext'

export function Header() {
  const { signed,loadingAuth} = useContext(AuthContext);


  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-2">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
         <Link to="/">
         <h1 className=" rounded-md bg-blue-600 px-3 py-2 text-2xl font-semibold text-white text-center sm:text-2xl">
              CarShop
            </h1>
         </Link>

         {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#1890ff"/>
            </div>
          </Link>
         )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={22} color="#1890ff"/>
            </div>
          </Link>
         )}
      </header>
    </div>
  )
}