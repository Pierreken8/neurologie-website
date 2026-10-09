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
    found: 'Verschillen in beloningsgebied bij frequente kijkers.',
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

function scrollToCanvasIfNeeded() {
  if (window.innerWidth < 900) {
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      canvasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

const xy = k => [POS[k][0] * W, POS[k][1] * H];

function draw() {
  ctx.clearRect(0, 0, W, H);
  
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

  if (current && ACTS[current]) {
    const targetKey = ACTS[current].target;
    const [x1, y1] = xy('visual');
    const [x2, y2] = xy(targetKey);
    const numDots = 4;

    for (let i = 0; i < numDots; i++) {
      const p = ((t / 120) + (i / numDots)) % 1;
      const px = x1 + (x2 - x1) * p;
      const py = y1 + (y2 - y1) * p;

      ctx.fillStyle = 'rgba(96, 165, 250, 0.25)';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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

function showActivity(key, triggerScroll = false) {
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

  if (triggerScroll) {
    scrollToCanvasIfNeeded();
  }
}

function showRegion(key, triggerScroll = false) {
  current = null;
  document.querySelectorAll('.btn-activity').forEach(b => b.classList.remove('active'));
  const r = REGIONS[key];
  setText('activityBadge', r.name);
  
  const info = document.getElementById('dynamicInfo');
  info.innerHTML = '';
  const h = document.createElement('h4'); h.textContent = r.name;
  info.appendChild(h); info.appendChild(document.createTextNode(r.text));
  
  setText('sourceLine', ''); 

  if (triggerScroll) {
    scrollToCanvasIfNeeded();
  }
}

document.querySelectorAll('.btn-activity').forEach(b => {
  b.addEventListener('click', () => showActivity(b.dataset.act, true));
});

document.querySelectorAll('.region-item').forEach(el => {
  el.addEventListener('click', () => showRegion(el.dataset.region, true));
});

canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  Object.keys(POS).forEach(k => { 
    const [x, y] = xy(k); 
    if (Math.hypot(mx - x, my - y) < 25) showRegion(k, false); 
  });
});

window.addEventListener('resize', resize);

resize();
showActivity('tiktok', false);

const baseQuizBank = [
  {
    q: "Wat ontdekten onderzoekers (Hunter 2019) over de invloed van tijd doorbrengen in de natuur op stress?",
    opts: [
      "Het stresshormoon cortisol daalt aantoonbaar, vooral tussen 20 en 30 minuten.",
      "Het heeft pas effect als je minimaal 5 uur onafgebroken in een bos bent.",
      "In de natuur stijgt het stresshormoon juist door omgevingsprikkels.",
      "Er is wetenschappelijk geen enkel effect gemeten."
    ],
    ans: 0,
    exp: "Onderzoekers zagen dat speekselcortisol snel afneemt tijdens een natuurervaring, waarbij de daling per minuut het krachtigst is in het eerste half uur."
  },
  {
    q: "Hoeveel procent van het welzijn van jongeren wordt volgens grootschalig onderzoek (Orben & Przybylski) verklaard door alleen het aantal uren schermtijd?",
    opts: [
      "Hooguit 0,4%",
      "Ongeveer 35%",
      "Ruim 75%",
      "Precies 15%"
    ],
    ans: 0,
    exp: "Uit de data blijkt dat louter het aantal uren op een scherm nauwelijks invloed heeft op welzijn. Hoe en wanneer schermen worden gebruikt, is veel bepalender."
  },
  {
    q: "Wat ontdekten onderzoekers (Carter 2016) over schermgebruik vlak voor het slapengaan?",
    opts: [
      "Het hangt samen met kortere slaap en een hogere kans op een slechte slaapkwaliteit.",
      "Het zorgt er juist voor dat mensen dubbel zo diep slapen.",
      "Het heeft alleen effect op computers, niet op telefoons.",
      "Er werd geen enkel verband met slaap gevonden."
    ],
    ans: 0,
    exp: "Wie dagelijks schermen gebruikt direct voor het bedtijd, slaopt gemiddeld korter en meldt vaker een verstoorde nachtrust."
  },
  {
    q: "Wat gebeurt er in het brein wanneer iemand gepersonaliseerde video's bekijkt (Su 2021)?",
    opts: [
      "Het beloningsgebied (VTA) wordt actiever bij video's op maat.",
      "Het gezichtsvermogen neemt tijdelijk met 10% af.",
      "Het gehoorcentrum schakelt zichzelf volledig uit.",
      "Er is geen verschil met willekeurige video's."
    ],
    ans: 0,
    exp: "Op fMRI-scans zagen onderzoekers dat video's die specifiek op het individuele kijkerprofiel zijn afgestemd, het Ventrale Tegmentale Area (VTA) sterker stimuleren."
  },
  {
    q: "Wat lieten fMRI-scans bij gamers zien in het onderzoek van Koepp (1998)?",
    opts: [
      "Aanwijzingen voor dopamine-afgifte in het beloningscentrum tijdens het spelen.",
      "Dat het brein stopt met het verwerken van visuele informatie.",
      "Een directe stijging van het stresshormoon met 300%.",
      "Dat gamen geen enkele reactie in de hersenen oproept."
    ],
    ans: 0,
    exp: "In dit experiment werd een daling in raclopride-binding gemeten, wat wijst op de vrijgave van dopamine in het ventrale striatum tijdens het spelen."
  },
  {
    q: "Wat is de voornaamste taak van de Visuele Cortex (het Ogen-centrum)?",
    opts: [
      "Het verwerken van licht en binnenkomende beelden van de ogen.",
      "Het sturen van de spieren in je benen.",
      "Het opslaan van herinneringen uit je vroege jeugd.",
      "Het regelen van je hartslag."
    ],
    ans: 0,
    exp: "De visuele cortex ligt achterin het brein en verwerkt alle visuele informatie die via de netvliezen binnenkomt."
  },
  {
    q: "Welke functie vervult de Amygdala (het Alarmcentrum) in onze hersenen?",
    opts: [
      "Het verwerken van emoties zoals schrik, angst en stressresponsen.",
      "Het berekenen van moeilijke wiskundige formules.",
      "Het controleren van je ademhaling tijdens de slaap.",
      "Het proeven van smaken op je tong."
    ],
    ans: 0,
    exp: "De Amygdala speelt een sleutelrol bij het detecteren van mogelijke dreiging en het activeren van emotionele reacties."
  },
  {
    q: "Waarvoor is de Prefrontale Cortex (het Denkcentrum) voornamelijk verantwoordelijk?",
    opts: [
      "Planning, concentratie, besluitvorming en zelfbeheersing.",
      "Het herkennen van geuren.",
      "Het verteren van voedsel in de maag.",
      "Het aansturen van de reflexen in je knie."
    ],
    ans: 0,
    exp: "Dit voorste deel van de hersenen helpt bij het nemen van verstandige beslissingen en het onderdrukken van spontane impulsen."
  },
  {
    q: "Wat is de biologische rol van de stof 'dopamine' in ons zenuwstelsel?",
    opts: [
      "Het speelt een rol bij motivatie, leergedrag en het verwachten van een beloning.",
      "Het is een stofje dat je direct in diepe slaap brengt.",
      "Het ruimt bacteriën op in de bloedbaan.",
      "Het zorgt ervoor dat je spieren niet vermoeid raken."
    ],
    ans: 0,
    exp: "Dopamine is een neurotransmitter die gedrag stimuleert door het vooruitzicht op een beloning aantrekkelijk te maken."
  },
  {
    q: "Wat zagen onderzoekers bij onderzoeken naar frequente gebruikers van dating-apps (meta-analyse 2026)?",
    opts: [
      "Een klein tot middelgroot verband met meer spanning of onzekerheid over uiterlijk.",
      "Dat gebruikers automatisch een beter geheugen krijgen.",
      "Dat alle gebruikers binnen een week trouwen.",
      "Geen enkel verschil op welk vlak dan ook."
    ],
    ans: 0,
    exp: "Uit de gepoolde onderzoeken bleek dat frequent swipe-gebruik samenhangt met iets meer gevoeligheid voor sociale evaluatie en spanning."
  },
  {
    q: "Wat benadrukken onderzoekers bij fMRI-studies naar frequent kijken naar +18 beelden (Kühn 2014)?",
    opts: [
      "Dat een gemeten verschil in breinstructuur niet automatisch betekent dat de beelden de oorzaak zijn.",
      "Dat het kijken naar beelden de hersenen fysiek doet smelten.",
      "Dat fMRI-scans nooit betrouwbaar zijn.",
      "Dat de oorzaak 100% vaststaat."
    ],
    ans: 0,
    exp: "De onderzoekers gaven expliciet aan dat een correlatie (samenhang) geen causaal (oorzakelijk) bewijs is."
  },
  {
    q: "Wat betekent het als een wetenschappelijke studie een 'correlatie' aantoont?",
    opts: [
      "Dat twee dingen samenhangen, maar dat het ene niet per se de directe oorzaak is van het andere.",
      "Dat het bewijs 100% onomstotelijk vaststaat voor iedereen.",
      "Dat het onderzoek mislukt is.",
      "Dat de uitkomst alleen geldt voor dieren."
    ],
    ans: 0,
    exp: "Correlatie geeft aan dat variabelen samen bewegen, maar om oorzaak en gevolg te bewijzen is experimenteel vervolgonderzoek nodig."
  },
  {
    q: "Wat is het voordeel van een schermvrij uur voordat je gaat slapen?",
    opts: [
      "Het geeft je zenuwstelsel de tijd om tot rust te komen zonder constante nieuwe prikkels.",
      "Het zorgt ervoor dat je telefoon batterij bespaart.",
      "Het wist automatisch vervelende herinneringen van de dag.",
      "Het verhoogt je lichaamstemperatuur."
    ],
    ans: 0,
    exp: "Door voor het slapen geen felle lichtprikkels en continue informatie te verwerken, kan het brein gemakkelijker omschakelen naar de rustmodus."
  },
  {
    q: "Waarom kijken wetenschappers bij hersenonderzoek naar grote groepen mensen?",
    opts: [
      "Omdat individuele verschillen groot zijn en trends pas bij groepen betrouwbaar zichtbaar worden.",
      "Omdat het minder tijd kost dan 1 persoon testen.",
      "Omdat alle mensen exact hetzelfde brein hebben.",
      "Dat is een wettelijke verplichting zonder reden."
    ],
    ans: 0,
    exp: "Wetenschap zoekt naar algemene patronen. Wat voor een hele groep geldt, hoeft niet voor elk individueel persoon op te gaan."
  },
  {
    q: "Wat ontdekten onderzoekers (Nguyen 2025) bij een meta-analyse onder 98.000 mensen over korte video's?",
    opts: [
      "Frequent gebruik hangt gemiddeld samen met wat meer moeite met langdurige concentratie.",
      "Korte video's verhogen het IQ gemiddeld met 20 punten.",
      "Er is geen enkel verband gevonden met aandacht of focus.",
      "Korte video's werken beter dan 8 uur slaap."
    ],
    ans: 0,
    exp: "Wie heel intensief short-form video's consumeert en er moeilijk mee kan stoppen, vertoont gemiddeld wat meer moeite met het vasthouden van de aandacht."
  }
];

let quizPool = [];
let currentQuizIndex = 0;
let userScore = 0;

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startNewQuiz() {
  quizPool = shuffle(baseQuizBank).slice(0, 15);
  currentQuizIndex = 0;
  userScore = 0;

  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  const item = quizPool[currentQuizIndex];
  document.getElementById('quizProgress').innerText = `Vraag ${currentQuizIndex + 1} van ${quizPool.length}`;
  document.getElementById('quizQuestion').innerText = item.q;

  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  document.getElementById('quizFeedback').style.display = 'none';

  const mappedOptions = item.opts.map((optText, origIdx) => ({
    text: optText,
    isCorrect: origIdx === item.ans
  }));
  const shuffledOptions = shuffle(mappedOptions);

  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerText = opt.text;
    btn.onclick = () => handleAnswer(opt.isCorrect, btn);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(isCorrect, clickedBtn) {
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    userScore++;
  } else {
    clickedBtn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.innerText === quizPool[currentQuizIndex].opts[0]) {
        b.classList.add('correct');
      }
    });
  }

  document.getElementById('quizExplanation').innerHTML = `<strong>Uitleg:</strong> ${quizPool[currentQuizIndex].exp}`;
  document.getElementById('quizFeedback').style.display = 'block';
}

