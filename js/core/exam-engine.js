// Exam Engine & State Management
// Functions and reference data for exam mode

let currentExam = 'game';
let state = { failedIds:{}, passedIds:{}, seenIds:{}, history:[], currentExamSession:null, currentIndex:0, currentAnswered:false, prevScreen:'home' };

// ── THEME TOGGLE ──
function toggleTheme() {
  const light = document.body.classList.toggle('light');
  document.getElementById('theme-btn').textContent = light ? '🌙 Dark' : '☀️ Light';
  try { localStorage.setItem('awshub_theme', light ? 'light' : 'dark'); } catch(e){}
}
// Default is light; switch to dark only if user previously chose dark
// Runs after DOM is ready
function initTheme(){
  try {
    const saved = localStorage.getItem('awshub_theme');
    const btn = document.getElementById('theme-btn');
    if(saved === 'dark'){ document.body.classList.remove('light'); if(btn) btn.textContent='☀️ Light'; }
    else { if(btn) btn.textContent='🌙 Dark'; }
  } catch(e){}
}

// ── ANSWER SHUFFLER ──
// Returns {options, correctIdx} with answers randomly reordered so correct answer position varies
function shuffleAnswers(q) {
  const indexed = q.options.map((text,i)=>({text,orig:i}));
  // Fisher-Yates shuffle
  for(let i=indexed.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[indexed[i],indexed[j]]=[indexed[j],indexed[i]]; }
  const correctIdx = indexed.findIndex(x=>x.orig===q.correct);
  return { options: indexed.map(x=>x.text), correctIdx, origMap: indexed.map(x=>x.orig) };
}

function load() { try { const s=localStorage.getItem('awshub_v1'); if(s) state={...state,...JSON.parse(s)}; } catch(e){} }
function save() { try { localStorage.setItem('awshub_v1',JSON.stringify({failedIds:state.failedIds,passedIds:state.passedIds,seenIds:state.seenIds,history:state.history})); } catch(e){} }
// (called from init)

function switchExam(exam) {
  currentExam = exam;
  document.querySelectorAll('.exam-tab').forEach(t=>t.className='exam-tab');
  const tab = document.querySelector(`[data-exam="${exam}"]`);
  if(tab) tab.classList.add(`active-${exam}`);
  document.querySelectorAll('.nav-btn').forEach(b=>b.className='nav-btn');
  const activeNav = document.querySelector('.nav-btn[data-nav="home"]');
  if(activeNav){ activeNav.classList.add('active',exam); }
  const btnClass = exam === 'tf-games' ? 'btn btn-terraform' : exam === 'k8s-games' ? 'btn btn-ckad' : `btn btn-${exam}`;
  const qb=document.getElementById('quick-btn'); if(qb) qb.className=btnClass;
  const pf=document.getElementById('practice-failed-btn'); if(pf) pf.className=btnClass;
  const se=document.getElementById('start-exam-btn'); if(se) se.className=btnClass;
  if(exam==='game'){
    document.getElementById('mainNav').style.display='none';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-game').classList.add('active');
    window.scrollTo(0,0);
    renderGameMenu();
    return;
  }
  if(exam==='ref'){
    document.getElementById('mainNav').style.display='none';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-game').classList.add('active');
    window.scrollTo(0,0);
    renderRefMenu();
    return;
  }
  if(exam==='tf-games'){
    document.getElementById('mainNav').style.display='none';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-game').classList.add('active');
    window.scrollTo(0,0);
    renderTerraformMenu();
    return;
  }
  if(exam==='k8s-games'){
    document.getElementById('mainNav').style.display='none';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-game').classList.add('active');
    window.scrollTo(0,0);
    renderK8sMenu();
    return;
  }
  document.getElementById('mainNav').style.display='flex';
  populateDomainSelects();
  showScreen('home');
}

function getQuestions() { return EXAMS[currentExam].questions; }
function getExamDomains() { return [...new Set(getQuestions().map(q=>q.domain))]; }

function populateDomainSelects() {
  const domains = getExamDomains();
  ['filter-domain','exam-domain'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.innerHTML=`<option value="">All domains</option>${domains.map(d=>`<option value="${d}">${d}</option>`).join('')}`;
  });
}
// (called from init)

function showScreen(id) {
  const cur=document.querySelector('.screen.active');
  state.prevScreen=cur?.id?.replace('screen-','')||'home';
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const map={home:0,bank:1,'exam-config':2,failed:3,history:4};
  if(map[id]!==undefined){ const btn=document.querySelectorAll('.nav-btn')[map[id]]; if(btn){btn.classList.add('active',currentExam);} }
  window.scrollTo(0,0);
  if(id==='home') renderHome();
  if(id==='bank') renderBank();
  if(id==='failed') renderFailed();
  if(id==='history') renderHistory();
}
function goBack(){ showScreen(state.prevScreen||'home'); }

