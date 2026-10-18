const FINOPS_GUIDES = [
  {
    id:'understand',icon:'📈',title:'Understand Cloud Usage & Cost',
    summary:'Build visibility into usage, cost, allocation, and cloud data.',
    sections:[
      {title:'Inform through timely data',body:'The Inform phase creates visibility and shared understanding of cloud usage and cost. Make data accessible at a useful level of detail, and provide it soon enough to influence decisions.'},
      {title:'Allocation and ownership',body:'Use account structures, tags, labels, and other metadata to associate spend with products, teams, environments, or cost centers. Define ownership and continuously improve coverage; unallocated and shared costs should remain visible.'},
      {title:'Choose the right cost view',body:'Unblended, net, amortized, and list cost answer different questions. Use consistent metrics, time periods, and scopes when comparing actuals, forecasts, and budgets. Amortization can spread eligible commitment costs over their benefit period.'},
      {title:'Cost and usage data',body:'Billing exports and provider cost-management tools can provide detailed records for analysis. Normalize, validate, and enrich the data for the questions teams need to answer. The FinOps Open Cost and Usage Specification (FOCUS) provides a common schema for cost and usage data.'}
    ]
  },
  {
    id:'business-value',icon:'🎯',title:'Quantify Business Value',
    summary:'Connect cloud investment and unit costs to measurable outcomes.',
    sections:[
      {title:'From spend to value',body:'Cloud spend is an input, not a measure of success by itself. Evaluate cost alongside business outcomes such as revenue, customer experience, delivery speed, resilience, and product adoption.'},
      {title:'Unit economics',body:'Relate cost to a meaningful unit of output, such as cost per transaction, customer, workload, or feature. Trend the unit metric with business and operational measures to understand whether efficiency and value are improving.'},
      {title:'Forecasts and budgets',body:'Forecasts estimate expected future usage and cost to support planning. Compare actuals with forecasts, investigate material variances with the owning teams, and update assumptions when demand or architecture changes.'},
      {title:'Showback and chargeback',body:'Showback communicates costs to teams to build awareness. Chargeback assigns costs to budgets or financial accounts. Both depend on trusted allocation data and transparent policies for shared services.'}
    ]
  },
  {
    id:'optimize',icon:'⚙️',title:'Optimize Cloud Usage & Cost',
    summary:'Improve cloud efficiency while preserving business and service outcomes.',
    sections:[
      {title:'Usage and rate',body:'Usage optimization improves how resources are selected and consumed: remove verified waste, right-size, schedule non-production resources, and improve architecture. Rate optimization evaluates pricing options and eligible discounts.'},
      {title:'Commitments',body:'Commitment-based discounts can reduce rates for stable, predictable usage. Assess historical patterns, expected demand, flexibility, coverage, utilization, and the financial impact if workloads change before committing.'},
      {title:'Make business-aware trade-offs',body:'Lower cost is not always better if it harms reliability, security, performance, or customer experience. Evaluate optimization opportunities against service objectives and business value, and measure the result after implementation.'},
      {title:'Continuous optimization',body:'Optimization is iterative. Prioritize opportunities by expected impact, effort, risk, and ownership. Validate changes safely, assign follow-up actions, and confirm actual outcomes rather than relying only on estimated savings.'}
    ]
  },
  {
    id:'practice',icon:'🤝',title:'Manage the FinOps Practice',
    summary:'Organize collaboration, accountability, governance, and continuous improvement.',
    sections:[
      {title:'The iterative lifecycle',body:'Inform builds understanding, Optimize identifies and implements improvements, and Operate embeds measurement and action into ongoing work. Organizations move among these phases continuously as cloud usage and business needs change.'},
      {title:'Shared responsibility',body:'Engineering, product, finance, procurement, leadership, and platform teams contribute different expertise. The teams building and using services need timely information and the ability to make trade-offs; a central FinOps function enables consistent practices and collaboration.'},
      {title:'Principles in practice',body:'Teams collaborate, everyone takes ownership of their cloud usage, decisions are driven by business value, and accessible, timely data enables action. Central teams should enable and guide rather than become a bottleneck for every workload decision.'},
      {title:'Governance and culture',body:'Use policies, budgets, anomaly detection, and review cadences to help teams act early. Make expectations clear and cultivate learning-oriented responses to anomalies so that teams improve forecasting, architecture, and controls.'}
    ]
  }
];

