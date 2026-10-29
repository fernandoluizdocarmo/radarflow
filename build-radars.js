// build-radars.js - Converte CSV do Pardal + OSM em JSON compacto para o RadarFlow
const fs = require('fs');

// ---- Pardal CSV ----
const csv = fs.readFileSync('pardal_radares.csv', 'utf8');
const lines = csv.trim().split('\n');
// header: lat,lng,kind,limit_kmh,source,active,end_lat,end_lng,direction_deg

const radars = [];
const seen = new Set();

lines.slice(1).forEach(line => {
  const p = line.split(',');
  const lat = parseFloat(p[0]);
  const lng = parseFloat(p[1]);
  const kind = (p[2] || 'FIXED').trim();
  const lim = parseInt(p[3]) || 0;
  const active = p[5] ? p[5].trim() === '1' : true;
  const endLat = parseFloat(p[6]) || 0;
  const endLng = parseFloat(p[7]) || 0;

  if (!active || isNaN(lat) || isNaN(lng)) return;
  
  // Dedup key (arredondado para ~11m de precisão)
  const key = (lat).toFixed(4) + ',' + (lng).toFixed(4);
  if (seen.has(key)) return;
  seen.add(key);

  const r = [
    Math.round(lat * 1e5) / 1e5,
    Math.round(lng * 1e5) / 1e5,
    kind === 'SECTION' ? 'S' : kind === 'RED_LIGHT' ? 'R' : 'F',
    lim
  ];

  // Se for SECTION, adicionar ponto final
  if (kind === 'SECTION' && endLat && endLng) {
    r.push(Math.round(endLat * 1e5) / 1e5);
    r.push(Math.round(endLng * 1e5) / 1e5);
  }

  radars.push(r);
});

// ---- Mesclar dados OSM ----
if (fs.existsSync('osm_radars_raw.json')) {
  try {
    const osm = JSON.parse(fs.readFileSync('osm_radars_raw.json', 'utf8'));
    let added = 0;
    (osm.elements || []).forEach(el => {
      if (el.type !== 'node' || !el.lat || !el.lon) return;
      const key = el.lat.toFixed(4) + ',' + el.lon.toFixed(4);
      if (seen.has(key)) return;
      seen.add(key);

      const lim = parseInt(el.tags && el.tags.maxspeed) || 0;
      const enforcement = el.tags && el.tags.enforcement;
      const kind = enforcement === 'average_speed' ? 'S' :
                    (enforcement === 'red_light_camera' || enforcement === 'traffic_signals') ? 'R' : 'F';

      radars.push([
        Math.round(el.lat * 1e5) / 1e5,
        Math.round(el.lon * 1e5) / 1e5,
        kind,
        lim
      ]);
      added++;
    });
    console.log('OSM: +' + added + ' radares adicionados (não duplicados)');
  } catch (e) {
    console.warn('Erro ao processar OSM:', e.message);
  }
}

// ---- Estatísticas ----
const stats = { F: 0, S: 0, R: 0, withLim: 0 };
radars.forEach(r => {
  stats[r[2]]++;
  if (r[3] > 0) stats.withLim++;
});

console.log('=== RadarFlow Database ===');
console.log('Total: ' + radars.length + ' radares únicos');
console.log('Fixos: ' + stats.F);
console.log('Semáforo: ' + stats.R);
console.log('Vel. Média (SECTION): ' + stats.S);
console.log('Com limite: ' + stats.withLim);

// ---- Salvar JSON compacto ----
// Formato: { v: version, d: date, r: [[lat, lng, tipo, limite, ?endLat, ?endLng], ...] }
const output = {
  v: 1,
  d: new Date().toISOString().split('T')[0],
  c: radars.length,
  r: radars
};

const json = JSON.stringify(output);
fs.writeFileSync('radars.json', json);
console.log('Arquivo: radars.json (' + (json.length / 1024).toFixed(0) + ' KB)');

// ---- Verificar tamanho ----
// Se muito grande para carregar no celular, comprimir ou segmentar
if (json.length > 3 * 1024 * 1024) {
  console.log('AVISO: Arquivo muito grande! Considerar segmentar por estado.');
}
