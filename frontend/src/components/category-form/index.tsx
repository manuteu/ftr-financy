import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import { Tag } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PREDEFINED_COLORS, PREDEFINED_ICONS } from "./constants"
import type { CategoryFormSchema } from "./schema"

interface CategoryFormProps {
  control: Control<CategoryFormSchema>
  register: UseFormRegister<CategoryFormSchema>
  errors: FieldErrors<CategoryFormSchema>
  isSubmitting: boolean
  onSubmit: (data: CategoryFormSchema) => void
  handleSubmit: (onValid: (data: CategoryFormSchema) => void) => (e: React.FormEvent) => void
  submitLabel?: string
}

export function CategoryForm({
  control,
  register,
  errors,
  isSubmitting,
  onSubmit,
  handleSubmit,
  submitLabel = "Salvar",
}: CategoryFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Título
        </Label>
        <Input
          id="name"
          placeholder="Ex. Alimentação"
          className="rounded-lg px-3.5 py-3.5 h-auto"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <span className="text-sm text-destructive">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          Descrição
        </Label>
        <Input
          id="description"
          placeholder="Descrição da categoria"
          className="rounded-lg px-3.5 py-3.5 h-auto"
          {...register("description")}
        />
        <p className="text-xs text-muted-foreground">Opcional</p>
        {errors.description && (
          <span className="text-sm text-destructive">{errors.description.message}</span>
        )}
      </div>

      <Controller
        name="icon"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => field.onChange(iconName)}
                  className={cn(
                    "flex size-[42px] items-center justify-center rounded-lg border transition-colors",
                    field.value === iconName
                      ? "border-primary bg-gray-100 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <DynamicIcon
                    name={iconName as IconName}
                    className="size-5"
                    fallback={() => <Tag className="size-5" />}
                  />
                </button>
              ))}
            </div>
            {errors.icon && (
              <span className="text-sm text-destructive">{errors.icon.message}</span>
            )}
          </div>
        )}
      />

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Cor</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => field.onChange(color.value)}
                  className={cn(
                    "flex flex-1 min-w-[52px] items-center justify-center p-1.5 rounded-lg border transition-colors",
                    field.value === color.value
                      ? "border-primary border-2 bg-gray-100"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  <div className={cn("h-5 w-full min-w-[20px] rounded-[4px]", color.color)} />
                </button>
              ))}
            </div>
            {errors.color && (
              <span className="text-sm text-destructive">{errors.color.message}</span>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-lg py-3 text-base font-medium mt-2"
        isLoading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </form>
  )
}
