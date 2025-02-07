import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const token = process.env.GYMPASS_TOKEN

    try {

      const apiUrl = 'https://apitesting.partners.gympass.com/booking/v1/gyms/153/classes';
  
      // Fazendo a requisição à API do Gympass do lado do servidor
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

  
      const data = await response.json();
      return res.status(200).json(data); // Retornando os dados para o front-end

    } catch (error) {
      // console.error('Erro ao fazer a requisição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

  }
  