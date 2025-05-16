import { useEffect, useState } from 'react';

export default function VilleImage({ nom, className }: { nom: string, className: string }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(nom)}&prop=pageimages&format=json&pithumbsize=250&origin=*`);
                const data = await res.json();
                const pages = data.query.pages;
                const firstPage = Object.values(pages)[0] as any;
                const image = firstPage?.thumbnail?.source || null;
                setImageUrl(image);
            } catch (err) {
                console.error('Erreur Wikipedia API', err);
            }
        };

        fetchImage();
    }, [nom]);

    if (!imageUrl) return null;

    return <img className={className} src={imageUrl} alt={`Vue de ${nom}`} style={{ borderRadius: '0.25rem', width: '250px', maxHeight: "160px", objectFit: "cover", objectPosition: "center bottom"}} />;
}