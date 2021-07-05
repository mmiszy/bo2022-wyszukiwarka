import BoList from './bo2022.json';
import Bluebird from 'bluebird';
import fetch from 'node-fetch';
import Fs from 'fs/promises';
import Path from 'path';

const DETAILS_API_URL = (id: string) =>
  `https://gdansk.ardvote.pl/gateway/api/public/projects/${encodeURIComponent(id)}`;

export async function run() {
  const result = await Bluebird.map(
    BoList.content,
    async (item) => {
      console.log(`Fetching ${item.title}…`);
      const url = DETAILS_API_URL(item.id);
      const res = await fetch(url);
      console.log(`Done ${item.title}…`);
      return res.json();
    },
    { concurrency: 10 },
  );
  await Fs.writeFile(Path.resolve(__dirname, 'details.json'), JSON.stringify(result, null, 2), 'utf-8');
}

run().catch((err) => console.error(err));
