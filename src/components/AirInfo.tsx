export default function AirInfo({ aqi }: {aqi : { code_qual: number, couleur: string } }) {
    const aqiLevels = ["Bon", "Moyen", "Mauvais", "Médiocre", "Dangereux"];
    const aqiDescription = aqi !== null ? aqiLevels[aqi.code_qual - 1] : "Inconnu";

    return<p className="no-margin">🌬️ Qualité de l&#39;air :  {
        aqi !== null ? (
            <>
                <span className="pastille" style={{backgroundColor: aqi.couleur}}></span>
                <strong>{aqi.code_qual}</strong> <small>{aqiDescription}</small>
            </>
            ) : 'Chargement...'}
        <div/>
    </p>;
}