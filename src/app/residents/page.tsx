'use client';

import { PageHeader } from '@/components/page-header';
import { ResidentsTable } from '@/components/residents-table';
import { ResidentFormDialog } from '@/components/resident-form-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Resident } from '@/app/lib/definitions';
import { collection } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ResidentsPage() {
  const firestore = useFirestore();
  const { isAdmin } = useAuth();

  const residentsCol = useMemoFirebase(() => {
    if (isAdmin) {
      return collection(firestore, 'residents');
    }
    return null;
  }, [firestore, isAdmin]);

  const { data: residents, isLoading } = useCollection<Resident>(residentsCol);

  if (!isAdmin) {
      return (
          <Card>
              <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Necesitas iniciar sesión como administrador para ver a los residentes.</p>
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Residentes"
        description="Administre los residentes de la comunidad Lago Mar aquí. Puede agregar, editar o eliminar registros de residentes."
      >
        <ResidentFormDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Residente
            </Button>
        </ResidentFormDialog>
      </PageHeader>
      
      <div className="flex-grow">
          {isLoading && <ResidentsSkeleton />}
          {!isLoading && residents && <ResidentsTable data={residents} />}
          {!isLoading && !residents && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No hay residentes para mostrar.</p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

const ResidentsSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);