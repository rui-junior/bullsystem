import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { database } from "@/firebase/firebase";

export default async function CanceledBooking(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { event_type, event_data } = req.body;

    if (!event_type || !event_data?.slot?.booking_number) {
        return res.status(400).json({ error: "Dados incompletos" });
    }

    if (event_type !== "booking-canceled") {
        return res.status(400).json({ error: "Tipo de evento inválido" });
    }

    try {
        const bookingNumber = event_data.slot.booking_number;

        // 🔍 Buscar em todas as subcoleções dentro de "admins"
        const adminsRef = collection(database, "admins");
        const adminsSnapshot = await getDocs(adminsRef);

        let foundUid = null;
        let foundDocId = null;

        for (const adminDoc of adminsSnapshot.docs) {
            const uid = adminDoc.id; // Obtém o UID do admin

            // Faz a query na subcoleção "gympass_bookings" deste admin
            const logsRef = collection(database, `admins/${uid}/gympass_bookings`);
            const q = query(logsRef, where("booking_number", "==", bookingNumber));
            const logsSnapshot = await getDocs(q);

            if (!logsSnapshot.empty) {
                const logDoc = logsSnapshot.docs[0]; // Obtém o primeiro encontrado
                foundUid = uid;
                foundDocId = logDoc.id;
                break; // Para o loop, pois já encontramos o booking_number
            }
        }

        if (!foundUid || !foundDocId) {
            return res.status(404).json({ error: "Booking não encontrado" });
        }

        // 🗑️ Deletar o documento encontrado
        const docRef = doc(database, `admins/${foundUid}/gympass_bookings/${foundDocId}`);
        await deleteDoc(docRef);

        // 📅 Formatar timestamp
        const timestamp = event_data.timestamp || Date.now();
        const date = new Date(timestamp);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");

        // 📝 Gravar no gympass_logs com a data do cancelamento
        const logRef = doc(database, `admins/${foundUid}/gympass_logs/${year}${month}${day}_${foundDocId}`);
        await setDoc(logRef, {
            error: "Agendamento de Aula Cancelado",
            gym_id: event_data.slot.gym_id,
            gympass_id: event_data.user.unique_token,
            username: event_data.user.name,
            email: event_data.user.email,
            time: `${hours}:${minutes}`
        });

        return res.status(200).json({
            delete: true,
            uid: foundUid,
            booking_number: bookingNumber
        });

    } catch (error) {
        console.error("Erro ao buscar e deletar booking:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
