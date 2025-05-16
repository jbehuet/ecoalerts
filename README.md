# 🌿 EcoAlerts

**EcoAlerts** est une application web qui informe des conditions environnementales locales :  
qualité de l’air, indice UV, niveau de pollen, température, et plus encore.

> Un outil simple, sans création de compte, pour adapter ses habitudes à l’environnement du jour.

---

## ✨ Fonctionnalités

- Recherche de ville en France
- Affichage AQI (air), UV, pollen, température
- Conseil personnalisé du jour
- Données mises en cache
- Interface responsive et rapide (Next.js + PicoCSS)

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
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_service_key_supabase
OPENAI_API_KEY=votre_openai_key
NEXT_PUBLIC_ATMOFRANCE_USERNAME=votre_atmofrance_username
NEXT_PUBLIC_ATMOFRANCE_PWD=votre_atmofrance_password
```

### 4. Éxécuter

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Déploiement

Le projet peut être déployé sur [Netlify](https://www.netlify.com/): [ecoalerts.netlify.app](https://ecoalerts.netlify.app/)

---

## 📦 Stack technique

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [PicoCSS](https://picocss.com/)

## 🧩 API Externes
- [geo.api.gouv.fr](https://geo.api.gouv.fr)
- [Wikipedia](https://fr.wikipedia.org/)
- [AtmoFrance](https://www.atmo-france.org/)
- [Open-meteo](https://www.open-meteo.com/)
- [OpenAI API](https://platform.openai.com/)

---

## 📄 Licence

Projet libre et open source – MIT License.

---

## 🙌 Contribuer

Les contributions sont les bienvenues !  
Améliorez une fonctionnalité, proposez en des nouvelles, ou ouvrez une issue ✨