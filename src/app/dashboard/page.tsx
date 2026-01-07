import { redirect } from 'next/navigation';

export default function DashboardPage() {
    // Redirect to inventario by default
    redirect('/dashboard/inventario');
}
