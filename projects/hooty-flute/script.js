(() => {
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('#contents-toggle'),panel=document.querySelector('#contents-panel');
  function closeMenu(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='+';}
  toggle.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'+';});
  document.addEventListener('click',e=>{if(!e.target.closest('.reading-tools'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeMenu();toggle.focus();}});
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{closeMenu();document.querySelector(a.hash)?.focus({preventScroll:true});}));
  const chapters=[...document.querySelectorAll('.figma-section')];
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)panel.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-5% 0px -70% 0px',threshold:0});
  chapters.forEach(s=>{s.tabIndex=-1;observer.observe(s);});
  if(!reducedMotion.matches)document.querySelector('#overview').classList.add('entrance');
  let frame;
  const fits=[...document.querySelectorAll('.fit-region')];
  function layout(){
    for(const host of fits){const canvas=host.firstElementChild,w=Number(host.dataset.fitWidth),scale=Math.min(1,host.clientWidth/w);const h=Number(host.dataset.fitHeight)||canvas.offsetHeight;canvas.style.transform=`scale(${scale})`;host.style.height=`${h*scale}px`;host.dataset.scale=String(scale);}
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(layout);}
  const resize=new ResizeObserver(schedule);fits.forEach(h=>{resize.observe(h);resize.observe(h.firstElementChild);});
  document.fonts.ready.then(schedule);window.addEventListener('load',schedule);layout();
  const viewer=document.querySelector('#image-viewer'),viewerImage=viewer.querySelector('img');let returnFocus,dragged=false;
  function inspect(img){if(dragged)return;returnFocus=document.activeElement;viewerImage.src=img.src;viewerImage.alt=img.alt;viewer.showModal();}
  document.querySelectorAll('.inspect-image').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Enlarge: '+img.alt);img.addEventListener('click',()=>inspect(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(img);}});});
  viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});viewer.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
  const gallery=document.querySelector('.modeling-scroll');let drag;
  gallery.addEventListener('pointerdown',e=>{dragged=false;if(e.pointerType!=='mouse'||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,left:gallery.scrollLeft};});
  gallery.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5){dragged=true;gallery.classList.add('is-dragging');gallery.setPointerCapture(e.pointerId);e.preventDefault();gallery.scrollLeft=drag.left-dx;}});
  function finish(e){if(!drag)return;if(gallery.hasPointerCapture(drag.id))gallery.releasePointerCapture(drag.id);drag=null;gallery.classList.remove('is-dragging');setTimeout(()=>{dragged=false},0);}
  window.addEventListener('pointerup',finish);gallery.addEventListener('pointercancel',finish);
  gallery.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const left=e.key==='Home'?0:e.key==='End'?gallery.scrollWidth:gallery.scrollLeft+(e.key==='ArrowRight'?1:-1)*gallery.clientWidth*.8;gallery.scrollTo({left,behavior:reducedMotion.matches?'instant':'smooth'});}});
  const video=document.querySelector('#hooty-film'),play=document.querySelector('.film-play');
  if (!video || !play) return
  play.addEventListener('click',async()=>{try{await video.play();}catch{video.controls=true;video.focus();}});
  video.addEventListener('play',()=>play.hidden=true);video.addEventListener('pause',()=>play.hidden=false);video.addEventListener('ended',()=>play.hidden=false);video.addEventListener('error',()=>{document.querySelector('.media-error').hidden=false;play.hidden=true;});
})();
