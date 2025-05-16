import {useEffect, useRef, useState} from "react";
import VilleSelecteur, {Ville} from "@/components/VilleSelecteur";
import UVInfo from "@/components/UVInfo";
import VilleImage from "@/components/VilleImage";
import AirInfo from "@/components/AirInfo";
import Conseil from "@/components/Conseil";

function AlertesEnvironnement({ ville }: { ville: Ville }) {
    const [data, setData] = useState<any | null>(null);
    const [conseil, setConseil] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const lastFetchedKey = useRef<string | null>(null);

    useEffect(() => {
        if (!ville) return;

        const villeKey = `${ville.nom}_${ville.lat}_${ville.lon}`;
        if (lastFetchedKey.current === villeKey) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const envRes = await fetch(`/api/environment?lat=${ville.lat}&lon=${ville.lon}&ville=${encodeURIComponent(ville.nom)}&code=${ville.code}`);
                const data = await envRes.json();
                setData(data);

                const conseilRes = await fetch('/api/conseil', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ville: ville.nom, aqi: data.aqi.code_qual, uv : data.uv, pollen : data.pollen.code_qual, profile: "" }),
                });
                const result = await conseilRes.json();
                setConseil(result.conseil);

                // Marque cette ville comme déjà fetchée
                lastFetchedKey.current = villeKey;
            } catch (err) {
                console.error('Erreur récupération conseil :', err);
                setConseil("Pas de conseil disponible aujourd'hui.");
            } finally {
                setLoading(false);
            }
        };
        fetchData()
    }, [ville]);


    if (loading) return <article aria-busy="true"/>;
    if (!data || !conseil) return null;
    return (
        <>
            <article>
                <div style={{ display: "flex" }}>
                    <VilleImage nom={ville.nom} />
                    <div style={{ marginLeft: "1rem", flexGrow: 1 }}>
                        <h4 className="text-lg font-semibold">Conditions à {ville.nom}</h4>
                        <AirInfo aqi={data.aqi} />
                        <p className="no-margin">🌿 Pollen : <strong>{data.pollen.code_qual}</strong> <small className="capitalize">{data.pollen.resp.toLocaleLowerCase()}</small></p>
                        <UVInfo uv={data.uv} />
                    </div>
                </div>
                <Conseil conseil={conseil} />
            </article>

        </>
    );
}

export default function VillePage() {
    const [ville, setVille] = useState<Ville | null>(null);
    return (
        <>
            <section>
                <VilleSelecteur onChange={setVille} />
            </section>
            <section>
                {ville && <AlertesEnvironnement ville={ville} />}
            </section>
        </>
    );
}
