import type { Context } from "hono";
import { getEnv, parseSiteUrls, siteOrigin, type Env } from "../lib/env";

/**
 * API POST /api/send-email  (contact, rappel, candidature) — envoi via Brevo (API REST, fetch).
 * Port fidèle de l'ancien server/send-email.js (Cloudflare) et api/send-email.js (Vercel) :
 * compatible Cloudflare Workers ET Vercel (Edge).
 *
 * Variables : BREVO_API_KEY (secret), BREVO_FROM_EMAIL, BREVO_FROM_NAME, BREVO_COMPANY_EMAIL,
 *             PUBLIC_SITE_URL (1 à 3 adresses séparées par des virgules), BREVO_LOGO_URL.
 *
 * Envois :
 *  - contact et candidature : 1 e-mail à l'entreprise (reply-to = visiteur) + 1 e-mail de confirmation au visiteur ;
 *  - callback : 1 e-mail à l'entreprise.
 */

type Body = Record<string, unknown>;

type Cfg = {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  companyEmail: string;
  logoUrl: string;
};

type Mail = { to: string; subject: string; html: string; replyTo?: string };

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BRAND = {
  rose: "#9f1239",
  roseDark: "#881337",
  gold: "#f59e0b",
  ink: "#1f2937",
  muted: "#64748b",
  light: "#fff1f2",
  cream: "#fff7ed",
  border: "#ffe4e6"
};

function text(value: unknown, max = 4000): string {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}
function validEmail(value: unknown): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text(value, 160));
}
function validPhone(value: unknown): boolean {
  const raw = text(value, 40);
  const digits = raw.replace(/\D/g, "");
  return /^[+\d\s().-]+$/.test(raw) && digits.length >= 8 && digits.length <= 15;
}
function escapeHtml(value: unknown): string {
  return text(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] as string);
}
function requiredText(value: unknown, label: string, max = 4000): string {
  const result = text(value, max);
  if (!result) throw new Error(`${label} est obligatoire.`);
  return result;
}
/**
 * `origin` = adresse du site réellement visitée (siteOrigin(c)) : .com ou workers.dev, donc toujours une URL qui fonctionne.
 * PUBLIC_SITE_URL peut contenir plusieurs adresses : on ne l'utilise jamais telle quelle pour fabriquer un lien.
 */
