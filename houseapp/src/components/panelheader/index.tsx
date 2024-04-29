import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../components/services/firebase'

export function DashboardHeader(){

  async function handleLogout(){
    await signOut(auth);
  }


  return(
    <div className="w-full items-center flex h-10 bg-blue-900 rounded-lg text-white font-medium gap-4 px-4 mb-4">
      <Link to="/dashboard">
        Dashboard
      </Link>
      <Link to="/dashboard/new">
        Cadastrar Imóvel
      </Link>

      <button className="ml-auto"  onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  )
}