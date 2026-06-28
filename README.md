# IA-news

IA-news est une application Vue 3 pour suivre l'actualite de l'intelligence artificielle: annonces produit, recherche, regulation, open source et outils.

## Fonctionnalites

- Grille d'articles responsive
- Recherche instantanee
- Filtres par categorie
- Page detaillee pour chaque article
- Section tendances a surveiller
- Mode sombre persistant
- Deploiement GitHub Pages via GitHub Actions

## Lancer le projet

```bash
npm install
npm run dev
```

## Deployer

Le workflow `.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages a chaque push sur `main`.

Dans les parametres du depot GitHub, active Pages avec la source `GitHub Actions`.
