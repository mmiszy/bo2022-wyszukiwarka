import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import styles from './map.module.css';

import { useQuery } from 'react-query';
import React, { useMemo } from 'react';

// Remove marker shadow
import { Icon, icon } from 'leaflet';
Icon.Default.prototype.options.shadowRetinaUrl = undefined;
Icon.Default.prototype.options.shadowUrl = undefined;
Icon.Default.prototype.options.shadowSize = undefined;
Icon.Default.prototype.options.shadowAnchor = undefined;

const boIcon = new Icon.Default({ className: styles.markerBo });
const zboIcon = new Icon.Default({ className: styles.markerZbo });
const boIconRejected = new Icon.Default({ className: `${styles.markerBo} ${styles.markerBoRejected}` });
const zboIconRejected = new Icon.Default({ className: `${styles.markerZbo} ${styles.markerZboRejected}` });

async function getItems() {
  const res = await fetch('/api/items');
  return res.json() as Promise<{ data: typeof import('../details.json') }>;
}

const center = { lat: 54.35612792919208, lng: 18.615087843634633 };

const getTrojmiastoPlCDNNumber = ({ x, y }: { x: number; y: number; z: number }) => (Math.abs(x + y) % 4) + 1;

const BoPopup = ({ title, id }: { title: string; id: string }) => {
  return (
    <Popup>
      <p>{title}</p>
      <p>
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={`https://gdansk.ardvote.pl/lista-projektow/${encodeURIComponent(id)}`}
        >
          Otwórz {id} na stronie
        </a>
      </p>
    </Popup>
  );
};

export const Map = ({}: {}) => {
  const { isLoading, error, data } = useQuery('items', () => getItems());

  const boData = useMemo(
    () =>
      data?.data
        .filter((item) => item.budgetType === 'CIVIC_BUDGET')
        .map((item) => {
          return (
            <Marker
              icon={item.status.includes('REJECTED') ? boIconRejected : boIcon}
              key={item.id}
              position={{ lat: item.coordinate.latitude, lng: item.coordinate.longitude }}
            >
              <BoPopup title={item.title} id={item.id} />
            </Marker>
          );
        }),
    [data],
  );

  const zboData = useMemo(
    () =>
      data?.data
        .filter((item) => item.budgetType === 'GREEN_BUDGET')
        .map((item) => {
          return (
            <Marker
              key={item.id}
              icon={item.status.includes('REJECTED') ? zboIconRejected : zboIcon}
              position={{ lat: item.coordinate.latitude, lng: item.coordinate.longitude }}
            >
              <BoPopup title={item.title} id={item.id} />
            </Marker>
          );
        }),
    [data],
  );

  return (
    <MapContainer className={styles.map} center={center} zoom={13} scrollWheelZoom={false}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Domyślny">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Czarno-białe">
          <TileLayer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Orotofotomapa">
          <LayerGroup>
            <TileLayer url="https://cfm{s}.s-trojmiasto.pl/tiles/2016/{z}/{x}/{y}.jpg" s={getTrojmiastoPlCDNNumber} />
            <TileLayer
              url="https://mbtiles{s}.trojmiasto.pl/mbtiles.php?z={z}&x={x}&y={y}&t=streets"
              {...{ s: getTrojmiastoPlCDNNumber }}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Budżet Obywatelski">
          <LayerGroup>{boData}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Zielony Budżet Obywatelski">
          <LayerGroup>{zboData}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};
