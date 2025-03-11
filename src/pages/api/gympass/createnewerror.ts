import { database } from "@/firebase/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";


export default async function CreateNewError(req: NextApiRequest, res: NextApiResponse) {

    const {
        uid,
        error,
        gym_id,
        gympass_id,
        username,
        email,
        day,
        month,
        year,
        time
    } = req.body


    try {

        const docRef = doc(database, "admins", `${uid}`, 'gympass_logs', `${year}${month}${day}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();

            if (data.time === time) {
                return res.json({ error: true });
            }

            return

        }

        await setDoc(doc(database, "admins", `${uid}`, 'gympass_logs', `${year}${month}${day}`), {
            error,
            gym_id,
            gympass_id,
            username,
            email,
            time
        });

        res.status(200).json({ 'error': false })

    } catch (error) {

        res.status(500).json({ 'error': true })

    }


}