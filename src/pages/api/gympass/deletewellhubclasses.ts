import { database } from "@/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function UpdateWellhubClasses(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const { id, uid, gym_id, product_id } = req.body

  try {

    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes/${id}`;

    // Fazendo a requisição à API do Gympass do lado do servidor
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        name: "deletado",
        description: "deletado",
        bookable: false,
        visible: false,
        product_id: product_id,
        gym_id: gym_id,
      }),
    });


    if(response.ok){

      try {

        const userDoc = doc(database, "admins", `${uid}`, 'gympass_classes', `${id}`);
        await deleteDoc(userDoc);
        return res.status(200).json({error: false}); // Retornando os dados para o front-end
        
      } catch (error) {
        return res.status(500).json({ error: true });
      }


    }



  } catch (error) {
    // console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error });
  }

}
