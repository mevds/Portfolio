import { useState, useEffect } from 'react'
import { Container } from "../../components/container";
import { Link } from 'react-router-dom'
import {collection,query,getDocs,orderBy, where} from 'firebase/firestore'
import { db } from '../../components/services/firebase'

interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps{
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadCars();
  }, [])

  function loadCars(){
    const carsRef = collection(db, "cars")
    const queryRef = query(carsRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then((snapshot) => {
      const listcars = [] as CarsProps[];

      snapshot.forEach( doc => {
        listcars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid
        })
      })

      setCars(listcars);  
    })

  }


  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearchCar(){
    if(input === ''){
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(collection(db, "cars"), 
    where("name", ">=", input.toUpperCase()),
    where("name", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const listcars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listcars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

   setCars(listcars);
  
  }

  return (
    <Container>
      <section className="bg-white p-4  rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="Digite o nome do carro..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button
          className="bg-blue-600 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-semibold text-center text-gray-500 mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

      {cars.map( car => (
        <Link key={car.id} to={`/car/${car.id}`}>
          <section className="w-full bg-white rounded-lg">
            <div 
            className="w-full h-72 rounded-lg bg-slate-200"
            style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src={car.images[0].url}
              alt="Carro" 
              onLoad={ () => handleImageLoad(car.id) }
              style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
            />
            <p className="font-bold text-gray-500 mt-1 mb-2 px-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
              <strong className="text-gray font-medium text-xl">R$ {car.price}</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">
                {car.city}
              </span>
            </div>

          </section>
        </Link>
      ))}  

        

      </main>
    </Container>
  )
}
