export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const TOKEN = "ISI_TOKEN_KAMU";
    const PHONE_ID = "ISI_PHONE_ID_KAMU";

    try {
        const {
            siswa
        } = req.body;

        const results = [];

        for (let s of siswa) {
            const pesan = `Konnichiwa ${s.nama}san, mengapa tidak ikut kelas hari ini?`;

            const response = await fetch(
                `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: s.wa,
                        type: "text",
                        text: {
                            body: pesan
                        }
                    })
                }
            );

            const data = await response.json();
            results.push({
                nama: s.nama,
                wa: s.wa,
                response: data
            });
        }

        res.status(200).json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Gagal kirim WA"
        });
    }
}