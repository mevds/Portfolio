import { useEffect,useContext } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { auth } from '../../components/services/firebase.ts'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import {AuthContext} from '../../components/context/AuthContext'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);
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


  async function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })

      console.log("CADASTRADO COM SUCESSO!")
      toast.success("CADASTRADO COM SUCESSO!")
      navigate("/dashboard", { replace: true })

    })
    .catch((error) => {
      console.log("ERRO AO CADASTRAR ESTE USUARIO")
      console.log(error);
      toast.error("ERRO AO CADASTRAR ESTE USUARIO!")
    })

  }

  return (
    <Container>
      <div className= "w-full min-h-screen flex justify-center items-center flex-col gap-4">
      <Link to="/" className=" max-w-lg w-full p-4 bg-blue-900 rounded-md ">
        <h1 className="  font-semibold text-center text-white">
              HouseApp
            </h1>
        </Link>

        <form
          className="bg-white max-w-lg w-full rounded-lg p-2"
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

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

          <button type="submit" className=" w-full bg-blue-900 mt-5 rounded-md text-white h-10 font-medium ">
            Acessar
          </button>

        </form>

        <Link to="/login">
          Já possui uma conta? Faça o login!
        </Link>

      </div>
    </Container>
  )
}