import Image from 'next/image';

export default function Loading() {
    return (
        <div className="min-h-screen bg-brand-cream/50 flex flex-col items-center justify-center">
            <div className="animate-pulse">
                <Image
                    src="/logoCarga.webp"
                    alt="Cargando..."
                    width={120}
                    height={120}
                    className="drop-shadow-lg"
                    priority
                />
            </div>
            <p className="font-nunito text-brand-brown/60 text-sm mt-4 animate-pulse">
                Cargando...
            </p>
        </div>
    );
}
