// Wetenschappelijke teksten gebaseerd op de onderzoeken
const NOTE = 'Onderzoekers zien dit bij groepen mensen. Dit beschrijft een verband bij groepen, geen direct oorzakelijk verband voor elk individu.';
const ACTS = {
  tiktok: {
    badge: 'Korte filmpjes', target: 'dopamine',
    title: 'Korte filmpjes kijken',
    text: 'Onderzoekers vergeleken mensen die heel veel korte filmpjes kijken met mensen die dat minder doen. Wie veel kijkt, kan zich gemiddeld wat moeilijker concentreren. Dat zagen ze bij tieners en bij volwassenen. Ook werd het beloningsgebied in het brein actiever bij filmpjes die speciaal voor iemand waren gekozen.',
    found: 'Wie veel kijkt, kan zich gemiddeld moeilijker concentreren.',
    measured: 'Onderzoek met meer dan 98.000 mensen.',
    stress: 'Wie veel kijkt, voelt zich gemiddeld wat vaker gespannen.',
    unit: NOTE + ' Het effect hangt vooral samen met moeite hebben om te stoppen.',
    source: 'Bron: Nguyen et al. 2025 en Su et al. 2021.'
  },
  swipen: {
    badge: 'Dating-app', target: 'dopamine',
    title: 'Swipen op een dating-app',
    text: 'Onderzoekers vergeleken mensen die zulke apps gebruiken met mensen die dat niet doen. Gebruikers voelden zich gemiddeld iets vaker gespannen of onzeker over hun uiterlijk, en sommigen vonden het moeilijk om te stoppen. Voor hoe tevreden mensen zijn met hun leven was er geen duidelijk verschil.',
    found: 'Klein tot middelgroot verschil tussen gebruikers en niet-gebruikers.',
    measured: '27 onderzoeken samen, ruim 21.000 mensen.',
    stress: 'Gebruikers voelden zich gemiddeld iets vaker gespannen.',
    unit: NOTE,
    source: 'Bron: meta-analyse in Communications Psychology, 2026.'
  },
  bedscherm: {
    badge: 'Scherm voor het slapen', target: 'pfc',
    title: 'Een scherm vlak voor het slapen',
    text: 'Onderzoekers vroegen meer dan 122.000 volwassenen naar hun schermgebruik vlak voor het slapen. Wie dat elke dag deed, sliep gemiddeld korter (ongeveer 48 minuten korter per week) en had ongeveer een derde vaker last van slecht slapen. Dit gold voor alle soorten schermen.',
    found: 'Schermgebruik rond bedtijd hing samen met kortere en slechtere slaap.',
    measured: 'Onderzoek met meer dan 125.000 jongeren en volwassenen.',
    stress: 'Niet onderzocht.',
    unit: NOTE + ' Het onderzoek keek specifiek naar schermgebruik direct voor het slapengaan.',
    source: 'Bron: Carter et al. 2016.'
  },
  gamen: {
    badge: 'Gamen', target: 'dopamine',
    title: 'Gamen',
    text: 'In een klein onderzoek speelden mensen een videospel terwijl hun brein werd gescand. Onderzoekers zagen aanwijzingen dat het beloningsgebied meer dopamine afgaf, vooral bij wie beter speelde. Dopamine is een stofje dat te maken heeft met motivatie.',
    found: 'Bij één specifiek spel zagen onderzoekers aanwijzingen voor dopamine-afgifte.',
    measured: 'Klein experimenteel onderzoek (1998) met één game.',
    stress: 'Niet onderzocht.',
    unit: NOTE,
    source: 'Bron: Koepp et al. 1998.'
  },
  plus18: {
    badge: 'Beelden +18', target: 'dopamine',
    title: 'Beelden voor volwassenen (+18)',
    text: 'Onderzoekers keken naar volwassen mannen die veel of weinig van zulke beelden bekeken. Bij wie meer keek, was een deel van het beloningsgebied gemiddeld kleiner en reageerde het minder sterk op zulke beelden. Bij mannen die hulp zochten vanwege moeite met stoppen, reageerde het beloningsgebied juist sterker op aankondigende signalen.',
    found: 'Verschillen in beloningsgebied bij frequente kijkers; oorzakelijk verband is onbekend.',
    measured: '64 volwassen mannen met hersenscans, aangevuld met fMRI-vervolgonderzoek.',
    stress: 'Niet onderzocht.',
    unit: NOTE,
    source: 'Bron: Kühn & Gallinat 2014 en Gola et al. 2017.'
  },
  natuur: {
    badge: 'Buiten in de natuur', target: 'amygdala',
    title: 'Tijd in de natuur',
    text: 'Mensen uit de stad gingen een tijd naar buiten, de natuur in. Daarna hadden ze minder van het stresshormoon cortisol in hun speeksel. Het effect per minuut was het sterkst tussen 20 en 30 minuten exposure.',
    found: 'Tijd in de natuur leidde tot een meetbare daling van het stresshormoon.',
    measured: '36 personen, 8 weken lang gevolgd met speekseltesten.',
    stress: 'Het cortisolniveau nam aantoonbaar af.',
    unit: NOTE + ' Het effect per minuut werkte het sterkst tussen 20 en 30 minuten.',
    source: 'Bron: Hunter et al. 2019 en Yao et al. 2021.'
  }
};

