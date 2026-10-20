import { ORPCError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { orpc } from "@/lib/orpc"

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.query(orpc.admin.me.queryOptions())
    } catch {
      return
    }
    redirect({
      to: "/admin/reservations",
      search: { property: "casadana", page: 1 },
      throw: true,
    })
  },
  component: AdminLoginPage,
})

interface LoginFormValues {
  email: string
  password: string
}

function AdminLoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  })

  const { mutate: login, isPending } = useMutation(
    orpc.admin.login.mutationOptions({
      onSuccess: () => {
        void navigate({ to: "/admin/reservations", search: { property: "casadana", page: 1 } })
      },
      onError: (err) => {
        const message =
          err instanceof ORPCError && err.code === "INVALID_CREDENTIALS"
            ? "E-mail ou mot de passe incorrect."
            : "Une erreur est survenue. Réessayez."
        setError("password", { type: "invalid", message })
      },
    }),
  )

  const onSubmit = (values: LoginFormValues) => {
    login(values)
  }

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
        className="bg-surface shadow-editorial w-full max-w-sm rounded-xl p-10"
      >
        <p className="text-on-surface-variant mb-1.5 font-mono text-[11px] tracking-[0.22em] uppercase">
          Casa DaNa &amp; CasAy
        </p>
        <h1 className="text-on-surface mb-6 text-xl font-bold">Accès administrateur</h1>

        <Field className="mb-3">
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            {...register("email", { required: true })}
          />
        </Field>
        <Field className="mb-1">
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
          />
        </Field>
        <FieldError errors={[errors.password]} className="mb-3 min-h-4" />

        <Button type="submit" disabled={isPending} className="w-full justify-center">
          {isPending ? "Connexion…" : "Accéder au tableau de bord"}
        </Button>
      </form>
    </div>
  )
}
