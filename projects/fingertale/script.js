(() => {
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('#contents-toggle'),panel=document.querySelector('#contents-panel');
  function closeMenu(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='+';}
  toggle.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'+';});
  document.addEventListener('click',e=>{if(!e.target.closest('.reading-tools'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeMenu();toggle.focus();}});
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{closeMenu();document.querySelector(a.hash)?.focus({preventScroll:true});}));
  const chapters=[...document.querySelectorAll('.case-section')];
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll('#contents-panel a,.chapter-link').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-5% 0px -70% 0px',threshold:0});
  chapters.forEach(s=>{s.tabIndex=-1;observer.observe(s);});
  if(!reducedMotion.matches)document.querySelector('#overview').classList.add('entrance');
  let frame;
  const fits=[...document.querySelectorAll('.fit-region')];
  function layout(){for(const host of fits){const canvas=host.firstElementChild,w=Number(host.dataset.fitWidth),scale=Math.min(1,host.clientWidth/w),h=Number(host.dataset.fitHeight)||canvas.offsetHeight;canvas.style.transform=`scale(${scale})`;host.style.height=`${h*scale}px`;host.dataset.scale=String(scale);}}
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(layout);}
  const resize=new ResizeObserver(schedule);fits.forEach(h=>{resize.observe(h);resize.observe(h.firstElementChild);});document.fonts.ready.then(schedule);window.addEventListener('load',schedule);layout();
  const jointData={PIP:['PIP / Proximal interphalangeal joint','Provides most of the finger’s bending motion. Grasping.'],MCP:['MCP / Metacarpophalangeal joint','The primary joint responsible for overall finger mobility. Opening and closing the hand.'],DIP:['DIP / Distal interphalangeal joint','Controls precise fingertip movements, allowing delicate actions.'],CMC:['CMC / Carpometacarpal joint','Allows the thumb to touch the fingertips and perform precision grips.'],Wrist:['Wrist / Wrist joint','Controls the orientation and stability of the entire hand.']};
  const buttons=[...document.querySelectorAll('.joint-button')];
  function selectJoint(name){buttons.forEach(b=>{const active=b.dataset.joint===name;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelector('#joint-title').textContent=jointData[name][0];document.querySelector('#joint-description').textContent=jointData[name][1];document.querySelectorAll('[data-joint-marker]').forEach(m=>m.classList.toggle('active',m.dataset.jointMarker===name));schedule();}
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>selectJoint(b.dataset.joint));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();selectJoint(buttons[next].dataset.joint);}});});
  const viewer=document.querySelector('#image-viewer'),viewerImage=viewer.querySelector('img');let returnFocus;
  function inspect(img){returnFocus=document.activeElement;viewerImage.src=img.src;viewerImage.alt=img.alt;viewer.showModal();}
  document.querySelectorAll('.inspect-image').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Enlarge: '+img.alt);img.addEventListener('click',()=>inspect(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(img);}});});
  viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});viewer.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
  const video=document.querySelector('#fingertale-film'),play=document.querySelector('.film-play');
  if (!video || !play) return
  play.addEventListener('click',async()=>{try{await video.play();}catch{video.controls=true;video.focus();}});video.addEventListener('play',()=>play.hidden=true);video.addEventListener('pause',()=>play.hidden=false);video.addEventListener('ended',()=>play.hidden=false);video.addEventListener('error',()=>{document.querySelector('.media-error').hidden=false;play.hidden=true;});
})();
document.querySelectorAll('[data-art-tab]').forEach(button=>{button.addEventListener('click',()=>{document.querySelectorAll('[data-art-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));document.querySelectorAll('[data-art-panel]').forEach(p=>p.hidden=p.dataset.artPanel!==button.dataset.artTab);document.querySelectorAll(".art-panels .fit-region").forEach(h=>{if(!h.closest("[hidden]")){const scale=Math.min(1,h.clientWidth/1280);h.firstElementChild.style.transform=`scale(${scale})`;h.style.height=Number(h.dataset.fitHeight)*scale+"px"}});window.dispatchEvent(new Event("resize"))});button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-art-tab]')],index=tabs.indexOf(button),next=tabs[(index+(e.key==='ArrowRight'?1:2))%3];next.focus();next.click()})});

