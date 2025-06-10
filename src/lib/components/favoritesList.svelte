<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    const { user } = $props();
    let favorites = $state([]);
    let favorite = $state(null);
    $effect(() => {
        if (favorite) {
            goto(`/ville/${favorite}`,  { replaceState: false });
        }
    });

    onMount(()=> {
        const handleStorage = () => {
            const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            favorites = localFavorites;
        };

        if (user){
            fetch("/api/favorites").then( async res => {
                if (res.ok) {
                    const data = await res.json();
                    const fav = data.favorites.map(f => `${f.city} (${f.city_code})`);
                    localStorage.setItem("favorites", JSON.stringify(fav));
                    favorites = fav;
                }
            })
        } else {
            handleStorage();
        }

        window.addEventListener('localStorageChange', handleStorage);
        return () => {
            window.removeEventListener('localStorageChange', handleStorage);
        };
    })

    const handleClick = (event, slug) => {
        event.preventDefault();
        goto(`/ville/${slug}`, { replaceState: false });
    }
</script>

{#if favorites.length > 0}
    <ul class="favorites">
        <li class="item-center"><span class={`icon icon-star-filled`} role="img"></span></li>
        {#each favorites as f}
            <li><button onclick={() => favorite = f} class="link-style">{f.substr(0, f.indexOf("(") -1)}</button></li>
        {/each}
    </ul>
{:else}
    <div style={{paddingTop:"0.25rem"}}>Explorer <a href="/ville/Bordeaux" onclick={(e) => handleClick(e, 'Bordeaux (33063)')}>Bordeaux</a>, <a href="/ville/Paris" onclick={(e) => handleClick(e, 'Paris (75056)')}>Paris</a></div>
{/if}