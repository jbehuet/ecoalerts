export type Temperature = {
    max: number;
    min: string;
}

export default function TemperatureInfo({ temperature }: {temperature : Temperature }) {
    return <p className="no-margin">🌡️ Températures : <strong>{temperature.max}°</strong> <small>{temperature.min}°</small></p>
}