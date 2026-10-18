let aiGameState = { mode:'', title:'', deck:[], index:0, score:0, answered:false, revealed:false };

function renderAiGamesMenu() {
  renderGameMenu();
}

function startAiGame(mode) {
  const domains={
    applications:['Applications of Foundation Models'],
    responsible:['Guidelines for Responsible AI','Security, Compliance, and Governance for AI Solutions']
  };
  const pool=AI_PRACTITIONER_QUESTIONS.filter(q=>!domains[mode]||domains[mode].includes(q.domain));
  const deck=[...pool].sort(()=>Math.random()-.5);
  aiGameState={
    mode,
    title:mode==='sprint'?'AI Concept Sprint':mode==='applications'?'Model Applications':mode==='responsible'?'Responsible AI Challenge':mode==='deepdive'?'AI Practitioner Deep Dive':'AI Flashcards',
    deck:mode==='flashcards'?deck:deck.slice(0,10),
    index:0,score:0,answered:false,revealed:false
  };
  renderAiGameQuestion();
}

function renderAiGameQuestion() {
  const game=aiGameState;
  const area=document.getElementById('game-area');
  if(game.index>=game.deck.length) {
    const pct=game.mode==='flashcards'?0:Math.round(game.score/game.deck.length*100);
    area.innerHTML=`
      <div class="game-card">
        <div style="font-size:42px;margin-bottom:8px">${game.mode==='flashcards'?'🃏':pct>=80?'🏆':pct>=60?'⭐':'💪'}</div>
        <div style="font-size:20px;font-weight:600">${game.title} complete</div>
        ${game.mode==='flashcards'
          ?`<div style="font-size:14px;color:var(--text2);margin-top:8px">${game.deck.length} cards reviewed</div>`
          :`<div style="font-size:30px;font-weight:600;font-family:'IBM Plex Mono',monospace;color:var(--ai);margin-top:8px">${pct}%</div><div style="font-size:14px;color:var(--text2)">${game.score} of ${game.deck.length} correct</div>`}
      </div>
      <div class="btn-row" style="margin-top:10px"><button class="btn btn-ai" onclick="startAiGame('${game.mode}')" style="flex:1">Play Again</button><button class="btn btn-ghost" onclick="renderAiGamesMenu()">Game Menu</button></div>`;
    return;
  }
  const q=game.deck[game.index];
  if(game.mode==='flashcards') {
    area.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderAiGamesMenu()">← AWS Games</button>
        <span class="game-score-pill" style="background:var(--ai-dim);color:var(--ai)">${game.index+1}/${game.deck.length}</span>
      </div>
      <div class="game-card" style="text-align:left">
        <div class="badge b-neutral">${q.domain}</div>
        <div style="font-size:16px;font-weight:500;line-height:1.5;margin-top:12px">${q.text}</div>
        ${game.revealed?`<div class="explanation" style="margin-top:12px"><strong>${q.options[q.correct]}</strong><br>${q.explanation}</div>`:''}
      </div>
      <button class="btn btn-ai" style="width:100%" onclick="${game.revealed?'nextAiFlashcard()':'revealAiFlashcard()'}">${game.revealed?(game.index===game.deck.length-1?'Finish cards':'Next card →'):'Reveal answer'}</button>`;
    return;
  }
  area.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 10px" onclick="renderAiGamesMenu()">← AWS Games</button>
      <div style="display:flex;gap:5px">
        <span class="game-score-pill" style="background:var(--ai-dim);color:var(--ai)">✓ ${game.score}</span>
        <span class="game-score-pill" style="background:var(--surface2);color:var(--text2)">${game.index+1}/${game.deck.length}</span>
      </div>
    </div>
    <div class="game-card" style="text-align:left">
      <div class="badge b-neutral">${q.domain}</div>
      <div style="font-size:16px;font-weight:500;line-height:1.5;margin-top:12px">${q.text}</div>
    </div>
    <div id="ai-game-options">${q.options.map((option,index)=>`<button class="game-opt" data-ai-choice="${index}">${option}</button>`).join('')}</div>
    ${game.answered?`<div class="explanation" style="margin-top:10px">${q.explanation}</div><button class="btn btn-ai" style="width:100%;margin-top:10px" onclick="nextAiGameQuestion()">${game.index===game.deck.length-1?'See results':'Next question →'}</button>`:''}`;
  if(!game.answered) {
    area.querySelector('#ai-game-options').addEventListener('click',event=>{
      const button=event.target.closest('[data-ai-choice]');
      if(button) answerAiGame(Number(button.dataset.aiChoice));
    });
  } else {
    area.querySelectorAll('#ai-game-options .game-opt').forEach((button,index)=>{
      button.classList.add('gd');
      if(index===q.correct) button.classList.add('g-correct');
      else if(index===game.selected) button.classList.add('g-wrong');
    });
  }
}

function answerAiGame(choice) {
  const game=aiGameState;
  if(game.answered) return;
  game.answered=true;
  game.selected=choice;
  if(choice===game.deck[game.index].correct) game.score++;
  renderAiGameQuestion();
}

function nextAiGameQuestion() {
  aiGameState.index++;
  aiGameState.answered=false;
  renderAiGameQuestion();
}

function revealAiFlashcard() {
  aiGameState.revealed=true;
  renderAiGameQuestion();
}

function nextAiFlashcard() {
  aiGameState.index++;
  aiGameState.revealed=false;
  renderAiGameQuestion();
}
