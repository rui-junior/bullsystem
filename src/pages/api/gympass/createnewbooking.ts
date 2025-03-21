import { database } from "@/firebase/firebase"
import { collection, doc, getDocs, or, query, setDoc, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

// function formatTimestamp(timestamp: number | string): string {
//     const date = new Date(Number(timestamp)); // Converte para número antes de criar o Date

//     if (isNaN(date.getTime())) {
//         return "Data inválida"; // Retorno para evitar erro se for um valor inválido
//     }

//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");

//     return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
// }


export default async function CreateNewCheckin(req: NextApiRequest, res: NextApiResponse) {

    const { uid, nome, email, gympass_id, booking_number, class_id, gym_id, slot_id, booking_id } = req.body;

    try {
        const collectionSlots = collection(database, "admins", uid, "gympass_slots");

        // Consulta para buscar um slot que tenha o mesmo slot_id ou class_id
        const q = query(
            collectionSlots,
            where("id", "==", slot_id),
            where("class_id", "==", class_id)
        );

        
        const querySnapshot = await getDocs(q);
        
        // Se nenhum documento for encontrado, retorna erro
        if (querySnapshot.empty) {
            return res.status(404).json({ error: true, message: "Nenhum slot encontrado para este slot_id ou class_id" });
        }
        
        // Obtém os dados do primeiro documento encontrado
        const docData = querySnapshot.docs[0].data();

        try {
          const bookingRef = doc(database, "admins", uid, "gympass_bookings", `${docData.occur_date}${gympass_id}`);

          await setDoc(bookingRef, {
            nome,
            email,
            gympass_id,
            booking_number,
            class_id,
            gym_id,
            slot_id,
            booking_id,
            occur_date: docData.occur_date
          });

          return res.status(200).json({ error: false });

        } catch (error) {
          console.error("Erro ao salvar reserva:", error);
          return res.status(500).json({ error: true, message: "Erro ao salvar reserva" });
        }

    } catch (error) {
        console.error("Erro na consulta de slots:", error);
        return res.status(500).json({ error: true, message: "Erro ao buscar slots" });
    }











    // const { uid, nome, email, gympass_id, booking_number, class_id, gym_id, slot_id, booking_id } = req.body

    // try {
    //     const collectionSlots = collection(database, "admins", uid, "gympass_slots")
    //     const q = query(
    //         collectionSlots,
    //         or(
    //             where("id", "==", slot_id),
    //             where("class_id", "==", class_id)
    //         )
    //     )

    //     const querySnapshot = await getDocs(q);

    //     if (!querySnapshot.empty) {
    //         const docData = querySnapshot.docs[0].data();
    //         try {

    //             await setDoc(doc(database, "admins", uid, 'gympass_bookings', `${docData.occur_date}${gympass_id}`), {
    //                 nome, email, gympass_id, booking_number, class_id, gym_id, slot_id, booking_id, occur_date: docData.occur_date
    //             });

    //             res.status(200).json({ 'error': false })

    //         } catch (error) {

    //             res.status(500).json({ 'error': true })

    //         }
    //     }

    //     res.status(500).json({ 'error': true })

    // } catch (error) {
    //     res.status(500).json({ 'error': true })
    // }

}