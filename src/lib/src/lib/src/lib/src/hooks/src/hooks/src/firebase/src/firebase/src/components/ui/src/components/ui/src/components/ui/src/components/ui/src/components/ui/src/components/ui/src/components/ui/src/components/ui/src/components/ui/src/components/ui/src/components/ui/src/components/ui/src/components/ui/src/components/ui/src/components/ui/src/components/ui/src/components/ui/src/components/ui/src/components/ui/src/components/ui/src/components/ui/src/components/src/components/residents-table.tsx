'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, ArrowUpDown, FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResidentFormDialog } from './resident-form-dialog';
import { deleteResident } from '@/firebase/firestore/residents';
import { useToast } from '@/hooks/use-toast';
import type { Resident } from '@/app/lib/definitions';
import { Card, CardContent } from './ui/card';
import { useFirestore } from '@/firebase';

type ResidentsTableProps = {
  data: Resident[];
};

export function ResidentsTable({ data }: ResidentsTableProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingResident, setEditingResident] = useState<Resident | undefined>(undefined);
  const [deletingResident, setDeletingResident] = useState<Resident | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Resident, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Resident) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(resident =>
      Object.values(resident).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingResident) return;
    deleteResident(firestore, deletingResident.id);
    toast({ title: 'Éxito', description: 'Residente eliminado con éxito.' });
    setDeletingResident(undefined);
  };
  
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID", "Nombre Completo", "Nro. de Casa", "Nro. de ID", "Edad", "Profesión"].join(",") + "\n"
      + filteredAndSortedData.map(r => `${r.id},"${r.fullName}","${r.houseNumber}","${r.idNumber}",${r.age},"${r.profession}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "residentes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "¡Exportado!", description: "Los datos de los residentes se han exportado a CSV." });
  };

  return (
    <>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar residentes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
        </Button>
      </div>
      <Card>
        <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('fullName')} className="cursor-pointer">
                Nombre Completo <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Nro. de Casa</TableHead>
            <TableHead>Nro. de ID</TableHead>
            <TableHead onClick={() => handleSort('age')} className="cursor-pointer">
                Edad <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('profession')} className="cursor-pointer">
                Profesión <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedData.length > 0 ? (
            filteredAndSortedData.map(resident => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.fullName}</TableCell>
                <TableCell>{resident.houseNumber}</TableCell>
                <TableCell>{resident.idNumber}</TableCell>
                <TableCell>{resident.age}</TableCell>
                <TableCell>{resident.profession}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(resident)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDeletingResident(resident)} className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </CardContent>
      </Card>
      {editingResident && (
        <ResidentFormDialog
          resident={editingResident}
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingResident(undefined);
          }}
        >
          <></>
        </ResidentFormDialog>
      )}
      <AlertDialog open={!!deletingResident} onOpenChange={() => setDeletingResident(undefined)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Está absolutely seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del residente {deletingResident?.fullName}.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}