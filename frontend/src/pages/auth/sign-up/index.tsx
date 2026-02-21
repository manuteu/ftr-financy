import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type ISignInSchema } from "./schemas";
import { Mail, Lock, LogIn, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import Logo from '@/assets/logo.svg'

export default function SignUp() {
  // const authStoreInstance = useAuthStore(); // TODO authstore
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState:
    { errors, isSubmitting }, reset } = useForm<ISignInSchema>({
      resolver: zodResolver(signInSchema),
      defaultValues: { username: "", password: "" },
      mode: "onSubmit",
      reValidateMode: "onChange",
    });

  async function onSubmit(data: ISignInSchema) {
    // const result = await loginHandlers.signIn(data, authStoreInstance);
    const result = true; // TODO login handlers
    if (!result) return;
    reset();
  }

  return (
    <div className=" w-full max-w-md mx-auto">
      <img src={Logo} className="w-33 mx-auto" />
      <Card className="p-8 xl:gap-6 gap-2 m-4 bg-white">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-xl font-bold">Criar conta</h1>
          <p>Entre na sua conta para continuar</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="text-base text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-foreground" />
              Nome completo
            </Label>
            <Input
              id="username"
              className="rounded-sm px-3"
              placeholder="mail@exemplo.com"
              aria-invalid={!!errors.username}
              {...register("username")}
              autoComplete="new-username"
            />
            {errors.username && (
              <span className="text-sm text-destructive">{errors.username.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="text-base text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-foreground" />
              E-mail
            </Label>
            <Input
              id="username"
              className="rounded-sm px-3"
              placeholder="mail@exemplo.com"
              aria-invalid={!!errors.username}
              {...register("username")}
              autoComplete="new-username"
            />
            {errors.username && (
              <span className="text-sm text-destructive">{errors.username.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="text-base text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-foreground" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="rounded-sm px-3"
              placeholder="Digite sua senha"
              aria-invalid={!!errors.password}
              {...register("password")}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="text-sm text-destructive">{errors.password.message}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs">A senha deve ter no mínimo 8 caractéres</p>
          </div>
          <Button type="submit" className="uppercase mt-2" isLoading={isSubmitting}>
            Cadastrar
          </Button>

          <div className="flex items-center gap-3">
            <Separator />
            <p>ou</p>
            <Separator />
          </div>

          <p className="text-center">Já tem uma conta?</p>
          <Button type="submit" className="uppercase mt-2" isLoading={isSubmitting} onClick={() => navigate('/')}>
            <LogIn />
            Fazer login
          </Button>
        </form>
      </Card>
    </div>
  )
}
