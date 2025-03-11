import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../../../firebase/firebase";

const database = getDatabase(app);
const timestamp = Date.now();

export default async function WellHubBooking(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { event_type, event_data } = req.body;

  if (!event_type || !event_data?.user?.unique_token || !event_data?.slot?.id || !event_data?.slot?.gym_id || !event_data?.slot?.class_id) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  if (event_type === "booking-requested") {

    try {

        await set(ref(database, `booking/success/${timestamp}`), {
          ...event_data,
        });

        return res.status(200).json({ message: "Booking armazenado" });
      

      
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }


  }

  return res.status(400).json({ error: "Tipo de evento inválido" });
}