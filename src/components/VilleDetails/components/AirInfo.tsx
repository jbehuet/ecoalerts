export type AQI = {
    code_qual: number;
    couleur: string;
}

export default function AirInfo({ aqi }: {aqi : AQI }) {
    const aqiLevels = ["Bon", "Moyen", "Mauvais", "Médiocre", "Dangereux"];
    const aqiDescription = aqi  ? aqiLevels[aqi.code_qual - 1] : "Inconnu";

    return<p className="no-margin">🌬️ Qualité de l&#39;air :  {
        aqi ? (
            <>
                <span className="pastille" style={{backgroundColor: aqi.couleur}}></span>
                <strong>{aqi.code_qual}</strong> <small>{aqiDescription}</small>
            </>
        ) : <em>n.c</em>}
        <div/>
    </p>;
}