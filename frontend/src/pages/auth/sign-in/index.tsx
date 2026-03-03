import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type ISignInSchema } from "./schemas";
import { Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router'
import Logo from '@/assets/logo.svg'
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import storage from "@/storage";

function getRememberMeEmail(): string {
  return localStorage.getItem(storage.REMEMBER_ME_EMAIL) ?? "";
}

export default function SignIn() {
  const authStoreInstance = useAuthStore();
  const navigate = useNavigate();
  const savedEmail = getRememberMeEmail();

  const {
    register,
    control,
    handleSubmit,
    formState:
    { errors, isSubmitting }, reset } = useForm<ISignInSchema>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        email: savedEmail,
        password: "",
        rememberMe: !!savedEmail,
      },
      mode: "onSubmit",
      reValidateMode: "onChange",
    });

  async function onSubmit(data: ISignInSchema) {
    try {
      const result = await authStoreInstance.signIn(data);
      if (!result) return;
      if (data.rememberMe) {
        localStorage.setItem(storage.REMEMBER_ME_EMAIL, data.email);
      } else {
        localStorage.removeItem(storage.REMEMBER_ME_EMAIL);
      }
      reset();
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error));
    }
  }

  return (
    <div className=" w-full max-w-md mx-auto">
      <img src={Logo} className="w-33 mx-auto" />
      <Card className="p-8 xl:gap-6 gap-2 m-4 bg-card">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-xl font-bold">Fazer login</h1>
          <p>Entre na sua conta para continuar</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-base text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-foreground" />
              E-mail
            </Label>
            <Input
              id="email"
              className="rounded-sm px-3"
              placeholder="mail@exemplo.com"
              aria-invalid={!!errors.email}
              {...register("email")}
              autoComplete="new-email"
            />
            {errors.email && (
              <span className="text-sm text-destructive">{errors.email.message}</span>
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
            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="rememberMe">Lembrar-me</Label>
            </div>
            <p className="text-sm text-primary">Recuperar senha</p>
          </div>
          <Button type="submit" size="lg" className="mb-1 text-base" isLoading={isSubmitting}>
            Entrar
          </Button>

          <div className="flex items-center gap-3">
            <Separator />
            <p className="text-sm text-muted-foreground">ou</p>
            <Separator />
          </div>

          <p className="text-center mt-1">Ainda não tem uma conta?</p>
          <Button type="button" size="lg" className="text-base" onClick={() => navigate('/signup')}>
            Criar conta
          </Button>
        </form>
      </Card>
    </div>
  )
}
