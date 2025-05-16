export type Pollen = {
    resp: string;
    code_qual : number;
}

export default function PollenInfo({ pollen }: { pollen: Pollen }) {
    const pollenLevels = ["Indisponible", "Très faible", "Faible", "Modéré", "Élevé", "Très élevé", "Extrêmement élevé"];
    const pollenDescription = pollen !== null ? pollenLevels[pollen.code_qual] : pollenLevels[0];

    return <p className="no-margin">🌿 Pollen : <strong>{pollen.code_qual}</strong> <small className="capitalize">{pollenDescription} ({pollen.resp.toLocaleLowerCase()})</small></p>;
}
