// dashboard/layout.tsx
import Breadcrumbs from '@/src/app/ui/breadcrumbs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-grow md:overflow-y-auto md:p-4">
        <Breadcrumbs />
        {children}
      </div>
    </div>
  );
}