// RARE QUEST — публичный каталог из Supabase

const SUPABASE_URL = 'https://fdlqpsktdbfvcogwegta.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Nhlq0ZCaRmde6DPgAlsKVA_iwNDgpMj';

const rqClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const fallback = [
  {
    id: 'demo1',
    title: 'Не отвечай после полуночи',
    genre: 'ПСИХОЛОГИЧЕСКИЙ ХОРРОР',
    description: 'Незнакомый номер пишет тебе каждую ночь. Сначала это кажется розыгрышем. Потом он называет то, чего знать не может.',
    duration: '30–45 МИН',
    age_limit: '16+',
    difficulty: 'СРЕДНИЙ'
  },
  {
    id: 'demo2',
    title: 'Дом на окраине',
    genre: 'МИСТИКА',
    description: 'Ты случайно попадаешь в общий чат жильцов заброшенного дома. Один из участников утверждает, что видит тебя.',
    duration: '40–60 МИН',
    age_limit: '16+',
    difficulty: 'СЛОЖНЫЙ'
  },
  {
    id: 'demo3',
    title: 'Последнее голосовое',
    genre: 'РЕАЛИСТИЧНЫЙ УЖАС',
    description: 'Подруга присылает голосовое сообщение, но утверждает, что телефон был выключен уже три дня.',
    duration: '25–35 МИН',
    age_limit: '14+',
    difficulty: 'ЛЁГКИЙ'
  }
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

let quests = fallback;

function applyDesign() {
  try {
    const d = JSON.parse(localStorage.getItem('rq_design') || '{}');

    if (d.heroTitle) document.querySelector('#heroTitle').textContent = d.heroTitle;
    if (d.heroSubtitle) document.querySelector('#heroSubtitle').textContent = d.heroSubtitle;
    if (d.centerTitle) document.querySelector('#centerTitle').textContent = d.centerTitle;
    if (d.aboutTitle) document.querySelector('#aboutTitle').textContent = d.aboutTitle;
    if (d.footerText) document.querySelector('#footerText').textContent = d.footerText;

    if (d.bgColor) document.documentElement.style.setProperty('--bg', d.bgColor);
    if (d.panelColor) document.documentElement.style.setProperty('--panel', d.panelColor);

    if (d.heroImage) {
      document.querySelector('.hero').style.backgroundImage =
        `linear-gradient(90deg,#100b09e8,#100b0955),url("${d.heroImage}")`;
    }

    if (d.ownersImage) document.querySelector('#ownersImage').src = d.ownersImage;
    if (d.heroHeight) document.querySelector('.hero').style.minHeight = d.heroHeight + 'px';

  } catch (e) {
    console.warn(e);
  }
}

function render() {
  const grid = document.querySelector('#questGrid');
  if (!grid) return;

  document.querySelector('#questCount').textContent =
    String(quests.length).padStart(2, '0') + ' ИСТОРИЙ';

  grid.innerHTML = quests.map(q => `
    <article class="quest-card">
      <span class="tag">${esc(q.genre || 'ХОРРОР')}</span>
      <h3>${esc(q.title)}</h3>
      <p>${esc(q.description || '')}</p>
      <div class="card-bottom">
        <span>${esc(q.duration || '—')} · ${esc(q.age_limit || '16+')}</span>
        <button data-id="${esc(q.id)}">ОТКРЫТЬ ↗</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-id]').forEach(b => {
    b.onclick = () => openQuest(b.dataset.id);
  });
}

function openQuest(id) {
  const q = quests.find(x => String(x.id) === String(id));
  if (!q) return;

  document.querySelector('#modalGenre').textContent = q.genre || 'ХОРРОР';
  document.querySelector('#modalTitle').textContent = q.title;
  document.querySelector('#modalDesc').textContent = q.description || '';
  document.querySelector('#modalMeta').textContent =
    [q.duration, q.age_limit, q.difficulty].filter(Boolean).join(' · ');

  document.querySelector('#questModal').classList.add('open');
}

document.querySelector('#closeModal').onclick = () => {
  document.querySelector('#questModal').classList.remove('open');
};

document.querySelector('#questModal').onclick = e => {
  if (e.target.id === 'questModal') {
    e.currentTarget.classList.remove('open');
  }
};

document.querySelector('#startQuest').onclick = () => {
  alert('Игровая переписка будет подключена следующим этапом.');
};

async function load() {
  try {
    const { data, error } = await rqClient
      .from('quests')
      .select('id,title,description,genre,duration,age_limit,difficulty,is_published,sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    if (data && data.length) {
      quests = data;
    } else {
      quests = [];
    }

  } catch (e) {
    console.error('Supabase:', e.message);
    quests = fallback;
    document.querySelector('#questCount').textContent = 'ДЕМО-РЕЖИМ';
  }

  render();
}

applyDesign();
load();
