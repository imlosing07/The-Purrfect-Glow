// src/app/(landing-page)/perfil/page.tsx
import ProfilePage from './ProfilePage';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Mi Perfil',
    description: 'Gestiona tu perfil y datos de envío.',
};

export default async function Page() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return <ProfilePage user={session.user} />;
}
