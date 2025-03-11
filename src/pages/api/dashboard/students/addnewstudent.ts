
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebase/firebase"

export default async function addNewStudent(req: NextApiRequest, res: NextApiResponse) {

    const {
        id, nome, email, genero, telefone, cpf, gympass_id, cep, logradouro, complemento, numero, cidade, estado
    } = req.body

    let idFirebaseUser = cpf === "" ? email : cpf;

    try {
        const docRef = doc(database, "admins", `${id}`, 'students', `${idFirebaseUser}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            res.json({ 'error': true })
            return

        }

        await setDoc(doc(database, "admins", `${id}`, 'students', `${idFirebaseUser}`), {
            nome,
            email,
            genero,
            telefone,
            cpf,
            gympass_id,
            cep,
            logradouro,
            complemento,
            numero,
            cidade,
            estado
        });

        res.status(200).json({ 'error': false })

    } catch (error) {

        res.status(500).json({ 'error': true })

    }

}
