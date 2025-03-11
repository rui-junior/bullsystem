import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const {class_id, gym_id, product_id, slots_query} = req.body
  
  const token = process.env.GYMPASS_TOKEN

    try {

      const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes/${class_id}/${slots_query}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

  
      const data = await response.json();
      return res.status(200).json(data);

    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

  }
  