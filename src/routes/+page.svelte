<script>
import VilleSelect from "$lib/components/villeSelect.svelte";
import {goto} from "$app/navigation";
import FavoritesList from "$lib/components/favoritesList.svelte";

export let data;

function onVilleChange(selectedVile) {
    if (selectedVile) {
        goto(`/ville/${selectedVile.nom}`);
    }
}

</script>
<svelte:head>
    <title>EcoAlerts – Suivez l’indice environnemental local</title>
    <meta property="og:title" content="EcoAlerts – Suivez l’indice environnemental local" />
    <meta property="og:url" content="https://www.ecoalerts.fr" />
</svelte:head>

<div class="section">
    <div style="flex-grow: 0.5">
        <label for="select">Entrer le nom de votre ville pour commencer :</label>
        <VilleSelect handleChange={onVilleChange} />
        <FavoritesList user={data.user} />

        <div id="grid-2x2">
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
    <div class="hide-on-mobile" style="margin: auto">
        <img src="/img/preview_mobile_light.png" width="300" class="hide-dark" alt="apercu mobile" />
        <img src="/img/preview_mobile_dark.png" width="300" class="hide-light" alt="apercu mobile" />
    </div>
</div>
<div class="full-width theme-inverse">
    <div class="inner-container">
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
</div>