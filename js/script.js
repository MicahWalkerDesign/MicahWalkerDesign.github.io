/* Minimal behavior: i18n loader, populate timeline & portfolio, expand/collapse, simple toss game */
(async function(){
  const i18n = await fetch('data/i18n.json').then(r=>r.json());
  const experience = await fetch('data/experience.json').then(r=>r.json());
  const portfolio = await fetch('data/portfolio.json').then(r=>r.json());

  const langButtons = document.querySelectorAll('.lang-switch button');
  let lang = localStorage.getItem('lang') || 'en';
  function setLang(newL){
    lang = newL;localStorage.setItem('lang',lang);
    langButtons.forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.dataset.i18n.split('.');
      let v = i18n[lang];
      key.forEach(k=>{ if(v) v=v[k] });
      if(v) el.textContent = v;
    });
    populateTimeline();
    populatePortfolio();
    // announce language change
    announce('Language set to ' + (lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'German'));
  }
  langButtons.forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  setLang(lang);

  // Timeline
  function populateTimeline(){
    const list = document.getElementById('timeline-list');
    list.innerHTML='';
    experience[lang].forEach((item,idx)=>{
      const el = document.createElement('div'); el.className='timeline-item';
      el.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header" role="button" tabindex="0" aria-expanded="false" data-index="${idx}">
            <div>
              <div class="role">${item.role}</div>
              <div class="company">${item.company} — ${item.range}</div>
            </div>
            <div class="chev">▸</div>
          </div>
          <div class="timeline-body">${item.description}</div>
        </div>`;
      list.appendChild(el);
    });
    attachToggleHandlers('.timeline-header', '.timeline-body');
  }

  // Portfolio cards
  function populatePortfolio(){
    const apps = document.getElementById('apps-list'); apps.innerHTML='';
    const sites = document.getElementById('sites-list'); sites.innerHTML='';
    portfolio[lang].apps.forEach((c,i)=> apps.appendChild(caseCard(c,i)));
    portfolio[lang].sites.forEach((c,i)=> sites.appendChild(caseCard(c,i)));
  }
  function caseCard(card,i){
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<div class="card-header" role="button" tabindex="0" aria-expanded="false"><div><strong>${card.title}</strong><div class="company">${card.tag}</div></div><div class="chev">▸</div></div>
      <div class="card-phases">${['Initial Ideas / Problem','Design','Proof of Work','Product'].map((p,j)=>`<div class="phase" data-phase="${j}"><img class="phase-icon" src="assets/icons/phase-${j}.svg" srcset="assets/icons/phase-${j}.svg 1x, assets/icons/phase-${j}.svg 2x" loading="lazy" alt="${p} icon"><strong>${p}</strong><div class="placeholder">Placeholder for ${p} visuals</div></div>`).join('')}</div>`;
    el.querySelector('.card-header').addEventListener('click',()=>{
      const phases = el.querySelector('.card-phases');
      const header = el.querySelector('.card-header');
      const open = phases.classList.toggle('open');
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    return el;
  }

  // common toggler for keyboard/aria
  function attachToggleHandlers(headerSel, bodySel){
    document.querySelectorAll(headerSel).forEach(h=>{
      const body = h.parentElement.querySelector(bodySel);
      h.addEventListener('click',()=>{
        const open = body.classList.toggle('open');
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
        // announce open/close with contextual label
        try{
          const label = h.querySelector('.role') ? h.querySelector('.role').textContent : h.textContent.trim();
          announce((open? 'Expanded ' : 'Collapsed ') + label);
        }catch(e){}
      });
      h.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); h.click(); }
      });
    });
  }

  // Accessible modal helpers
  const modal = document.getElementById('offer-modal');
  const live = document.getElementById('a11y-live');
  let previouslyFocused = null;
  function announce(msg){ if(live){ live.textContent = msg; /* keep it visible briefly for AT */ setTimeout(()=>{ live.textContent = ''; },1200); } }
  function openModal(){
    previouslyFocused = document.activeElement;
    document.getElementById('main').setAttribute('aria-hidden','true');
    modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
    // focus first focusable element inside modal
    const focusables = modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if(focusables.length) focusables[0].focus();
    announce('Offer dialog opened');
    document.addEventListener('keydown', modalKey);
  }
  function closeModal(){
    modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true');
    document.getElementById('main').setAttribute('aria-hidden','false');
    document.removeEventListener('keydown', modalKey);
    if(previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    announce('Offer dialog closed');
  }
  function modalKey(e){
    if(e.key === 'Escape') return closeModal();
    if(e.key !== 'Tab') return;
    // focus trap inside modal
    const focusables = Array.from(modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
    if(focusables.length === 0) return;
    const first = focusables[0]; const last = focusables[focusables.length-1];
    if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
    else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
  }
  document.getElementById('close-offer').addEventListener('click', closeModal);

  // Paper toss: improved physics and accessible controls
  const canvas = document.getElementById('toss-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-game');
  let dpr = window.devicePixelRatio || 1;
  let score = 0; let playing = false; let balls = [];

  function setCanvasSize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(150, Math.floor(rect.height * dpr));
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', ()=>{ dpr = window.devicePixelRatio || 1; setCanvasSize(); drawScene(); });
  setCanvasSize();

  function drawScene(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // scale for drawing text etc.
    ctx.save();
    ctx.scale(1/dpr,1/dpr);
    const w = canvas.width/dpr, h = canvas.height/dpr;
    // bin
    const binX = w - 80, binY = h - 60, binW = 50, binH = 50;
    ctx.fillStyle = '#6b6b6b'; ctx.fillRect(binX,binY,binW,binH);
    ctx.fillStyle = '#ccc'; ctx.fillRect(binX+8,binY+8,binW-16,binH-16);
    ctx.fillStyle = '#222'; ctx.font='14px sans-serif'; ctx.fillText('Score: '+score,10,20);
    // balls
    balls.forEach(b=>{
      ctx.beginPath(); ctx.fillStyle=b.color; ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  function launchBall(targetX){
    const w = canvas.width/dpr, h = canvas.height/dpr;
    const startX = 40, startY = h - 20;
    // compute simple parabolic velocity toward targetX
    const tx = targetX; const dx = tx - startX; const duration = 60 + Math.min(60, Math.abs(dx)/2);
    const vx = dx / duration;
    const vy = - (Math.abs(dx)/duration) - 6; // lift
    const ball = {x:startX,y:startY,vx: vx, vy: vy, r:8, color:'#1E4C3A'};
    balls.push(ball);
  }

  function step(){
    const w = canvas.width/dpr, h = canvas.height/dpr;
    const binX = w - 80, binY = h - 60, binW = 50, binH = 50;
    // update balls
    for(let i=balls.length-1;i>=0;i--){
      const b = balls[i]; b.vy += 0.5; b.x += b.vx; b.y += b.vy;
      if(b.y > h + 30) balls.splice(i,1);
      // collision with bin
      if(b.x > binX && b.x < binX+binW && b.y > binY && b.y < binY+binH){
        balls.splice(i,1); score++; announce('Score ' + score); if(score>=3){ playing=false; openModal(); }
      }
    }
    drawScene();
    if(playing) requestAnimationFrame(step);
  }

  startBtn.addEventListener('click', ()=>{ score=0; balls=[]; playing=true; setCanvasSize(); step(); drawScene(); canvas.focus(); });

  // clicking/tapping canvas launches a ball toward the tapped x coordinate
  canvas.addEventListener('click', (e)=>{
    if(!playing) return; const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left);
    launchBall(x);
  });
  // keyboard accessibility: space to throw toward center
  canvas.setAttribute('tabindex','0');
  canvas.addEventListener('keydown', (e)=>{ if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); if(playing) launchBall((canvas.width/dpr)/2); } });

  // initial draw
  drawScene();

  // Attach toggles for dynamically generated headers
  // (called at end of setLang via populateTimeline/populatePortfolio)
})();
