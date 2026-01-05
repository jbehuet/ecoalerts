<script>
    import {onMount} from "svelte";
    import TomSelect from "tom-select";
    import "tom-select/dist/css/tom-select.css";

    let { placeholder = 'Choisissez une option', handleChange } = $props();
    let tom = $state(null);

    const fetchCommunes =  async (value)=> {
        const trimmed = value.trim();
        const padded = /^\d+$/.test(trimmed) ? trimmed.padEnd(5, '0') : trimmed;
        let url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(trimmed)}&fields=nom,codesPostaux,centre,code&limit=5`;

        if (/^\d{2}$/.test(trimmed)) {
            // département (ex: "75")
            url = `https://geo.api.gouv.fr/departements/${trimmed}/communes?fields=nom,codesPostaux,centre,code&limit=5`;
        } else if (/^\d{5}$/.test(padded)) {
            // code postal
            url = `https://geo.api.gouv.fr/communes?codePostal=${padded}&fields=nom,codesPostaux,centre,code&limit=5`;
        } else if (/^.+\s\(\d{5}\)$/.test(trimmed)) {
            // "Ville (code INSEE)" avec nom de ville plus souple
            const inseeCode = trimmed.match(/\((\d{5})\)/)?.[1];
            if (inseeCode) {
                url = `https://geo.api.gouv.fr/communes?code=${inseeCode}&fields=nom,codesPostaux,centre,code`;
            }
        }
        const res = await fetch(url);
        const data = await res.json();

        const results= data.map((v) => ({
            fullname: `${v.nom} (${v.codesPostaux[0]})`,
            nom: v.nom,
            codePostal: v.codesPostaux[0],
            code: v.code,
            lat: v.centre.coordinates[1],
            lon: v.centre.coordinates[0],
        }));

        return results;
    }

    onMount(() => {
        tom = new TomSelect('#autocomplete-select', {
            valueField: 'fullname',
            labelField: 'fullname',
            searchField: ['fullname', 'codePostal'],
            maxOptions: 5,
            create: false,
            placeholder: 'Recherchez une ville ou code postal',
            hideSelected: true,
            load: async (query, callback) => {
                if (!query.length) return callback();
                const results = await fetchCommunes(query)
                callback(results);
            },
            onChange: (value) => {
                const selectedVille = tom.options[value];
                if (selectedVille) {
                    handleChange(selectedVille);
                    tom.blur();
                }
                // Nettoyer le champ et vider les options
                tom.clearOptions();
                tom.setTextboxValue('');
            },
        });

        return () => {
            if (tom) tom.destroy();
        };
    });
</script>

<select id="autocomplete-select">
    <option value="">{placeholder}</option>
</select>