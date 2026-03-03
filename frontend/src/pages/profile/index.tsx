import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type IUpdateProfileSchema } from "./schemas";
import { Mail, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { useEffect } from "react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (user?.name) reset({ name: user.name });
  }, [user?.name, reset]);

  async function onSubmit(data: IUpdateProfileSchema) {
    try {
      const success = await updateProfile(data.name);
      if (success) {
        toast.success("Perfil atualizado com sucesso!");
        reset({ name: data.name });
      }
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <Card className="mx-auto mt-12 max-w-md border border-border bg-card p-8 rounded-xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <Avatar className="size-16 rounded-full bg-gray-300">
            <div className="bg-gray-300 text-gray-800 text-2xl font-medium flex items-center justify-center size-full">
              {getInitials(user.name)}
            </div>
          </Avatar>
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="text-xl font-semibold text-gray-800 leading-7">{user.name}</p>
            <p className="text-base text-muted-foreground leading-6">{user.email}</p>
          </div>
        </div>

        <Separator />

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                className="rounded-lg pl-10"
                placeholder="Digite seu nome"
                aria-invalid={!!errors.name}
                {...register("name")}
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <span className="text-sm text-destructive">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                disabled
                value={user.email}
                className="rounded-lg pl-10 opacity-50"
              />
            </div>
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <Button
              type="submit"
              className="h-12 w-full rounded-lg py-3 text-base font-medium"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Salvar alterações
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-lg gap-2 border-border py-3 text-base font-medium text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-[18px] text-destructive" />
              Sair da conta
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
