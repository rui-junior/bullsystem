import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/firebase/firebase"
import { deleteDoc, doc } from "firebase/firestore";

export default async function deleteStudent(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Método não permitido" });
      }

    const { userId, id } = req.body

    try {
        
        const userDoc = doc(database, "admins", `${userId}`, 'students', id);
        await deleteDoc(userDoc);
        return res.status(200).json({ 'delete' : true })
        
    } catch (error) {
        
        return res.status(500).json({ 'delete' : false })

    }

}