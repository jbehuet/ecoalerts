## Changelog – EcoAlerts

### v0.0.4 – soon
 
- Enregistrement email pour envoi mail quotidien
- Script envoi mail quotidien
- Script + cron Netlify pour nettoyer les sessions

### v0.0.3 – 4 juin 2025

- Synchronisation des favoris
- Utilisation de Resend pour envoi du lien magique

### v0.0.2 – 28 mai 2025

- Parallélisation des appels aux indicateurs
- Redirection si la ville n'existe pas
- Ajout logger
- Amélioration style mobile

### v0.0.1 – 22 mai 2025

🚀 Première version MVP fonctionnelle

Fonctionnalités principales :
- Sélecteur de ville (avec TomSelect + API GeoGouv)
- Affichage des indicateurs environnementaux :
    - Qualité de l'air (AtmoFrance)
    - Indice UV (open-meteo)
    - Température min/max (open-meteo)
    - Niveau de pollen (AtmoFrance)
    - Restrictions d'eau (VigiEau)
- Calcul d'un **score environnemental global (EcoScore)**
- **Conseil du jour** généré par GPT via OpenAI API, avec cache Supabase
- Image de la ville dynamique (API Wikipedia)
- Partage de la ville
- Système de **favoris stockés localement**
- Mode clair / sombre avec **PicoCSS** + toggle manuel
- Logo, favicon, typographie Outfit (Google Fonts)
- Version mobile responsive optimisée
- Footer avec numéro de version
