import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/firebase/firebase"
import { deleteDoc, doc } from "firebase/firestore";

export default async function deleteLogs(req: NextApiRequest, res: NextApiResponse) {
    
    const { uid, id } = req.body


    if (req.method !== "DELETE") {
        return res.status(405).json({ delete: true });
      }

    try {
        
        const userDoc = doc(database, "admins", uid, 'plans', id);
        await deleteDoc(userDoc);
        return res.status(200).json({ 'delete' : true })
        
    } catch (error) {
        
        return res.status(500).json({ 'delete' : false })

    }

}