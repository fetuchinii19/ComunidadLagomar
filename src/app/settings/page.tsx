'use client';

import { PageHeader } from "@/components/page-header";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/config';
import type { Resident } from '@/app/lib/definitions';
import { collection } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const firestore = useFirestore();
  const { isAdmin } = useAuth();
  
  const residentsCol = useMemoFirebase(() => {
    if (isAdmin) {
      return collection(firestore, 'residents');
    }
    return null;
  }, [firestore, isAdmin]);
  const { data: residents, isLoading } = useCollection(residentsCol);

  if (!isAdmin) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Necesitas iniciar sesión como administrador para ver la configuración.</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Administre la configuración y los datos de la aplicación."
      />
      {isLoading && <SettingsSkeleton />}
{!isLoading && residents && <div className="p-4 border rounded">Datos de residentes cargados correctamente</div>}      
    </>
  );
}

const SettingsSkeleton = () => (
    <div className="grid gap-6">
        <div className="p-4 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="p-4 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
)