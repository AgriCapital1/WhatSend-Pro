# WhatSend Pro

**WhatsApp professionnel, simplement.**

Plateforme SaaS de gestion, automatisation et intégration de WhatsApp Business.

## Stack
- React + Vite
- Supabase Auth + PostgreSQL
- Vercel
- Meta WhatsApp Business Platform

## Développement
```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner dans `.env.local` :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Déploiement Vercel
Importer le dépôt dans Vercel, sélectionner le framework **Vite**, puis ajouter les deux variables d'environnement pour **Production, Preview et Development**.

Le fichier `vercel.json` gère le fallback SPA.

## WhatsApp réel
Le front-end ne contient aucun secret Meta. Pour la production WhatsApp, configurer côté serveur/Supabase Edge Functions :
- `META_ACCESS_TOKEN`
- `META_VERIFY_TOKEN`
- `META_GRAPH_API_VERSION`

Les sources sont dans `supabase/functions/`.

Le numéro WhatsApp Business, le Business Account et les autorisations Meta doivent également être configurés dans l'environnement Meta du propriétaire du service.

## État
Le dépôt contient la landing page, l'authentification Supabase, le dashboard, les modules Contacts/Automatisations/Modèles connectés à Supabase, la structure API/webhooks et la configuration Vercel.

