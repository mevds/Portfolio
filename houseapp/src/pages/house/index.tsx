import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc, } from 'firebase/firestore'
import { db } from '../../components/services/firebase'

import { Swiper, SwiperSlide } from 'swiper/react'


interface HouseProps{
  id: string;
  name: string;
  areautil: string;
  areaconstruida:string;
  price: string | number;
  city: string;
  bairro: string;
  localizacao:string;
  whatsapp:string;
  description: string;
  created: string;
  owner:string;
  images: ImageHouseProps[];
  uid: string;
}

interface ImageHouseProps{
  name: string;
  uid: string;
  url: string;
}

export function HouseDetail() {
  const { id } = useParams(); 
  const [house, setHouse] = useState<HouseProps>()
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();


  useEffect(() => {
    async function loadHouse(){
      if(!id){ return }

      const docRef = doc(db, "houses", id)
      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()){
          navigate("/")
        }

        setHouse({
          id: snapshot.id,
          name: snapshot.data()?.name,
          areautil: snapshot.data()?.areautil,
          city: snapshot.data()?.city,
          bairro: snapshot.data()?.bairro,
          areaconstruida: snapshot.data()?.areacontruida,
          uid: snapshot.data()?.uid,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          price: snapshot.data()?.price,
          localizacao: snapshot.data()?.localizacao,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images
        })
      })


    }

    loadHouse()


  }, [id, navigate])


  useEffect(() => {

    function handleResize(){
      if(window.innerWidth < 720){
        setSliderPerView(1);
      }else{
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize)

    return() => {
      window.removeEventListener("resize", handleResize)
    }

  }, [])


  return (
    <Container>
      
      { house && (
        <Swiper 
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {house?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                className="w-full h-80 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      { house && (
      <main className="w-full bg-white rounded-lg p-6 my-4">
        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
          <h1 className="font-bold text-3xl text-gray">{house?.name}</h1>
          <h1 className="font-bold text-3xl text-gray">R$ {house?.price}</h1>
        </div>
        <p>{house?.localizacao}</p>
        
        <div className="flex w-full gap-6 my-4">
          <div className="flex flex-col gap-4">
            <div>
              <p>Cidade</p>
              <strong>{house?.city}</strong>
            </div> 
            <div>
              <p>Area ùtil</p>
              <strong>{house?.areautil}</strong>
            </div> 
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p>Área Construída</p>
              <strong>{house?.areaconstruida}</strong>
            </div> 
          </div>
        </div>

        <strong>Descrição:</strong>
        <p className="mb-4">{house?.description}</p>
        

        <strong>Telefone / WhatsApp</strong>
        <p>{house?.whatsapp}</p>

        <a
          href={`https://api.whatsapp.com/send?phone=${house?.whatsapp}&text=Olá vi esse ${house?.name} no site HouseApp e fique interessado!`}
          target="_blank"  
          className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
        >
          Conversar com corretor
          <FaWhatsapp size={26} color="#FFF" />
        </a>

      </main>
      )}
    </Container>
  )
}