import type { NextApiRequest, NextApiResponse } from "next";

export default async function CreateNewSlots(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const {
    occur_date,
    length_in_minutes,
    total_capacity,
    total_booked,
    product_id,
    cancellable_until,
    booking_window,
    instructors,
    gym_id,
    class_id
  } = req.body

  try {

    const apiUrl = `https://apitesting.partners.gympass.com/booking/v1/gyms/${gym_id}/classes/${class_id}/slots`;

    const payload: any = {
      occur_date,
      status: 1,
      length_in_minutes,
      total_capacity,
      total_booked,
      product_id,
      booking_window: {
        opens_at: booking_window.opens_at,
        closes_at: booking_window.closes_at
      },
      cancellable_until
    };

    if (instructors && instructors.name.trim() !== "") {
      payload.instructors = [{
        name: instructors.name,
        substitute: false
      }];
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (instructors && instructors.name.trim() !== "") {
      payload.instructors = [{
        name: instructors.name,
        substitute: false
      }];
    }


    const data = await response.json();
    // console.log(data)
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error });
  }

}
