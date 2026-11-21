/* СТУДЕНТ & ТРУД KZ. Браузерный интерактив без серверов, регистрации и API-ключей. */
(() => {
'use strict';
const KEY = 'studentLaborKzV1';
const LAW = 'https://adilet.zan.kz/rus/docs/K1500000414';
const DEFAULT = {theme:'light',color:'#123d35',background:null,pattern:'none',caught:0,best:0,helper:0,quiz:0,badges:[],checklist:[]};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
let state;
try { const obj=JSON.parse(localStorage.getItem(KEY)||'{}'); state={...DEFAULT,...obj}; if(!Array.isArray(state.badges))state.badges=[];if(!Array.isArray(state.checklist))state.checklist=[]; }
catch(e){state={...DEFAULT};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){ /* private mode */ }}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimeout;
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('show'),2900);}
const accentMap={'#123d35':'#8dd8b5','#4052a4':'#b9c1ff','#a85e79':'#f4c2d2','#835d44':'#e8c5a9','#166f85':'#a2e2ef','#6751a2':'#cfc3ff'};
function tint(hex){const c=hex.replace('#','');if(!/^[0-9a-f]{6}$/i.test(c))return '#8dd8b5';return '#'+[0,2,4].map(i=>Math.round(parseInt(c.slice(i,i+2),16)*.4+255*.6).toString(16).padStart(2,'0')).join('');}
function applyStyle(){
 const color=/^#[0-9a-f]{6}$/i.test(state.color)?state.color:DEFAULT.color;
 document.body.style.setProperty('--p',color);
 document.body.style.setProperty('--a',accentMap[color.toLowerCase()]||tint(color));
 document.body.dataset.theme=state.theme==='dark'?'dark':'light';
 document.body.dataset.wallpaper=['none','documents','notebook','grid','dots'].includes(state.pattern)?state.pattern:'none';
 if(state.background && /^#[0-9a-f]{6}$/i.test(state.background)){
  document.body.style.setProperty('--custom-bg',state.background);
  document.body.style.setProperty('--user-bg',state.background);
  document.body.dataset.userBg='yes';
 }else{
  document.body.style.removeProperty('--custom-bg'); document.body.style.removeProperty('--user-bg');delete document.body.dataset.userBg;
 }
 $$('#swatches .swatch').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.color.toLowerCase()===color.toLowerCase())));
 $$('#patterns .smallbtn').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.pattern===state.pattern)));
 if($('#custom-color'))$('#custom-color').value=color;
 if($('#bg-color'))$('#bg-color').value=state.background||(state.theme==='dark'?'#101d19':'#f7f9f6');
 if($('#theme-toggle'))$('#theme-toggle').textContent=state.theme==='dark'?'☀️':'◐';
}
applyStyle();
const menu=$('#site-nav'),burger=$('#menu-toggle'),panel=$('#palette-panel'),pal=$('#palette-toggle');
burger?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));burger.textContent=open?'✕':'☰';});
$$('.nav a').forEach(n=>n.addEventListener('click',()=>{menu?.classList.remove('open');burger?.setAttribute('aria-expanded','false');}));
function openPalette(open){if(!panel)return;const want=typeof open==='boolean'?open:panel.hidden;panel.hidden=!want;pal?.setAttribute('aria-expanded',String(want));if(want)$('#palette-close')?.focus();}
pal?.addEventListener('click',()=>openPalette());$('#palette-close')?.addEventListener('click',()=>openPalette(false));
$('#home-palette')?.addEventListener('click',()=>openPalette(true));$('#play-palette')?.addEventListener('click',()=>openPalette(true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel?.hidden)openPalette(false);});
document.addEventListener('click',e=>{if(panel&&!panel.hidden&&!panel.contains(e.target)&&!pal?.contains(e.target)&&!e.target.closest?.('#home-palette,#play-palette'))openPalette(false);});
$('#theme-toggle')?.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';save();applyStyle();toast(state.theme==='dark'?'Тёмная тема включена 🌙':'Светлая тема включена ☀️');});
$$('#swatches .swatch').forEach(n=>n.addEventListener('click',()=>{state.color=n.dataset.color;save();applyStyle();toast('Цвет изменён 🎨');}));
$('#custom-color')?.addEventListener('input',e=>{state.color=e.target.value;save();applyStyle();});
$('#bg-color')?.addEventListener('input',e=>{state.background=e.target.value;save();applyStyle();});
$$('#patterns .smallbtn').forEach(n=>n.addEventListener('click',()=>{state.pattern=n.dataset.pattern;save();applyStyle();toast('Обои установлены 📓');}));
$('#reset-style')?.addEventListener('click',()=>{Object.assign(state,{theme:'light',color:DEFAULT.color,pattern:'none',background:null});save();applyStyle();toast('Исходный дизайн восстановлен');});
function renderBadges(){let num=0;$$('.achievement').forEach(n=>{let yes=state.badges.includes(n.dataset.badge);n.classList.toggle('unlocked',yes);n.setAttribute('aria-label',(yes?'Награда получена: ':'Награда не получена: ')+(n.querySelector('b')?.textContent||''));if(yes)num++;});if($('#badge-count'))$('#badge-count').textContent=state.badges.length+'/5';}
function updateCounters(){if($('#home-helper'))$('#home-helper').textContent=state.helper;if($('#home-quiz'))$('#home-quiz').textContent=state.quiz;if($('#home-badges'))$('#home-badges').textContent=state.badges.length;if($('#game-best'))$('#game-best').textContent=state.best;}
function award(id,name){if(state.badges.includes(id))return;state.badges.push(id);save();renderBadges();updateCounters();toast('🏆 Открыта награда: '+name);}
renderBadges();updateCounters();