const REGIONS = {
  visual:   { name: 'Ogen-centrum', text: 'Hier worden de beelden van je ogen verwerkt.' },
  dopamine: { name: 'Beloningscentrum', text: 'Dit deel speelt mee als je iets leuks of spannends doet.' },
  amygdala: { name: 'Alarmcentrum', text: 'Dit deel speelt mee bij gevoelens zoals schrik en angst.' },
  pfc:      { name: 'Denkcentrum', text: 'Dit deel helpt je plannen, opletten en jezelf afremmen.' }
};

const COLORS = { visual: '#38bdf8', dopamine: '#34d399', amygdala: '#f87171', pfc: '#c084fc' };
const POS = { visual: [0.15, 0.5], dopamine: [0.45, 0.22], pfc: [0.84, 0.5], amygdala: [0.42, 0.80] };
const EDGES = [['visual', 'dopamine'], ['dopamine', 'pfc'], ['pfc', 'amygdala'], ['amygdala', 'visual']];

const canvas = document.getElementById('neuroCanvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, current = null, t = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const r = canvas.getBoundingClientRect();
  W = r.width || 300; H = r.height || 280;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const xy = k => [POS[k][0] * W, POS[k][1] * H];

function draw() {
  ctx.clearRect(0, 0, W, H);
  
  // Breinnetwerk verbindingen
  EDGES.forEach(([a, b]) => {
    const [x1, y1] = xy(a), [x2, y2] = xy(b);
    const isTarget = current && ACTS[current] && (ACTS[current].target === a || ACTS[current].target === b);
    
    ctx.strokeStyle = isTarget ? '#4a525d' : '#272b2f'; 
    ctx.lineWidth = isTarget ? 2 : 1.5;
    ctx.beginPath(); 
    ctx.moveTo(x1, y1); 
    ctx.lineTo(x2, y2); 
    ctx.stroke();
  });

  // Geanimeerde signaalstippen over de actieve zenuwbaan
  if (current && ACTS[current]) {
    const targetKey = ACTS[current].target;
    const [x1, y1] = xy('visual');
    const [x2, y2] = xy(targetKey);
    const numDots = 4;

    for (let i = 0; i < numDots; i++) {
      const p = ((t / 120) + (i / numDots)) % 1;
      const px = x1 + (x2 - x1) * p;
      const py = y1 + (y2 - y1) * p;

      // Glow effect rond stippen
      ctx.fillStyle = 'rgba(96, 165, 250, 0.25)';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      // Kern van de signaalstip
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Breinregio punten (Nodes)
  Object.keys(POS).forEach(k => {
    const [x, y] = xy(k);
    const isTarget = current && ACTS[current] && ACTS[current].target === k;

    if (isTarget) {
      ctx.fillStyle = COLORS[k] + '33';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = COLORS[k]; 
    ctx.beginPath(); 
    ctx.arc(x, y, isTarget ? 10 : 8, 0, Math.PI * 2); 
    ctx.fill();

    ctx.fillStyle = isTarget ? '#f0f2f5' : '#9ea7b0'; 
    ctx.font = (isTarget ? '600' : '500') + ' 11px Inter, sans-serif'; 
    ctx.textAlign = 'center';
    ctx.fillText(REGIONS[k].name, x, y + 24);
  });

  t++;
  requestAnimationFrame(draw);
}

function setText(id, v) { document.getElementById(id).textContent = v; }

function showActivity(key) {
  const a = ACTS[key]; current = key;
  document.querySelectorAll('.btn-activity').forEach(b => b.classList.toggle('active', b.dataset.act === key));
  setText('activityBadge', a.badge);
  
  const info = document.getElementById('dynamicInfo');
  info.innerHTML = '';
  const h = document.createElement('h4'); h.textContent = a.title;
  info.appendChild(h); info.appendChild(document.createTextNode(a.text));
  
  setText('dopamineVal', a.found); 
  setText('fatigueVal', a.measured); 
  setText('stressVal', a.stress);
  setText('unitNote', a.unit); 
  setText('sourceLine', a.source);
}

function showRegion(key) {
  current = null;
  document.querySelectorAll('.btn-activity').forEach(b => b.classList.remove('active'));
  const r = REGIONS[key];
  setText('activityBadge', r.name);
  
  const info = document.getElementById('dynamicInfo');
  info.innerHTML = '';
  const h = document.createElement('h4'); h.textContent = r.name;
  info.appendChild(h); info.appendChild(document.createTextNode(r.text));
  
  setText('sourceLine', ''); 
}

document.querySelectorAll('.btn-activity').forEach(b => b.addEventListener('click', () => showActivity(b.dataset.act)));
document.querySelectorAll('.region-item').forEach(el => el.addEventListener('click', () => showRegion(el.dataset.region)));

canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  Object.keys(POS).forEach(k => { 
    const [x, y] = xy(k); 
    if (Math.hypot(mx - x, my - y) < 25) showRegion(k); 
  });
});

window.addEventListener('resize', resize);

resize();
showActivity('tiktok');
requestAnimationFrame(draw);