function config(env: Env, origin: string): Cfg {
  const required = ["BREVO_API_KEY", "BREVO_FROM_EMAIL", "BREVO_COMPANY_EMAIL"] as const;
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Configuration Brevo manquante: ${missing.join(", ")}`);
  if (!validEmail(env.BREVO_FROM_EMAIL) || !validEmail(env.BREVO_COMPANY_EMAIL)) {
    throw new Error("Configuration Brevo invalide: vérifiez les adresses e-mail.");
  }
  const base = text(origin, 300).replace(/\/+$/, "");
  const configuredLogo = text(env.BREVO_LOGO_URL, 500);
  const siteUrls = parseSiteUrls(env.PUBLIC_SITE_URL);
  // Logo hébergé ailleurs que sur le site (CDN...) : utilisé tel quel.
  // Logo hébergé sur l'un des domaines du site : reconstruit sur l'adresse qui fonctionne.
  const logoIsExternal = configuredLogo !== "" && !siteUrls.some((u) => configuredLogo.startsWith(u));
  return {
    apiKey: env.BREVO_API_KEY as string,
    fromEmail: text(env.BREVO_FROM_EMAIL, 160),
    fromName: text(env.BREVO_FROM_NAME, 80) || "Wicka Assistance",
    companyEmail: text(env.BREVO_COMPANY_EMAIL, 160),
    logoUrl: logoIsExternal ? configuredLogo : base ? `${base}/assets/images/logo.png` : configuredLogo
  };
}
function emailLayout(title: string, content: string, cfg: Cfg): string {
  const logo = cfg.logoUrl
    ? `<img src="${escapeHtml(cfg.logoUrl)}" alt="Wicka Assistance" style="display:block;width:120px;height:98px;max-width:100%;margin:0 auto 22px;object-fit:contain;">`
    : `<div style="font-size:24px;font-weight:800;letter-spacing:.08em;color:${BRAND.rose};margin-bottom:22px;">WICKA<span style="color:${BRAND.gold};">.</span></div>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:${BRAND.light};font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};"><div style="padding:28px 12px;"><div style="max-width:650px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(136,19,55,.10);"><div style="height:6px;background:linear-gradient(90deg,${BRAND.rose},${BRAND.gold});"></div><div style="padding:34px 30px 28px;text-align:center;">${logo}<h1 style="margin:0;color:${BRAND.roseDark};font-size:23px;line-height:1.3;">${escapeHtml(title)}</h1></div><div style="padding:0 30px 30px;font-size:15px;line-height:1.7;">${content}</div><div style="padding:18px 30px;background:${BRAND.cream};border-top:1px solid ${BRAND.border};text-align:center;color:${BRAND.muted};font-size:12px;">Wicka Assistance · Études et accompagnement au Maroc<br><a href="mailto:${escapeHtml(cfg.companyEmail)}" style="color:${BRAND.rose};">${escapeHtml(cfg.companyEmail)}</a></div></div></div></body></html>`;
}
async function sendBrevo({ to, subject, html, replyTo }: Mail, cfg: Cfg): Promise<void> {
  const payload: Record<string, unknown> = {
    sender: { name: cfg.fromName, email: cfg.fromEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html
  };
  if (replyTo && validEmail(replyTo)) payload.replyTo = { email: replyTo };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let response: Response;
  try {
    response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { accept: "application/json", "api-key": cfg.apiKey, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error("[brevo] API error", response.status, detail.slice(0, 500));
    throw new Error("Le service e-mail est temporairement indisponible.");
  }
}
function validateCommon(body: Body): { email: string; phone: string } {
  const email = text(body.email, 160);
  const phone = text(body.phone || body.whatsapp, 40);
  if (!email || !validEmail(email)) throw new Error("Adresse e-mail invalide.");
  if (!phone || !validPhone(phone)) throw new Error("Numéro de téléphone invalide.");
  return { email, phone };
}
function detailRows(labels: [string, string][]): string {
  return labels
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 8px;"><strong style="color:${BRAND.roseDark};">${escapeHtml(label)} :</strong> ${escapeHtml(value)}</p>`
    )
    .join("");
}
function contactEmails(body: Body, cfg: Cfg): { company: Mail; user: Mail } {
  const { email, phone } = validateCommon(body);
  const name = requiredText(body.name, "Le nom", 100);
  const subject = requiredText(body.subject, "Le sujet", 160);
  const message = requiredText(body.message, "Le message", 4000);
  if (name.length < 2 || subject.length < 3 || message.length < 10) throw new Error("Les champs du contact sont incomplets.");
  const details = detailRows([
    ["Nom", name],
    ["E-mail", email],
    ["Téléphone", phone],
    ["Sujet", subject],
    ["Message", message]
  ]);
  return {
    company: {
      to: cfg.companyEmail,
      subject: `[Contact] ${subject}`,
      html: emailLayout("Nouveau message de contact", details, cfg),
      replyTo: email
    },
    user: {
      to: email,
      subject: "Votre message a bien été reçu — Wicka Assistance",
      html: emailLayout(
        "Merci pour votre message",
        `<p>Bonjour ${escapeHtml(name)},</p><p>Nous avons bien reçu votre message. Notre équipe Wicka Assistance reviendra vers vous dès que possible.</p><hr style="border:0;border-top:1px solid ${BRAND.border};margin:24px 0;">${details}<p>Merci,<br><strong>Wicka Assistance</strong></p>`,
        cfg
      )
    }
  };
}
function candidatureEmails(body: Body, cfg: Cfg): { company: Mail; user: Mail } {
  const { email, phone } = validateCommon(body);
  const name = requiredText(body.fullName, "Le nom complet", 120);
  const fields: [string, unknown, string][] = [
    ["Pays", body.country, "Le pays"],
    ["Niveau d’études", body.currentLevel, "Le niveau d’études"],
    ["Série du bac", body.bacSeries, "La série du bac"],
    ["Filière souhaitée", body.studyDomain, "La filière"],
    ["Ville souhaitée", body.targetCity, "La ville souhaitée"],
    ["Formule", body.selectedPack, "La formule"],
    ["Navette aéroport", body.airportTransfer, "Le choix de navette"]
  ];
  fields.forEach(([, value, label]) => requiredText(value, label, 300));
  const details = detailRows([
    ["Nom complet", name],
    ...fields.map(([label, value]): [string, string] => [label, text(value)]),
    ["WhatsApp", phone],
    ["E-mail", email],
    ["Université souhaitée", text(body.targetUniversity, 200) || "Recommandation Wicka"],
    ["Notes", text(body.notes, 4000) || "Aucune"]
  ]);
  const disclaimer = `<p style="padding:14px 16px;background:${BRAND.light};border-left:4px solid ${BRAND.rose};">Cette confirmation ne constitue pas une garantie d’admission. La décision appartient à l’établissement et, lorsqu’un examen est demandé, au résultat de l’étudiant.</p>`;
  return {
    company: {
      to: cfg.companyEmail,
      subject: `[Candidature] ${name}`,
      html: emailLayout("Nouvelle candidature", details, cfg),
      replyTo: email
    },
    user: {
      to: email,
      subject: "Votre candidature a bien été reçue — Wicka Assistance",
      html: emailLayout(
        "Candidature reçue",
        `<p>Bonjour ${escapeHtml(name)},</p><p>Nous confirmons la bonne réception de votre candidature par Wicka Assistance.</p>${disclaimer}<hr style="border:0;border-top:1px solid ${BRAND.border};margin:24px 0;">${details}<p>Merci,<br><strong>Wicka Assistance</strong></p>`,
        cfg
      )
    }
  };
}
function callbackEmail(body: Body, cfg: Cfg): Mail {
  const phone = text(body.phone, 40);
  if (!phone || !validPhone(phone)) throw new Error("Numéro de téléphone invalide.");
  const name = text(body.name, 100) || "Non renseigné";
  const details = detailRows([
    ["Nom", name],
    ["Numéro WhatsApp / téléphone", phone]
  ]);
  return {
    to: cfg.companyEmail,
    subject: "[Rappel demandé] Nouvelle demande",
    html: emailLayout(
      "Nouvelle demande de rappel",
      `<p>Un visiteur souhaite être rappelé par un conseiller Wicka Assistance.</p>${details}<p>Merci de contacter ce numéro dans le délai annoncé.</p>`,
      cfg
    )
  };
}

/** Handler Hono de POST /api/send-email (la méthode, la limite de débit et l'origine sont contrôlées dans src/app.tsx). */
export async function sendEmailHandler(c: Context) {
  try {
    const contentLength = Number(c.req.header("content-length") || 0);
    if (contentLength > 50_000) return c.json({ error: "Requête trop volumineuse." }, 413);
    const body: Body = await c.req.json().catch(() => ({}));
    if (body.website) return c.json({ ok: true });
    const cfg = config(getEnv(c), siteOrigin(c));
    const type = text(body.type, 20);
    if ((type === "contact" || type === "candidature") && body.consent !== "accepted") {
      return c.json({ error: "Le consentement est obligatoire." }, 400);
    }
    if (type === "callback") {
      await sendBrevo(callbackEmail(body, cfg), cfg);
      return c.json({ ok: true });
    }
    const emails = type === "contact" ? contactEmails(body, cfg) : type === "candidature" ? candidatureEmails(body, cfg) : null;
    if (!emails) return c.json({ error: "Type de formulaire inconnu." }, 400);
    await sendBrevo(emails.company, cfg);
    await sendBrevo(emails.user, cfg);
    return c.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[send-email]", message);
    const isClientError = /Adresse|Numéro|obligatoire|incomplets|inconnu|trop volumineuse/.test(message);
    const status = isClientError ? 400 : 502;
    return c.json({ error: isClientError ? message : "Le service est temporairement indisponible." }, status);
  }
}
