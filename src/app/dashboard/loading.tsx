import Image from 'next/image';

export default function Loading() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-pulse">
                <Image
                    src="/logoCarga.webp"
                    alt="Cargando..."
                    width={100}
                    height={100}
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
