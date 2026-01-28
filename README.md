# 🏋️ DETER - Fitness Social Tracker

<div align="center">

![DETER Logo](https://img.shields.io/badge/DETER-Fitness%20Social-667eea?style=for-the-badge&logo=strava&logoColor=white)

**Comparez vos performances sportives avec vos amis.**  
Connectez Strava, ajoutez vos séances Basic Fit, et dépassez-vous ensemble.

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## ✨ Fonctionnalités

- 🔐 **Authentification** — Inscription/connexion sécurisée avec Supabase
- 🚴 **Intégration Strava** — Synchronisez automatiquement vos activités
- 🏋️ **Séances manuelles** — Ajoutez vos workouts Basic Fit
- 📅 **Calendrier social** — Visualisez les séances de vos amis
- 🏆 **Leaderboards** — Classements et statistiques comparatives
- 👥 **Système d'amis** — Ajoutez des amis et suivez leur progression
- 🎨 **Design Glass iOS** — Interface moderne avec effets glassmorphism

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) 18+
- Un compte [Supabase](https://supabase.com)
- Une application [Strava API](https://www.strava.com/settings/api)

### 1. Cloner le projet

```bash
git clone https://github.com/ton-username/deter.git
cd deter
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le contenu de `supabase/schema.sql`
3. Récupérer les clés dans **Settings > API**

### 3. Configurer Strava

1. Créer une application sur [strava.com/settings/api](https://www.strava.com/settings/api)
2. **Authorization Callback Domain** : `localhost` (dev) ou ton domaine (prod)
3. Noter le **Client ID** et **Client Secret**

### 4. Variables d'environnement

Copier `.env.example` vers `.env` et remplir :

```env
# Supabase
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Strava
STRAVA_CLIENT_ID=123456
STRAVA_CLIENT_SECRET=xxxxxxxx

# App URL
PUBLIC_APP_URL=http://localhost:5173
```

### 5. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Structure du projet

```
deter/
├── src/
│   ├── lib/
│   │   ├── components/     # Composants réutilisables (Glass*)
│   │   ├── stores/         # Stores Svelte
│   │   └── utils/          # Fonctions utilitaires
│   ├── routes/
│   │   ├── (app)/          # Routes protégées (dashboard, calendar...)
│   │   ├── auth/           # Authentification (login, register)
│   │   └── api/            # API routes (Strava OAuth, etc.)
│   └── app.css             # Styles globaux + thème glass
├── static/                 # Assets statiques
├── supabase/
│   └── schema.sql          # Script de création des tables
└── package.json
```

---

## 🎨 Design System

L'interface utilise un design **glassmorphism** inspiré d'iOS :

| Composant | Description |
|-----------|-------------|
| `GlassCard` | Carte avec effet verre dépoli |
| `GlassButton` | Bouton avec dégradé et hover glow |
| `GlassInput` | Champ de saisie avec backdrop blur |
| `GlassNav` | Navigation transparente |

### Couleurs principales

```css
--primary-start: #667eea  /* Violet */
--primary-end: #764ba2    /* Pourpre */
--accent-orange: #f97316
--accent-green: #22c55e
```

---

## 🚢 Déploiement

### Vercel (recommandé)

```bash
npm run build
vercel deploy
```

### Variables d'environnement sur Vercel

Ajouter dans **Settings > Environment Variables** :
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `PUBLIC_APP_URL` (ton URL Vercel)

---

## 📝 Roadmap

- [x] Authentification email/password
- [x] Design glassmorphism
- [x] Pages principales (Dashboard, Calendar, Friends, Leaderboard)
- [ ] Intégration Strava complète
- [ ] Sync automatique des activités
- [ ] Entrée manuelle Basic Fit
- [ ] Notifications push
- [ ] Mode sombre/clair

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

---

## 📄 Licence

MIT © 2026 DETER

---

<div align="center">

**Made with 💪 by fitness enthusiasts**

</div>