/* Главная: чеклист без регистрации */
$$('#home-checklist input').forEach(n=>{n.checked=state.checklist.includes(n.dataset.check);n.addEventListener('change',()=>{state.checklist=$$('#home-checklist input:checked').map(x=>x.dataset.check);save();updateChecklist();});});
function updateChecklist(){const t=$('#checklist-progress');if(!t)return;const count=$$('#home-checklist input:checked').length;t.textContent=count+' из 4 готово'+(count===4?' · Отличная подготовка! 🎉':'');}
updateChecklist();

/* Правовой помощник: учебная оценка, а не автоматическое юридическое решение */
const cases=[
 {name:'Работа без договора',icon:'📝',article:'Статьи 28 и 33',questions:[['Работодатель дал договор для ознакомления?', ['Да, внимательно читаю','Сказал, что оформим позже','Вообще не упоминал договор']],['Ты понимаешь, как будут платить?', ['Да, ставка и дата понятны','Обещают на словах','Оплата не обсуждалась']],['Как оформлены часы работы?', ['График определён','График часто меняют','Графика нет']],],tips:['Попроси проект трудового договора и проверь условия до начала работы.','Сохрани переписку об оплате и графике.','Уточни, как будут оформлены трудовые отношения и сведения о них.']},
 {name:'Задержали зарплату',icon:'💸',article:'Статья 113',questions:[['Указана ли дата выплаты в договоре?', ['Да, дата известна','Дата указана неясно','Договора нет']],['Что известно о начисленной сумме?', ['Есть расчёт','Есть только устные обещания','Не знаю, сколько начислили']],['Спрашивал ли ты работодателя письменно?', ['Да','Только устно','Пока не обращался']],],tips:['Сверь срок выплаты с договором и статьёй 113.','Сохрани расчётные листки и подтверждение выполненной работы.','Попроси письменное объяснение сроков и суммы; при необходимости получи правовую консультацию.']},
 {name:'Рабочее время',icon:'⏰',article:'Статьи 68–70',questions:[['Совпадает ли график с договором?', ['Да','Иногда меняется','Совсем не совпадает']],['Сколько часов в неделю?', ['В пределах нормы','Близко к пределу','Выше возрастного ограничения']],['Учитывает ли работа учёбу?', ['Да','Бывает сложно','Мешает посещать занятия']],],tips:['Подсчитай часы и проверь применимые возрастные ограничения.','Обсуди с работодателем удобный и законный график.','При несовершеннолетнем возрасте проверь дополнительные условия трудоустройства.']},
 {name:'Ночная смена',icon:'🌙',article:'Статья 76',questions:[['Тебе уже есть 18?', ['Да','Ещё нет','Возраст нужно уточнить']],['Попадает ли смена на 22:00–06:00?', ['Нет','Иногда','Да']],['Был ли письменный график?', ['Да','Частично','Нет']],],tips:['Если тебе нет 18 лет, к ночной работе привлекать нельзя.','Сверь время смен с графиком и правилами Трудового кодекса.','В спорной ситуации обсуди проблему с доверенным взрослым или специалистом.']},
 {name:'Отпуск и отдых',icon:'🌿',article:'Статьи 70 и 88',questions:[['Есть ли трудовой договор?', ['Да','Готовится','Не оформлен']],['Работаешь по неполному графику?', ['Нет','Да','Не уверен']],['Обсуждались сроки отдыха?', ['Да','Частично','Нет']],],tips:['По общему правилу ежегодный оплачиваемый отпуск составляет не менее 24 календарных дней.','Неполное рабочее время само по себе не отменяет право на отпуск.','Проверь свой договор, график и условия применения норм.']},
 {name:'Первая подработка',icon:'🎒',article:'Статьи 31 и 69',questions:[['Соответствует ли возраст условиям работы?', ['Да, проверил','Нужно уточнить','Условия не обсуждали']],['Работа безопасна?', ['Да','Не уверен','Предлагают рискованную работу']],['Обсудили ли условия с законным представителем, если нужно?', ['Да','Не уверен','Нет']],],tips:['С 16 лет договор допускается по общему правилу, раньше — при специальных условиях.','Учитывай ограничения по часам и запреты на некоторые виды работ.','При несовершеннолетнем возрасте привлеки законного представителя в предусмотренных законом случаях.']}
];
const helperApp=$('#helper-app');let currentCase=null,step=0,scores=[];
function startHelper(){if(!helperApp)return;currentCase=null;step=0;scores=[];helperApp.innerHTML='<span class="eyebrow">Начни с выбора</span><h2>Что произошло?</h2><p class="muted">Выбери тему — дальнейшие вопросы будут разными.</p><div class="choice-grid" id="case-list"></div>';
 const grid=$('#case-list');grid.innerHTML=cases.map((c,i)=>`<button type="button" class="choice" data-case="${i}"><span style="font-size:1.65rem">${c.icon}</span><b>${esc(c.name)}</b><small class="muted">Разобрать →</small></button>`).join('');
 grid.addEventListener('click',e=>{const b=e.target.closest('button[data-case]');if(!b)return;currentCase=cases[Number(b.dataset.case)];step=0;scores=[];renderHelper();});
}
function renderHelper(){if(!helperApp||!currentCase)return;
 if(step>=currentCase.questions.length){renderResult();return;}
 const [q,answers]=currentCase.questions[step];
 helperApp.innerHTML=`<span class="eyebrow">${esc(currentCase.icon+' '+currentCase.name)} · Вопрос ${step+1} из 3</span><div class="progress-track"><div class="progress-fill" style="width:${Math.round(step/3*100)}%"></div></div><h2>${esc(q)}</h2><div class="helper-options">${answers.map((a,i)=>`<button class="helper-option" data-answer="${i}">${esc(a)}</button>`).join('')}</div><div class="actions"><button id="helper-back" class="btn sm ghost">← ${step===0?'К темам':'Назад'}</button></div>`;
 $$('.helper-option',helperApp).forEach(n=>n.addEventListener('click',()=>{scores[step]=Number(n.dataset.answer);step++;renderHelper();}));
 $('#helper-back')?.addEventListener('click',()=>{if(step===0)startHelper();else{step--;renderHelper();}});
}
function renderResult(){
 let risk=scores.reduce((sum,v)=>sum+v,0);let title=risk>=5?'Есть важные вопросы для проверки':risk>=2?'Обрати внимание на условия':'Хорошая основа — проверь детали';
 state.helper++;save();updateCounters();if(state.helper>=3)award('helper','Правовой навигатор');
 helperApp.innerHTML=`<span class="eyebrow">✅ Разбор завершён</span><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div><div class="result" id="helper-result"><span class="labor-tag">${esc(currentCase.icon+' '+currentCase.name)}</span><h2 style="margin-top:15px">${title}</h2><p>Это учебная оценка по твоим ответам. Она не доказывает и не исключает правонарушение.</p><h3>Что делать дальше</h3><ul>${currentCase.tips.map(t=>'<li>'+esc(t)+'</li>').join('')}</ul><p><b>Нормативная основа:</b> ${esc(currentCase.article)} · <a href="${LAW}" target="_blank" rel="noopener noreferrer">официальный Трудовой кодекс ↗</a></p></div><div class="actions no-print" style="margin-top:18px"><button id="helper-again" class="btn">↻ Новая ситуация</button><button id="helper-print" class="btn ghost">🖨️ Печать</button></div>`;
 $('#helper-again')?.addEventListener('click',startHelper);$('#helper-print')?.addEventListener('click',()=>window.print());
}
startHelper();

