import { database } from "@/firebase/firebase"
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";


export default async function CreateNewCheckin(req: NextApiRequest, res: NextApiResponse) {

    const { id, nome, email, gympass_id, gym_product, gym_product_id, validated } = req.body
    const date = new Date(validated);
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() retorna de 0-11, por isso somamos 1
    const day = String(date.getUTCDate()).padStart(2, "0");
    const year = String(date.getUTCFullYear());

    try {

        await setDoc(doc(database, "admins", `${id}`, 'gympass_checkins', `${validated}`), {
            nome,
            email,
            gympass_id,
            gym_product,
            gym_product_id,
            validated
        });

        res.status(200).json({ 'error': false })

    } catch (error) {

        res.status(500).json({ 'error': true })

    }


}