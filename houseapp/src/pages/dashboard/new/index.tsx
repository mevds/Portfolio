import {ChangeEvent,useContext,useState} from 'react'
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiUpload,FiTrash } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidV4 } from 'uuid'
import { storage, db } from '../../../components/services/firebase'
import { AuthContext } from '../../../components/context/AuthContext'
import {ref,uploadBytes,getDownloadURL,deleteObject} from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().nonempty("Informação do imóvel é obrigatório"),
  areautil: z.string().nonempty("Área Útil é obrigatória"),
  areaconstruida: z.string().nonempty("Área Construída é obrigatória"),
  localizacao: z.string().nonempty("Localização é obrigatório"),
  price: z.string().nonempty("O valor do imóvel é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  bairro: z.string().nonempty("O bairro é obrigatória"),
  whatsapp: z.string().min(1, "O Telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
  message: "Numero de telefone invalido."
  }),
  description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}



export function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [houseImages, setHouseImages] = useState<ImageItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        await handleUpload(image)
      }else{
        alert("Envie uma imagem jpeg ou png!")
        return;
      }

    }
  }
  
  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          }

          setHouseImages((images) => [...images, imageItem] )


        })
    })

  }

  function onSubmit(data: FormData){

    if(houseImages.length === 0){
      toast.error("Envie uma imagem!")
      alert("Envie alguma imagem deste carro!")
      return;
    }
    
    const houseListImages = houseImages.map( house => {
      return{
        uid: house.uid,
        name: house.name,
        url: house.url
      }
    })

    addDoc(collection(db, "houses"), {
      name: data.name,
      areautil: data.areautil,
      whatsapp: data.whatsapp,
      city: data.city,
      bairro: data.bairro,
      areaconstruida: data.areaconstruida,
      localizacao: data.localizacao,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: houseListImages,
    })
    .then(() => {
      reset();
      setHouseImages([]);
      console.log("CADASTRADO COM SUCESSO!");
      toast.success("Cadastrado com Sucesso!")
    })
    .catch((error) => {
      console.log(error)
      console.log("ERRO AO CADASTRAR NO BANCO")
      toast.error("Erro ao Cadastrar no Banco!")
    })

    
  }

  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try{
      await deleteObject(imageRef)
      setHouseImages(houseImages.filter((house) => house.url !== item.url))
    }catch(err){
      console.log("ERRO AO DELETAR")
    }

  }


  return (
    <Container>
      <DashboardHeader/>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-blue-900 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#1E3A8A" />
          </div>
          <div className="cursor-pointer">
            <input type="file" accept="image/*" className="opacity-0 cursor-pointer" 
            onChange={handleFile} />
          </div>
        </button>
        {houseImages.map( item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute" onClick={() => handleDeleteImage(item) }>
              <FiTrash size={28} color="#1E3A8A" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do imóvel"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}  
        >
          <div className="mb-3">
            <p className="mb-2 font-medium">Imóvel</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex:Casa 2 quartos..."
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">

              <div className="w-full">
               <p className="mb-2 font-medium">Área Útil</p>
                 <Input
                 type="text"
                 register={register}
                 name="areautil"
                 error={errors.areautil?.message}
                 placeholder="Ex: 50 metros..."
                 />
              </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Área Construída</p>
              <Input
                type="text"
                register={register}
                name="areaconstruida"
                error={errors.areaconstruida?.message}
                placeholder="Ex: 100 metros..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Localização</p>
              <Input
                type="text"
                register={register}
                name="localizacao"
                error={errors.localizacao?.message}
                placeholder="Ex: Zona oeste..."
              />
            </div>
         </div>


          <div className="flex w-full mb-3 flex-row items-center gap-4">

          <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Campo Grande - MS..."
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Bairro</p>
              <Input
                type="text"
                register={register}
                name="bairro"
                error={errors.bairro?.message}
                placeholder="Ex: Santo Antônio..."
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 011999101923..."
              />
            </div>

      
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa do imóvel..."
            />
            {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
          </div>

          <div className=" flex mb-3 flex-row items-center justify-items-center gap-2">
            
            <button type="submit" className="w-full rounded-md bg-blue-900 text-white font-medium h-10">
            Cadastrar
          </button>
            
           
          
           </div>
        
        </form>
        

      </div>
    </Container>
  )
}