/* Зарплата: чисто арифметический калькулятор из пользовательских данных */
const money=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Math.round(n))+' ₸';
function calcSalary(){if(!$('#salary-form'))return;
 const age=Number($('#salary-age').value),rate=Number($('#salary-rate').value),hours=Number($('#salary-hours').value),days=Number($('#salary-days').value),weeks=Number($('#salary-weeks').value);
 const values=[rate,hours,days,weeks];
 const valid=values.every(Number.isFinite)&&rate>0&&rate<=10000000&&hours>0&&hours<=24&&days>=1&&days<=7&&weeks>0&&weeks<=5;
 if(!valid){$('#salary-total').textContent='— ₸';$('#salary-week-total').textContent='—';$('#salary-week-hours').textContent='—';$('#salary-bar').style.width='0%';$('#salary-meter-label').textContent='—';$('#salary-warning').className='calc-warn';$('#salary-warning').textContent='Проверь введённые числа: ставка, часы, дни и недели должны быть положительными и в допустимом диапазоне.';return;}
 const weekHours=hours*days,totalHours=weekHours*weeks,weekWage=weekHours*rate,total=totalHours*rate,cap=age===14?24:age===16?36:40;
 $('#salary-total').textContent=money(total);$('#salary-week-total').textContent=money(weekWage);$('#salary-week-hours').textContent=Number(weekHours.toFixed(2)).toLocaleString('ru-RU')+' ч';
 $('#salary-bar').style.width=Math.min(100,weekHours/cap*100)+'%';$('#salary-meter-label').textContent=weekHours+'/'+cap+' ч';
 let box=$('#salary-warning');
 if(weekHours>cap){box.className='calc-warn';box.textContent=age<18?`Внимание: выбранный график превышает ${cap} часов в неделю — возрастной предел по статье 69 ТК РК. Уменьши часы или дни работы.`:`Внимание: ${weekHours} часов превышает общую норму ${cap} часов в неделю по статье 68. Возможность работы по такому графику и её оплату нужно проверять отдельно.`;}
 else {box.className='calc-ok';box.textContent='✅ По указанным часам недельный график укладывается в '+cap+' ч. Это не означает автоматическую законность всех условий работы.';}
 if(age===14&&weekHours<=cap){box.textContent+=' Для 14–15 лет трудоустройство возможно только при специальных условиях статьи 31.';}
}
$$('#salary-form input,#salary-form select').forEach(el=>el.addEventListener('input',calcSalary));calcSalary();

