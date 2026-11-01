const quests = [
 {title:"Падение",genre:"Психологический хоррор",desc:"Обычный вечер оборачивается цепочкой сообщений, которые лучше было не открывать. Чем дальше ты заходишь, тем сложнее понять, кто говорит правду.",time:"30–45 минут",age:"16+",level:"Средняя"},
 {title:"Поезд мёртвых",genre:"Мистика · расследование",desc:"Ты получаешь странное сообщение от пассажира поезда, которого, кажется, не существует. Попробуй разобраться, пока состав не прибыл на конечную.",time:"40–60 минут",age:"16+",level:"Сложная"},
 {title:"Кто ты?",genre:"Переписка с незнакомцем",desc:"Незнакомец знает о тебе слишком много. Но откуда? И почему он так настойчиво просит не оборачиваться?",time:"25–40 минут",age:"16+",level:"Средняя"},
 {title:"Поклонник",genre:"Реалистичная страшная история",desc:"Сначала это кажется милым вниманием. Потом подарки становятся страннее, а сообщения — всё более личными.",time:"35–50 минут",age:"16+",level:"Средняя"},
 {title:"Последнее желание",genre:"Детектив · несколько концовок",desc:"У тебя есть несколько зацепок и слишком мало времени. Каждое решение меняет ход истории.",time:"45–70 минут",age:"16+",level:"Сложная"},
 {title:"Безликое Проклятие",genre:"Мистика · сериал",desc:"В старом чате появляется участник без имени и фотографии. Он пишет так, будто давно тебя знает.",time:"50–70 минут",age:"16+",level:"Сложная"},
 {title:"Сладость или Гадость?",genre:"Хоррор · несколько персонажей",desc:"Ночная прогулка превращается в игру, правила которой никто не объяснил. Не всем удастся дойти до конца.",time:"30–45 минут",age:"14+",level:"Средняя"}
];
const grid=document.querySelector("#questGrid");
quests.forEach((q,i)=>{
 const card=document.createElement("button");card.className="quest-card";
 card.innerHTML=`<div class="quest-art"></div><div class="quest-info"><small>${String(i+1).padStart(2,"0")} / ${q.genre}</small><h3>${q.title}</h3><p>${q.desc.slice(0,92)}…</p></div><span class="card-arrow">↗</span>`;
 card.addEventListener("click",()=>openQuest(q));grid.appendChild(card);
});
const modal=document.querySelector("#questModal");
function openQuest(q){
 document.querySelector("#detailGenre").textContent=q.genre;
 document.querySelector("#detailTitle").textContent=q.title;
 document.querySelector("#detailDescription").textContent=q.desc;
 document.querySelector("#detailMeta").innerHTML=`<span>◷ ${q.time}</span><span>Возраст: ${q.age}</span><span>Сложность: ${q.level}</span>`;
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeQuest(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",closeQuest));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeQuest()});
document.querySelector("#startQuest").addEventListener("click",()=>alert("Это демонстрация оформления. Чтобы начать настоящий квест, нужно подключить регистрацию, базу данных и чат с живым ведущим."));
