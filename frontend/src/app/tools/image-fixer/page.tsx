import { ImageFixer } from '@/features/image-fixer/components/image-fixer';

export default function ImageFixerPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
                        FormFit Tool
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight">
                        Image Form Fixer
                    </h1>

                    <p className="mt-4 max-w-2xl text-slate-400">
                        Resize, crop, compress, and convert your image so it matches online
                        application upload requirements.
                    </p>
                </div>

                <ImageFixer />
            </div>
        </main>
    );
}