<script>
    const { ville, user } = $props();
    let localFavorites = $state();
    let inFavorite = $state(false);

    $effect(()=> {
        if (ville) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
            for (const favorite of favorites) {
                if (favorite && favorite === `${ville.nom} (${ville.code})`) {
                    inFavorite = true;
                    break;
                }
            }
            localFavorites = favorites
        }
    })

    const addFavorite = async () => {
        let favorites= localFavorites
        if (inFavorite) {
            if (user){
                await fetch("/api/favorites", {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: user.email, ville: ville.nom, code: ville.code })
                })
            }
            favorites = favorites.filter(f => f != `${ville.nom} (${ville.code})`)
        } else {
            if (user){
                await fetch("/api/favorites", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: user.email, ville: ville.nom, code: ville.code })
                })
            }
            favorites.push(`${ville.nom} (${ville.code})`)
        }
        inFavorite = !inFavorite;
        localFavorites = favorites;
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('localStorageChange'));
    }
</script>

<span class={`icon ${inFavorite ? 'icon-star-filled' : 'icon-star-outline'}`} role="img" onclick={addFavorite}/>