document.getElementById('btnNextQuestion').addEventListener('click', () => {
  currentQuizIndex++;
  if (currentQuizIndex < quizPool.length) {
    renderQuestion();
  } else {
    displayScoreboard();
  }
});

function displayScoreboard() {
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';

  // Emoticon element verbergen als het aanwezig is
  const badgeIcon = document.getElementById('scoreBadgeIcon');
  if (badgeIcon) {
    badgeIcon.style.display = 'none';
  }

  document.getElementById('finalScoreVal').innerText = `${userScore} / ${quizPool.length}`;

  let rank = 'Beginner';
  let title = 'Resultaat Voltooid';
  let insight = 'Je hebt de basis van de wetenschap over het brein verkend. Doe de quiz gerust nog een keer om nieuwe vragen te ontdekken!';

  const pct = (userScore / quizPool.length) * 100;

  if (pct >= 85) {
    rank = 'Neurowetenschapper';
    title = 'Uitstekend Begrip!';
    insight = 'Indrukwekkend! Je hebt een uitstekend inzicht in hoe het zenuwstelsel reageert op prikkels, slaap en de natuur.';
  } else if (pct >= 60) {
    rank = 'Onderzoeker';
    title = 'Mooie Prestatie!';
    insight = 'Je begrijpt de belangrijkste principes van het brein en de onderzoeksresultaten heel goed.';
  } else if (pct >= 40) {
    rank = 'Verkenner';
    title = 'Goede Basis!';
    insight = 'Je hebt al een solide basiskennis opgebouwd over de werking van het zenuwstelsel.';
  }

  document.getElementById('scoreTitle').innerText = title;
  document.getElementById('finalRankVal').innerText = rank;
  document.getElementById('scoreInsight').innerText = insight;
}

document.getElementById('btnRestartQuiz').addEventListener('click', startNewQuiz);

startNewQuiz();
requestAnimationFrame(draw);