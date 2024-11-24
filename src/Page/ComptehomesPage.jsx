'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DELETE_COMPTE, SAVE_COMPTE, GET_ALL_COMPTES_AND_TOTAL_SOLDE } from '@/Services/CompteGraph';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Filter, CreditCard, Calendar, Currency } from 'lucide-react';
import AddAccountPopup from './AddAccountPopup';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ComptehomesPage() {
    const [comptes, setComptes] = useState([]);
    const [solde, setSolde] = useState({});

    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [compteToDelete, setCompteToDelete] = useState(null);

    const [filterOptions, setFilterOptions] = useState({
        type: 'TOUS',
        solde: '',
        filterBySolde: false
    });

    const { data, loading, error, refetch } = useQuery(GET_ALL_COMPTES_AND_TOTAL_SOLDE);
    const [deleteCompte] = useMutation(DELETE_COMPTE, {
        update(cache, { data: { deleteCompte } }) {
            if (deleteCompte) {
                refetch();
            }
        },
        onError: (err) => {
            console.error('Delete error:', err);
            alert("Une erreur est survenue lors de la suppression du compte.");
        }
    });

    const [addaccount] = useMutation(SAVE_COMPTE, {
        update({ data: { saveCompte } }) {
            if (saveCompte) {
                refetch();
            }
        },
        onError: (err) => {
            console.error('Add error:', err);
            alert("Une erreur est survenue lors de l'ajout du compte.");
        }
    });

    useEffect(() => {
        if (data?.getComptes) {
            setComptes(data.getComptes);
            setSolde(data.totalSolde);
        }
    }, [data]);

    if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    if (error) return <div className="flex items-center justify-center h-screen">Erreur : {error.message}</div>;

    const handleDelete = async (id) => {
        setCompteToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCompte({ variables: { id: compteToDelete } });
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Delete operation failed:', error);
            alert("La suppression a échoué. Veuillez réessayer.");
        }
    };

    const handleAdd = async (newCompte) => {
        await addaccount({
            variables: newCompte,
        });
        setIsAddPopupOpen(false);
        refetch();
    };

    const handleFilterChange = (key, value) => {
        setFilterOptions(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        if (filterOptions.type !== "TOUS") {
            if (filterOptions.solde) {
                refetch({ type: filterOptions.type, minSolde: filterOptions.solde });
            } else {
                refetch({ type: filterOptions.type });
            }
        } else {
            refetch();
        }
    };

    const filteredComptes = comptes.filter(compte =>
        (filterOptions.type === 'TOUS' || compte.type === filterOptions.type) &&
        (!filterOptions.filterBySolde || compte.solde >= parseFloat(filterOptions.solde || '0'))
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 border-r p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="type">Type de compte</Label>
                        <Select onValueChange={(value) => handleFilterChange('type', value)} defaultValue={filterOptions.type}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TOUS">Tous</SelectItem>
                                <SelectItem value="COURANT">Courant</SelectItem>
                                <SelectItem value="EPARGNE">Épargne</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={applyFilters} className="w-full">
                        <Filter className="mr-2 h-4 w-4" /> Appliquer les filtres
                    </Button>
                </div>
                <div className="mt-auto">
                    <Button onClick={() => setIsAddPopupOpen(true)} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un compte
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-100 text-gray-800 p-4">
                    <h1 className="text-2xl font-bold mt-4">Comptes</h1>
                </header>

                <main className="flex-1 p-4 overflow-auto">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredComptes.map((compte) => (
                                <Card key={compte.id}
                                      className="overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-white hover:bg-gray-50">
                                    <CardHeader className="bg-gray-100 text-gray-800">
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Compte {compte.id}</span>
                                            <CreditCard className="h-6 w-6"/>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center mb-2">
                                            <Currency className="mr-2 h-4 w-4"/>
                                            <p className="font-semibold">{compte.solde.toLocaleString('fr-FR')} DHS</p>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <CreditCard className="mr-2 h-4 w-4"/>
                                            <p>{compte.type}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4"/>
                                            <p>{new Date(compte.dateCreation).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end bg-gray-200 text-gray-800">
                                        <Button variant="destructive" onClick={() => handleDelete(compte.id)}>
                                            <Trash2 className="mr-2 h-4 w-4"/> Supprimer
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </main>

                <footer className="bg-gray-100 p-4 border-t">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-[#030303]">Total : <span
                                className="text-[#030303]">{solde.sum} DHS</span></p>
                            <p className="text-sm text-muted-foreground text-[#030303]">Moyenne
                                : {solde.average} DHS</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-[#030303]">Nombre de comptes : <span
                                className="text-[#030303]">{solde.count}</span></p>
                        </div>
                    </div>
                </footer>
            </div>

            <AddAccountPopup
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                onAdd={handleAdd}
            />

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

