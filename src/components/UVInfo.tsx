import {useMemo} from 'react';

export default function UVInfo({ uv }: { uv: number }) {
    const niveau:string = useMemo(() => {
        if (!uv || uv < 0) return ""
        if( uv <= 2) {
            return "Faible";
        } else if (uv <= 5){
            return "Modéré";
        } else if (uv <= 7) {
            return "Élevé";
        } else if (uv <= 10 ){
            return "Très élevé";
        }
        return "Extrême";
    }, [uv])


    return <p className="no-margin">☀️ Indice UV : {uv !== null ?  (<><strong>{uv}</strong> <small>{niveau}</small></>) : 'Chargement...'}</p>;
}