let finopsGameState={mode:'',deck:[],index:0,score:0,answered:false,revealed:false,selected:-1};

function renderFinOpsMenu() {
  const area=document.getElementById('game-area');
  area.innerHTML=`
    <div class="card" style="text-align:center;padding:12px 16px">
      <div style="font-size:28px;margin-bottom:3px">💹</div>
      <div style="font-size:17px;font-weight:600">FinOps Games &amp; Resources</div>
      <div style="font-size:12px;color:var(--text2)">FinOps Certified Practitioner · Independent study materials</div>
      <button class="btn btn-finops" style="margin-top:10px" onclick="switchExam('finops')">Practice exam →</button>
    </div>
    <div class="section-title" style="padding:0 2px">FinOps games</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="game-mode-btn" onclick="startFinOpsGame('quiz')"><div class="gm-tag"><span class="badge b-finops">FCP</span><span style="background:#e8f5e9;color:#2e7d32">Challenge</span></div><div class="gm-icon">💹</div><div class="gm-name">FinOps Challenge</div><div class="gm-desc">A 10-question round across the FinOps Framework domains.</div></div>
      <div class="game-mode-btn" onclick="startFinOpsGame('flashcards')"><div class="gm-tag"><span class="badge b-finops">FCP</span><span style="background:#f3e5f5;color:#6a1b9a">Review</span></div><div class="gm-icon">🃏</div><div class="gm-name">FinOps Flashcards</div><div class="gm-desc">Review practice questions and explanations at your own pace.</div></div>
    </div>
    <div class="section-title" style="padding:0 2px">Study resources · FinOps Framework</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      ${FINOPS_GUIDES.map(guide=>`<div class="game-mode-btn" onclick="showFinOpsGuide('${guide.id}')"><div class="gm-icon">${guide.icon}</div><div class="gm-name">${guide.title}</div><div class="gm-desc">${guide.summary}</div></div>`).join('')}
    </div>
    <div class="card" style="font-size:12px;color:var(--text2);line-height:1.5">These questions and study notes are independent practice materials and are not official FinOps Foundation exam content.</div>`;
}

function startFinOpsGame(mode) {
  const deck=[...FINOPS_QUESTIONS].sort(()=>Math.random()-.5);
  finopsGameState={mode,deck:mode==='quiz'?deck.slice(0,10):deck,index:0,score:0,answered:false,revealed:false,selected:-1};
  renderFinOpsGameQuestion();
}

