import Dynamic from 'next/dynamic';

const loader = () => import('../components/map').then((r) => r.Map);
const Map = Dynamic(loader, { ssr: false });

export default function Home() {
  return <Map />;
}
