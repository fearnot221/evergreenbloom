import { CampusSketch } from './CampusSketch';

/**
 * The real campus, drawn from OpenStreetMap, framed like a photograph: the figure clips
 * and `.plate-inner` is the oversized layer the motion system scales.
 */
export function CampusPlate({ className = '' }: { className?: string }) {
  return (
    <figure className={`plate plate-campus ${className}`}>
      <div className="plate-inner">
        <CampusSketch />
      </div>
      <figcaption className="sr-only">中央大學校園線稿，資料來自 OpenStreetMap</figcaption>
    </figure>
  );
}
