import { useEffect, useState,useContext } from 'react'
import { BsCartPlusFill } from 'react-icons/bs'
import { api } from '../../services/api'
import { CartContext } from '../../contexts/CartContext'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'



export function Home(){
  interface ProductProps{
    id: number;
    title: string;
    description: string;
    price: number;
    cover: string;
  }
  const { addItemCart } = useContext(CartContext)
  const [products, setProducts] = useState<ProductProps[]>([])

  useEffect(() => {
    async function getProducts(){
      const response = await api.get("/products")
      setProducts(response.data)
    }

    getProducts();
  }, [])

  function handleAddCartItem(product: ProductProps){
    toast.success("Produto adicionado no carrinho.", {
      style:{
        borderRadius: 10,
        backgroundColor: "#4f46e5",
        color: "#FFF"
      }
    })
    addItemCart(product);
  }

  return(
    <div>
      <main className="w-full max-w-7xl px-4 mx-auto">
        <h1 className="font-bold text-2xl mb-4 mt-10 text-center">Produtos em Destaque</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {products.map( (product) => (
            <section key={product.id} className="w-full">
              <Link to={`/product/${product.id}`}>
                <img
                  className="w-full rounded-lg max-h-70 mb-2"
                  src={product.cover}
                  alt={product.title}
                />
                <p className="font-light mt-1 mb-2">{product.title}</p>
              </Link>
            <div className="flex gap-3 items-center">
              <strong className="font-medium">
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </strong>
              <button className="bg-indigo-600 p-1 rounded" onClick={ () => handleAddCartItem(product) }>
                <BsCartPlusFill size={22} color="#FFF"/>
              </button>
            </div>
  
            </section>
          ))}

        </div>

      </main>
    </div>
  )
}
