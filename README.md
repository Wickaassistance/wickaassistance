# Wicka Assistance 

Site vitrine et formulaires d’accompagnement pour les étudiants internationaux souhaitant étudier au Maroc.

Hono + TypeScript (JSX), compatible **Cloudflare Workers** et **Vercel** (une seule application, deux points d'entrée).

## Où modifier quoi

| Je veux modifier…                                   | Fichier                                   |
| --------------------------------------------------- | ----------------------------------------- |
| Menu, footer (liens), téléphone, e-mail             | `src/config/site.ts`                      |
| **Règle de la promo −50% (dates, compte à rebours)** | `src/config/site.ts` → `getPromo()`       |
| Structure du header (bandeau, menu, menu mobile)    | `src/layout/Header.tsx`                   |
| Structure du footer                                 | `src/layout/Footer.tsx`                   |
| WhatsApp flottant, barre CTA mobile, modals         | `src/layout/FloatingActions.tsx`          |
| Bannière cookies                                    | `src/layout/CookieBanner.tsx`             |
| `<head>` SEO (canonical, Open Graph, polices, CSS)  | `src/layout/Head.tsx`                     |
| Gabarit unique de toutes les pages (header + footer) | `src/layout/Layout.tsx`                   |
| Données structurées JSON-LD                         | `src/seo/jsonld.ts`                       |
| `sitemap.xml`                                       | `src/seo/sitemap.ts`                      |
| `robots.txt`                                        | `src/seo/robots.ts`                       |
| `llms.txt`                                          | `src/seo/llms.ts`                         |
| Le texte d'une page                                 | `src/pages/NomDeLaPage.tsx`               |
| Ajouter une page (+ priorité sitemap)               | `src/pages/index.tsx` (registre)          |
| Page 404                                            | `src/pages/NotFound.tsx`                  |
| Responsive                                          | `public/css/responsive.css`               |
| Tarifs, universités, FAQ, avis                      | `public/js/data.js`                       |
| Compte à rebours (JS client)                        | `public/js/main.js`                       |
| Envoi des e-mails (Brevo)                           | `src/routes/send-email.ts`                |

## Promo −50% et compte à rebours (règle annuelle automatique)

**Fuseau : GMT+0 (UTC).** Aucune modification manuelle n'est nécessaire d'une année à l'autre.

| Période (UTC)                        | État de la promo                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| 1er août 00:00:00 → 15 nov. 23:59:59 | **Active** : compte à rebours, bandeau header, boutons/offres de réduction, prix promo |
| 16 novembre → 31 juillet             | **Masquée** : rien de promotionnel n'est rendu, les prix pleins s'affichent       |

Le 1er août suivant, tout réapparaît automatiquement, avec une échéance au 15 novembre de l'année en cours.

### Fonctionnement

- **Source unique de vérité** : `getPromo()` dans `src/config/site.ts`. Elle renvoie `{ active, deadline, rentree, text }`.
  - `active` : `true` uniquement du 1er août au 15 novembre.
  - `deadline` : 15 novembre de l'année en cours (ISO 8601, UTC).
  - `rentree` : rentrée visée (ex. `2026-2027`), qui passe à l'année suivante après le 15 novembre.
  - `text` : texte du bandeau promo du header.
- **Côté serveur** : les pages appellent `getPromo()` à chaque requête et ne rendent pas les éléments promo quand `active` vaut `false`.
- **Côté client** (`public/js/main.js`) : le script lit `data-promo-deadline`, décompte chaque seconde et, à l'échéance, retire tous les éléments `.promo-only` (utile si la page reste ouverte au moment du 15 novembre).

### Éléments concernés

- Compte à rebours (`#promoCountdown`, page d'accueil)
- Bandeau promo du header
- Bouton / libellé « Postuler (Promo −50%) » (barre CTA mobile)
- Textes « promo −50% » (cartes Explorez, FAQ) et prix promo de `/tarifs`

### Règles pour les développeurs

1. Tout nouvel élément lié à la promo doit être conditionné par `getPromo().active`.
2. Il doit porter la classe CSS `promo-only`.
3. Ne jamais écrire de date de fin en dur : la modifier uniquement dans `getPromo()`.
4. Si la page est mise en cache (Cloudflare, CDN), prévoir un cache court ou une purge le 16 novembre et le 1er août.
5. Le Maroc est en GMT+1 la majeure partie de l'année : la fin « 23:59:59 UTC » correspond à 00:59:59 le 16 novembre à Casablanca. Pour finir à minuit locale, utiliser `22, 59, 59` dans `end` (fonction `getPromo`).

## Pages

| Route                         | Fichier                                  |
| ----------------------------- | ---------------------------------------- |
| `/`                           | `src/pages/Home.tsx`                     |
| `/candidature`                | `src/pages/Candidature.tsx`              |
| `/universites`                | `src/pages/Universites.tsx`              |
| `/tarifs`                     | `src/pages/Tarifs.tsx`                   |
| `/contact`                    | `src/pages/Contact.tsx`                  |
| `/mentions-legales`           | `src/pages/MentionsLegales.tsx`          |
| `/politique-confidentialite`  | `src/pages/PolitiqueConfidentialite.tsx` |
| `/cgv`                        | `src/pages/Cgv.tsx`                      |
| `/merci` (noindex)            | `src/pages/Merci.tsx`                    |
| toute autre URL (404)         | `src/pages/NotFound.tsx`                 |

Toutes les pages, y compris la 404, passent par le même gabarit `src/layout/Layout.tsx` : bandeau promo (affiché selon `getPromo()`), header, footer, WhatsApp flottant, modals et bannière cookies sont écrits une seule fois.

Autres routes : `/sitemap.xml`, `/robots.txt`, `/llms.txt` (générées à partir de `PUBLIC_SITE_URL`) et `POST /api/send-email`.
Les anciennes URLs `/xxx.html` sont redirigées (301) vers `/xxx`.

## Développement

```bash
npm install
cp .dev.vars.example .dev.vars   # Cloudflare — puis renseigner les valeurs
cp .env.example .env.local       # Vercel — puis renseigner les valeurs
npm run dev          # Cloudflare (wrangler dev)
npm run dev:vercel   # Vercel (vercel dev)
npm run typecheck
```

## Variables et secrets

| Variable              | Type              | Usage                                                              |
| --------------------- | ----------------- | ------------------------------------------------------------------ |
| `BREVO_API_KEY`       | Secret            | Authentification API Brevo                                         |
| `BREVO_FROM_EMAIL`    | Variable          | Adresse expéditrice vérifiée dans Brevo                            |
| `BREVO_FROM_NAME`     | Variable          | Nom affiché par l’expéditeur                                       |
| `BREVO_COMPANY_EMAIL` | Variable          | Adresse de réception de l’entreprise (`wickaassistance@gmail.com`) |
| `PUBLIC_SITE_URL`     | Variable publique | Domaine canonique public, sans slash final (vide = domaine d'accès) |
| `BREVO_LOGO_URL`      | Variable publique | URL absolue du logo dans les e-mails (défaut : `<site>/assets/images/logo.png`) |

La clé API Brevo doit rester un secret. Ne jamais committer `.dev.vars` ni `.env.local`.

## Déploiement

- **Cloudflare Workers** : `npm run deploy`, puis `npx wrangler secret put BREVO_API_KEY` (et ajouter les autres variables dans **Settings → Variables and Secrets**). `keep_vars = true` évite que le déploiement n'efface les variables saisies dans le tableau de bord.
- **Vercel** : importer le dépôt et ajouter les variables d'environnement ci-dessus. `vercel.json` redirige toutes les routes vers `api/index.ts` (Node.js) ; les fichiers de `public/` sont servis en statique. Le runtime Node.js est utilisé côté Vercel pour accepter les sous-modules Hono JSX ; Cloudflare reste déployé nativement en Worker.

## Logo officiel

Fichier : `public/assets/images/logo.png` — route publique unique : `/assets/images/logo.png` (header, footer, favicon, Apple Touch Icon, JSON-LD, e-mails Brevo). L'image Open Graph est `public/assets/images/og-share.jpg`.

## Images à fournir (non incluses dans le dépôt)

`public/assets/images/` : `logo.png`, `og-share.jpg`, `hero-students.jpg`, `about-team.jpg`, `student-senegal.jpg`, `student-ivory-coast.jpg`, `student-cameroon.jpg`, `student-gabon.jpg`.

`public/assets/uni/` : `student-grad.jpg`, `student-grad-2.jpg`, `student-portrait.jpg`, et les photos de villes `casablanca.jpg`, `rabat.jpg`, `fes.jpg`, `marrakech.jpg`, `tanger.jpg`, `ifrane.jpg` (+ `campus1.jpg` en repli).

## Vérifications après déploiement

```bash
curl -I https://votre-domaine.com/assets/images/logo.png
curl -I https://votre-domaine.com/
curl https://votre-domaine.com/robots.txt
```

Vérifier chaque route (`/`, `/candidature`, `/universites`, `/tarifs`, `/contact`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/merci`) et une URL inexistante (page 404), puis tester un formulaire réel (contact, rappel, candidature) une fois les variables Brevo renseignées.

Test de la règle promo : dans `getPromo(now)`, passer une date factice (ex. `getPromo(new Date("2026-11-16T00:00:00Z"))`) pour vérifier que compte à rebours, bandeau et boutons disparaissent, puis `2026-08-01T00:00:00Z` pour vérifier leur retour.
