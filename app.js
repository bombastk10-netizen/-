'use strict';
const categories={popular:'الأكثر طلبًا',cheesecake:'تشيز كيك',cakes:'الكيك',cookies:'الكوكيز','crepe-waffle':'كريب ووافل',other:'حلويات أخرى'};
const number=new Intl.NumberFormat('ar-SA');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav=document.getElementById('categories');
nav.innerHTML=Object.entries(categories).map(([id,name],i)=>`<a class="category" href="#${id}" data-category="${id}" ${i===0?'aria-current="true"':''}>${name}</a>`).join('');
const sections=document.getElementById('sections');
sections.innerHTML=Object.entries(categories).map(([id,name],i)=>{const items=products.filter(p=>p.category===id);return `<section class="product-section ${id==='popular'?'popular':''}" id="${id}" aria-labelledby="heading-${id}"><div class="section-title"><span aria-hidden="true">0${i+1}</span><h3 id="heading-${id}">${name}</h3><small class="section-count">${number.format(items.length)} أصناف</small></div><div class="grid">${items.map(p=>`<button class="product" data-product="${p.id}" aria-label="${p.name}، ${p.price} ريال، عرض التفاصيل"><div class="product-photo"><img src="${p.image}" alt="${p.name}" width="560" height="450" loading="lazy" decoding="async"><span class="photo-action" aria-hidden="true">+</span></div><div class="product-top"><h4>${p.name}</h4><span class="price">${number.format(p.price)} <small>ريال</small></span></div><p>${p.description}</p></button>`).join('')}</div></section>`}).join('');
const dialog=document.getElementById('detail');let lastTrigger;
document.addEventListener('click',event=>{const button=event.target.closest('[data-product]');if(!button)return;const p=products.find(p=>p.id===Number(button.dataset.product));if(!p)return;lastTrigger=button;document.getElementById('detailImage').src=p.image;document.getElementById('detailImage').alt=p.name;document.getElementById('detailTitle').textContent=p.name;document.getElementById('detailDescription').textContent=p.description;document.getElementById('detailCategory').textContent=categories[p.category];document.getElementById('detailPrice').textContent=number.format(p.price);dialog.showModal();document.body.classList.add('modal-open');});
function closeDetail(){dialog.close()}
document.getElementById('closeDetail').onclick=closeDetail;document.getElementById('backMenu').onclick=closeDetail;
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastTrigger?.focus({preventScroll:true})});
function active(id){nav.querySelectorAll('a').forEach(a=>{if(a.dataset.category===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
nav.addEventListener('click',e=>{const a=e.target.closest('a');if(a)active(a.dataset.category)});
if('IntersectionObserver'in window){const spy=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)active(entry.target.id)},{rootMargin:'-15% 0px -65% 0px',threshold:0});document.querySelectorAll('.product-section').forEach(s=>spy.observe(s));if(!reduced){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');reveal.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.product').forEach(p=>reveal.observe(p))}}
const intro=document.getElementById('intro'),video=document.getElementById('introVideo');
let introDone=false;let introTimer;
function finishIntro(){
 if(introDone)return;
 introDone=true;clearTimeout(introTimer);video.pause();
 document.body.classList.remove('intro-active');intro.classList.add('is-finished');
 setTimeout(()=>{intro.hidden=true},180);
}
video.addEventListener('ended',finishIntro,{once:true});
video.addEventListener('error',finishIntro,{once:true});
// The full original film is accelerated to exactly three seconds.
// A wall-clock cap prevents loading or autoplay restrictions from blocking the menu.
introTimer=setTimeout(finishIntro,3000);
if(reduced){finishIntro()}else{video.play().catch(finishIntro)}
