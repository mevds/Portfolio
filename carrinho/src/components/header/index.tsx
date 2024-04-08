import { useContext  } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'

import { CartContext } from '../../contexts/CartContext'

export function Header(){
  const { cartAmount } = useContext(CartContext)

  return(
    <header className="w-full px-1 bg-indigo-600">
      <nav className="w-full max-w-7xl h-14 flex items-center justify-between px-5 mx-auto">
        <Link className="font-bold text-white" to="/">
          Dev Shop
        </Link>

        <Link className="relative" to="/cart">
          <FiShoppingCart size={24} color="#fff"/>
          {cartAmount > 0 && (
            <span className="absolute -top-4  -right-4 px-2.5 bg-red-900 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
              {cartAmount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  )
}