// api/webhook.js

export default async function handler(req, res) {
  // Usamos variable de entorno definida en Vercel
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === "POST") {
    console.log("📩 Mensaje recibido:", req.body);

    // 👉 Reenviar evento a Make (saca el ID de tu Webhook en Make)
    await fetch("https://hook.integromat.com/TU_WEBHOOK_ID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    return res.sendStatus(200);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
