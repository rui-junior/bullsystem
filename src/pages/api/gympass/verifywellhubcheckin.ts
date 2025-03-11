import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../../../firebase/firebase";

const database = getDatabase(app);
const timestamp = Date.now();

export default async function WellHubCheckin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { event_type, event_data } = req.body;

  if (!event_type || !event_data?.user?.unique_token || !event_data?.gym?.id) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  if (event_type === "checkin") {

    const gympassId = event_data.user.unique_token;
    const gymId = event_data.gym.id;
    const gymproduct = event_data.gym.product.description;
    const gymproductid = event_data.gym.product.id;
    const userData = {
      gympass_id: gympassId,
      user: event_data.user,
      gym_id: gymId,
      gym_product: gymproduct,
      gym_product_id: gymproductid,
      timestamp
    };

    try {
      const response = await fetch(`${process.env.GYMPASS_ADDRESS}/validate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GYMPASS_TOKEN}`,
          "X-Gym-Id": String(gymId),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gympass_id: gympassId }),
      });

      const data = await response.json();

      // Verifica se houve erro na resposta
      if (data?.metadata?.errors > 0) {
        const checkinError = data.errors.find((err: any) => err.key === "checkin.already.validated");

        const errorMessage = checkinError
          ? "Check-in já foi validado anteriormente"
          : "Erro na validação do check-in";

          // add no realtime database
        await set(ref(database, `checkins/errors/${timestamp}`), {
          ...userData,
          error: errorMessage,
          details: data.errors,
        });

        return res.status(400).json({ error: errorMessage, details: data.errors });
      }

      // Se o check-in for validado com sucesso, armazena no Firebase
      if (data?.results?.user?.gympass_id) {
        await set(ref(database, `checkins/success/${timestamp}`), {
          ...userData,
          validated_at: data.results.validated_at,
        });

        return res.status(200).json({ message: "Check-in validado e armazenado" });
      }

      await set(ref(database, `checkins/errors/${timestamp}`), {
        ...userData,
        error: "Check-in não validado pelo Gympass",
      });

      return res.status(400).json({ error: "Check-in não validado pelo Gympass" });

    } catch (error: any) {
      console.error("Erro no processo de check-in:", error);

      await set(ref(database, `checkins/errors/${timestamp}`), {
        ...userData,
        error: "Erro interno no servidor",
        details: error.message || error,
      });

      return res.status(500).json({ error: "Erro interno no servidor" });
    }


  }

  return res.status(400).json({ error: "Tipo de evento inválido" });
}