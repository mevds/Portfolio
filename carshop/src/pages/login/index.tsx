import {Container} from '../../components/container'
import {Link,useNavigate} from 'react-router-dom'

import {useEffect} from 'react'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../components/services/firebase.ts'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")})
type FormData = z.infer<typeof schema>

export function Login() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange"
    })

    useEffect(() => {
      async function handleLogout(){
        await signOut(auth)
      }
  
      handleLogout();
    }, [])
  
  
    function onSubmit(data: FormData){
      signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log("LOGADO COM SUCESSO!")
        console.log(user)
        toast.success("LOGADO COM SUCESSO!")
        navigate("/dashboard", { replace: true })
      })
      .catch(err => {
        console.log("ERRO AO LOGAR")
        console.log(err);
        toast.error("Erro ao fazer o login.")
      
      })
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    

  return (
    
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className=" max-w-xl w-full p-4 bg-blue-600 rounded-lg  ">
          <h1 className="font-semibold text-center text-white">CarShop</h1>
        </Link>

        <form 
          className="bg-white max-w-xl w-full rounded-lg p-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          

          <div className="mb-3">
       
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
       
            <button type="submit" className=" w-full bg-blue-600 mt-5 rounded-md text-white h-10 font-medium ">
            Acessar
          </button>
          
          

        </form>

        <Link to="/register">
          Ainda não possui uma conta? Cadastre-se
        </Link>

      </div>
    </Container>

  )
}