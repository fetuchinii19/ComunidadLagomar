'use client';

import { Users, Home, Activity } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { PageHeader } from '@/components/page-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Resident } from '@/app/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const firestore = useFirestore();
  const { isAdmin, isAuthenticated } = useAuth();

  const residentsCol = useMemoFirebase(() => {
    if (isAdmin) {
      return collection(firestore, 'residents');
    }
    return null;
  }, [firestore, isAdmin]);
  
  const { data: residents, isLoading: isResidentsLoading } = useCollection<Resident>(residentsCol);
  
  const totalResidents = residents?.length ?? 0;
  const totalHouseholds = residents ? new Set(residents.map(r => r.houseNumber)).size : 0;
  const averageAge = totalResidents > 0 && residents
    ? Math.round(residents.reduce((acc, r) => acc + r.age, 0) / totalResidents)
    : 0;

  const isLoading = isAuthenticated && isResidentsLoading;

  return (
    <>
      <PageHeader
        title="Panel de Control"
        description={
            isAuthenticated 
            ? "Un resumen de las estadísticas de la comunidad Lago Mar." 
            : "Bienvenido. Inicia sesión para ver y gestionar los datos de la comunidad."
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <StatCardSkeleton /> : (
            <StatCard
            title="Total de Residentes"
            value={totalResidents}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="El número total de residentes registrados en la comunidad."
            />
        )}
        {isLoading ? <StatCardSkeleton /> : (
            <StatCard
            title="Total de Hogares"
            value={totalHouseholds}
            icon={<Home className="h-4 w-4 text-muted-foreground" />}
            description="El número total de hogares únicos en la comunidad."
            />
        )}
        {isLoading ? <StatCardSkeleton /> : (
            <StatCard
            title="Edad Promedio"
            value={isAuthenticated ? `${averageAge} años` : '0 años'}
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            description="La edad promedio de todos los residentes registrados."
            />
        )}
      </div>
    </>
  );
}

const StatCardSkeleton = () => (
    <Card className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
    </Card>
)