// ═══════════════════════════════════════════════════
// RENDER HOME
// ═══════════════════════════════════════════════════
function renderHome() {
  const qs=getQuestions(), total=qs.length;
  const myIds=new Set(qs.map(q=>q.id));
  const seen=qs.filter(q=>state.seenIds[q.id]).length;
  const failed=qs.filter(q=>state.failedIds[q.id]).length;
  const exams=state.history.filter(h=>h.exam===currentExam).length;
  document.getElementById('stats-grid').innerHTML=`
    <div class="stat"><div class="stat-val">${total}</div><div class="stat-lbl">Questions</div></div>
    <div class="stat"><div class="stat-val">${seen}</div><div class="stat-lbl">Seen</div></div>
    <div class="stat"><div class="stat-val" style="color:var(--fail)">${failed}</div><div class="stat-lbl">Failed</div></div>
    <div class="stat"><div class="stat-val">${exams}</div><div class="stat-lbl">Exams taken</div></div>`;
  const recent=state.history.filter(h=>h.exam===currentExam).slice(-5).reverse();
  document.getElementById('recent-list').innerHTML=recent.length ? recent.map(h=>`
    <div class="result-row">
      <div><div style="font-size:13px;font-weight:500">${h.label}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${new Date(h.date).toLocaleDateString()}</div></div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:14px;font-weight:600;font-family:'IBM Plex Mono',monospace">${h.score}/${h.total}</span>
        <span class="badge ${h.pct>=70?'b-pass':'b-fail'}">${h.pct}%</span>
      </div>
    </div>`).join('') : '<div style="font-size:12px;color:var(--text3)">No exams yet. Take your first!</div>';
  const dc={};
  qs.forEach(q=>{ if(!dc[q.domain]) dc[q.domain]={total:0,seen:0,failed:0}; dc[q.domain].total++; if(state.seenIds[q.id]) dc[q.domain].seen++; if(state.failedIds[q.id]) dc[q.domain].failed++; });
  document.getElementById('domain-coverage').innerHTML=getExamDomains().map(d=>{
    const info=dc[d]||{total:0,seen:0,failed:0}, pct=Math.round(info.seen/info.total*100);
    return `<div class="domain-row">
      <div class="domain-top"><span class="domain-name">${d}</span><span class="domain-stat">${info.seen}/${info.total}${info.failed?` · <span style="color:var(--fail)">${info.failed}✗</span>`:''}</span></div>
      <div class="progress-bar" style="margin-bottom:0"><div class="progress-fill ${EXAMS[currentExam].fillClass}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════
// RENDER BANK
// ═══════════════════════════════════════════════════
function renderBank() {
  const domain=document.getElementById('filter-domain').value;
  const status=document.getElementById('filter-status').value;
  let qs=getQuestions().filter(q=>{
    if(domain&&q.domain!==domain) return false;
    if(status==='failed'&&!state.failedIds[q.id]) return false;
    if(status==='passed'&&!state.passedIds[q.id]) return false;
    if(status==='unseen'&&state.seenIds[q.id]) return false;
    return true;
  });
  document.getElementById('bank-count').textContent=`${qs.length} question${qs.length!==1?'s':''}`;
  document.getElementById('bank-list').innerHTML=qs.length ? qs.map(q=>`
    <div class="q-list-item" onclick="viewQuestion('${q.id}')">
      <div style="flex:1;min-width:0">
        <div class="q-list-text">${q.text}</div>
        <div class="tag-row">
          <span class="badge b-neutral">${q.domain}</span>
          ${currentExam==='all'?q.exams.map(e=>`<span class="badge b-${e}">${e.toUpperCase()}</span>`).join(''):''}
          ${state.failedIds[q.id]?`<span class="badge b-fail">${state.failedIds[q.id]}✗</span>`:''}
          ${state.passedIds[q.id]&&!state.failedIds[q.id]?'<span class="badge b-pass">✓</span>':''}
          ${!state.seenIds[q.id]?'<span class="badge b-neutral">new</span>':''}
        </div>
      </div>
      <div class="chevron">›</div>
    </div>`).join('') : '<div class="empty"><div class="empty-icon">🔍</div>No questions match your filters.</div>';
}

// ═══════════════════════════════════════════════════
// VIEW QUESTION DETAIL
// ═══════════════════════════════════════════════════
function viewQuestion(id) {
  const q=getQuestions().find(x=>x.id===id)||EXAMS.all.questions.find(x=>x.id===id);
  if(!q) return;
  state.prevScreen=document.querySelector('.screen.active')?.id?.replace('screen-','')||'bank';
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-question').classList.add('active');
  window.scrollTo(0,0);
  const letters=['A','B','C','D'];
  document.getElementById('question-detail').innerHTML=`
    <div class="q-card">
      <div class="q-meta">
        <span class="badge b-neutral">${q.domain}</span>
        ${q.exams.map(e=>`<span class="badge b-${e}">${e.toUpperCase()}</span>`).join('')}
        ${state.failedIds[q.id]?`<span class="badge b-fail">Failed ${state.failedIds[q.id]}×</span>`:''}
        ${state.passedIds[q.id]?'<span class="badge b-pass">Passed</span>':''}
      </div>
      <div class="q-text">${q.text}</div>
      ${q.options.map((o,i)=>`<div class="option ${i===q.correct?'correct':''}" style="cursor:default">
        <span class="option-letter">${letters[i]}</span><span style="flex:1">${o}</span>
        ${i===q.correct?'<span style="font-size:11px;color:#81c784;font-weight:600">✓</span>':''}
      </div>`).join('')}
      <div class="explanation">${q.explanation}</div>
    </div>`;
}

// ═══════════════════════════════════════════════════
// EXAM ENGINE
// ═══════════════════════════════════════════════════
function getFilteredQuestions(count, domain, pool) {
  let qs=getQuestions().filter(q=>{
    if(domain&&q.domain!==domain) return false;
    if(pool==='failed'&&!state.failedIds[q.id]) return false;
    if(pool==='unseen'&&state.seenIds[q.id]) return false;
    return true;
  });
  return qs.sort(()=>Math.random()-.5).slice(0,Math.min(count,qs.length));
}

function startExam() {
  const count=parseInt(document.getElementById('exam-count').value)||20;
  const domain=document.getElementById('exam-domain').value;
  const pool=document.getElementById('exam-pool').value;
  const qs=getFilteredQuestions(count,domain,pool);
  if(!qs.length){ alert('No questions match. Adjust filters.'); return; }
  launchExam(qs,`${domain||'All Domains'} · ${pool==='all'?'Mixed':pool==='failed'?'Failed':'Unseen'}`);
}
function startQuickExam() {
  const qs=getQuestions().sort(()=>Math.random()-.5).slice(0,10);
  launchExam(qs,'Quick 10-Q Exam');
}
function startFailedExam() {
  const qs=getQuestions().filter(q=>state.failedIds[q.id]).sort(()=>Math.random()-.5);
  if(!qs.length){ alert('No failed questions yet! Take an exam first.'); return; }
  launchExam(qs,'Failed Questions Review');
}

function launchExam(qs,label) {
  // Pre-shuffle answers for every question so correct answer position varies
  const shuffled = qs.map(q => shuffleAnswers(q));
  state.currentExamSession={questions:qs,shuffled,answers:[],label,exam:currentExam,startTime:Date.now()};
  state.currentIndex=0; state.currentAnswered=false;
  const pbar=document.getElementById('exam-progress-bar');
  pbar.className=`progress-fill ${EXAMS[currentExam].fillClass}`;
  showScreen('exam'); renderExamQ();
}

function renderExamQ() {
  const sess=state.currentExamSession, q=sess.questions[state.currentIndex];
  const sh=sess.shuffled[state.currentIndex]; // {options, correctIdx}
  const total=sess.questions.length, answered=sess.answers.filter(Boolean).length;
  const correct=sess.answers.filter(a=>a&&a.correct).length;
  document.getElementById('exam-progress-lbl').textContent=`Q${state.currentIndex+1} / ${total}`;
  document.getElementById('exam-score-lbl').textContent=answered>0?`${correct}/${answered} ✓`:'';
  document.getElementById('exam-progress-bar').style.width=`${(state.currentIndex/total)*100}%`;
  const letters=['A','B','C','D'], isAns=state.currentAnswered;
  const prev=sess.answers[state.currentIndex];
  document.getElementById('exam-question-area').innerHTML=`
    <div class="q-card">
      <div class="q-meta">
        <span class="badge b-neutral">${q.domain}</span>
        ${currentExam==='all'?q.exams.map(e=>`<span class="badge b-${e}">${e.toUpperCase()}</span>`).join(''):''}
      </div>
      <div class="q-text">${q.text}</div>
      ${sh.options.map((o,i)=>{
        let cls='option'+(isAns?' disabled':'');
        if(isAns){ if(i===sh.correctIdx) cls+=' correct'; else if(prev&&prev.chosen===i) cls+=' wrong'; }
        return `<div class="${cls}" ${isAns?'':'onclick="choose('+i+')"'}>
          <span class="option-letter">${letters[i]}</span>${o}
        </div>`;
      }).join('')}
      ${isAns?`<div class="explanation">${q.explanation}</div>`:''}
    </div>`;
  const ctrl=document.getElementById('exam-controls');
  if(isAns){
    const isLast=state.currentIndex>=sess.questions.length-1;
    ctrl.innerHTML=isLast
      ?`<button class="btn btn-${currentExam}" style="width:100%" onclick="finishExam()">See Results →</button>`
      :`<button class="btn btn-${currentExam}" style="width:100%" onclick="nextQ()">Next Question →</button>`;
  } else ctrl.innerHTML='';
}

function choose(idx) {
  if(state.currentAnswered) return;
  const sess=state.currentExamSession, q=sess.questions[state.currentIndex];
  const sh=sess.shuffled[state.currentIndex];
  const isCorrect=idx===sh.correctIdx;
  state.currentAnswered=true; state.seenIds[q.id]=true;
  if(!isCorrect){ state.failedIds[q.id]=(state.failedIds[q.id]||0)+1; }
  else { state.passedIds[q.id]=true; if(state.failedIds[q.id]) delete state.failedIds[q.id]; }
  sess.answers[state.currentIndex]={chosen:idx,correct:isCorrect};
  save(); renderExamQ();
}

function nextQ() { state.currentIndex++; state.currentAnswered=!!state.currentExamSession.answers[state.currentIndex]; renderExamQ(); }

function finishExam() {
  const sess=state.currentExamSession, total=sess.questions.length;
  const correct=sess.answers.filter(a=>a&&a.correct).length;
  const pct=Math.round(correct/total*100);
  state.history.push({label:sess.label,score:correct,total,date:Date.now(),pct,exam:currentExam}); save();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-results').classList.add('active');
  window.scrollTo(0,0);
  const pass=pct>=70;
  document.getElementById('results-area').innerHTML=`
    <div class="card" style="text-align:center">
      <div class="score-big">
        <div class="score-num" style="color:var(--${pass?'pass':'fail'})">${pct}%</div>
        <div class="score-label">${correct} correct of ${total} questions</div>
        <div class="score-pill" style="background:var(--${pass?'pass-dim':'fail-dim'});color:var(--${pass?'pass':'fail'})">${pass?'PASS ✓':'FAIL ✗'} · 70% required</div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Question review</div>
      ${sess.questions.map((q,i)=>{const a=sess.answers[i];return`
        <div class="result-row">
          <div style="flex:1;min-width:0;margin-right:10px"><div style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2)">${q.text}</div></div>
          <span class="badge ${a&&a.correct?'b-pass':'b-fail'}">${a&&a.correct?'✓':'✗'}</span>
        </div>`}).join('')}
    </div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-${currentExam}" onclick="showScreen('home')" style="flex:1">Dashboard</button>
      <button class="btn btn-ghost" onclick="startQuickExam()">Retry</button>
    </div>`;
}

// ═══════════════════════════════════════════════════
// FAILED & HISTORY
// ═══════════════════════════════════════════════════
function renderFailed() {
  const failed=getQuestions().filter(q=>state.failedIds[q.id]).sort((a,b)=>state.failedIds[b.id]-state.failedIds[a.id]);
  document.getElementById('failed-subtitle').textContent=`${failed.length} question${failed.length!==1?'s':''} to review`;
  document.getElementById('failed-list').innerHTML=failed.length
    ?`<div class="card" style="padding:0;overflow:hidden">${failed.map(q=>`
      <div class="q-list-item" onclick="viewQuestion('${q.id}')">
        <div style="flex:1;min-width:0">
          <div class="q-list-text">${q.text}</div>
          <div class="tag-row"><span class="badge b-neutral">${q.domain}</span>
          ${currentExam==='all'?q.exams.map(e=>`<span class="badge b-${e}">${e.toUpperCase()}</span>`).join(''):''}
          </div>
        </div>
        <span class="fail-count">${state.failedIds[q.id]}✗</span>
      </div>`).join('')}</div>`
    :'<div class="empty"><div class="empty-icon">🎯</div>No failed questions yet!<br>Take an exam to track weak areas.</div>';
}

function renderHistory() {
  const h=[...state.history].filter(x=>x.exam===currentExam).reverse();
  document.getElementById('history-list').innerHTML=h.length ? h.map(entry=>`
    <div class="card" style="padding:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div><div style="font-weight:500;font-size:14px">${entry.label}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${new Date(entry.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div></div>
        <div style="text-align:right">
          <div style="font-size:18px;font-weight:600;font-family:'IBM Plex Mono',monospace">${entry.score}/${entry.total}</div>
          <span class="badge ${entry.pct>=70?'b-pass':'b-fail'}">${entry.pct}%</span>
        </div>
      </div>
      <div class="progress-bar" style="margin-bottom:0">
        <div class="progress-fill" style="width:${entry.pct}%;background:var(--${entry.pct>=70?'pass':'fail'})"></div>
      </div>
    </div>`).join('')
    :'<div class="empty"><div class="empty-icon">📊</div>No history yet for this exam.</div>';
}

// Init after DOM ready
document.addEventListener("DOMContentLoaded", function(){
  initTheme();
  renderGameMenu();
});

// ═══════════════════════════════════════════════════
// GAME ENGINE
// ═══════════════════════════════════════════════════

const AWS_SERVICES = [
  // CCP Core
  {name:'Amazon S3',icon:'🪣',desc:'Object storage for any amount of data',category:'Storage',level:'ccp'},
  {name:'Amazon EC2',icon:'🖥️',desc:'Resizable virtual machines in the cloud',category:'Compute',level:'ccp'},
  {name:'AWS Lambda',icon:'λ',desc:'Run code without provisioning servers',category:'Compute',level:'ccp'},
  {name:'Amazon RDS',icon:'🗄️',desc:'Managed relational database service',category:'Database',level:'ccp'},
  {name:'Amazon DynamoDB',icon:'⚡',desc:'Fast NoSQL key-value database',category:'Database',level:'ccp'},
  {name:'Amazon CloudFront',icon:'🌐',desc:'Global content delivery network (CDN)',category:'Networking',level:'ccp'},
  {name:'Amazon VPC',icon:'🔒',desc:'Isolated virtual network in the cloud',category:'Networking',level:'ccp'},
  {name:'AWS IAM',icon:'🔑',desc:'Manage user access and permissions',category:'Security',level:'ccp'},
  {name:'Amazon CloudWatch',icon:'📊',desc:'Monitor resources and collect metrics and logs',category:'Monitoring',level:'ccp'},
  {name:'AWS CloudTrail',icon:'🔍',desc:'Record and audit all API calls',category:'Security',level:'ccp'},
  {name:'Amazon SNS',icon:'📣',desc:'Pub/sub messaging and push notifications',category:'Messaging',level:'ccp'},
  {name:'Amazon SQS',icon:'📬',desc:'Managed message queuing service',category:'Messaging',level:'ccp'},
  {name:'AWS CloudFormation',icon:'📋',desc:'Infrastructure as code with templates',category:'Management',level:'ccp'},
  {name:'Amazon Route 53',icon:'🗺️',desc:'Scalable DNS and domain registration',category:'Networking',level:'ccp'},
  {name:'AWS Fargate',icon:'🐳',desc:'Run containers without managing servers',category:'Compute',level:'ccp'},
  {name:'Amazon EKS',icon:'☸️',desc:'Managed Kubernetes service',category:'Compute',level:'ccp'},
  {name:'Amazon ElastiCache',icon:'💨',desc:'In-memory caching with Redis or Memcached',category:'Database',level:'ccp'},
  {name:'Amazon Redshift',icon:'📦',desc:'Petabyte-scale data warehouse',category:'Database',level:'ccp'},
  {name:'AWS KMS',icon:'🗝️',desc:'Create and manage encryption keys',category:'Security',level:'ccp'},
  {name:'Amazon GuardDuty',icon:'🛡️',desc:'Intelligent threat detection service',category:'Security',level:'ccp'},
  {name:'AWS WAF',icon:'🧱',desc:'Web application firewall against exploits',category:'Security',level:'ccp'},
  {name:'Amazon Cognito',icon:'👤',desc:'User sign-up, sign-in and access control',category:'Security',level:'ccp'},
  {name:'AWS Direct Connect',icon:'🔌',desc:'Dedicated private connection to AWS',category:'Networking',level:'ccp'},
  {name:'Amazon Aurora',icon:'✨',desc:'MySQL/PostgreSQL-compatible high-perf DB',category:'Database',level:'ccp'},
  {name:'AWS Step Functions',icon:'🔗',desc:'Serverless workflow orchestration',category:'Compute',level:'ccp'},
  {name:'Amazon Kinesis',icon:'🌊',desc:'Real-time data streaming and processing',category:'Analytics',level:'ccp'},
  {name:'Amazon Athena',icon:'🔎',desc:'Query S3 data directly with SQL',category:'Analytics',level:'ccp'},
  {name:'AWS Glue',icon:'🧩',desc:'Serverless ETL data integration service',category:'Analytics',level:'ccp'},
  {name:'Amazon SageMaker',icon:'🤖',desc:'Build, train and deploy ML models',category:'AI/ML',level:'ccp'},
  {name:'AWS Shield',icon:'🛡️',desc:'DDoS protection for AWS applications',category:'Security',level:'ccp'},
  {name:'Amazon EFS',icon:'📁',desc:'Shared elastic file system for EC2',category:'Storage',level:'ccp'},
  {name:'Amazon EBS',icon:'💾',desc:'Block storage volumes for EC2 instances',category:'Storage',level:'ccp'},
  {name:'AWS Elastic Beanstalk',icon:'🌱',desc:'Deploy and scale web apps automatically',category:'Compute',level:'ccp'},
  {name:'AWS CodePipeline',icon:'🚀',desc:'Continuous delivery pipeline automation',category:'DevOps',level:'ccp'},
  {name:'AWS CodeBuild',icon:'🔨',desc:'Build and test code in the cloud',category:'DevOps',level:'ccp'},
  {name:'AWS CodeDeploy',icon:'📦',desc:'Automate code deployments to any target',category:'DevOps',level:'ccp'},
  {name:'Amazon API Gateway',icon:'🚪',desc:'Create and manage APIs at any scale',category:'Networking',level:'ccp'},
  {name:'AWS Secrets Manager',icon:'🔐',desc:'Rotate, manage and retrieve secrets',category:'Security',level:'ccp'},
  {name:'Amazon Inspector',icon:'🔬',desc:'Automated vulnerability assessment',category:'Security',level:'ccp'},
  {name:'AWS Config',icon:'📝',desc:'Audit and evaluate resource configurations',category:'Management',level:'ccp'},
  {name:'AWS Trusted Advisor',icon:'💡',desc:'Real-time best practice recommendations',category:'Management',level:'ccp'},
  {name:'Amazon Macie',icon:'🕵️',desc:'Discover and protect sensitive S3 data',category:'Security',level:'ccp'},
  {name:'AWS Organizations',icon:'🏢',desc:'Centrally manage multiple AWS accounts',category:'Management',level:'ccp'},
  {name:'Amazon Connect',icon:'📞',desc:'Omnichannel cloud contact center',category:'Business',level:'ccp'},
  {name:'AWS DataSync',icon:'🔄',desc:'Accelerate data transfer to AWS',category:'Storage',level:'ccp'},
  {name:'Amazon Rekognition',icon:'👁️',desc:'Image and video analysis with ML',category:'AI/ML',level:'ccp'},
  {name:'AWS Snow Family',icon:'❄️',desc:'Physical devices for large data migration',category:'Storage',level:'ccp'},
  {name:'Amazon Comprehend',icon:'💬',desc:'NLP to find insights in text',category:'AI/ML',level:'ccp'},
  {name:'Amazon Translate',icon:'🌍',desc:'Neural machine translation service',category:'AI/ML',level:'ccp'},
  {name:'Amazon Polly',icon:'🗣️',desc:'Turn text into lifelike speech',category:'AI/ML',level:'ccp'},
  // SAA additions
  {name:'AWS Transit Gateway',icon:'🔀',desc:'Central hub connecting VPCs and on-premises networks',category:'Networking',level:'saa'},
  {name:'Amazon RDS Proxy',icon:'🔄',desc:'Managed DB connection pooler for RDS and Aurora',category:'Database',level:'saa'},
  {name:'AWS PrivateLink',icon:'🔐',desc:'Private connectivity to services without internet exposure',category:'Networking',level:'saa'},
  {name:'AWS Backup',icon:'💾',desc:'Centrally automate backups across AWS services',category:'Management',level:'saa'},
  {name:'Amazon EventBridge',icon:'📡',desc:'Serverless event bus for event-driven architectures',category:'Messaging',level:'saa'},
  {name:'AWS DMS',icon:'🚢',desc:'Database Migration Service — migrate with minimal downtime',category:'Database',level:'saa'},
  {name:'Amazon FSx for Lustre',icon:'⚙️',desc:'High-performance file system for HPC and ML workloads',category:'Storage',level:'saa'},
  {name:'Amazon FSx for Windows',icon:'🪟',desc:'Managed Windows native file system with SMB support',category:'Storage',level:'saa'},
  {name:'AWS Network Firewall',icon:'🔥',desc:'Stateful managed network firewall and IDS/IPS for VPCs',category:'Security',level:'saa'},
  {name:'Amazon OpenSearch',icon:'🔍',desc:'Managed Elasticsearch for log analytics and search',category:'Analytics',level:'saa'},
  {name:'AWS Global Accelerator',icon:'🌏',desc:'Route TCP/UDP traffic via AWS global network for lower latency',category:'Networking',level:'saa'},
  {name:'AWS RAM',icon:'🤝',desc:'Resource Access Manager — share resources across accounts',category:'Management',level:'saa'},
  {name:'Amazon Kinesis Firehose',icon:'🔥',desc:'Load streaming data into S3, Redshift, or OpenSearch',category:'Analytics',level:'saa'},
  {name:'AWS Elastic Disaster Recovery',icon:'♻️',desc:'Continuous replication for fast recovery with low RTO/RPO',category:'Management',level:'saa'},
  {name:'Amazon Aurora Serverless',icon:'🌠',desc:'Auto-scaling Aurora that starts and stops based on demand',category:'Database',level:'saa'},
  {name:'AWS Firewall Manager',icon:'🛡️',desc:'Centrally manage WAF and Shield rules across accounts',category:'Security',level:'saa'},
  {name:'Amazon MQ',icon:'✉️',desc:'Managed message broker for ActiveMQ and RabbitMQ',category:'Messaging',level:'saa'},
  {name:'DynamoDB Global Tables',icon:'🌐',desc:'Multi-region, multi-active DynamoDB replication',category:'Database',level:'saa'},
  {name:'Amazon DAX',icon:'⚡',desc:'In-memory cache for DynamoDB with microsecond latency',category:'Database',level:'saa'},
  {name:'AWS Cloud Map',icon:'🗺️',desc:'Service discovery for cloud resources',category:'Networking',level:'saa'},
  {name:'Amazon ECR',icon:'📦',desc:'Managed container image registry',category:'DevOps',level:'saa'},
];

const SUPPORT_PLANS = [
  {name:'Basic',icon:'🆓',price:'Free (included with all accounts)',features:['AWS documentation and whitepapers','Service health dashboard','6 core Trusted Advisor checks','Customer service for billing and account questions only','No technical support cases'],response:{general:'N/A',sys_impaired:'N/A',prod_impaired:'N/A',prod_down:'N/A',biz_critical:'N/A'},tam:false,concierge:false},
  {name:'Developer',icon:'👨‍💻',price:'From $29/mo or 3% of monthly usage',features:['General architectural guidance','Unlimited support cases (1 primary contact)','Business hours email support only','No phone or chat support','Access to AWS Health API'],response:{general:'24 hrs (business hours)',sys_impaired:'12 hrs (business hours)',prod_impaired:'N/A',prod_down:'N/A',biz_critical:'N/A'},tam:false,concierge:false},
  {name:'Business',icon:'🏢',price:'From $100/mo or tiered % of monthly usage',features:['Contextual architectural guidance for use case','Unlimited contacts and support cases','24/7 phone, email and chat support','Full Trusted Advisor checks and Trusted Advisor API','AWS Support API access','Third-party software support'],response:{general:'24 hours',sys_impaired:'12 hours',prod_impaired:'4 hours',prod_down:'1 hour',biz_critical:'N/A'},tam:false,concierge:false},
  {name:'Enterprise On-Ramp',icon:'🚀',price:'From $5,500/mo',features:['Consultative architectural review','Unlimited contacts and support cases','24/7 phone, email and chat','Full Trusted Advisor checks','Pool of TAMs (not dedicated)','Concierge Support Team','Infrastructure Event Management included','Annual business reviews'],response:{general:'24 hours',sys_impaired:'12 hours',prod_impaired:'4 hours',prod_down:'1 hour',biz_critical:'30 minutes'},tam:false,concierge:true},
  {name:'Enterprise',icon:'🏆',price:'From $15,000/mo',features:['Consultative architectural review','Unlimited contacts and support cases','24/7 phone, email and chat','Full Trusted Advisor checks','Dedicated Technical Account Manager (TAM)','Concierge Support Team','Well-Architected reviews','Infrastructure Event Management included','Proactive reviews, workshops, and deep dives'],response:{general:'24 hours',sys_impaired:'12 hours',prod_impaired:'4 hours',prod_down:'1 hour',biz_critical:'15 minutes'},tam:true,concierge:true},
];

const WA_PILLARS = [
  {name:'Operational Excellence',icon:'⚙️',services:['AWS CloudFormation','AWS Config','Amazon CloudWatch','AWS CloudTrail','AWS Systems Manager']},
  {name:'Security',icon:'🔒',services:['AWS IAM','Amazon Cognito','AWS KMS','AWS Shield','AWS WAF','Amazon GuardDuty','Amazon Macie','AWS CloudTrail']},
  {name:'Reliability',icon:'🛡️',services:['Amazon Route 53','Elastic Load Balancing','AWS Auto Scaling','Amazon RDS Multi-AZ','S3 Cross-Region Replication','AWS Backup']},
  {name:'Performance Efficiency',icon:'⚡',services:['AWS Lambda','Amazon EC2 Auto Scaling','Amazon CloudFront','Amazon ElastiCache','Amazon DynamoDB DAX']},
  {name:'Cost Optimization',icon:'💰',services:['AWS Cost Explorer','AWS Budgets','Amazon S3 Intelligent-Tiering','Spot Instances','Reserved Instances','AWS Trusted Advisor']},
  {name:'Sustainability',icon:'🌱',services:['AWS Graviton','Spot Instances','Amazon S3 Intelligent-Tiering','AWS Lambda','Amazon EC2 Auto Scaling']},
];

const ARCH_SCENARIOS = [
  {id:'s1',title:'Highly Available Web App',desc:'A retail website needs 99.99% uptime, handles 10k-100k users unpredictably, and serves static assets globally.',components:[{label:'DNS & Routing',correct:'Amazon Route 53',options:['Amazon Route 53','AWS Direct Connect','Amazon VPC','AWS CloudTrail']},{label:'Content Delivery',correct:'Amazon CloudFront',options:['Amazon CloudFront','Amazon EBS','AWS Glue','Amazon Connect']},{label:'Load Balancing',correct:'Application Load Balancer',options:['Application Load Balancer','Amazon SQS','AWS CloudFormation','Amazon Macie']},{label:'Compute',correct:'EC2 Auto Scaling Group',options:['EC2 Auto Scaling Group','Amazon Redshift','AWS Snowball','Amazon Lex']},{label:'Database',correct:'Amazon Aurora Multi-AZ',options:['Amazon Aurora Multi-AZ','Amazon S3 Glacier','AWS Batch','Amazon Kinesis']}],explanation:'Route 53 provides DNS and health checks. CloudFront caches static assets at edge locations. ALB distributes to Auto Scaling EC2 across AZs. Aurora Multi-AZ ensures DB high availability with automatic failover.'},
  {id:'s2',title:'Serverless API Backend',desc:'A mobile app needs a scalable REST API that costs nothing when idle, auto-scales, and stores user data.',components:[{label:'API Layer',correct:'Amazon API Gateway',options:['Amazon API Gateway','Amazon Route 53','AWS Direct Connect','Amazon VPC']},{label:'Compute',correct:'AWS Lambda',options:['AWS Lambda','Amazon EC2','Amazon EKS','AWS Fargate']},{label:'Database',correct:'Amazon DynamoDB',options:['Amazon DynamoDB','Amazon Redshift','Amazon RDS Oracle','Amazon EMR']},{label:'Authentication',correct:'Amazon Cognito',options:['Amazon Cognito','AWS KMS','IAM Users only','Amazon Inspector']},{label:'File Storage',correct:'Amazon S3',options:['Amazon S3','Amazon EBS','Amazon EFS','AWS Storage Gateway']}],explanation:'API Gateway triggers Lambda functions with no servers to manage. DynamoDB provides serverless NoSQL at scale. Cognito handles user auth. S3 stores files. You pay per request, zero cost when idle.'},
  {id:'s3',title:'Real-Time Data Pipeline',desc:'IoT sensors send millions of events per second. Data must be processed, stored for analytics, and trigger alerts.',components:[{label:'Ingestion',correct:'Amazon Kinesis Data Streams',options:['Amazon Kinesis Data Streams','Amazon SQS Standard','Amazon SNS','AWS DataSync']},{label:'Processing',correct:'AWS Lambda',options:['AWS Lambda','Amazon Redshift','Amazon RDS','AWS Snowball']},{label:'Data Lake',correct:'Amazon S3',options:['Amazon S3','Amazon EBS','Amazon RDS','Amazon ElastiCache']},{label:'Analytics',correct:'Amazon Athena',options:['Amazon Athena','Amazon Connect','AWS OpsWorks','Amazon Polly']},{label:'Alerting',correct:'Amazon SNS',options:['Amazon SNS','AWS Config','Amazon Macie','AWS Artifact']}],explanation:'Kinesis ingests high-throughput streams. Lambda processes records in real time. S3 forms the data lake. Athena runs serverless SQL analytics on S3. SNS delivers real-time alerts.'},
  {id:'s4',title:'Disaster Recovery',desc:'A financial system needs RPO less than 15 minutes and RTO less than 1 hour across AWS regions.',components:[{label:'DB Replication',correct:'RDS Cross-Region Read Replica',options:['RDS Cross-Region Read Replica','DynamoDB DAX','Amazon ElastiCache','Amazon Redshift']},{label:'Storage Sync',correct:'S3 Cross-Region Replication',options:['S3 Cross-Region Replication','Amazon EBS Snapshot','AWS DataSync','Amazon EFS']},{label:'DNS Failover',correct:'Route 53 Failover Routing',options:['Route 53 Failover Routing','Amazon CloudFront','AWS Transit Gateway','Amazon VPC Peering']},{label:'Compute Readiness',correct:'EC2 AMI in DR Region',options:['EC2 AMI in DR Region','Amazon Lightsail','AWS Batch','Fargate Only']},{label:'Orchestration',correct:'AWS CloudFormation',options:['AWS CloudFormation','Amazon SageMaker','Amazon Comprehend','AWS Artifact']}],explanation:'RDS cross-region replicas achieve RPO under 15 minutes. S3 CRR keeps objects in sync. Route 53 failover routing redirects traffic on health check failure. AMIs in the DR region allow rapid EC2 launch. CloudFormation re-creates the full stack.'},
  {id:'s5',title:'Microservices on Containers',desc:'10 microservices need independent deployments, service discovery, auto-scaling, and zero-downtime updates.',components:[{label:'Orchestration',correct:'Amazon EKS',options:['Amazon EKS','Amazon EC2 only','AWS Batch','Amazon Lightsail']},{label:'Service Discovery',correct:'AWS Cloud Map',options:['AWS Cloud Map','Amazon Route 53 Simple','Amazon SQS','AWS CloudTrail']},{label:'Container Registry',correct:'Amazon ECR',options:['Amazon ECR','Amazon S3','AWS CodeArtifact','Amazon EFS']},{label:'Load Balancing',correct:'Application Load Balancer',options:['Application Load Balancer','Amazon CloudFront','AWS Direct Connect','AWS Transit Gateway']},{label:'CI/CD',correct:'AWS CodePipeline',options:['AWS CodePipeline','Amazon SageMaker','Amazon Connect','AWS Glue']}],explanation:'EKS manages Kubernetes pods for each microservice. Cloud Map provides service discovery. ECR stores container images. ALB routes HTTP traffic with path-based rules. CodePipeline automates build and blue/green deployment.'},
];

const TRUTHY_FACTS = [
  {svc:'Amazon S3',stmt:'Amazon S3 stores data as objects in buckets.',ans:true},
  {svc:'Amazon S3',stmt:'Amazon S3 is a block storage service like a hard drive.',ans:false},
  {svc:'AWS Lambda',stmt:'Lambda functions can run for a maximum of 15 minutes.',ans:true},
  {svc:'AWS Lambda',stmt:'Lambda requires you to manage the underlying EC2 servers.',ans:false},
  {svc:'Amazon EC2',stmt:'EC2 Spot Instances can be reclaimed by AWS with 2-minute notice.',ans:true},
  {svc:'Amazon EC2',stmt:'EC2 Reserved Instances offer up to 90% savings over On-Demand.',ans:false},
  {svc:'Amazon RDS',stmt:'RDS Multi-AZ provides automatic failover to a standby replica.',ans:true},
  {svc:'Amazon RDS',stmt:'RDS Read Replicas are used for disaster recovery failover.',ans:false},
  {svc:'Amazon DynamoDB',stmt:'DynamoDB is a serverless, fully managed NoSQL database.',ans:true},
  {svc:'Amazon DynamoDB',stmt:'DynamoDB supports full SQL queries natively without add-ons.',ans:false},
  {svc:'Amazon CloudFront',stmt:'CloudFront is a CDN that caches content at global edge locations.',ans:true},
  {svc:'Amazon CloudFront',stmt:'CloudFront can only serve content stored in Amazon S3.',ans:false},
  {svc:'AWS IAM',stmt:'An IAM Role provides temporary credentials that can be assumed by services.',ans:true},
  {svc:'AWS IAM',stmt:'IAM policies can grant permissions but can never explicitly deny them.',ans:false},
  {svc:'Amazon VPC',stmt:'A NAT Gateway lets private subnet instances access the internet outbound.',ans:true},
  {svc:'Amazon VPC',stmt:'Security Groups in AWS are stateless and do not track connections.',ans:false},
  {svc:'AWS CloudFormation',stmt:'CloudFormation uses JSON or YAML templates to define infrastructure.',ans:true},
  {svc:'AWS CloudFormation',stmt:'A CloudFormation change set immediately deploys changes without preview.',ans:false},
  {svc:'Amazon SNS',stmt:'SNS supports a publish/subscribe messaging pattern.',ans:true},
  {svc:'Amazon SNS',stmt:'Amazon SNS guarantees exactly-once message delivery to all subscribers.',ans:false},
  {svc:'Amazon SQS',stmt:'SQS FIFO queues guarantee strict message ordering and exactly-once processing.',ans:true},
  {svc:'Amazon SQS',stmt:'SQS Standard queues guarantee strict first-in, first-out ordering.',ans:false},
  {svc:'AWS KMS',stmt:'AWS KMS creates and controls cryptographic keys used to encrypt data.',ans:true},
  {svc:'Amazon GuardDuty',stmt:'GuardDuty detects threats without requiring agents on EC2 instances.',ans:true},
  {svc:'Amazon GuardDuty',stmt:'GuardDuty requires installing a security agent on every EC2 instance.',ans:false},
  {svc:'Amazon Aurora',stmt:'Amazon Aurora is compatible with both MySQL and PostgreSQL.',ans:true},
  {svc:'Amazon Aurora',stmt:'Aurora stores 6 copies of data across 3 Availability Zones.',ans:true},
  {svc:'AWS Fargate',stmt:'Fargate runs containers without requiring you to manage EC2 servers.',ans:true},
  {svc:'Amazon Kinesis',stmt:'Kinesis Data Streams collects and processes real-time streaming data.',ans:true},
  {svc:'Amazon Athena',stmt:'Athena lets you run SQL queries directly against data in Amazon S3.',ans:true},
  {svc:'AWS Shield Standard',stmt:'AWS Shield Standard is included free with all AWS accounts.',ans:true},
  {svc:'AWS Shield Standard',stmt:'AWS Shield Standard provides a dedicated 24/7 DDoS Response Team.',ans:false},
  {svc:'Amazon EBS',stmt:'A single EBS volume can be attached to multiple EC2 instances at once.',ans:false},
  {svc:'Amazon EFS',stmt:'Amazon EFS can be mounted by multiple EC2 instances simultaneously.',ans:true},
  {svc:'AWS Elastic Beanstalk',stmt:'Elastic Beanstalk automatically handles deployment, scaling, and monitoring.',ans:true},
  {svc:'Amazon Route 53',stmt:'Route 53 is both a DNS web service and a domain name registrar.',ans:true},
  {svc:'AWS Secrets Manager',stmt:'Secrets Manager can automatically rotate database credentials on a schedule.',ans:true},
  {svc:'Amazon Cognito',stmt:'Cognito User Pools handle user authentication (sign-up and sign-in).',ans:true},
  {svc:'AWS Organizations',stmt:'AWS Organizations supports consolidated billing across all member accounts.',ans:true},
  {svc:'Amazon Redshift',stmt:'Amazon Redshift is optimized for OLAP analytical workloads.',ans:true},
  {svc:'AWS Transit Gateway',stmt:'Transit Gateway connects multiple VPCs and on-premises networks through a central hub.',ans:true},
  {svc:'AWS Transit Gateway',stmt:'You still need individual VPC peering connections when using Transit Gateway.',ans:false},
  {svc:'Amazon RDS Proxy',stmt:'RDS Proxy improves scalability by pooling and sharing database connections.',ans:true},
  {svc:'Amazon RDS Proxy',stmt:'RDS Proxy is used to replicate your database across multiple regions.',ans:false},
  {svc:'AWS PrivateLink',stmt:'AWS PrivateLink provides private connectivity to services without internet exposure.',ans:true},
  {svc:'DynamoDB Global Tables',stmt:'DynamoDB Global Tables provide multi-region, multi-active replication.',ans:true},
  {svc:'DynamoDB Global Tables',stmt:'DynamoDB Global Tables only allow writes in the primary region.',ans:false},
  {svc:'Amazon DAX',stmt:'DAX (DynamoDB Accelerator) provides microsecond read latency as an in-memory cache.',ans:true},
  {svc:'Amazon EventBridge',stmt:'EventBridge is a serverless event bus that routes events between services.',ans:true},
  {svc:'Amazon EventBridge',stmt:'EventBridge can only receive events from AWS services, not custom applications.',ans:false},
  {svc:'Amazon Aurora Serverless',stmt:'Aurora Serverless automatically scales capacity up and down based on application demand.',ans:true},
  {svc:'Amazon OpenSearch',stmt:'Amazon OpenSearch Service is used for log analytics, search, and real-time monitoring.',ans:true},
  {svc:'AWS Global Accelerator',stmt:'Global Accelerator uses the AWS global network to route TCP and UDP traffic.',ans:true},
  {svc:'AWS Global Accelerator',stmt:'Global Accelerator and CloudFront provide identical functionality for all use cases.',ans:false},
  {svc:'AWS Backup',stmt:'AWS Backup provides a centralized service to automate backups across multiple AWS services.',ans:true},
  {svc:'AWS Support Plans',stmt:'The Basic support plan includes access to all Trusted Advisor checks.',ans:false},
  {svc:'AWS Support Plans',stmt:'Business support provides 24/7 phone, email, and chat technical support.',ans:true},
  {svc:'AWS Support Plans',stmt:'The Developer plan includes a dedicated Technical Account Manager.',ans:false},
  {svc:'AWS Support Plans',stmt:'Enterprise support includes a dedicated TAM for proactive guidance.',ans:true},
  {svc:'AWS Support Plans',stmt:'Enterprise On-Ramp provides a pool of TAMs rather than a single dedicated one.',ans:true},
  {svc:'AWS Support Plans',stmt:'Business support guarantees a 15-minute response for business-critical outages.',ans:false},
  {svc:'AWS Support Plans',stmt:'Enterprise support provides a 15-minute response for business-critical system failures.',ans:true},
  {svc:'AWS Support Plans',stmt:'The Basic plan allows unlimited technical support cases via email.',ans:false},
  {svc:'AWS Support Plans',stmt:'Both Business and Enterprise plans include the AWS Support API.',ans:true},
  {svc:'AWS Support Plans',stmt:'A Concierge Support Team is included with Enterprise and Enterprise On-Ramp plans.',ans:true},
];

const SUPPORT_QS = [
  {q:'Which plan gives you a dedicated Technical Account Manager?',opts:['Developer','Business','Enterprise On-Ramp','Enterprise'],correct:3,exp:'Only Enterprise includes a dedicated TAM. Enterprise On-Ramp provides a pool of TAMs, not a dedicated one.'},
  {q:'Response time for a business-critical system down on Enterprise support?',opts:['4 hours','1 hour','30 minutes','15 minutes'],correct:3,exp:'Enterprise guarantees less than 15 minutes for business-critical system failures. Enterprise On-Ramp is 30 minutes.'},
  {q:'Minimum plan for 24/7 phone and chat support?',opts:['Basic','Developer','Business','Enterprise On-Ramp'],correct:2,exp:'Business support is the first plan offering 24/7 phone, email, and chat technical support.'},
  {q:'How many Trusted Advisor checks does Basic include?',opts:['0','6 core checks','50 checks','All checks'],correct:1,exp:'Basic includes only 6 core Trusted Advisor checks. Business and above unlock all checks.'},
  {q:'Enterprise On-Ramp vs Enterprise — key TAM difference?',opts:['No phone support','Pool of TAMs not dedicated','No Trusted Advisor','No concierge team'],correct:1,exp:'Enterprise On-Ramp provides a pool of TAMs to rotate in, whereas Enterprise assigns one dedicated TAM.'},
  {q:'Minimum plan to access the AWS Support API?',opts:['Basic','Developer','Business','Enterprise'],correct:2,exp:'Business support and above include access to the AWS Support API for programmatic case management.'},
  {q:'Response time for System Impaired on Developer plan?',opts:['1 hour','4 hrs business hours','12 hrs business hours','24 hrs business hours'],correct:2,exp:'Developer plan guarantees less than 12 business hours for a System Impaired case.'},
  {q:'Which plans include the Concierge Support Team?',opts:['Enterprise only','Enterprise On-Ramp only','Both Enterprise and Enterprise On-Ramp','Business and above'],correct:2,exp:'Both Enterprise and Enterprise On-Ramp include the Concierge Support Team for billing and account questions.'},
  {q:'Minimum monthly cost for Business support?',opts:['Free','$29/month','$100/month','$5,500/month'],correct:2,exp:'Business support starts at $100/month or a tiered percentage of usage, whichever is greater.'},
  {q:'Infrastructure Event Management at no extra cost — which plans?',opts:['Business only','Enterprise On-Ramp only','Enterprise only','Both Enterprise On-Ramp and Enterprise'],correct:3,exp:'IEM is included in both Enterprise On-Ramp and Enterprise. Business can purchase it as an add-on.'},
  {q:'Response time for Production System Down on Business support?',opts:['4 hours','1 hour','30 minutes','15 minutes'],correct:1,exp:'Business support guarantees less than 1 hour when your production system is down.'},
  {q:'Developer plan — how many contacts can open support cases?',opts:['Unlimited','5 contacts','1 primary contact','3 contacts'],correct:2,exp:'Developer plan allows only 1 primary contact. Business and above allow unlimited contacts.'},
  {q:'Which plan has NO technical support cases at all?',opts:['Developer','Business','Basic','Enterprise On-Ramp'],correct:2,exp:'Basic support has no technical support cases. It only covers billing/account questions and documentation access.'},
  {q:'What is the starting price for Enterprise On-Ramp?',opts:['$100/month','$1,000/month','$5,500/month','$15,000/month'],correct:2,exp:'Enterprise On-Ramp starts at $5,500/month. Enterprise starts at $15,000/month.'},
];

const WA_QS = [
  {q:'AWS CloudTrail and AWS Config are core to which pillar?',ans:'Security',exp:'CloudTrail (API audit logs) and Config (resource compliance evaluation) are detective controls in the Security pillar.'},
  {q:'Using Spot Instances and S3 Intelligent-Tiering supports which pillar?',ans:'Cost Optimization',exp:'Spot Instances and Intelligent-Tiering reduce spend — core practices of the Cost Optimization pillar.'},
  {q:'Auto Scaling Groups and Route 53 health checks directly support which pillar?',ans:'Reliability',exp:'Auto Scaling and health-check-based routing help workloads recover from failures — the Reliability pillar.'},
  {q:'"Perform operations as code" and "learn from all failures" are principles of which pillar?',ans:'Operational Excellence',exp:'Operational Excellence covers running workloads effectively, automating changes, and improving from operational failures.'},
  {q:'Using CloudFront and DynamoDB DAX to reduce latency falls under which pillar?',ans:'Performance Efficiency',exp:'Caching and CDN reduce latency — Performance Efficiency is about using resources efficiently as demand changes and evolves.'},
  {q:'Measuring and reducing your cloud carbon footprint belongs to which pillar?',ans:'Sustainability',exp:'The Sustainability pillar minimises environmental impact through efficient resource usage, Graviton processors, and serverless.'},
  {q:'Which pillar emphasises "stop guessing capacity" and "test recovery procedures"?',ans:'Reliability',exp:'Reliability focuses on right-sizing to avoid capacity guessing, and regularly testing DR procedures.'},
  {q:'AWS Graviton processors and AWS Lambda reduce energy consumption — which pillar?',ans:'Sustainability',exp:'Graviton uses less power per compute unit; Lambda avoids idle servers — both reduce energy and fall under Sustainability.'},
  {q:'Which pillar includes "implement a strong identity foundation" as a core principle?',ans:'Security',exp:'A strong identity foundation (IAM least privilege, MFA, SCPs) is the first principle of the Security pillar.'},
  {q:'"Go global in minutes" and "use serverless architectures" belong to which pillar?',ans:'Performance Efficiency',exp:'Performance Efficiency encourages using managed services to deploy globally fast and serverless to scale without waste.'},
  {q:'AWS Budgets, Cost Explorer, and Reserved Instances are tools for which pillar?',ans:'Cost Optimization',exp:'Cost Optimization pillar uses these tools to understand, track, and reduce AWS spending over time.'},
  {q:'Route 53 failover routing and RDS Multi-AZ primarily serve which pillar?',ans:'Reliability',exp:'Failover routing and Multi-AZ standby both ensure workloads continue operating despite infrastructure failures.'},
  {q:'"Make frequent small reversible changes" is a principle of which pillar?',ans:'Operational Excellence',exp:'Operational Excellence encourages small, reversible deployments (e.g., canary releases) over large risky changes.'},
];