/* Генератор черновика — ничего не отправляет */
let letter='';
$('#letter-form')?.addEventListener('submit',e=>{e.preventDefault();let topic=$('#letter-topic').value.trim(),desc=$('#letter-desc').value.trim(),goal=$('#letter-goal').value.trim();if(!topic||!desc||!goal){toast('Пожалуйста, заполни все поля');return;}
 letter=`ЧЕРНОВИК ОБРАЩЕНИЯ К РАБОТОДАТЕЛЮ\n\nТема: ${topic}\n\nЗдравствуйте!\n\nПрошу рассмотреть следующий вопрос:\n${desc}\n\nЖелаемый результат:\n${goal}\n\nПрошу предоставить ответ и разъяснение по данному вопросу.\n\nПеред отправкой проверьте факты, выберите надлежащего адресата и при необходимости добавьте сведения о договоре и контактные данные.\n\nЭтот текст составлен с помощью учебного сайта «СТУДЕНТ & ТРУД KZ».`;
 $('#letter-preview').textContent=letter;$('#copy-letter').disabled=false;$('#print-letter').disabled=false;toast('Черновик готов ✅');
});
async function copy(text){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);toast('Скопировано в буфер обмена ✅');return;}}catch(e){}
 const el=document.createElement('textarea');el.value=text;el.setAttribute('readonly','');el.style.position='fixed';el.style.top='-9999px';document.body.append(el);el.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}el.remove();toast(ok?'Скопировано ✅':'Не удалось скопировать автоматически. Выдели текст вручную.');}
