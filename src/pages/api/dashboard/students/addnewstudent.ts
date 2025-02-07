import { NextApiRequest, NextApiResponse } from "next";


export default async function addNewStudent(req: NextApiRequest, res: NextApiResponse) {

    console.log(req.body)
    
}


// export default async function addclient(req: NextApiRequest, res: NextApiResponse) {

//     const {
//         id,
//         name,
//         birthdate,
//         cpf,
//         email,
//         gender,
//         cellphone,
//         emergency,
//         profession,
//         streetadress,
//         numberadress,
//         cityadress,
//         complement,
//         cep,
//         plan,
//         startdate,
//         vencimento,
//         price
//     } = req.body

//     const docRef = doc(database, `${id}`, 'clients', 'client', `${cpf}`);
//     const docSnap = await getDoc(docRef);

//     if(docSnap.exists()){

//         res.json( { 'error': true } )
//         return

//     }
    
//     await setDoc(doc(database, `${id}`, 'clients', 'client', `${cpf}`), {
//         name: name,
//         birthdate: birthdate,
//         cpf: cpf,
//         email: email,
//         gender: gender,
//         cellphone: cellphone,
//         emergency: emergency,
//         profession: profession,
//         streetadress: streetadress,
//         numberadress: numberadress,
//         cityadress: cityadress,
//         complement: complement,
//         cep: cep,
//         plan: plan,
//         startdate: startdate,
//         vencimento: vencimento,
//         price: price
//     });

//     res.json({ 'error' : false })

// }
