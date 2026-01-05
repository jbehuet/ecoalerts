export async function load({params, fetch}){
    const ville = params.nom;
    let url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(ville)}&fields=nom,codesPostaux,centre,code&limit=1`
    if (/^.+\s\(\d{5}\)$/.test(ville)) {
        // "Ville (code INSEE)" avec nom de ville plus souple
        const inseeCode = ville.match(/\((\d{5})\)/)?.[1];
        if (inseeCode) {
            url = `https://geo.api.gouv.fr/communes?code=${inseeCode}&fields=nom,codesPostaux,centre,code`;
        }
    }

    // 1. Récupérer les données de la ville depuis l'API
    const res = await fetch(url);
    const data = await res.json();

    const city = data[0];

    if (!city) {
        return {
            status: 404,
            error: new Error('Ville non trouvée'),
        };
    }

    // 2. Récupérer les données environnementales
    const envRes = await fetch(`/api/environment?lat=${city.centre.coordinates[1]}&lon=${city.centre.coordinates[0]}&ville=${encodeURIComponent(city.nom)}&code=${city.code}`);
    const envData = await envRes.json();

    // 3. Récupérer le conseil
    const conseilRes = await fetch('/api/conseil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ville: city.nom,
            code: city.code,
            aqi: envData.aqi,
            pollen: envData.pollen,
            weather: envData.weather,
            eau: envData.eau,
            profile: ""
        }),
    });
    const conseilData = await conseilRes.json();

    // 4. Récupérer l'image depuis Wikipedia
    const wikiRes = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city.nom)}&prop=pageimages&format=json&pithumbsize=250&origin=*`);
    const wikiData = await wikiRes.json();
    const pages = wikiData.query.pages;
    const firstPage = Object.values(pages)[0];
    const imageUrl = firstPage?.thumbnail?.source || null;

    return {
        ville: city,
        villeData: {
            ...envData,
            conseil: conseilData.conseil,
            imageUrl
        },
    };
}