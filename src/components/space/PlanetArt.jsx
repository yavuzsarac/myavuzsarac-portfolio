import { memo } from 'react';
import PlanetLife from './PlanetLife';
const palettes = {
 home: ['#173e46','#276867','#3b9d88','#6dc5a3','#a4e2ba'],
 industry: ['#593747','#92534d','#bf7956','#e5a874','#f6cc94'],
 city: ['#30294f','#514175','#77639d','#a58acf','#d1b9ef'],
 crystal: ['#1a425c','#286783','#3899b1','#71c8d3','#b7e9de'],
 signal: ['#4e304f','#814669','#b66e93','#e2a0ba','#f5c9ce'],
 earth: ['#253b53','#3b6375','#5f8d7b','#92b889','#d6dca2'],
};
function PlanetArt({ type, className = '' }) {
 const colors = palettes[type] || palettes.home;
 const pixels = [];
 for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++) {
  const dx = x - 13.5, dy = y - 13.5;
  if (dx * dx + dy * dy > 177) continue;
  const noise = ((x * 31 + y * 17 + x * y * 7) % 29) / 29;
  const light = Math.max(0, Math.min(4, Math.floor(2.5 - dx / 9 - dy / 12 + (noise - .5) * 1.7)));
  pixels.push(<rect key={`${x}-${y}`} x={x + 10} y={y + 12} width="1" height="1" fill={colors[light]} />);
 }
 return <svg className={`planet-art ${className}`} viewBox="0 0 48 48" aria-hidden="true" shapeRendering="crispEdges">
  {type === 'city' && <path d="M2 33 43 15 46 17 6 37Z" fill="#8f78ba" opacity=".7" />}
  {pixels}
  <path d="M15 25h5v2h4v3h-4v2h-5v-2h-2v-3h2Z M29 34h4v3h-4Z" fill={colors[0]} opacity=".4" />
  {type === 'home' && <g><path d="M16 15h15v2H16Z M19 10h10v5H19Z M21 8h6v2h-6Z" fill="#bedbd4"/><path d="M23 10h4v4h-4Z" fill="#29485c"/><path d="m28 9 5-4 1 2-5 4Z" fill="#e8e5bc"/><path d="M15 17h18v2H15Z M17 19h2v3h-2Z M29 19h2v3h-2Z" fill="#2c5356"/><rect x="21" y="15" width="4" height="4" fill="#77c7dd"/></g>}
  {type === 'industry' && <g><path d="M16 16V9h3v7h4V5h3v11h6v5H16Z" fill="#353d4b"/><path d="M17 10h1v4h-1Z M24 6h1v7h-1Z" fill="#c5d2c8"/><path d="M17 17h4v2h-4Z M26 17h4v2h-4Z" fill="#80d9c4"/><path d="M28 10h6v5h-6Z" fill="#e2ba88"/><path d="M29 11h4v3h-4Z" fill="#48525a"/><path d="M22 3h5v1h-5Z M17 6h4v1h-4Z" fill="#d1bfa9" opacity=".5"/></g>}
  {type === 'city' && <g><path d="M15 19V11h4v8h2V5h4v14h2V9h5v10Z" fill="#343453"/><path d="M22 3h2v2h-2Z" fill="#f7b4ca"/><path d="M16 13h2v1h-2Z M16 16h2v1h-2Z M22 7h2v2h-2Z M22 11h2v2h-2Z M28 11h3v1h-3Z M28 15h3v1h-3Z" fill="#ded4aa"/><path d="M8 35 38 22 41 22 10 37Z" fill="#c2a5df"/></g>}
  {type === 'crystal' && <g><path d="m16 22-3-9 3-4 5 8-1 5Z" fill="#9af5ec"/><path d="m22 20-2-13 4-6 5 7-3 12Z" fill="#aee1ec"/><path d="m24 1 5 7-3 12h-2Z" fill="#67a6cd"/><path d="m29 23-1-9 6-7 2 8-4 8Z" fill="#73e6ce"/><path d="m34 7 2 8-4 8h-2Z" fill="#409ca9"/><path d="M15 23h19v2H15Z" fill="#376d86"/></g>}
  {type === 'signal' && <g><path d="M23 8h2v12h-2Z M18 20h12v2H18Z" fill="#e1dbd7"/><path d="m16 9 10 8 7-9-4-3-7 3Z" fill="#e2c6d5"/><path d="m18 9 8 6 5-6-3-2Z" fill="#8a6385"/><path d="M33 2v2h3v3h2V2Z M31 6v2h3v3h2V6Z" fill="#e8b4d3" opacity=".8"/></g>}
  {type === 'earth' && <g><path d="M15 29h5v2h3v4h-4v3h-4Z M28 19h7v3h-3v4h-5v-4Z" fill="#8eae73"/><path d="M18 9h13v10H18Z" fill="#e1dbc2"/><path d="M20 11h9v6h-9Z" fill="#263f4a"/><path d="M22 13h3v1h-3Z M25 15h2v1h-2Z" fill="#9ad5ad"/><path d="M23 19h3v2h-3Z M19 21h11v2H19Z" fill="#b4b99c"/></g>}
  <PlanetLife type={type}/>
 </svg>;
}

export default memo(PlanetArt);


