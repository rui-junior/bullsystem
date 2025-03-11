
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebase/firebase"

export default async function addNewStudent(req: NextApiRequest, res: NextApiResponse) {

    const {
        uid, nome, dias, valor, obs
    } = req.body

    try {

        const plansRef = collection(database, "admins", uid, "plans");
    
        const q = query(plansRef, where("nome", "==", nome));
        const querySnapshot = await getDocs(q);

        
        if (!querySnapshot.empty) {
            console.log("vaziu")
            return res.status(400).json({ error: true, message: "Plano com este nome já existe." });
        }
    
        await setDoc(doc(plansRef), { nome, dias, valor, obs });
    
        res.status(200).json({ error: false });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Erro ao salvar o plano." });
    }

}
