<script>
    const { restrictions } = $props();
    const restrictionsNiveaux = {
        vigilance: {desc : 'Vigilance', col: "#F0E641"},
        alerte: {desc : 'Alerte', col: "#FFC300"},
        alerte_renforcee: {desc : 'Alerte renforcée', col: "#FF5733"},
        crise: {desc : 'Crise', col: "#C70039"},
    };
    const niveau = restrictions && restrictionsNiveaux[restrictions.niveauMax.toLowerCase()]
</script>

<p class="no-margin">🚱 Restrictions d'eau :
    {#if restrictions}
        <span class="pastille" style={`background-color: ${niveau.col}`}></span>
        <strong>{niveau.desc} </strong>
        {#if restrictions.liensArretes.length > 0}
            <em><small><a href={restrictions.liensArretes[0]} target="_blank" rel="noopener noreferrer">Arrêté préfectoral</a></small></em>
        {/if}
    {:else}
        <small><em>Aucune</em></small>
    {/if}
</p>