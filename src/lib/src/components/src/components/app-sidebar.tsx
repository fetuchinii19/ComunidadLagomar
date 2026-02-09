'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Settings, Lock, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from './icons';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { PasswordDialog } from './password-dialog';

const navItems = [
  { href: '/', label: 'Panel de Control', icon: Home, protected: false },
  { href: '/residents', label: 'Residentes', icon: Users, protected: true },
];

const settingsItem = { href: '/settings', label: 'Configuración', icon: Settings, protected: true };


export function AppSidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <AppSidebarNav />
      </div>
    </div>
  );
}

export function AppSidebarNav({ isMobile = false }) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, isProtected: boolean) => {
    if (isProtected && !isAdmin) {
      e.preventDefault();
      toast({
        title: 'Acceso denegado',
        description: 'Necesitas iniciar sesión como administrador para acceder a esta pestaña.',
        variant: 'destructive',
      });
    }
  };

  const NavLinkWrapper = ({ href, isProtected, children }: { href: string; isProtected: boolean; children: React.ReactNode }) => {
    return (
        <Link href={href} onClick={(e) => handleLinkClick(e, isProtected)}>
            {children}
        </Link>
    )
  };
  
  const NavLink = NavLinkWrapper;

  return (
    <>
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="">Lago Mar</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map(({ href, label, icon: Icon, protected: isProtected }) => (
            <NavLink
              key={href}
              href={href}
              isProtected={isProtected}
            >
              <span className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname === href }
              )}>
                <Icon className="h-4 w-4" />
                {label}
                {isProtected && !isAdmin && <Lock className="h-4 w-4 ml-auto" />}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {!isAuthenticated && (
                <Button onClick={() => setIsPasswordDialogOpen(true)} variant="ghost" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary justify-start">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                </Button>
            )}
          <NavLink
            href={settingsItem.href}
            isProtected={settingsItem.protected}
          >
            <span className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname === settingsItem.href }
            )}>
                <settingsItem.icon className="h-4 w-4" />
                {settingsItem.label}
                {settingsItem.protected && !isAdmin && <Lock className="h-4 w-4 ml-auto" />}
            </span>
          </NavLink>
        </nav>
      </div>
      <PasswordDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} />
    </>
  );
}