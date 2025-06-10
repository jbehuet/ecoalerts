<script>
    import {onMount} from "svelte";
    import TomSelect from "tom-select";
    import "tom-select/dist/css/tom-select.css";

    let { placeholder = 'Choisissez une option', handleChange, defaultValue } = $props();
    let tom = $state(null);

    const fetchCommunes =  async (value)=> {
        const hasCode = /\d+/.test(value)
        const url = hasCode
            ? `https://geo.api.gouv.fr/communes?code=${value.match(/\d+/)[0]}&fields=nom,codesPostaux,centre,code&limit=5`
            : `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,codesPostaux,centre,code&limit=5`;

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

    $effect(() => {
        if (defaultValue && tom) {
            fetchCommunes(defaultValue).then(data => {
                if (!data?.length) {
                    handleChange();
                    return;
                }
                // Injecte l'option et la sélectionne
                tom.addOption(data[0]);
                tom.setValue(`${data[0].nom} (${data[0].codePostal})`);
            });
        }
    });

</script>

<select id="autocomplete-select">
    <option value="">{placeholder}</option>
</select>