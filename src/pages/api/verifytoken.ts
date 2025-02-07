// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '../../firebase/firebaseAdmin'
import { getAuth, Auth } from 'firebase-admin/auth'


export default function (req: NextApiRequest, res: NextApiResponse) {

    const { token } = req.body

    getAuth().verifyIdToken(token)
    .then((decodedToken) => {

        res.json({ 'id': decodedToken.uid })

    })

    .catch((error) => {

        res.json({ 'error': true })
        console.log(error)

    })


}