$('#copy-letter')?.addEventListener('click',()=>letter&&copy(letter));
$('#print-letter')?.addEventListener('click',()=>{if(!letter)return;document.body.classList.add('print-letter');window.print();});
window.addEventListener('afterprint',()=>document.body.classList.remove('print-letter'));

/* Справочник: поиск и фильтры */
let filter='all';
function filterLaws(){let search=($('#law-search')?.value||'').trim().toLocaleLowerCase('ru');let count=0;$$('.law-card').forEach(n=>{const yes=(filter==='all'||n.dataset.lawCategory===filter)&&n.dataset.lawSearch.toLocaleLowerCase('ru').includes(search);n.hidden=!yes;if(yes)count++;});if($('#law-empty'))$('#law-empty').hidden=count!==0;}
$('#law-search')?.addEventListener('input',filterLaws);
$$('#law-filters .chip').forEach(n=>n.addEventListener('click',()=>{filter=n.dataset.filter;$$('#law-filters .chip').forEach(x=>x.setAttribute('aria-pressed',String(x===n)));filterLaws();}));

/* Викторина: вопросы основаны на статьях кодекса */
const quizData=[
 ['С какого возраста обычно допускается заключение трудового договора?',['С 12 лет','С 16 лет','Только с 21 года'],1,'Общее правило в статье 31 ТК РК — с 16 лет; есть специальные исключения.'],
 ['Сколько часов в неделю может работать 17-летний работник?',['Не более 36','Не более 48','Без ограничений'],0,'Статья 69 устанавливает для работников 16–17 лет предел 36 часов в неделю.'],
 ['Какой предел недельной работы установлен для 14–15 лет?',['40 часов','36 часов','24 часа'],2,'Статья 69: до 24 часов в неделю для работников 14–15 лет.'],
 ['Можно ли привлекать 17-летнего к работе с 23:00 до 02:00?',['Да, по желанию','Нет, ночная работа запрещена','Да, если это выходной'],1,'Статья 76 запрещает ночную работу лицам младше 18 лет.'],
 ['Как часто должна выплачиваться зарплата по общему правилу?',['Раз в полгода','Не реже раза в месяц','Только в конце договора'],1,'Статья 113: не реже одного раза в месяц и в установленные сроки.'],
 ['Сколько обычно составляет основной ежегодный оплачиваемый отпуск?',['Не менее 24 календарных дней','Только 7 дней','Отпуск не положен студентам'],0,'Статья 88: в общем случае 24 календарных дня или больше, если предусмотрено.']
];
let quizIndex=0,correct=0,answered=false;
const quizApp=$('#quiz-app');
function renderQuiz(){if(!quizApp)return;
 if(quizIndex>=quizData.length){quizApp.innerHTML=`<span class="labor-tag">Тест завершён</span><h2 style="margin-top:16px">${correct} из ${quizData.length} верно!</h2><p class="muted">${correct===quizData.length?'Идеальный результат — так держать! 🏆':'Попробуй ещё раз — можно закрепить знания.'}</p><button id="quiz-reset" class="btn">↻ Пройти заново</button>`;if(correct===quizData.length)award('scholar','Знаток кодекса');$('#quiz-reset')?.addEventListener('click',()=>{quizIndex=0;correct=0;renderQuiz();});return;}
 const [q,answers,right,reason]=quizData[quizIndex];answered=false;
 quizApp.innerHTML=`<span class="eyebrow">Вопрос ${quizIndex+1} из ${quizData.length}</span><div class="progress-track"><div class="progress-fill" style="width:${quizIndex/quizData.length*100}%"></div></div><h3>${esc(q)}</h3><div class="quiz-answers">${answers.map((a,i)=>`<button class="quiz-answer" type="button" data-quiz="${i}">${esc(a)}</button>`).join('')}</div><div id="quiz-feedback" aria-live="polite"></div><button class="btn sm" id="quiz-next" style="margin-top:14px" hidden>${quizIndex===quizData.length-1?'Результат →':'Следующий вопрос →'}</button>`;
 $$('.quiz-answer',quizApp).forEach(n=>n.addEventListener('click',()=>{if(answered)return;answered=true;const choice=Number(n.dataset.quiz);if(choice===right)correct++;state.quiz++;save();updateCounters();$$('.quiz-answer',quizApp).forEach(b=>{b.disabled=true;if(Number(b.dataset.quiz)===right)b.dataset.right='true';else if(b===n)b.dataset.wrong='true';});$('#quiz-feedback').innerHTML=`<div class="quiz-feedback">${choice===right?'✅ Верно!':'💡 Правильный ответ: '+esc(answers[right])+'.'} ${esc(reason)}</div>`;$('#quiz-next').hidden=false;}));
 $('#quiz-next')?.addEventListener('click',()=>{quizIndex++;renderQuiz();});
}
renderQuiz();

