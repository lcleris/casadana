import {
  getListAdminUsersQueryKey,
  useAdminMe,
  useDeleteAdminUser,
  useListAdminUsers,
} from "@casa-dana/api"
import type { AdminUser } from "@casa-dana/api"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"

import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast"

function formatCreatedAt(createdAt: string | undefined): string {
  return createdAt !== undefined && createdAt !== ""
    ? new Date(createdAt).toLocaleDateString("fr-FR")
    : "—"
}

interface UserRowProps {
  user: AdminUser
  isSelf: boolean
  onDelete: (id: string) => void
}

function UserRow({ user, isSelf, onDelete }: UserRowProps) {
  return (
    <tr className="border-outline-variant border-b last:border-0">
      <td className="text-on-surface px-5 py-3">
        {user.email}
        {isSelf && <span className="text-on-surface-variant ml-2">(vous)</span>}
      </td>
      <td className="text-on-surface-variant px-5 py-3 font-mono">
        {formatCreatedAt(user.created_at)}
      </td>
      <td className="px-5 py-3">
        {!isSelf && (
          <button
            type="button"
            onClick={() => {
              if (user.id !== undefined && user.id !== "") {
                onDelete(user.id)
              }
            }}
            aria-label="Supprimer l'administrateur"
            className="text-on-surface-variant hover:bg-error-container hover:text-on-error-container rounded-md p-1.5"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </td>
    </tr>
  )
}

export default function AdminUsersTable() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: me } = useAdminMe()
  const { data } = useListAdminUsers()
  const users = data?.users ?? []
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const { mutate: deleteUser } = useDeleteAdminUser({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey() })
        toast("Administrateur supprimé")
      },
      onError: () => {
        toast("Impossible de supprimer l'administrateur")
      },
    },
  })

  const handleDelete = (id: string) => {
    setPendingDeleteId(id)
  }

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      deleteUser({ id: pendingDeleteId })
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-on-surface-variant px-5 py-10 text-center text-[13.5px]">
        Aucun compte administrateur pour le moment.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-[13px]">
        <thead>
          <tr className="border-outline-variant bg-surface-container-low text-on-surface-variant border-b text-left text-[10.5px] font-semibold tracking-[0.08em] uppercase">
            <th className="px-5 py-2.5">E-mail</th>
            <th className="px-5 py-2.5">Ajouté le</th>
            <th className="px-5 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === me?.id}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={pendingDeleteId !== null}
        question="Retirer l'accès de cet administrateur ?"
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null)
          }
        }}
      />
    </div>
  )
}
