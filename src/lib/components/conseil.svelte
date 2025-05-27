<script>
    const { conseil } = $props()
</script>


<blockquote>
    {#if conseil}
        <cite>{conseil}</cite>
    {:else}
        <cite>Aucun conseil</cite>
    {/if}
</blockquote>
