<script>
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css'; // for React, Vue and Svelte

    import VilleSelect from "$lib/components/villeSelect.svelte";
    import FavoritesList from "$lib/components/favoritesList.svelte";
    import ScoreGlobal from "$lib/components/scoreGlobal.svelte";
    import FavoriteBtn from "$lib/components/favoriteBtn.svelte";
    import TemperatureInfo from "$lib/components/temperatureInfo.svelte";
    import UVInfo from "$lib/components/uvInfo.svelte";
    import AirInfo from "$lib/components/airInfo.svelte";
    import PollenInfo from "$lib/components/pollenInfo.svelte";
    import RestrictionsEau from "$lib/components/rescritionsEau.svelte";
    import Conseil from "$lib/components/conseil.svelte";
    import {goto} from "$app/navigation";

    const { data } = $props();

    let ville = $state();
    let loading = $state(false);
    let villeData = $state();
    let lastFetchedKey = $state();

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const partageUrl = `${baseUrl}/ville/${encodeURIComponent(data.nom)}`;

    function onVilleChange(selectedVile) {
        ville = selectedVile
        if (!ville) {
            goto('/');
            return;
        }

        const villeKey = `${ville.nom}_${ville.lat}_${ville.lon}`;
        if (loading || (lastFetchedKey && lastFetchedKey === villeKey)) return;

        const fetchData = async () => {
            loading = true;
            try {
                // Récupération des données d'env.
                const envRes = await fetch(`/api/environment?lat=${ville.lat}&lon=${ville.lon}&ville=${encodeURIComponent(ville.nom)}&code=${ville.code}`);
                const envData = await envRes.json();
                villeData = {...envData};

                // Récupération du conseil
                const conseilRes = await fetch('/api/conseil', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ville: ville.nom,
                        aqi: villeData.aqi,
                        pollen: villeData.pollen,
                        weather: villeData.weather,
                        eau: villeData.eau,
                        profile: ""
                    }),
                });
                const result = await conseilRes.json();
                villeData.conseil = result.conseil;

                // Récupération de l'image
                const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(ville.nom)}&prop=pageimages&format=json&pithumbsize=250&origin=*`);
                const data = await res.json();
                const pages = data.query.pages;
                const firstPage = Object.values(pages)[0];
                villeData.imageUrl = firstPage?.thumbnail?.source || null;

                // Marque cette ville comme déjà fetchée
                lastFetchedKey = villeKey;
            } catch (err) {
                console.log(err)
            } finally {
                loading = false;
            }
        };
        fetchData()
    }
</script>
<svelte:head>
    <title>{data.nom} – EcoAlerts</title>
    <meta property="og:title" content="EcoAlerts – Indice environnemental de {data.nom}" />
    <meta property="og:url" content="https://www.ecoalerts.fr/ville/{data.nom}" />
</svelte:head>


<section>
    <VilleSelect handleChange={onVilleChange} defaultValue={data.nom} />
    <FavoritesList user={data.user} />
</section>

{#if loading}
    <article aria-busy="true"></article>
{:else if ville && villeData}
    <section>
        <article>
            <div class="header">
                <ScoreGlobal aqi={villeData.aqi?.code_qual} uv={villeData.weather?.uv} pollen={villeData.pollen?.code_qual} hasRestrictions={!!villeData.eau}/>
                <h4 class="flex"><span class="hide-on-mobile" style="margin-right:5px">Conditions à</span>{ville.nom}</h4>
                <FavoriteBtn ville={ville} user={data.user}/>
            </div>
            <div style="display:flex; justify-content: space-between; align-items:center">
                <div>
                    <TemperatureInfo temperature={villeData.weather.temperature} />
                    <UVInfo uv={villeData.weather.uv} />
                    <AirInfo aqi={villeData.aqi} />
                    <PollenInfo pollen={villeData.pollen} />
                    <RestrictionsEau restrictions={villeData.restrictionsEau} />
                </div>
                {#if villeData.imageUrl}
                    <img class="hide-on-mobile" src={villeData.imageUrl} alt={`Vue de ${ville.nom}`} style="border-radius:0.25rem; width:250px; max-height:160px; object-fit:cover; object-position:center bottom;" />
                {/if}
            </div>
            <Conseil conseil={villeData.conseil} />
            <div class="footer">
                <small>
                    <button
                            class="link-style"
                            onclick={async () => {
                                const notyf = new Notyf();
                                try {
                                    await navigator.clipboard.writeText(partageUrl);
                                    notyf.success("Lien de la ville copié !");
                                } catch (err) {
                                    notyf.error('Erreur copie du lien : ' + err);
                                }
                            }}
                    >
                        📤 Partager
                    </button>
                </small>
                <small>
                    <em>mis à jour le {new Date(villeData.fetched_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</em>
                </small>
            </div>
        </article>
    </section>
{/if}