import { useEffect, useState, useContext  } from 'react'
import { Container } from "../../components/container";
import { DashboardHeader } from '../../components/panelheader'

import { FiTrash2,FiEdit } from 'react-icons/fi'
//import { Link } from 'react-router-dom'
import { collection, getDocs, where, query, doc, deleteDoc } from 'firebase/firestore'
import { db, storage } from '../../components/services/firebase'
import { ref, deleteObject } from 'firebase/storage'
import { AuthContext } from '../../components/context/AuthContext'


interface HouseProps{
  id: string;
  name: string;
  areautil: string;
  areaconstruida:string;
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

export function Dashboard() {
  const [houses, setHouses] = useState<HouseProps[]>([]); 
  const { user } = useContext(AuthContext);

  

  useEffect(() => {

    function loadHouses(){
      if(!user?.uid){
        return;
      }

      const housesRef = collection(db, "houses")
      const queryRef = query(housesRef, where("uid", "==", user.uid))

      getDocs(queryRef)
      .then((snapshot) => {
        const listhouses = [] as HouseProps[];

        snapshot.forEach( doc => {
          listhouses.push({
            id: doc.id,
            name: doc.data().name.toUpperCase(),
            areautil: doc.data().areautil,
            areaconstruida: doc.data().areaconstruida,
            city: doc.data().city,
            bairro: doc.data().bairro,
            price: doc.data().price,
           images: doc.data().images,
            uid: doc.data().uid
          })
        })

        setHouses(listhouses);  
        
      })

    }

    loadHouses();

  }, [user])



  async function handleDeleteHouse(house: HouseProps){
    const itemHouse = house;

    const docRef = doc(db, "houses", itemHouse.id)
    await deleteDoc(docRef);
    
    itemHouse.images.map( async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`
      const imageRef = ref(storage, imagePath)

      try{
        await deleteObject(imageRef)
        setHouses(houses.filter(house => house.id !== itemHouse.id))
        
      }catch(err){
        console.log("ERRO AO EXCLUIR ESSA IMAGEM")
        
      }

    })
  }


  return (
    <Container>
      <DashboardHeader/>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

      {houses.map(house => (
        <section key={house.id} className="w-full bg-white rounded-lg relative">
          <button 
          onClick={ () => handleDeleteHouse(house) }
          className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center 
          right-2 top-2 drop-shadow">
            <FiTrash2 size={25} color="#1e3a8a" />
          </button>
        
          <button className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center 
          right-2 top-10 drop-shadow" >
            
            <FiEdit size={25} color="#1e3a8a"  />

        
          </button>

          <img
            className="w-full rounded-lg mb-2 max-h-70"
            src={house.images[0].url}/>
         
          <p className="font-bold mt-1 px-2 mb-2">{house.name}</p>

          <div className="flex flex-col px-2">
            <span className="text-gray-700">
              Área Útil: {house.areautil} | Área Construída: {house.areaconstruida} 
            </span>
            <strong className="text-gray font-bold mt-4">
              R$ {house.price}
            </strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2">
            <span className="text-gray">
              {house.city} | {house.bairro}
            </span>
          </div>

        </section>
      )) }

      </main>

    </Container>
  )
}