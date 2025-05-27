<script>
    const { ville } = $props();
    let localFavorites = $state();
    let inFavorite = $state(false);

    $effect(()=> {
        if (ville) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
            for (const favorite of favorites) {
                if (favorite && favorite === ville.nom) {
                    inFavorite = true;
                    break;
                }
            }
            localFavorites = favorites
        }
    })

    const addFavorite = () => {
        let favorites= localFavorites
        if (inFavorite) {
            favorites = favorites.filter(f => f != ville.nom)
        } else {
            favorites.push(ville.nom)
        }
        inFavorite = !inFavorite;
        localFavorites = favorites;
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('localStorageChange'));
    }
</script>

<span class={`icon ${inFavorite ? 'icon-star-filled' : 'icon-star-outline'}`} role="img" onclick={addFavorite}/>