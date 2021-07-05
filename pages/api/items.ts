import { NextApiRequest, NextApiResponse } from 'next';
import Details from '../../details.json';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    data: Details,
  });
};
