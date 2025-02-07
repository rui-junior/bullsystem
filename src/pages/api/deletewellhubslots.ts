import type { NextApiRequest, NextApiResponse } from "next";

export default async function deleteWellhubSlots(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const { slots_id, class_id, gym_id } = req.body

  try {
    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes/${class_id}/slots/${slots_id}`;
  
    const response = await fetch(apiUrl, {
      method: "DELETE",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  
    // Verifica se a resposta foi bem-sucedida (código 2xx)
    if (!response.ok) {
      throw new Error(`Erro ao deletar slot: ${response.status} - ${response.statusText}`);
    }
  
    // Verifica se a resposta tem conteúdo (204 significa que não tem)
    let responseData = null;
    if (response.status !== 204) {
      responseData = await response.json();
    }

    return res.status(200).json(responseData);
  
  } catch (error) {
    // console.error("Erro ao fazer a requisição:", error);
    return res.status(500).json(error);
  }

}
