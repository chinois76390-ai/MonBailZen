const site=document.getElementById('site'), app=document.getElementById('app');
const openAppBtn=document.getElementById('open-app'); const startDemoBtn=document.getElementById('start-demo');
document.querySelectorAll('#site-tabs .tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('#site-tabs .tab').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  ['home','features','pricing','faq','contact'].forEach(id=>document.getElementById(id).classList.toggle('hidden', id!==btn.dataset.tab));
}));
[openAppBtn,startDemoBtn].forEach(b=>b&&b.addEventListener('click',()=>{site.classList.add('hidden'); app.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});}));
document.querySelectorAll('.subtabs .tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.subtabs .tab').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
  ['dashboard','leases','accounting','docs','settings'].forEach(id=>document.getElementById(id).classList.toggle('hidden', id!==btn.dataset.app));
}));

const S=JSON.parse(localStorage.getItem('mbz_v7')||'{"baux":[],"compta":{}}');
function save(){localStorage.setItem('mbz_v7', JSON.stringify(S)); render();}
function euro(n){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n||0);}
function yyyymm(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0');}
function val(id){const el=document.getElementById(id);return el?el.value:''}
function num(id){const el=document.getElementById(id);return el?parseFloat(el.value||0):0}

const bCreate=document.getElementById('b-create');
if(bCreate){
  bCreate.onclick=()=>{
    const b={id:Math.random().toString(36).slice(2,7).toUpperCase(),
      type:val('b-type'), adr:val('b-adr'), loyer:num('b-loyer'), charges:num('b-charges'),
      date:val('b-date'), depot:num('b-depot'), locataire:val('t-name'), email:val('t-mail'),
      phone:val('t-phone'), garant:val('g-name'), clauses:val('b-clauses'), createdAt:Date.now()};
    if(!b.adr || !b.loyer || !b.locataire){ alert("Adresse, loyer et nom du locataire sont requis."); return; }
    S.baux.push(b);
    const k=yyyymm(new Date()); if(!S.compta[k]) S.compta[k]=[];
    S.compta[k].push({asset:b.adr+" — "+b.locataire, type:'Loyers encaissés', amount:b.loyer});
    save(); alert("Bail créé (démo) + loyer ajouté au mois courant.");
  };
}

const bSign=document.getElementById('b-sign'); if(bSign){ bSign.onclick=()=>alert("Signature eIDAS simulée (démo)."); }
const bPdf=document.getElementById('b-pdf'); if(bPdf){ bPdf.onclick=()=>{ const w=window.open('','_blank'); w.document.write('<!doctype html><title>Bail (démo)</title><div style="font-family:Arial;padding:24px">Aperçu PDF bail (démo).</div>'); w.print(); }; }

const roomsBox=document.getElementById('rooms'); const addRoom=document.getElementById('add-room');
if(addRoom){ addRoom.onclick=()=>{
  const kind=document.getElementById('room-kind').value;
  const el=document.createElement('div'); el.className='card'; el.innerHTML=`
    <h4 style="margin:0 0 6px 0">${kind}</h4>
    <div class="grid g3">
      <div><label>Murs</label><select><option>Neuf</option><option>Bon état</option><option>Correct</option><option>À rafraîchir</option><option>Dégradé</option></select></div>
      <div><label>Plafond</label><select><option>Neuf</option><option>Bon état</option><option>Correct</option><option>À rafraîchir</option><option>Dégradé</option></select></div>
      <div><label>Sol</label><select><option>Neuf</option><option>Bon état</option><option>Correct</option><option>À rafraîchir</option><option>Dégradé</option></select></div>
    </div>
    <div class="grid g3" style="margin-top:6px">
      <div><label>Menuiseries</label><select><option>OK</option><option>À régler</option><option>À réparer</option></select></div>
      <div><label>Radiateurs</label><select><option>OK</option><option>À purger</option><option>À remplacer</option></select></div>
      <div><label>Électroménager / Appareils</label><select><option>OK</option><option>Nettoyage filtre</option><option>En panne</option></select></div>
    </div>
    <label>Commentaire</label><textarea rows="2" placeholder="Observations…"></textarea>
  `;
  roomsBox.appendChild(el);
}; }

function previewFiles(input, boxId){ const box=document.getElementById(boxId); box.innerHTML=''; [...input.files].forEach(f=>{ const img=document.createElement('img'); img.src=URL.createObjectURL(f); box.appendChild(img); }); }
const p1=document.getElementById('e-photos'); if(p1){ p1.addEventListener('change', e=>previewFiles(e.target,'e-prev')); }
const p2=document.getElementById('e-issues'); if(p2){ p2.addEventListener('change', e=>previewFiles(e.target,'e-prev-issues')); }
const ePdf=document.getElementById('e-pdf'); if(ePdf){ ePdf.onclick=()=>{ const w=window.open('','_blank'); w.document.write('<!doctype html><title>EDL (démo)</title><div style="font-family:Arial;padding:24px">Aperçu PDF EDL (démo).</div>'); w.print(); }; }
const eSign=document.getElementById('e-sign'); if(eSign){ eSign.onclick=()=>alert("Signature EDL simulée (démo)."); }

const monthSel=document.getElementById('c-month');
if(monthSel){
  const y=(new Date()).getFullYear();
  for(let i=1;i<=12;i++){ const k=`${y}-${String(i).padStart(2,'0')}`; const o=document.createElement('option'); o.value=k; o.textContent=new Date(`${k}-01`).toLocaleString('fr-FR',{month:'long',year:'numeric'}); monthSel.appendChild(o); }
  monthSel.value=yyyymm(new Date());
  monthSel.addEventListener('change', renderCompta);
}
const cAdd=document.getElementById('c-add');
if(cAdd){ cAdd.onclick=()=>{ const k=monthSel.value, asset=document.getElementById('c-asset').value.trim(), type=document.getElementById('c-type').value, amount=parseFloat(document.getElementById('c-amount').value||0); if(!S.compta[k]) S.compta[k]=[]; S.compta[k].push({asset,type,amount}); save(); }; }

function renderBaux(){
  const box=document.getElementById('b-list'); if(!box) return; box.innerHTML='';
  S.baux.slice().reverse().forEach(b=>{
    const d=document.createElement('div'); d.className='card';
    d.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
      <div><b>${b.type}</b> — <span class="muted">${b.adr}</span>
      <div class="muted">${b.locataire||'Locataire ?'} • Loyer HC: ${euro(b.loyer)} • Charges: ${euro(b.charges)} • Dépôt: ${euro(b.depot)} • Effet: ${b.date||'—'}</div></div>
      <button class="btn" data-del="${b.id}">Supprimer</button></div>`;
    box.appendChild(d);
  });
  box.querySelectorAll('[data-del]').forEach(btn=>btn.addEventListener('click',()=>{ S.baux=S.baux.filter(x=>x.id!==btn.dataset.del); save(); }));
}
function renderCompta(){
  const k=monthSel.value, rows=S.compta[k]||[];
  const el=document.getElementById('c-table'); if(!el) return;
  if(!rows.length){ el.innerHTML='<span class="muted">Aucune ligne.</span>'; document.getElementById('k-loyers').textContent='0 €'; return; }
  let html='<table style="width:100%;border-collapse:collapse"><thead><tr><th>Mois</th><th>Bien / Locataire</th><th>Type</th><th>Montant (€)</th></tr></thead><tbody>';
  let loy=0, dep=0;
  rows.forEach(r=>{ html+=`<tr><td>${k}</td><td>${r.asset||''}</td><td>${r.type}</td><td>${euro(r.amount)}</td></tr>`; if(r.type==='Loyers encaissés') loy+=r.amount; else dep+=r.amount; });
  html+='</tbody></table>'; html+=`<div class="panel" style="margin-top:8px"><b>Total loyers:</b> ${euro(loy)} • <b>Dépenses:</b> ${euro(dep)} • <b>Résultat:</b> ${euro(loy-dep)}</div>`;
  el.innerHTML=html; document.getElementById('k-loyers').textContent=euro(loy);
}
function render(){ renderBaux(); renderCompta(); }
render();
