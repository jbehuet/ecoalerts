# 🌿 EcoAlerts

**EcoAlerts** est une application web qui informe des conditions environnementales locales :  
qualité de l’air, indice UV, niveau de pollen, température, et plus encore.

> Un outil simple, sans création de compte, pour adapter ses habitudes à l’environnement du jour.

---

## ✨ Fonctionnalités

- Recherche de ville en France
- Affichage AQI (air), UV, pollen, température, restrictions d'eau
- Calcul d'un score global (EcoScore) pour une ville
- Conseil personnalisé du jour
- Données mises en cache
- Interface responsive et rapide (SvelteKit + PicoCSS)

---

## 🚀 Démarrage local

### 1. Clonez le dépôt

```bash
git clone https://github.com/jbehuet/ecoalerts.git
cd ecoalerts
```

### 2. Installez les dépendances

```bash
npm install
```

### 3. Créez le fichier `.env.local`

```env
SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_service_key_supabase
OPENAI_API_KEY=votre_openai_key
ATMOFRANCE_USERNAME=votre_atmofrance_username
ATMOFRANCE_PWD=votre_atmofrance_password
JWT_SECRET=secret
RESEND_API_KEY=votre_resend_key
```

### 4. Éxécuter

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Déploiement

Le projet peut être déployé sur [Netlify](https://www.netlify.com/): [ecoalerts.fr](https://www.ecoalerts.fr/)

---

## 📦 Stack technique

- [SvelteKit](https://svelte.dev/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [PicoCSS](https://picocss.com/)

## 🧩 API Externes
- [geo.api.gouv.fr](https://geo.api.gouv.fr)
- [Wikipedia](https://fr.wikipedia.org/)
- [AtmoFrance](https://www.atmo-france.org/)
- [Open-meteo](https://www.open-meteo.com/)
- [VigiEau](https://vigieau.gouv.fr/)
- [OpenAI API](https://platform.openai.com/)
- [Resend](https://resend.com)

---

## 📄 Licence

Projet libre et open source – MIT License.

---

## 🙌 Contribuer

Les contributions sont les bienvenues !  
Améliorez une fonctionnalité, proposez en des nouvelles, ou ouvrez une issue ✨