import React, { useEffect, useRef } from "react";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.css";

export type Ville = {
    nom:string,
    codesPostaux:string,
    code:number,
    centre : {
        coordinates: number[],
    },
    lat:number,
    lon:number,
};

type VilleSelecteurProps = {
    placeholder?: string;
    onChange?: (ville: Ville) => void;
};

const VilleSelecteur: React.FC<VilleSelecteurProps> = ({placeholder = "Choisissez une option", onChange}) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const tomSelectInstance = useRef<TomSelect | null>(null);

    useEffect(() => {
        if (!selectRef.current) return;

        const tom = new TomSelect(selectRef.current, {
            valueField: 'fullname',
            labelField: 'fullname',
            searchField: ['fullname', 'codePostal'],
            maxOptions: 5,
            create: false,
            placeholder: 'Recherchez une ville ou code postal',
            load: async (query:any, callback:any) => {
                if (!query.length) return callback();

                const isPostalCode = /^\d{4,5}$/.test(query);
                const url = isPostalCode
                    ? `https://geo.api.gouv.fr/communes?codePostal=${query}&fields=nom,codesPostaux,centre,code&limit=5`
                    : `https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,codesPostaux,centre,code&limit=5`;

                const res = await fetch(url);
                const data = await res.json();

                const results:Ville[] = data.map((v: Ville) => ({
                    fullname: `${v.nom} (${v.codesPostaux[0]})`,
                    nom: v.nom,
                    codePostal: v.codesPostaux[0],
                    code: v.code,
                    lat: v.centre.coordinates[1],
                    lon: v.centre.coordinates[0],
                }));

                callback(results);
            },
            onChange: (value: string) => {
                const ville = tom.options[value];
                if (ville) onChange?.((ville as Ville));
                // Nettoyer le champ et vider les options
                tom.clearOptions();
                tom.setTextboxValue('');
                tom.blur();
            },
        });


        return () => {
            tomSelectInstance.current?.destroy();
        };
    }, []);

    return (
        <select ref={selectRef} id="autocomplete-select">
            <option value="">{placeholder}</option>
        </select>
    );
};

export default VilleSelecteur;