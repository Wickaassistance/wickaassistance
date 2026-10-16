# Wicka Assistance

Site vitrine et formulaires d’accompagnement pour les étudiants internationaux souhaitant étudier au Maroc.

Hono + TypeScript (JSX), compatible **Cloudflare Workers** et **Vercel** (une seule application, deux points d'entrée).

## Où modifier quoi

| Je veux modifier…                                   | Fichier                                   |
| --------------------------------------------------- | ----------------------------------------- |
| Menu, footer (liens), téléphone, e-mail, promo      | `src/config/site.ts`                      |
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
| Envoi des e-mails (Brevo)                           | `src/routes/send-email.ts`                |

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

Toutes les pages, y compris la 404, passent par le même gabarit `src/layout/Layout.tsx` : bandeau promo, header, footer, WhatsApp flottant, modals et bannière cookies sont écrits une seule fois.

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
