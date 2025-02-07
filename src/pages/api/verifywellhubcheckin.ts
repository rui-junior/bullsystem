import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../../firebase/firebase";

const database = getDatabase(app);
const timestamp = Date.now();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { event_type, event_data } = req.body;

  if (!event_type || !event_data?.user?.unique_token || !event_data?.gym?.id) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  if (event_type === "checkin") {
    try {
      const response = await fetch(`${process.env.GYMPASS_ADDRESS}/validate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GYMPASS_TOKEN}`,
          "X-Gym-Id": String(event_data.gym.id),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gympass_id: event_data.user.unique_token }),
      });

      const data = await response.json();

      // Verifica se houve erro na resposta
      if (data?.metadata?.errors > 0) {
        const checkinError = data.errors.find((err: any) => err.key === "checkin.already.validated");

        if (checkinError) {
          return res.status(400).json({ error: "Check-in já foi validado anteriormente" });
        }

        return res.status(400).json({ error: "Erro na validação do check-in", details: data.errors });
      }

      // Se o check-in for validado com sucesso, armazena no Firebase
      if (data?.results?.user?.gympass_id) {

        await set(ref(database, `checkins/${timestamp}`), {
          event_type,
          event_data,
          timestamp,
          validated_at: data.results.validated_at
        });

        return res.status(200).json({ message: "Check-in validado e armazenado" });
      }

      return res.status(400).json({ error: "Check-in não validado pelo Gympass" });

    } catch (error) {
      console.error("Erro no processo de check-in:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  return res.status(400).json({ error: "Tipo de evento inválido" });
}