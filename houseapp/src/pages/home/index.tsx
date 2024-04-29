import { useState, useEffect } from 'react'
import { Container } from "../../components/container";
import { Link } from 'react-router-dom'
import {collection,query,getDocs,orderBy, where} from 'firebase/firestore'
import { db } from '../../components/services/firebase'

interface HouseProps{
  id: string;
  name: string;
  areautil: string;
  areaconstruida: string;
  price: string | number;
  city: string;
  bairro: string;
  images: ImageHouseProps[];
  uid: string;
}

interface ImageHouseProps{
  name: string;
  uid: string;
  url: string;
}
 

export function Home() {
  const [houses, setHouses] = useState<HouseProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadHouses();
  }, [])

  function loadHouses(){
    const housesRef = collection(db, "houses")
    const queryRef = query(housesRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then((snapshot) => {
      const listhouses = [] as HouseProps[];

      snapshot.forEach( doc => {
        listhouses.push({
            id: doc.id,
            name: doc.data().name.toUpperCase(),
            areautil: doc.data().areautil,
            areaconstruida: doc.data().areaconstruida,
            city: doc.data().city.toUpperCase(),
            bairro: doc.data().bairro.toUpperCase(),
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
        })
      })

      setHouses(listhouses);  
    })

  }


  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearchHouse(){
    if(input === ''){
      loadHouses();
      return;
    }

    setHouses([]);
    setLoadImages([]);

    const q = query(collection(db, "houses"), 
    where("bairro", ">=", input.toUpperCase()),
    where("bairro", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const listhouses = [] as HouseProps[];

    querySnapshot.forEach((doc) => {
      listhouses.push({
        id: doc.id,
        name: doc.data().name.toUpperCase(),
        areautil: doc.data().areautil,
        areaconstruida: doc.data().areaconstruida,
        city: doc.data().city.toUpperCase(),
        bairro: doc.data().bairro.toUpperCase(),
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

   setHouses(listhouses);
  
  }

  return (
    <Container>
      <section className="bg-white p-4  rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
          placeholder="Digite o nome do Bairro..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button
          className="bg-blue-900 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchHouse}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-semibold text-center text-gray-500 mt-6 text-2xl mb-4">
        Imóveis a venda para todo o Brasil
      </h1>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

      {houses.map( house => (
        <Link key={house.id} to={`/house/${house.id}`}>
          <section className="w-full bg-white rounded-lg">
            <div 
            className="w-full h-72 rounded-lg bg-slate-200"
            style={{ display: loadImages.includes(house.id) ? "none" : "block" }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src={house.images[0].url}
              alt="Imóvel" 
              onLoad={ () => handleImageLoad(house.id) }
              style={{ display: loadImages.includes(house.id) ? "block" : "none" }}
            />
            <p className="font-bold text-gray-500 mt-1 mb-2 px-2">{house.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Área Útil: {house.areautil} | Área Construída: {house.areaconstruida} </span>
              <strong className="text-gray font-medium text-xl">R$ {house.price}</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">
                {house.city} - {house.bairro}
              </span>
            </div>

          </section>
        </Link>
      ))}  

        

      </main>
    </Container>
  )
}
