import {Ville} from "@/components/VilleSelecteur";
import {useEffect, useRef, useState} from "react";
import VilleImage from "@/components/VilleDetails/components/VilleImage";
import AirInfo from "@/components/VilleDetails/components/AirInfo";
import PollenInfo from "@/components/VilleDetails/components/PollenInfo";
import UVInfo from "@/components/VilleDetails/components/UVInfo";
import Conseil from "@/components/VilleDetails/components/Conseil";
import TemperatureInfo from "@/components/VilleDetails/components/TemperatureInfo";
import {logError} from "@/lib/logger";

export default function VilleDetails({ ville }: { ville: Ville }) {
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
                    body: JSON.stringify({
                        ville: ville.nom,
                        aqi: data.aqi,
                        pollen : data.pollen,
                        weather : data.weather,
                        profile: ""
                    }),
                });
                const result = await conseilRes.json();
                setConseil(result.conseil);

                // Marque cette ville comme déjà fetchée
                lastFetchedKey.current = villeKey;
            } catch (err) {
                await logError("Erreur API conseil", err);
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h4 className="text-lg font-semibold">Conditions à {ville.nom}</h4>
                        <TemperatureInfo temperature={data.weather.temperature} />
                        <UVInfo uv={data.weather.uv} />
                        <AirInfo aqi={data.aqi} />
                        <PollenInfo pollen={data.pollen} />
                    </div>
                    <VilleImage nom={ville.nom} className="hide-on-mobile"/>
                </div>
                <Conseil conseil={conseil} />
            </article>
        </>
    );
}