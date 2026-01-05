import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default async function LoginPage() {
  const session = await auth();
  
  // Si ya está autenticado, redirigir al home
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
          {/* Logo/Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Sneakers<span className="text-gray-400">Hooes</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Accede con tu cuenta
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
            >
              <FcGoogle className="text-2xl" />
              Continuar con Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500">
            Al continuar, aceptas nuestros{' '}
            <a href="/terms" className="underline hover:text-gray-700">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="underline hover:text-gray-700">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}