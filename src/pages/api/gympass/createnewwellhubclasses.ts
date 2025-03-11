import { database } from "@/firebase/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function UpdateWellhubClasses(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const { uid, gym_id, product_id, name, description, notes, bookable, visible, is_virtual } = req.body

  try {

    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "classes": [
          {
            name,
            description,
            notes,
            bookable,
            visible,
            is_virtual,
            product_id,
          }
        ]
      })
    });


    if (response.ok) {
      const data = await response.json();
      try {
        await setDoc(doc(database, "admins", `${uid}`, 'gympass_classes', `${data.classes[0].id}`), {
          name,
          description,
          notes,
          bookable,
          visible,
          product_id,
          id: data.classes[0].id
        });

        return res.status(200).json({error: false});
      } catch (error) {
        console.error('Erro interno Firebase:', error);
        return res.status(500).json({ error: true });
      }
    }

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error });
  }

}
