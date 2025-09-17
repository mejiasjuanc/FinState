// api/webhook.js

export default async function handler(req, res) {
  const VERIFY_TOKEN = "disu123"; // cámbialo por tu token

  if (req.method === "GET") {
    // Validación inicial del webhook (Meta -> Vercel)
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente.");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("📩 Mensaje recibido:", JSON.stringify(body, null, 2));

      // 👉 Reenviar evento a Make (cambia por tu webhook real)
      await fetch("https://hook.integromat.com/TU_WEBHOOK_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      res.sendStatus(200);
    } catch (error) {
      console.error("❌ Error procesando mensaje:", error);
      res.sendStatus(500);
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}