
// Настройки визуального редактора (локальное сохранение в этом браузере).
try {
 const d=JSON.parse(localStorage.getItem('rq_design')||'{}');
 if(d.heroTitle) document.querySelector('#heroTitle').innerHTML=d.heroTitle;
 if(d.heroSubtitle) document.querySelector('#heroSubtitle').textContent=d.heroSubtitle;
 if(d.centerTitle) document.querySelector('#centerTitle').textContent=d.centerTitle;
 if(d.aboutTitle) document.querySelector('#aboutTitle').innerHTML=d.aboutTitle;
 if(d.footerText) document.querySelector('#footerText').textContent=d.footerText;
 if(d.bgColor) document.documentElement.style.setProperty('--bg',d.bgColor);
 if(d.panelColor) document.documentElement.style.setProperty('--panel',d.panelColor);
 if(d.heroImage) document.querySelector('.hero').style.backgroundImage=`linear-gradient(90deg,#100b09e8,#100b0955),url("${d.heroImage}")`;
 if(d.ownersImage) document.querySelector('#ownersImage').src=d.ownersImage;
 if(d.heroHeight) document.querySelector('.hero').style.minHeight=d.heroHeight+'px';
} catch(e) { console.warn('Не удалось применить оформление',e); }
const defaults=[
{id:'q1',title:'Не отвечай после полуночи',genre:'ПСИХОЛОГИЧЕСКИЙ ХОРРОР',desc:'Незнакомый номер пишет тебе каждую ночь. Сначала это кажется розыгрышем. Потом он называет то, чего знать не может.',time:'30–45 МИН',age:'16+',level:'СРЕДНИЙ'},
{id:'q2',title:'Дом на окраине',genre:'МИСТИКА',desc:'Ты случайно попадаешь в общий чат жильцов заброшенного дома. Один из участников утверждает, что видит тебя.',time:'40–60 МИН',age:'16+',level:'СЛОЖНЫЙ'},
{id:'q3',title:'Последнее голосовое',genre:'РЕАЛИСТИЧНЫЙ УЖАС',desc:'Подруга присылает голосовое сообщение, но утверждает, что телефон был выключен уже три дня.',time:'25–35 МИН',age:'14+',level:'ЛЁГКИЙ'}];
const getQuests=()=>{try{return JSON.parse(localStorage.getItem('rq_quests'))||defaults}catch{return defaults}};
function render(){const qs=getQuests();document.querySelector('#questCount').textContent=String(qs.length).padStart(2,'0')+' ИСТОРИЙ';document.querySelector('#questGrid').innerHTML=qs.map(q=>`<article class="quest-card"><span class="tag">${esc(q.genre||'ХОРРОР')}</span><h3>${esc(q.title)}</h3><p>${esc(q.desc)}</p><div class="card-bottom"><span>${esc(q.time||'—')} · ${esc(q.age||'16+')}</span><button data-id="${esc(q.id)}">ОТКРЫТЬ ↗</button></div></article>`).join('');document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openQuest(b.dataset.id))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openQuest(id){const q=getQuests().find(x=>x.id===id);if(!q)return;document.querySelector('#modalGenre').textContent=q.genre||'ХОРРОР';document.querySelector('#modalTitle').textContent=q.title;document.querySelector('#modalDesc').textContent=q.desc;document.querySelector('#modalMeta').textContent=[q.time,q.age,q.level].filter(Boolean).join(' · ');document.querySelector('#questModal').classList.add('open')}
document.querySelector('#closeModal').onclick=()=>document.querySelector('#questModal').classList.remove('open');document.querySelector('#questModal').onclick=e=>{if(e.target.id==='questModal')e.currentTarget.classList.remove('open')};document.querySelector('#startQuest').onclick=()=>alert('Скоро здесь появится интерактивная переписка. Сейчас это демонстрационная версия сайта.');render();