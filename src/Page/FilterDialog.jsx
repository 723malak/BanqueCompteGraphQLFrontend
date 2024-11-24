import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterDialog({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState('TOUS');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type });
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les comptes</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type">Type de compte</label>
                <Select value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOUS">Tous</SelectItem>
                    <SelectItem value="EPARGNE">EPARGNE</SelectItem>
                    <SelectItem value="COURANT">COURANT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Appliquer le filtre</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
