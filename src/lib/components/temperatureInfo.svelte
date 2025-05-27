<script>
    const { temperature } = $props();
</script>


<p class="no-margin">🌡️ Températures :
    {#if temperature}
        <strong>{temperature.max}°</strong> <small>{temperature.min}°</small>
    {:else}
        <em>n.c</em>
    {/if}
</p>