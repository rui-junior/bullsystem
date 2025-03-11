import { database } from "@/firebase/firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteWellhubSlots(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const token = process.env.GYMPASS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Token de autenticação não encontrado" });
  }

  const { slots_id, class_id, gym_id, uid } = req.body;

  if (!slots_id || !class_id || !gym_id) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes/${class_id}/slots/${slots_id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    

    if (response.status == 204) {
      
      try {
        const userDoc = doc(database, "admins", `${uid}`, 'gympass_slots', `${slots_id}`);
        await deleteDoc(userDoc);

        const bookingsCollection = collection(database, "admins", `${uid}`, "gympass_bookings");
        const bookingsQuery = query(bookingsCollection, where("slot_id", "==", slots_id));
        const querySnapshot = await getDocs(bookingsQuery);

        const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return res.status(200).json({ error: false });

      } catch (error) {
        return res.status(500).json({ error: true });
      }

    }

    return res.status(response.status).json({ error: true});

  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return res.status(500).json({ error: true });
  }
}
