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
    import {navigating} from "$app/state";

    const { data } = $props();

    const onVilleChange = (selectedVille) => {
        if (!selectedVille) {
            goto('/');
            return;
        }
        goto(`/ville/${selectedVille.nom} (${selectedVille.code})`, { replaceState: true });
    };

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const partageUrl = `${baseUrl}/ville/${encodeURIComponent(data.ville.nom)}`;
</script>
<svelte:head>
    <title>{data.ville.nom} – EcoAlerts</title>
    <meta property="og:title" content="EcoAlerts – Indice environnemental de {data.ville.nom}" />
    <meta property="og:url" content="https://www.ecoalerts.fr/ville/{data.ville.nom} ({data.ville.code})" />
</svelte:head>


<section>
    <VilleSelect handleChange={onVilleChange} defaultValue={data.ville.nom} />
    <FavoritesList user={data.user} />
</section>

{#if navigating?.to}
    <section>
        <article class="skeleton">
            <!-- Header -->
            <div class="header">
                <div class="skeleton-score"></div>
                <div class="skeleton-title"></div>
                <div class="skeleton-fav"></div>
            </div>

            <!-- Infos + image -->
            <div class="content">
                <div class="left">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>

            <!-- Conseil -->
            <!-- <div class="skeleton-conseil"></div> -->

            <!-- Footer -->
            <div class="footer">
                <div class="skeleton-small"></div>
                <div class="skeleton-small"></div>
            </div>
        </article>
    </section>
{:else }
    {#if data.ville && data.villeData}
        <section>
            <article>
                <div class="header">
                    <ScoreGlobal aqi={data.villeData.aqi?.code_qual} uv={data.villeData.weather?.uv} pollen={data.villeData.pollen?.code_qual} hasRestrictions={!!data.villeData.eau}/>
                    <h4 class="flex"><span class="hide-on-mobile" style="margin-right:5px">Conditions à</span>{data.ville.nom}</h4>
                    <FavoriteBtn ville={data.ville} user={data.user}/>
                </div>
                <div style="display:flex; justify-content: space-between; align-items:center">
                    <div>
                        <TemperatureInfo temperature={data.villeData.weather.temperature} />
                        <UVInfo uv={data.villeData.weather.uv} />
                        <AirInfo aqi={data.villeData.aqi} />
                        <PollenInfo pollen={data.villeData.pollen} />
                        <RestrictionsEau restrictions={data.villeData.restrictionsEau} />
                    </div>
                    {#if data.villeData.imageUrl}
                        <img class="hide-on-mobile" src={data.villeData.imageUrl} alt={`Vue de ${data.ville.nom}`} style="border-radius:0.25rem; width:250px; max-height:160px; object-fit:cover; object-position:center bottom;" />
                    {/if}
                </div>
                <!-- <Conseil conseil={data.villeData.conseil} /> -->
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
                        <em>mis à jour le {new Date(data.villeData.fetched_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</em>
                    </small>
                </div>
            </article>
        </section>
    {/if}
{/if}