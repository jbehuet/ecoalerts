<script>
    const { temperature, valueOnly } = $props();
</script>


<p class="no-margin">{#if !valueOnly}🌡️ Températures :{/if}
    {#if temperature}
        <strong>{temperature.max}°</strong> <small>{temperature.min}°</small>
    {:else}
        <em>n.c</em>
    {/if}
</p>