<script>
    import {onMount} from "svelte";
    import TomSelect from "tom-select";
    import "tom-select/dist/css/tom-select.css";

    let { placeholder = 'Choisissez une option', ville =  $bindable(), defaultValue } = $props();
    let tom = $state(null);

    const fetchCommunes =  async (value)=> {
        const isPostalCode = /^\d{4,5}$/.test(value);
        const url = isPostalCode
            ? `https://geo.api.gouv.fr/communes?codePostal=${value}&fields=nom,codesPostaux,centre,code&limit=5`
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
                    ville = selectedVille;
                    tom.blur();
                }
                // Nettoyer le champ et vider les options
                tom.clearOptions();
                tom.setTextboxValue('');
            },
        });

        if (defaultValue){
            fetchCommunes(defaultValue).then(data => {
                if (!data?.length) {
                    ville = null;
                    return;
                }
                const v = data[0];
                // Injecte l'option et la sélectionne
                tom.addOption(v);
                tom.setValue(`${v.nom} (${v.codePostal})`);
            });
        }

        return () => {
            if (tom) tom.destroy();
        };
    });

    $effect(() => {
        if (defaultValue && tom) {
            fetchCommunes(defaultValue).then(data => {
                if (!data?.length) {
                    ville = null;
                    return;
                }
                const v = data.find(d => d.nom.toLowerCase() == defaultValue.toLowerCase());
                if (!v) return;
                // Injecte l'option et la sélectionne
                tom.addOption(v);
                tom.setValue(`${v.nom} (${v.codePostal})`);
            });
        }
    });

</script>

<select id="autocomplete-select">
    <option value="">{placeholder}</option>
</select>