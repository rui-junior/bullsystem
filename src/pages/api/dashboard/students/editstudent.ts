import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebase/firebase";

export default async function EditStudent(req: NextApiRequest, res: NextApiResponse) {
    // Verifica se o método HTTP é PUT
    if (req.method !== "PUT") {
        return res.status(405).json({ error: true, message: "Método não permitido" });
    }

    try {
        const {
            id,
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
        } = req.body;

        const studentRef = doc(database, "admins", String(id), "students", String(cpf));

        // Atualiza os dados no Firestore
        await updateDoc(studentRef, {
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

        return res.status(200).json({ error: false });

    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        return res.status(500).json({ error: true });
    }
}
