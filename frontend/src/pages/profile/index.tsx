import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type IUpdateProfileSchema } from "./schemas";
import { Mail, LogOut, User } from "lucide-react";
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState:
    { errors, isSubmitting }, reset } = useForm<IUpdateProfileSchema>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: { name: "", email: "" },
      mode: "onSubmit",
      reValidateMode: "onChange",
    });

  async function onSubmit(data: IUpdateProfileSchema) {
    // const result = await loginHandlers.signIn(data, authStoreInstance);
    const result = true; // TODO login handlers
    if (!result) return;
    reset();
  }

  return (
    <Card className="max-w-md mx-auto p-6 mt-12 bg-white">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>Conta teste</p>
        <p>conta@teste.com</p>
      </div>
      <Separator />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1">
          <Label htmlFor="name" className="text-base text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-foreground" />
            Nome completo
          </Label>
          <Input
            id="name"
            className="rounded-sm px-3"
            placeholder="Digite seu nome"
            aria-invalid={!!errors.name}
            {...register("name")}
            autoComplete="new-name"
          />
          {errors.name && (
            <span className="text-sm text-destructive">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-base text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-foreground" />
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            className="rounded-sm px-3"
            placeholder="Digite seu e-mail"
            aria-invalid={!!errors.email}
            {...register("email")}
            autoComplete="new-email"
          />
          <span className="text-xs text-muted-foreground">O e-mail não pode ser alterado</span>
        </div>
        <Button type="submit" className="" isLoading={isSubmitting}>
          Salvar alterações
        </Button>
        <Button type="submit" className="" isLoading={isSubmitting} onClick={() => navigate('/signup')}>
          <LogOut className="text-red-500" />
          Sair da conta
        </Button>
      </form>
    </Card>
  )
}
