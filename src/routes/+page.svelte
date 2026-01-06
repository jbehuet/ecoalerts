<script>
import VilleSelect from "$lib/components/villeSelect.svelte";
import {goto} from "$app/navigation";
import FavoritesList from "$lib/components/favoritesList.svelte";
import {onMount} from "svelte";
import ScoreGlobal from "$lib/components/scoreGlobal.svelte";
import AirInfo from "$lib/components/airInfo.svelte";
import TemperatureInfo from "$lib/components/temperatureInfo.svelte";

const { data } = $props();

function onVilleChange(selectedVille) {
    if (selectedVille) {
        goto(`/ville/${selectedVille.nom} (${selectedVille.code})`);
    }
}

const villesPrincipales = [
  { nom: "Paris", code: "75056", lat: 48.8566, lon: 2.2967, codePostal: "75000", data: null },
  { nom: "Marseille", code: "13055", lat: 43.2965, lon: 5.3698, codePostal: "13000", data: null },
  { nom: "Lyon", code: "69123", lat: 45.7640, lon: 4.8357, codePostal: "69000", data: null },
  { nom: "Toulouse", code: "31555", lat: 43.6047, lon: 1.4442, codePostal: "31000", data: null },
  { nom: "Nice", code: "06088", lat: 43.7035, lon: 7.2660, codePostal: "06000", data: null },
  { nom: "Nantes", code: "44109", lat: 47.2184, lon: -1.5536, codePostal: "44000", data: null },
  { nom: "Montpellier", code: "34172", lat: 43.6108, lon: 3.8772, codePostal: "34000", data: null },
  { nom: "Strasbourg", code: "67482", lat: 48.5846, lon: 7.7505, codePostal: "67000", data: null },
  { nom: "Bordeaux", code: "33063", lat: 44.8378, lon: -0.5792, codePostal: "33000", data: null },
  { nom: "Lille", code: "59350", lat: 50.6292, lon: 3.0573, codePostal: "59000", data: null },
  { nom: "Caen", code: "14118", lat: 49.1828, lon: -0.3697, codePostal: "14000", data: null },
];

const handleClick = (event, slug) => {
    event.preventDefault();
    goto(`/ville/${slug}`, { replaceState: false });
}

let loading = $state(true);

const fetchData = async () => {
    try {
        for (let i = 0; i < villesPrincipales.length; i++) {
            // Récupération des données d'env.
            const envRes = await fetch(`/api/environment?lat=${villesPrincipales[i].lat}&lon=${villesPrincipales[i].lon}&ville=${encodeURIComponent(villesPrincipales[i].nom)}&code=${villesPrincipales[i].code}`);
            const envData = await envRes.json();
            villesPrincipales[i].data = {...envData};
        }
    } catch (err) {
        console.log(err)
    } finally {
        loading = false;
    }
};

onMount(() => {
    fetchData();
});

</script>
<svelte:head>
    <title>EcoAlerts – Suivez l’indice environnemental local</title>
    <meta property="og:title" content="EcoAlerts – Suivez l’indice environnemental local" />
    <meta property="og:url" content="https://www.ecoalerts.fr" />
</svelte:head>

<div>
    <div style="margin-bottom: 1rem">
        <label for="select">Entrer le nom de votre ville pour commencer :</label>
        <VilleSelect handleChange={onVilleChange} />
        <FavoritesList user={data.user} />
    </div>
    <div>
        <table class="table {loading ? 'is-loading' : ''}">
            <thead>
            <tr>
                <th>Ville</th>
                <th>Score</th>
                <th>Temp.</th>
                <th>Air</th>
            </tr>
            </thead>
            <tbody>
            {#if loading}
                {#each Array(villesPrincipales.length) as _}
                    <tr>
                        <td style="width:35%"><div class="skeleton skeleton-text"></div></td>
                        <td><div class="skeleton skeleton-text"></div></td>
                        <td><div class="skeleton skeleton-text"></div></td>
                        <td><div class="skeleton skeleton-text"></div></td>
                    </tr>
                {/each}
            {:else }
                {#each villesPrincipales as ville}
                    <tr>
                        <td><a href="/ville/{ville.nom} ({ville.code})" onclick={(e) => handleClick(e, `${ville.nom} (${ville.code})`)}>{ville.nom}</a></td>
                        <td><ScoreGlobal aqi={ville.data.aqi?.code_qual} uv={ville.data.weather?.uv} pollen={ville.data.pollen?.code_qual} hasRestrictions={!!ville.data.eau}/></td>
                        <td><TemperatureInfo temperature={ville.data.weather.temperature} valueOnly/></td>
                        <td><AirInfo aqi={ville.data.aqi} valueOnly/></td>
                    </tr>
                {/each}
            {/if}
            </tbody>
        </table>
    </div>
    <div id="grid">
        <div class="cell">
            <div>
                <img src="/icons/score.png" alt="icone score"/>
                <h5>Indice du jour</h5>
                <em>Calcul pondéré selon les indicateurs journaliers</em>
            </div>
        </div>
        <div class="cell">
            <div>
                <img src="/icons/sources.png" alt="icone source"/>
                <h5>Multi sources</h5>
                <em>AtmoFrance, VigiEau, OpenWeather, ...</em>
            </div>
        </div>
        <div class="cell">
            <div>
                <img src="/icons/conseil.png" alt="icone conseil"/>
                <h5>Conseils personnalisés</h5>
                <em>Via le support d&#39;OpenAI</em>
            </div>
        </div>
        <div class="cell">
            <div>
                <img src="/icons/sans-compte.png" alt="icone sans compte"/>
                <h5>Sans compte</h5>
                <em>Aucun création de compte nécessaire</em>
            </div>
        </div>
    </div>
</div>
<div class="section full-width theme-inverse" id="about">
    <div class="inner-container" style="display:flex;">
        <div class="inner">
            <h4>Qu'est-ce qu'EcoAlerts ?</h4>
            <p>EcoAlerts est un outil simple et gratuit qui vous permet de consulter en un coup d'œil les conditions environnementales de votre ville :<br />
                qualité de l’air, indice UV, pollen, températures, restrictions d’eau et un conseil personnalisé.</p>
            <p><em>Pas besoin de compte, pas de pub — juste l’essentiel.</em></p>
            <h4>Comment ça fonctionne ?</h4>
            <p class="no-margin"><strong>1. Choisissez une ville</strong></p>
            <p>– via le moteur de recherche ou vos favoris.</p>
            <p class="no-margin"><strong>2. Consultez l'indice du jour</strong></p>
            <p>– un score global sur 5 vous indique les conditions actuelles.</p>
            <p class="no-margin"><strong>3. Explorez les indicateurs</strong></p>
            <p>– températures, qualité de l’air, UV, pollen, eau : tout est synthétisé et mis à jour régulièrement.</p>
            <p class="no-margin"><strong>4. Lisez le conseil du jour</strong></p>
            <p>– généré selon votre situation locale.</p>
            <p class="no-margin"><strong>5. Partagez ou ajoutez à vos favoris</strong></p>
            <p>– pour suivre facilement vos villes importantes.</p>
        </div>

        <div class="hide-on-mobile" style="margin: auto">
            <img src="/img/preview_mobile_light.png" width="300" class="hide-dark" alt="apercu mobile" />
            <img src="/img/preview_mobile_dark.png" width="300" class="hide-light" alt="apercu mobile" />
        </div>

    </div>
</div>