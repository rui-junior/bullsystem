import type { NextApiRequest, NextApiResponse } from "next";

export default async function UpdateWellhubClasses(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const { name, description, notes, bookable, visible, is_virtual } = req.body

  // add numero gym_id fornecido pelo gympass
  const gym_id = 153
  const product_id = 305

  try {

    // atualizar o gym id e o class id

    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes`;

    // Fazendo a requisição à API do Gympass do lado do servidor
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
            product_id
          }
        ]
      })
    });


    const data = await response.json();
    return res.status(200).json(data); // Retornando os dados para o front-end

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error });
  }

}
