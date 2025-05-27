<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let favorites = $state([]);
    let favorite = $state(null);
    $effect(() => {
        if (favorite) {
            goto(`/ville/${favorite}`);
        }
    });

    onMount(()=> {
        const handleStorage = () => {
            const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            favorites = localFavorites;
        };

        handleStorage()
        window.addEventListener('localStorageChange', handleStorage);
        return () => {
            window.removeEventListener('localStorageChange', handleStorage);
        };
    })
</script>

{#if favorites.length > 0}
    <ul class="favorites">
        <li class="item-center"><span class={`icon icon-star-filled`} role="img"></span></li>
        {#each favorites as f}
            <li><button onclick={() => favorite = f} class="link-style">{f}</button></li>
        {/each}
    </ul>
{:else}
    <div style={{paddingTop:"0.25rem"}}>Explorer <a href="/ville/Bordeaux">Bordeaux</a>, <a href="/ville/Paris">Paris</a></div>
{/if}