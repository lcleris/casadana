import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ConfirmDialogProps {
  open: boolean
  question: string
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export function ConfirmDialog({ open, question, onConfirm, onOpenChange }: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{question}</DialogTitle>
        <div className="mt-2 flex justify-end gap-2.5">
          <DialogClose render={<Button type="button" variant="outline" />}>Annuler</DialogClose>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
