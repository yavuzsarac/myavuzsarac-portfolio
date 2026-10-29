import { memo } from 'react';
function Starfield() {
  return <div className="starfield" aria-hidden="true">
    <div className="nebula nebula-one"/><div className="nebula nebula-two"/>
    {[0, 1, 2].map(layer => <div key={layer} className={`star-layer star-layer-${layer}`}>{Array.from({ length: 35 }, (_, j) => {
      const i = j * 3 + layer;
      return <i key={i} className={i % 13 === 0 ? 'star cross-star' : 'star'} style={{ left: `${(i * 73.37 + 3) % 100}%`, top: `${(i * 41.13 + 7) % 100}%`, '--delay': `${i % 7}s`, opacity: .18 + (i % 6) * .12 }}/>;
    })}</div>)}
  </div>;
}
export default memo(Starfield);