/* Мини-игра: бегающая мышка. 40 секунд + пауза */
const arena=$('#game-arena'),mouse=$('#mouse'),start=$('#game-start'),pause=$('#game-pause');
let playing=false,paused=false,seconds=40,points=0,tickTimer=null,moveTimer=null;
function gameHud(){if($('#game-time'))$('#game-time').textContent=seconds;if($('#game-score'))$('#game-score').textContent=points;if($('#game-best'))$('#game-best').textContent=state.best;}
function moveMouse(){if(!arena||!mouse||!playing||paused)return;const maxX=Math.max(0,arena.clientWidth-mouse.offsetWidth-16),maxY=Math.max(0,arena.clientHeight-mouse.offsetHeight-16);mouse.style.left=Math.round(8+Math.random()*maxX)+'px';mouse.style.top=Math.round(8+Math.random()*maxY)+'px';}
function stopTimers(){clearInterval(tickTimer);clearInterval(moveTimer);tickTimer=null;moveTimer=null;}
function startTimers(){stopTimers();tickTimer=setInterval(()=>{if(!playing||paused)return;seconds=Math.max(0,seconds-1);gameHud();if(seconds===0)endGame();},1000);moveTimer=setInterval(moveMouse,820);}
function endGame(){playing=false;paused=false;stopTimers();mouse.disabled=true;pause.disabled=true;start.textContent='↻ Играть ещё';$('#game-message').textContent=`Игра окончена! Ты поймал(а) мышку ${points} раз. ${points>=10?'Впечатляющая реакция!':'Попробуй побить рекорд!'}`;if(points>state.best){state.best=points;save();toast('🏆 Новый рекорд!');}gameHud();}
start?.addEventListener('click',()=>{playing=true;paused=false;seconds=40;points=0;mouse.disabled=false;pause.disabled=false;pause.textContent='⏸ Пауза';start.textContent='↻ Заново';$('#game-message').textContent='Договор почти пойман! Кликай по мышке 🐭';gameHud();moveMouse();startTimers();});
pause?.addEventListener('click',()=>{if(!playing)return;paused=!paused;pause.textContent=paused?'▶ Продолжить':'⏸ Пауза';if(paused){stopTimers();$('#game-message').textContent='Пауза. Мышка ждёт 🧀';}else{startTimers();$('#game-message').textContent='Лови её!';}});
mouse?.addEventListener('click',()=>{if(!playing||paused)return;points++;state.caught++;save();if(state.caught>=1)award('first','Первый контракт');if(state.caught>=10)award('fast','Быстрый студент');if(state.caught>=25)award('master','Трудовой инспектор');gameHud();const pop=document.createElement('span');pop.className='game-bubble';pop.textContent='+1 📄';pop.style.left=mouse.style.left;pop.style.top=mouse.style.top;arena.append(pop);setTimeout(()=>pop.remove(),800);moveMouse();});
gameHud();
const randomCases=[
 ['Смена на ночь','Работодатель предлагает 17-летнему студенту работать после 22:00. Что нужно проверить?','Статья 76 запрещает ночную работу лицам до 18 лет.'],
 ['Договор на словах','В кафе предлагают начать завтра и оформить договор после первой недели. Какие вопросы стоит задать?','Проверь порядок оформления и условия договора по статьям 28 и 33.'],
 ['Зарплата задержалась','Дата выплаты в договоре прошла. Как можно грамотно уточнить причину?','Статья 113 регулирует сроки выплаты зарплаты.'],
 ['Слишком много смен','Тебе 16, и предлагают 42 рабочих часа в неделю. Как оценить график?','Статья 69: для работников 16–17 лет не более 36 часов в неделю.'],
 ['Летняя подработка','Тебе 15 лет, предлагают работу на каникулах. Что нужно учесть?','Статья 31 устанавливает специальные условия работы несовершеннолетних.'],
 ['Отпуск на полставки','Работник на неполном графике думает, что отпуск ему не положен. Так ли это?','Статья 70 сохраняет право на оплачиваемый отпуск при неполном времени.'],
 ['Проверка расчёта','За 4 часа работы по ставке 1500 ₸/час обещают 4000 ₸ без объяснений. Что проверить?','Сначала проверь договорную ставку и фактические часы, затем попроси расчёт начислений.']
];
let lastCase=-1;
$('#random-case')?.addEventListener('click',()=>{let i=Math.floor(Math.random()*randomCases.length);if(i===lastCase)i=(i+1)%randomCases.length;lastCase=i;let [title,q,explanation]=randomCases[i];$('#random-case-result').innerHTML=`<span class="labor-tag">🗂️ ${esc(title)}</span><h3 style="margin-top:12px">${esc(q)}</h3><p class="muted">${esc(explanation)}</p><a class="arrow-link" href="${LAW}" target="_blank" rel="noopener noreferrer">Перейти к официальному кодексу ↗</a>`;});

/* FAQ + безопасное копирование сообщения без отправки */
$('#faq-search')?.addEventListener('input',e=>{const q=e.target.value.trim().toLocaleLowerCase('ru');let num=0;$$('#faq-list details').forEach(d=>{const yes=d.dataset.faqSearch.toLocaleLowerCase('ru').includes(q);d.hidden=!yes;if(yes)num++;});if($('#faq-empty'))$('#faq-empty').hidden=num!==0;});
$('#feedback-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('#fb-name').value.trim(),sub=$('#fb-subject').value.trim(),txt=$('#fb-msg').value.trim();if(!name||!sub||!txt){toast('Заполни все поля');return;}copy(`Тема: ${sub}\nОт: ${name}\n\n${txt}\n\nПодготовлено с помощью учебного сайта «СТУДЕНТ & ТРУД KZ».`);});
})();
