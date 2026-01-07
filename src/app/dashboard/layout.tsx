import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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