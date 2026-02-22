'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addResident, updateResident } from '@/firebase/firestore/residents';
import type { Resident } from '@/app/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { z } from 'zod';

type ResidentFormDialogProps = {
  children: React.ReactNode;
  resident?: Resident;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ResidentSchema = z.object({
  fullName: z.string().min(3, { message: 'El nombre completo debe tener al menos 3 caracteres.' }),
  houseNumber: z.string().min(1, { message: 'El número de casa es obligatorio.' }),
  idNumber: z.string().min(5, { message: 'El número de ID debe tener al menos 5 caracteres.' }),
  age: z.coerce.number().int().gt(0, { message: 'La edad debe ser un número positivo.' }),
  profession: z.string().min(3, { message: 'La profesión debe tener al menos 3 caracteres.' }),
});

export function ResidentFormDialog({ children, resident, open, onOpenChange }: ResidentFormDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    const formData = new FormData(event.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      houseNumber: formData.get('houseNumber'),
      idNumber: formData.get('idNumber'),
      age: formData.get('age'),
      profession: formData.get('profession'),
    };

    const validation = ResidentSchema.safeParse(data);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    if (resident) {
      updateResident(firestore, resident.id, validation.data);
      toast({
        title: 'Éxito',
        description: 'Residente actualizado con éxito.',
      });
    } else {
      addResident(firestore, validation.data);
      toast({
        title: 'Éxito',
        description: 'Residente agregado con éxito.',
      });
    }
    onOpenChange?.(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!open) {
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{resident ? 'Editar Residente' : 'Agregar Residente'}</DialogTitle>
          <DialogDescription>
            {resident ? 'Actualice los detalles de este residente.' : 'Ingrese los detalles del nuevo residente.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">Nombre Completo</Label>
              <Input id="fullName" name="fullName" defaultValue={resident?.fullName} className="col-span-3" />
            </div>
            {errors?.fullName && <p className="col-span-4 text-sm text-destructive text-right">{errors.fullName[0]}</p>}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="houseNumber" className="text-right">Nro. de Casa</Label>
              <Input id="houseNumber" name="houseNumber" defaultValue={resident?.houseNumber} className="col-span-3" />
            </div>
            {errors?.houseNumber && <p className="col-span-4 text-sm text-destructive text-right">{errors.houseNumber[0]}</p>}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idNumber" className="text-right">Nro. de ID</Label>
              <Input id="idNumber" name="idNumber" defaultValue={resident?.idNumber} className="col-span-3" />
            </div>
            {errors?.idNumber && <p className="col-span-4 text-sm text-destructive text-right">{errors.idNumber[0]}</p>}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Edad</Label>
              <Input id="age" name="age" type="number" defaultValue={resident?.age} className="col-span-3" />
            </div>
             {errors?.age && <p className="col-span-4 text-sm text-destructive text-right">{errors.age[0]}</p>}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profession" className="text-right">Profesión</Label>
              <Input id="profession" name="profession" defaultValue={resident?.profession} className="col-span-3" />
            </div>
            {errors?.profession && <p className="col-span-4 text-sm text-destructive text-right">{errors.profession[0]}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange?.(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}