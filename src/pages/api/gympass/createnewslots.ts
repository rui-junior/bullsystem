import { database } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

interface Instructor {
  name: string;
  substitute: boolean;
}

interface BookingWindow {
  opens_at: string; // ou Date, dependendo do formato
  closes_at: string; // ou Date
}

interface Payload {
  occur_date: string; // ou Date, se for um objeto de data
  status: number;
  length_in_minutes: number;
  room: string;
  total_capacity: number;
  total_booked: number;
  product_id: string; // ou number, dependendo do tipo do ID
  booking_window: BookingWindow;
  cancellable_until: string; // ou Date
  instructors: Instructor[];
}

export default async function CreateNewSlots(req: NextApiRequest, res: NextApiResponse) {

  const token = process.env.GYMPASS_TOKEN

  const {
    uid,
    occur_date,
    length_in_minutes,
    total_capacity,
    room,
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

    const payload: Payload = {
      occur_date,
      status: 1,
      length_in_minutes,
      total_capacity,
      room,
      total_booked,
      product_id,
      booking_window: {
        opens_at: booking_window.opens_at,
        closes_at: booking_window.closes_at
      },
      cancellable_until,
      instructors
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
    
    const data = await response.json();

    if (data.metadata.errors == 0) {
      try {
        const occur_date_new = data.results[0].occur_date.split("-")[0] + "-" + data.results[0].occur_date.split("-")[1] + "-" + data.results[0].occur_date.split("-")[2].slice(0, 8)+"Z"
        await setDoc(doc(database, "admins", `${uid}`, 'gympass_slots', `${data.results[0].id}`), {

          id: data.results[0].id,
          class_id: data.results[0].class_id,
          occur_date: occur_date_new,
          status: data.results[0].status,
          length_in_minutes: data.results[0].length_in_minutes,
          total_capacity: data.results[0].total_capacity,
          room: data.results[0].room,
          total_booked: data.results[0].total_booked,
          product_id: data.results[0].product_id,
          booking_window: data.results[0].booking_window,
          cancellable_until: data.results[0].cancellable_until,
          instructors: data.results[0].instructors,
          virtual: data.results[0].virtual

        });

        return res.status(200).json({error: false});
        
      } catch (error) {
        return res.status(200).json({error: true});
      }
    }
    

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error: true });
  }

}
