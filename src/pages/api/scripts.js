import { createUser } from '../../../server/mongodb/actions/User';

export default async function handler(req, res) {
    if (process.env.NODE_ENV === 'production') return res.status(404).end();

    switch (req.query.task) {
        case 'seed':
            const user = await createUser("root@boggers.com", "boggers", "root", true);
            return res.status(200).json(user)
    }
}
  