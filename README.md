# IA-news

IA-news est une application Vue 3 pour suivre l'actualite de l'intelligence artificielle: annonces produit, recherche, regulation, open source et outils.

## Fonctionnalites

- Grille d'articles responsive
- Recherche instantanee
- Filtres par categorie
- Page detaillee pour chaque article
- Appels API vers Hacker News Algolia, GitHub Search et arXiv
- Section tendances a surveiller
- Mode sombre persistant
- Deploiement GitHub Pages via GitHub Actions

## Sources de donnees

L'application interroge des sources publiques sans cle API:

- Hacker News Algolia API pour les discussions tech recentes autour de l'IA
- GitHub Search API pour les projets open source lies a l'intelligence artificielle
- arXiv API pour les publications recentes en IA et machine learning

Si une source est indisponible ou bloquee par le navigateur, l'application garde un fallback local pour rester consultable.

## Lancer le projet

```bash
npm install
npm run dev
```

## Deployer

Le workflow `.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages a chaque push sur `main`.

Dans les parametres du depot GitHub, active Pages avec la source `GitHub Actions`.