function renderFinOpsGameQuestion() {
  const game=finopsGameState;
  const area=document.getElementById('game-area');
  if(game.index>=game.deck.length) {
    const pct=game.mode==='flashcards'?0:Math.round(game.score/game.deck.length*100);
    area.innerHTML=`
      <div class="game-card">
        <div style="font-size:42px;margin-bottom:8px">${game.mode==='flashcards'?'🃏':pct>=80?'🏆':pct>=60?'⭐':'💪'}</div>
        <div style="font-size:20px;font-weight:600">${game.mode==='flashcards'?'FinOps Flashcards complete':'FinOps Challenge complete'}</div>
        ${game.mode==='flashcards'?`<div style="font-size:14px;color:var(--text2);margin-top:8px">${game.deck.length} cards reviewed</div>`:`<div style="font-size:30px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--finops);margin-top:8px">${pct}%</div><div style="font-size:14px;color:var(--text2)">${game.score} of ${game.deck.length} correct</div>`}
      </div>
      <div class="btn-row" style="margin-top:10px"><button class="btn btn-finops" onclick="startFinOpsGame('${game.mode}')" style="flex:1">Play again</button><button class="btn btn-ghost" onclick="renderFinOpsMenu()">FinOps menu</button></div>`;
    return;
  }
  const q=game.deck[game.index];
  if(game.mode==='flashcards') {
    area.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <button class="btn btn-ghost" onclick="renderFinOpsMenu()">← FinOps menu</button>
        <span class="game-score-pill" style="background:var(--finops-dim);color:var(--finops)">${game.index+1}/${game.deck.length}</span>
      </div>
      <div class="game-card" style="text-align:left">
        <div class="badge b-finops">${q.domain}</div>
        <div style="font-size:16px;font-weight:500;line-height:1.5;margin-top:12px">${q.text}</div>
        ${game.revealed?`<div class="explanation" style="margin-top:12px"><strong>${q.options[q.correct]}</strong><br>${q.explanation}</div>`:''}
      </div>
      <button class="btn btn-finops" style="width:100%" onclick="${game.revealed?'nextFinOpsFlashcard()':'revealFinOpsFlashcard()'}">${game.revealed?(game.index===game.deck.length-1?'Finish cards':'Next card →'):'Reveal answer'}</button>`;
    return;
  }
  area.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" onclick="renderFinOpsMenu()">← FinOps menu</button>
      <div style="display:flex;gap:5px"><span class="game-score-pill" style="background:var(--finops-dim);color:var(--finops)">✓ ${game.score}</span><span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${game.index+1}/${game.deck.length}</span></div>
    </div>
    <div class="game-card" style="text-align:left">
      <div class="badge b-finops">${q.domain}</div>
      <div style="font-size:16px;font-weight:500;line-height:1.5;margin-top:12px">${q.text}</div>
    </div>
    <div id="finops-game-options">${q.options.map((option,index)=>`<button class="game-opt" data-finops-choice="${index}">${option}</button>`).join('')}</div>
    ${game.answered?`<div class="explanation" style="margin-top:10px">${q.explanation}</div><button class="btn btn-finops" style="width:100%;margin-top:10px" onclick="nextFinOpsGameQuestion()">${game.index===game.deck.length-1?'See results':'Next question →'}</button>`:''}`;
  if(!game.answered) {
    area.querySelector('#finops-game-options').addEventListener('click',event=>{
      const button=event.target.closest('[data-finops-choice]');
      if(button) answerFinOpsGame(Number(button.dataset.finopsChoice));
    });
  } else {
    area.querySelectorAll('#finops-game-options .game-opt').forEach((button,index)=>{
      button.classList.add('gd');
      if(index===q.correct) button.classList.add('g-correct');
      else if(index===game.selected) button.classList.add('g-wrong');
    });
  }
}

function answerFinOpsGame(choice) {
  const game=finopsGameState;
  if(game.answered) return;
  game.answered=true;
  game.selected=choice;
  if(choice===game.deck[game.index].correct) game.score++;
  renderFinOpsGameQuestion();
}

function nextFinOpsGameQuestion() {
  finopsGameState.index++;
  finopsGameState.answered=false;
  renderFinOpsGameQuestion();
}

function revealFinOpsFlashcard() {
  finopsGameState.revealed=true;
  renderFinOpsGameQuestion();
}

function nextFinOpsFlashcard() {
  finopsGameState.index++;
  finopsGameState.revealed=false;
  renderFinOpsGameQuestion();
}

function showFinOpsGuide(id) {
  const guide=FINOPS_GUIDES.find(item=>item.id===id);
  if(!guide) return;
  document.getElementById('game-area').innerHTML=`
    <button class="btn btn-ghost" style="margin-bottom:12px;width:100%" onclick="renderFinOpsMenu()">← Back to FinOps resources</button>
    <div class="card" style="text-align:center">
      <div style="font-size:30px">${guide.icon}</div>
      <div style="font-size:17px;font-weight:600">${guide.title}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">${guide.summary}</div>
    </div>
    ${guide.sections.map(section=>`<div class="card"><div class="section-title">${section.title}</div><div style="font-size:13px;line-height:1.6;color:var(--text2)">${section.body}</div></div>`).join('')}
    <button class="btn btn-finops" style="width:100%" onclick="switchExam('finops')">Practice FCP questions →</button>`;
}
