// Point d'entrée Vercel (vercel.json redirige toutes les routes vers /api)
import { handle } from "hono/vercel";
import app from "../src/app";

export const config = { runtime: "edge" };

export default handle(app);
