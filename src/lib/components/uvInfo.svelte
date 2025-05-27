<script>
    const { uv } = $props();
    const niveau = (() => {
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
    })();

</script>

<p class="no-margin">☀️ Indice UV :
    {#if uv}
        <strong>{uv}</strong> <small>{niveau}</small>
    {:else}
        <em>n.c</em>
    {/if}
</p>