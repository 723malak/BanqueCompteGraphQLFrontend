import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddAccountPopup({ isOpen, onClose, onAdd }) {
  const [solde, setSolde] = useState('')
  const [type, setType] = useState('COURANT')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCompte = {
      solde: parseFloat(solde),
      type,
    }
    onAdd(newCompte)
    setSolde('')
    setType('COURANT')
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau compte</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="solde">Solde</Label>
                <Input
                    id="solde"
                    type="number"
                    value={solde}
                    onChange={(e) => setSolde(e.target.value)}
                    required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionnez le type de compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EPARGNE">EPARGNE</SelectItem>
                    <SelectItem value="COURANT">COURANT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}