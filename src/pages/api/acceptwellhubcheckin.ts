import { NextApiRequest, NextApiResponse } from "next";

export default async function Accept(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body;

    // if (!data || !data.events || !Array.isArray(data.events)) {
    //     return res.status(400).json({ error: "Invalid request data" });
    // }

    // try {
    //     let results = [];

    //     for (const element of data.events) {
    //         try {
    //             const fetchCheckin = await fetch(`${process.env.GYMPASS_ADDRESS}/validate`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Authorization": `Bearer ${process.env.GYMPASS_TOKEN}`,
    //                     "X-Gym-Id": `${process.env.GYM_ID}`,
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     gympass_id: element.event_data.user.unique_token
    //                 })
    //             });

    //             const response = await fetchCheckin.json();
    //             console.log(response);
    //             if (response.results) {
                    
    //             }
    //             // results.push(response);
    //         } catch (error) {
    //             console.error("Erro na requisição:", error);
    //             results.push({ error: "Request failed" });
    //         }
    //     }

    //     return res.status(200).json({ results });
    // } catch (error) {
    //     console.error("Erro geral:", error);
    //     return res.status(500).json({ error: "Internal Server Error" });
    // }
}
