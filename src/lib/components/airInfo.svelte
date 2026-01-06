<script>
    const { aqi, valueOnly } = $props();
    const aqiLevels = ["Bon", "Moyen", "Mauvais", "Médiocre", "Dangereux"];
    const description = aqi ? aqiLevels[aqi.code_qual - 1] : "Inconnu";
</script>

<p class="no-margin">{#if !valueOnly}🌬️ Qualité de l'air :{/if}
    {#if aqi}
            <span class="pastille" style={`background-color: ${aqi.couleur}`}></span>
            <strong>{aqi.code_qual}</strong> <small>{description}</small>
    {:else}
        <em>n.c</em>
    {/if}
</p>