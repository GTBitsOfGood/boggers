
export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send();
    } else if (!req.body.email) {
        res.status(400).send("email field required");
    } else if (!req.body.password) {
        res.status(400).send("password field required");
    } else {
        console.log(req.body);
        res.status(200).send();
    }
}
