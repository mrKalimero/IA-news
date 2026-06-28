export const categories = [
  'Tous',
  'Modeles',
  'Startups',
  'Recherche',
  'Regulation',
  'Outils',
  'Open source',
]

export const articles = [
  {
    slug: 'agents-autonomes-production',
    title: 'Les agents autonomes passent du prototype aux operations',
    category: 'Modeles',
    source: 'IA-news Radar',
    date: '2026-06-28',
    readTime: '4 min',
    summary:
      "Les equipes produit stabilisent leurs premiers agents specialises avec supervision humaine, journaux d'audit et garde-fous metier.",
    body:
      "La tendance forte n'est plus seulement la demonstration spectaculaire, mais l'integration dans des processus controles. Les entreprises avancent avec des agents limites a un domaine precis, capables de consulter des outils internes, proposer des actions et demander validation avant execution.",
    tags: ['agents', 'workflow', 'enterprise'],
    impact: 'A surveiller pour les equipes support, ventes, operations et developpement logiciel.',
  },
  {
    slug: 'open-source-petits-modeles',
    title: 'Les petits modeles open source gagnent du terrain',
    category: 'Open source',
    source: 'Community Watch',
    date: '2026-06-27',
    readTime: '3 min',
    summary:
      'Des modeles compacts specialistes deviennent attractifs pour les usages locaux, embarques ou sensibles aux couts.',
    body:
      'Le compromis performance, cout et confidentialite pousse de nombreuses equipes a tester des modeles plus petits. Ils ne remplacent pas les systemes generalistes les plus puissants, mais excellent sur des taches ciblees lorsque les donnees et les prompts sont bien cadres.',
    tags: ['local-first', 'couts', 'privacy'],
    impact: 'Interessant pour les PME, les apps desktop et les produits avec donnees sensibles.',
  },
  {
    slug: 'regulation-transparence-contenus',
    title: 'La transparence des contenus generes devient un sujet central',
    category: 'Regulation',
    source: 'Policy Brief',
    date: '2026-06-26',
    readTime: '5 min',
    summary:
      'Les plateformes experimentent des labels, signatures et journaux de provenance pour mieux identifier les contenus synthetiques.',
    body:
      "La question n'est pas seulement de detecter les contenus generes par IA, mais de documenter leur provenance. Les standards techniques progressent, tandis que les plateformes cherchent un equilibre entre confiance, vie privee et experience utilisateur.",
    tags: ['provenance', 'synthetique', 'confiance'],
    impact: 'Important pour les medias, reseaux sociaux, editeurs et outils creatifs.',
  },
  {
    slug: 'outils-developpeurs-copilotes',
    title: 'Les copilotes de developpement deviennent plus contextuels',
    category: 'Outils',
    source: 'Developer Pulse',
    date: '2026-06-25',
    readTime: '4 min',
    summary:
      'Les assistants code exploitent davantage le contexte du depot, des tickets, des tests et des conventions locales.',
    body:
      "La prochaine marche de valeur vient de la comprehension de l'environnement complet: architecture, historique, CI, documentation et intentions produit. Les meilleurs outils reduisent les allers-retours plutot que de simplement completer du code.",
    tags: ['devtools', 'code', 'productivite'],
    impact: 'A fort potentiel pour accelerer maintenance, revue et onboarding.',
  },
  {
    slug: 'recherche-raisonnement-multimodal',
    title: 'Le raisonnement multimodal progresse dans les laboratoires',
    category: 'Recherche',
    source: 'Research Notes',
    date: '2026-06-24',
    readTime: '6 min',
    summary:
      'Les travaux recents combinent texte, image, audio et action pour resoudre des taches plus proches du monde reel.',
    body:
      'Les benchmarks evoluent vers des situations moins isolees: comprendre un schema, manipuler une interface, expliquer une erreur visuelle ou croiser plusieurs sources. Cette progression rend les modeles plus utiles, mais aussi plus difficiles a evaluer proprement.',
    tags: ['multimodal', 'evaluation', 'raisonnement'],
    impact: 'A suivre pour education, support technique, robotique logicielle et analyse documentaire.',
  },
  {
    slug: 'startups-ia-verticale',
    title: 'Les startups IA verticales cherchent leur avantage defensible',
    category: 'Startups',
    source: 'Market Signal',
    date: '2026-06-23',
    readTime: '4 min',
    summary:
      'Les nouveaux acteurs misent sur donnees metier, distribution et integration profonde plutot que sur le modele seul.',
    body:
      "La differenciation se deplace vers la qualite du produit, la proximite metier et l'acces a des donnees rares. Les startups qui gagnent combinent interface simple, automatisation mesuree et preuve de ROI rapide.",
    tags: ['vertical-ai', 'saas', 'marche'],
    impact: 'Signal fort pour les fondateurs, investisseurs et equipes innovation.',
  },
]

export const watchlist = [
  'Agents supervises en production',
  'Modeles locaux specialises',
  'Provenance des contenus IA',
  'Copilotes connectes aux depots',
]
