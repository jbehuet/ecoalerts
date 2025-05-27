<script>
    const { pollen } = $props();
    const pollenLevels = ["Indisponible", "Très faible", "Faible", "Modéré", "Élevé", "Très élevé", "Extrêmement élevé"];
    const description = pollen !== null ? pollenLevels[pollen.code_qual] : pollenLevels[0];
</script>

<p class="no-margin">🌿 Pollen :
    {#if pollen}
        <strong>{pollen.code_qual}</strong> <small class="capitalize">{description} ({pollen.resp.toLocaleLowerCase()})</small>
    {:else}
        <em>n.c</em>
    {/if}
</p>