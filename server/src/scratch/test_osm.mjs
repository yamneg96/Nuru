const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:10000,9.03,38.75);node["amenity"="clinic"](around:10000,9.03,38.75);node["amenity"="pharmacy"](around:10000,9.03,38.75););out body;`;

const mirrors = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

for (const url of mirrors) {
  try {
    console.log(`Trying: ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*', 'User-Agent': 'NuruApp/1.0' },
      body: 'data=' + encodeURIComponent(query),
    });
    console.log('Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Elements found:', data.elements?.length);
      data.elements?.slice(0, 5).forEach(el => {
        console.log(`  ${el.tags?.name || '(unnamed)'} | ${el.tags?.amenity}`);
      });
      break;
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
