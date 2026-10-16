// Point d'entrée Vercel (vercel.json redirige toutes les routes vers /api)
import { handle } from "hono/vercel";
import app from "../src/app";

// Vercel Node.js accepte les sous-modules Hono JSX sans la restriction Edge
// sur les modules externes. Cloudflare conserve son runtime Worker séparé.
export const config = { runtime: "nodejs" };

export default handle(app);
