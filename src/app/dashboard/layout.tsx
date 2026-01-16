import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check
  const session = await auth();

  // Si no está autenticado, redirigir al login
  if (!session?.user) {
    redirect('/login');
  }

  // Si no es admin, redirigir al inicio
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-brand-cream">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile header spacing */}
          <div className="lg:hidden h-16" />

          {/* Content */}
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}