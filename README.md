# IA-news

IA-news est une application Vue 3 pour suivre l'actualite de l'intelligence artificielle: annonces produit, recherche, regulation, open source et outils.

## Fonctionnalites

- Grille d'articles responsive
- Recherche instantanee
- Filtres par categorie
- Page detaillee pour chaque article
- Appels API vers Hacker News Algolia, GitHub Search et arXiv
- Ingestion planifiee via GitHub Actions vers `public/data/news.json`
- Section tendances a surveiller
- Mode sombre persistant
- Deploiement GitHub Pages via GitHub Actions

## Sources de donnees

L'application interroge des sources publiques sans cle API:

- Hacker News Algolia API pour les discussions tech recentes autour de l'IA
- GitHub Search API pour les projets open source lies a l'intelligence artificielle
- Hugging Face Hub API pour les modeles recents
- Semantic Scholar Graph API pour la recherche academique enrichie
- arXiv API pour les publications recentes en IA et machine learning
- GDELT DOC API pour les signaux media et regulation

Le workflow `Update news data` regenere `public/data/news.json` toutes les 6 heures. L'application lit ce fichier statique depuis GitHub Pages et garde un fallback local pour rester consultable.

## Mettre a jour les donnees localement

```bash
npm run update:news
```

## Lancer le projet

```bash
npm install
npm run dev
```

## Deployer

Le workflow `.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages a chaque push sur `main`.

Dans les parametres du depot GitHub, active Pages avec la source `GitHub Actions`.
