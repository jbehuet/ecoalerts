import {useState} from "react";
import VilleSelecteur, {Ville} from "@/components/VilleSelecteur";
import VilleDetails from "@/components/VilleDetails/VilleDetails";

export default function VillePage() {
    const [ville, setVille] = useState<Ville | null>(null);
    return (
        <>
            <section>
                <VilleSelecteur onChange={setVille} />
            </section>
            <section>
                {ville && <VilleDetails ville={ville} />}
            </section>
        </>
    );
}
