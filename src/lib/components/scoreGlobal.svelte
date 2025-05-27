<script>
    import {onMount} from "svelte";
    const NIVEAUX = [
        { desc: 'Très mauvais', col: '#C70039'},
        { desc: 'Mauvais', col: '#FF5733'},
        { desc: 'Moyen', col: '#FFC300'},
        { desc: 'Bon', col: '#F0E641'},
        { desc: 'Excellent', col: '#8bc700'},
    ];

    let props = $props();
    let ecoScore = $state();
    const invert = (score) => 100 - score;
    onMount(()=>{
        const parts = [];
        const weights = {
            aqi: 0.4,
            uv: 0.25,
            pollen: 0.25,
            eau: 0.1,
        };

        if (props.aqi) {
            const score = props.aqi > 6 ? 100 : (props.aqi - 1) * 20; // 0–100
            parts.push({ name: 'aqi', value: invert(score), weight: weights.aqi });
        }

        if (props.uv) {
            const score = Math.min(100, props.uv * 10); // max 11 → 110, clampé
            parts.push({ name: 'uv', value: invert(score), weight: weights.uv });
        }

        if (props.pollen) {
            const score = props.pollen > 6 ? 100 : (props.pollen - 1) * 20;
            parts.push({ name: 'pollen', value: score, weight: weights.pollen });
        }

        // Eau est facultative mais simple
        const eauScore = props.hasRestrictions ? 60 : 20;
        parts.push({ name: 'eau', value: invert(eauScore), weight: weights.eau });

        // Recalcul dynamique des poids
        const totalWeight = parts.reduce((acc, p) => acc + p.weight, 0);


        // Pondération du score
        const scoreFlottant = parts.reduce(
            (sum, p) => sum + (p.value * (p.weight / totalWeight)),
            0
        );

        const scoreSur5 = scoreFlottant / 20;
        ecoScore = {
            score:   Math.round(scoreSur5),
            niveau: NIVEAUX[Math.round(scoreSur5) - 1]
        };
    })
</script>
{#if ecoScore}
    <kbd style={`background-color:${ecoScore.niveau.col}`}>{ecoScore.score}<small>/5</small></kbd>
{/if}