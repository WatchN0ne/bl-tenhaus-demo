/* ==================================================
   BLÜTENHAUS – BIG SCRIPT (FINAL)
   - Loader niemals unendlich
   - iOS safe touches
   - Reveal (IntersectionObserver) nur 1x
   - 9 Produkte aus Daten
   - Filter + Suche + Sort
   - Produkt-Modal
   - Warenkorb Drawer + Qty
   - Checkout Sheet + WhatsApp Link + Copy
   - FAQ: nur 1 offen
================================================== */

/* =========================
   Utils
========================= */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const euro = (n) => n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});

function toast(msg){
  const el = $("#toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> el.classList.remove("show"), 1800);
}

/* =========================
   1) Loader (ANTI-INFINITE)
========================= */
(function(){
  const loader = $("#pageLoader");
  if(!loader) return;
  let done = false;

  function remove(){
    if(done) return;
    done = true;
    loader.classList.add("hide");
    setTimeout(()=> loader.remove(), 900);
  }

  // Normal
  window.addEventListener("load", ()=> setTimeout(remove, 2600));
  // Fallback
  setTimeout(remove, 5200);
})();

/* =========================
   2) Mobile Nav
========================= */
const burger = $("#burger");
const nav = $("#nav");
if(burger && nav){
  burger.addEventListener("click", ()=>{
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  $$(".navLink").forEach(a=>{
    a.addEventListener("click", ()=>{
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded","false");
    });
  });
}

/* Smooth anchor */
document.addEventListener("click", (e)=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute("href");
  const t = $(id);
  if(!t) return;
  e.preventDefault();
  t.scrollIntoView({behavior:"smooth", block:"start"});
  history.pushState(null,"",id);
});

/* =========================
   3) Reveal Observer (ONLY ONCE)
========================= */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
},{threshold:0.15});

function observeReveals(){
  $$(".reveal").forEach(el=> io.observe(el));
}
observeReveals();

/* =========================
   4) Data (9 Products)
========================= */
const PRODUCTS = [
  { sku:"morgenlicht", name:"Chrysanthemen Hortensie Gerbera Schleierkraut", price:34.90, tag:"neutral", mood:"ruhig · warm", size:"M", care:"2–3 Tage frisch schneiden", stock:5,
    desc:"Warme Töne, modern gebunden. Sehr sicher für neutral & danke.",
    img:"914855F6-103E-4AF0-A278-A611AD3F2D1E.jpeg",
    featured: 1
  },
  { sku:"wiesenrand", name:"Wiesenrand", price:31.90, tag:"thanks", mood:"natürlich", size:"M", care:"frisches Wasser", stock:3,
    desc:"Locker, organisch, leicht. Ideal als Danke & Alltag.",
    img:"https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=1600&auto=format&fit=crop",
    featured: 2
  },
  { sku:"leinenweiss", name:"Leinenweiß", price:27.90, tag:"neutral", mood:"klar · hell", size:"S", care:"kühl stellen", stock:6,
    desc:"Helle Ruhe. Minimalistisch, clean — ohne kitschige Wirkung.",
    img:"https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1600&auto=format&fit=crop",
    featured: 3
  },
  { sku:"abendrot", name:"Abendrot", price:36.90, tag:"love", mood:"tief · edel", size:"L", care:"Wasser täglich", stock:4,
    desc:"Satter, eleganter Akzent. Liebe ohne Übertreibung.",
    img:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop",
    featured: 4
  },
  { sku:"still", name:"Still", price:29.90, tag:"getwell", mood:"sanft", size:"M", care:"Stiele schräg", stock:7,
    desc:"Sehr ruhig und weich. Gute Besserung & sensible Anlässe.",
    img:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop",
    featured: 5
  },
  { sku:"fruehling", name:"Frühling", price:33.90, tag:"birthday", mood:"leicht · freundlich", size:"M", care:"nicht in Sonne", stock:5,
    desc:"Helle Energie ohne grelle Farben. Geburtstag: modern & positiv.",
    img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1600&auto=format&fit=crop",
    featured: 6
  },
  { sku:"weissraum", name:"Weißraum", price:28.90, tag:"thanks", mood:"clean", size:"S", care:"Vase sauber", stock:2,
    desc:"Sehr clean, sehr hochwertig. Danke, Neutral, Büro.",
    img:"https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1600&auto=format&fit=crop",
    featured: 7
  },
  { sku:"ruhepol", name:"Ruhepol", price:32.90, tag:"neutral", mood:"balance", size:"M", care:"Blätter entfernen", stock:3,
    desc:"Ausbalanciert, ruhig, perfekt als ‚einfach schön‘.",
    img:"https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=1600&auto=format&fit=crop",
    featured: 8
  },
  { sku:"waldrand", name:"Waldrand", price:35.90, tag:"love", mood:"grün · edel", size:"L", care:"kühl lagern", stock:4,
    desc:"Grün-Details, elegant und modern. Liebe, aber sehr erwachsen.",
    img:"https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
    featured: 9
  }
];

/* =========================
   5) Pickup Times (Heute/Morgen)
========================= */
const pickupDay = $("#pickupDay");
const pickupTime = $("#pickupTime");
const pickupDay2 = $("#pickupDay2");
const pickupTime2 = $("#pickupTime2");
const yearEl = $("#year");
if(yearEl) yearEl.textContent = String(new Date().getFullYear());

function buildTimes(dayLabel){
  // simple, stable slots
  const base = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
  // If today and late, we could filter—but keep stable (no surprises).
  return base;
}

function fillSelect(sel, options, value){
  if(!sel) return;
  sel.innerHTML = options.map(t=> `<option value="${t}">${t}</option>`).join("");
  if(value) sel.value = value;
}

function syncPickupSelectors(fromPrimary=true){
  const day = pickupDay?.value || "Heute";
  const times = buildTimes(day);

  fillSelect(pickupTime, times, pickupTime?.value);
  if(pickupDay2 && pickupTime2){
    pickupDay2.innerHTML = `<option value="Heute">Heute</option><option value="Morgen">Morgen</option>`;
    pickupDay2.value = day;
    fillSelect(pickupTime2, buildTimes(day), pickupTime?.value || times[0]);
  }
}

pickupDay?.addEventListener("change", ()=> syncPickupSelectors(true));
pickupDay2?.addEventListener("change", ()=>{
  if(pickupDay) pickupDay.value = pickupDay2.value;
  syncPickupSelectors(false);
});

pickupTime?.addEventListener("change", ()=>{
  if(pickupTime2) pickupTime2.value = pickupTime.value;
});
pickupTime2?.addEventListener("change", ()=>{
  if(pickupTime) pickupTime.value = pickupTime2.value;
});

syncPickupSelectors();

/* =========================
   6) Render Products
========================= */
const grid = $("#productGrid");
let currentFilter = "all";
let currentSearch = "";
let currentSort = "featured";

function matchesFilter(p){
  if(currentFilter === "all") return true;
  return p.tag === currentFilter;
}

function matchesSearch(p){
  if(!currentSearch) return true;
  const q = currentSearch.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.mood.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q)
  );
}

function sortList(list){
  const arr = [...list];
  if(currentSort === "featured") arr.sort((a,b)=> a.featured - b.featured);
  if(currentSort === "priceAsc") arr.sort((a,b)=> a.price - b.price);
  if(currentSort === "priceDesc") arr.sort((a,b)=> b.price - a.price);
  if(currentSort === "nameAsc") arr.sort((a,b)=> a.name.localeCompare(b.name,"de"));
  return arr;
}

function renderProducts(){
  if(!grid) return;
  const filtered = sortList(PRODUCTS.filter(p=> matchesFilter(p) && matchesSearch(p)));

  if(filtered.length === 0){
    grid.innerHTML = `<div class="note"><div class="noteDot"></div><p class="muted">Keine Treffer. Bitte Suche/Filter anpassen.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product reveal" data-sku="${p.sku}">
      <div class="productMedia">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="tag">${p.mood}</span>
        ${p.stock <= 3 ? `<span class="lowStock">Nur ${p.stock}</span>` : ``}
      </div>

      <div class="productBody">
        <div class="productTop">
          <h3>${p.name}</h3>
          <span class="price">${euro(p.price)}</span>
        </div>

        <p class="muted productDesc">${p.desc}</p>

        <div class="productActions">
          <div class="qty" aria-label="Menge wählen">
            <button class="qtyBtn touch" type="button" data-step="-1">−</button>
            <span class="qtyValue">1</span>
            <button class="qtyBtn touch" type="button" data-step="1">+</button>
          </div>

          <button class="btn btnPrimary touch" type="button" data-add="${p.sku}">In den Warenkorb</button>
          <button class="btn btnGhost touch" type="button" data-detail="${p.sku}">Details</button>
        </div>
      </div>
    </article>
  `).join("");

  observeReveals();
}
renderProducts();

/* =========================
   7) Filters / Search / Sort
========================= */
$$(".chip").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    $$(".chip").forEach(b=> b.classList.remove("isActive"));
    btn.classList.add("isActive");
    currentFilter = btn.dataset.filter || "all";
    renderProducts();
    toast(`Filter: ${btn.textContent.trim()}`);
  });
});

$("#searchInput")?.addEventListener("input", (e)=>{
  currentSearch = e.target.value.trim();
  renderProducts();
});

$("#sortSelect")?.addEventListener("change", (e)=>{
  currentSort = e.target.value;
  renderProducts();
});

$("#jumpToFilters")?.addEventListener("click", ()=>{
  $("#filters")?.scrollIntoView({behavior:"smooth", block:"start"});
});

/* =========================
   8) Cart
========================= */
const cart = new Map(); // sku -> {sku,name,price,img,qty}
const cartCount = $("#cartCount");
const cartCount2 = $("#cartCount2");
const drawer = $("#drawer");
const overlay = $("#overlay");
const cartItems = $("#cartItems");
const subtotalEl = $("#subtotal");
const subtotal2 = $("#subtotal2");

function countCart(){
  let c = 0;
  cart.forEach(i=> c += i.qty);
  return c;
}
function setBadges(){
  const c = countCart();
  if(cartCount) cartCount.textContent = String(c);
  if(cartCount2) cartCount2.textContent = String(c);
}

function subtotal(){
  let s = 0;
  cart.forEach(i=> s += i.price * i.qty);
  return s;
}

function renderCart(){
  setBadges();

  if(!cartItems || !subtotalEl) return;
  if(cart.size === 0){
    cartItems.innerHTML = `<p class="muted">Noch nichts im Warenkorb.</p>`;
    subtotalEl.textContent = euro(0);
    if(subtotal2) subtotal2.textContent = euro(0);
    updateCheckoutSummary();
    return;
  }

  const parts = [];
  cart.forEach(item=>{
    parts.push(`
      <div class="cartItem">
        <div class="cartLeft">
          <img class="cartThumb" src="${item.img}" alt="${item.name}">
          <div>
            <div class="cartName">${item.name}</div>
            <div class="cartMeta">${euro(item.price)} / Stück</div>
          </div>
        </div>

        <div class="cartRight">
          <div class="qty" aria-label="Menge im Warenkorb">
            <button class="qtyBtn touch" type="button" data-cart-step="-1" data-sku="${item.sku}">−</button>
            <span class="qtyValue">${item.qty}</span>
            <button class="qtyBtn touch" type="button" data-cart-step="1" data-sku="${item.sku}">+</button>
          </div>
          <strong>${euro(item.price * item.qty)}</strong>
          <button class="cartRemove touch" type="button" data-remove="${item.sku}">Entfernen</button>
        </div>
      </div>
    `);
  });

  cartItems.innerHTML = parts.join("");
  subtotalEl.textContent = euro(subtotal());
  if(subtotal2) subtotal2.textContent = euro(subtotal());
  updateCheckoutSummary();
}

/* Drawer open/close */
function openCart(){
  overlay?.classList.add("open");
  drawer?.classList.add("open");
  drawer?.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  overlay?.classList.remove("open");
  drawer?.classList.remove("open");
  drawer?.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

$("#openCart")?.addEventListener("click", openCart);
$("#openCart2")?.addEventListener("click", openCart);
$("#stickyOpenCart")?.addEventListener("click", openCart);
$("#closeCart")?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);

/* =========================
   9) Product interactions + Modal
========================= */
const modalOverlay = $("#modalOverlay");
const modal = $("#productModal");

const modalTitle = $("#modalTitle");
const modalImg = $("#modalImg");
const modalTag = $("#modalTag");
const modalPrice = $("#modalPrice");
const modalStock = $("#modalStock");
const modalDesc = $("#modalDesc");
const modalMood = $("#modalMood");
const modalSize = $("#modalSize");
const modalCare = $("#modalCare");
const modalQty = $("#modalQty");
const modalMinus = $("#modalMinus");
const modalPlus = $("#modalPlus");
const modalAdd = $("#modalAdd");

let modalSku = null;
let modalQtyValue = 1;

function openModal(sku){
  const p = PRODUCTS.find(x=> x.sku === sku);
  if(!p || !modal || !modalOverlay) return;

  modalSku = sku;
  modalQtyValue = 1;
  if(modalQty) modalQty.textContent = "1";

  modalTitle.textContent = p.name;
  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalTag.textContent = p.mood;
  modalPrice.textContent = euro(p.price);
  modalStock.textContent = p.stock <= 3 ? `Nur noch ${p.stock} verfügbar` : `Verfügbar`;
  modalDesc.textContent = p.desc;
  modalMood.textContent = `Mood: ${p.mood}`;
  modalSize.textContent = `Größe: ${p.size}`;
  modalCare.textContent = `Pflege: ${p.care}`;

  modalOverlay.classList.add("open");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modalOverlay?.classList.remove("open");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden","true");
  if(!drawer?.classList.contains("open") && !$("#checkoutSheet")?.classList.contains("open")){
    document.body.style.overflow = "";
  }
}

$("#closeModal")?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

$("#openDetailFromHero")?.addEventListener("click", ()=> openModal("abendrot"));

modalMinus?.addEventListener("click", ()=>{
  modalQtyValue = Math.max(1, modalQtyValue - 1);
  if(modalQty) modalQty.textContent = String(modalQtyValue);
});
modalPlus?.addEventListener("click", ()=>{
  modalQtyValue = Math.min(9, modalQtyValue + 1);
  if(modalQty) modalQty.textContent = String(modalQtyValue);
});
modalAdd?.addEventListener("click", ()=>{
  if(!modalSku) return;
  addToCart(modalSku, modalQtyValue);
  closeModal();
  openCart();
});

/* Card click handling */
document.addEventListener("click", (e)=>{
  // qty +/-
  const qtyBtn = e.target.closest(".qtyBtn[data-step]");
  if(qtyBtn){
    const product = e.target.closest(".product");
    if(!product) return;
    const valueEl = $(".qtyValue", product);
    if(!valueEl) return;
    const step = Number(qtyBtn.dataset.step || "0");
    const cur = Number(valueEl.textContent || "1");
    valueEl.textContent = String(Math.max(1, Math.min(9, cur + step)));
    return;
  }

  // add from card
  const addBtn = e.target.closest("[data-add]");
  if(addBtn){
    const sku = addBtn.getAttribute("data-add");
    const product = addBtn.closest(".product");
    const qty = Number($(".qtyValue", product)?.textContent || "1");
    addToCart(sku, qty);

    // micro feedback
    const old = addBtn.textContent;
    addBtn.textContent = "Hinzugefügt ✓";
    addBtn.disabled = true;
    setTimeout(()=>{ addBtn.textContent = old; addBtn.disabled = false; }, 900);
    return;
  }

  // details
  const detBtn = e.target.closest("[data-detail]");
  if(detBtn){
    openModal(detBtn.getAttribute("data-detail"));
    return;
  }

  // remove
  const rm = e.target.closest("[data-remove]");
  if(rm){
    const sku = rm.getAttribute("data-remove");
    cart.delete(sku);
    renderCart();
    toast("Entfernt");
    return;
  }

  // cart qty
  const cbtn = e.target.closest("[data-cart-step]");
  if(cbtn){
    const sku = cbtn.getAttribute("data-sku");
    const step = Number(cbtn.getAttribute("data-cart-step"));
    const item = cart.get(sku);
    if(!item) return;
    item.qty = Math.max(1, Math.min(9, item.qty + step));
    cart.set(sku, item);
    renderCart();
    return;
  }
});

function addToCart(sku, qty){
  const p = PRODUCTS.find(x=> x.sku === sku);
  if(!p) return;
  const existing = cart.get(sku);
  cart.set(sku, {
    sku,
    name: p.name,
    price: p.price,
    img: p.img,
    qty: existing ? Math.min(99, existing.qty + qty) : qty
  });
  renderCart();
  toast("Zum Warenkorb hinzugefügt");
}

/* Clear cart */
$("#clearCart")?.addEventListener("click", ()=>{
  cart.clear();
  renderCart();
  toast("Warenkorb geleert");
});

/* =========================
   10) Checkout Sheet + WhatsApp
========================= */
const sheetOverlay = $("#sheetOverlay");
const sheet = $("#checkoutSheet");

function openCheckout(){
  // if empty: nudge
  if(cart.size === 0){
    toast("Warenkorb ist leer");
    openCart();
    return;
  }
  sheetOverlay?.classList.add("open");
  sheet?.classList.add("open");
  sheet?.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  // sync pickup selects
  if(pickupDay2) pickupDay2.value = pickupDay?.value || "Heute";
  fillSelect(pickupTime2, buildTimes(pickupDay2?.value || "Heute"), pickupTime?.value);
  updateCheckoutSummary();
  updateWhatsAppLink();
}

function closeCheckout(){
  sheetOverlay?.classList.remove("open");
  sheet?.classList.remove("open");
  sheet?.setAttribute("aria-hidden","true");
  if(!drawer?.classList.contains("open") && !modal?.classList.contains("open")){
    document.body.style.overflow = "";
  }
}

$("#openCheckout")?.addEventListener("click", openCheckout);
$("#closeCheckout")?.addEventListener("click", closeCheckout);
sheetOverlay?.addEventListener("click", closeCheckout);

/* Update summary in checkout */
function itemsLine(){
  let lines = [];
  cart.forEach(i=> lines.push(`${i.qty}× ${i.name}`));
  return lines.join(", ");
}

function pickupLine(){
  const day = pickupDay2?.value || pickupDay?.value || "Heute";
  const time = pickupTime2?.value || pickupTime?.value || "—";
  return `${day} ${time}`;
}

function updateCheckoutSummary(){
  const pickupOut = $("#pickupOut");
  const itemsOut = $("#itemsOut");
  if(pickupOut) pickupOut.textContent = pickupLine();
  if(itemsOut) itemsOut.textContent = cart.size ? `${countCart()} Artikel` : "—";
  if(subtotal2) subtotal2.textContent = euro(subtotal());
}

$("#custName")?.addEventListener("input", updateWhatsAppLink);
$("#custPhone")?.addEventListener("input", updateWhatsAppLink);
$("#orderNote")?.addEventListener("input", updateWhatsAppLink);
pickupDay2?.addEventListener("change", ()=>{
  if(pickupDay) pickupDay.value = pickupDay2.value;
  fillSelect(pickupTime2, buildTimes(pickupDay2.value), pickupTime2.value);
  if(pickupTime) pickupTime.value = pickupTime2.value;
  updateCheckoutSummary();
  updateWhatsAppLink();
});
pickupTime2?.addEventListener("change", ()=>{
  if(pickupTime) pickupTime.value = pickupTime2.value;
  updateCheckoutSummary();
  updateWhatsAppLink();
});

function buildOrderText(){
  const name = ($("#custName")?.value || "").trim();
  const phone = ($("#custPhone")?.value || "").trim();
  const note = ($("#orderNote")?.value || "").trim();
  const pickup = pickupLine();
  const items = itemsLine();
  const sum = euro(subtotal());

  const lines = [
    "Hallo Blütenhaus 🌿",
    "",
    "Ich möchte bestellen:",
    items ? `• ${items}` : "• (leer)",
    "",
    `Abholung: ${pickup}`,
    `Zwischensumme: ${sum}`,
    "",
    name ? `Name: ${name}` : "Name: —",
    phone ? `Telefon: ${phone}` : "Telefon: —",
    note ? `Notiz: ${note}` : ""
  ].filter(Boolean);

  return lines.join("\n");
}

function updateWhatsAppLink(){
  const wa = $("#whatsAppOrder");
  if(!wa) return;

  const phoneNumber = "4915159428123"; // <-- HIER Nummer deiner Mutter einsetzen (ohne +, mit Länderkennung)
  const text = encodeURIComponent(buildOrderText());
  wa.href = `https://wa.me/${phoneNumber}?text=${text}`;
}

updateWhatsAppLink();

/* Copy order */
$("#copyOrder")?.addEventListener("click", async ()=>{
  try{
    await navigator.clipboard.writeText(buildOrderText());
    toast("Bestelltext kopiert");
  }catch{
    toast("Kopieren nicht möglich");
  }
});

/* Copy info */
$("#copyInfo")?.addEventListener("click", async ()=>{
  const text = "Blütenhaus — Abholung heute/morgen. Öffnungszeiten Mo–Sa 09:00–18:00. (Adresse hier einsetzen)";
  try{
    await navigator.clipboard.writeText(text);
    toast("Info kopiert");
  }catch{
    toast("Kopieren nicht möglich");
  }
});

/* Scroll helper */
$("#scrollToProducts")?.addEventListener("click", ()=>{
  $("#auswahl")?.scrollIntoView({behavior:"smooth", block:"start"});
});

/* Fake subscribe */
$("#fakeSubscribe")?.addEventListener("click", ()=>{
  toast("Danke! (Demo)");
});

/* =========================
   11) FAQ: only one open
========================= */
$$(".faqItem").forEach(item=>{
  item.addEventListener("toggle", ()=>{
    if(item.open){
      $$(".faqItem").forEach(other=>{
        if(other !== item) other.removeAttribute("open");
      });
    }
  });
});

/* =========================
   12) Quick links
========================= */
$("#openCart2")?.addEventListener("click", openCart);
$("#openCart")?.addEventListener("click", openCart);

/* hero details */
$("#openDetailFromHero")?.addEventListener("click", ()=> openModal("abendrot"));

/* Ensure cart initial */
renderCart();

/* =========================
   13) Keyboard Escape
========================= */
document.addEventListener("keydown", (e)=>{
  if(e.key !== "Escape") return;
  if(modal?.classList.contains("open")) closeModal();
  if(sheet?.classList.contains("open")) closeCheckout();
  if(drawer?.classList.contains("open")) closeCart();
});

const whatsappBtn = document.getElementById("whatsAppOrder");

function updateWhatsAppLink(){
  if(!whatsappBtn) return;

  if(cart.size === 0){
    whatsappBtn.href = "#";
    whatsappBtn.setAttribute("aria-disabled","true");
    return;
  }

  let message = "Hallo 🌿%0A";
  message += "ich möchte folgende Blumen bestellen:%0A%0A";

  cart.forEach(item=>{
    message += `• ${item.qty}× ${item.name} – ${item.price.toFixed(2)} €%0A`;
  });

  message += `%0AAbholung: ${pickupDaySelect.value}%0A`;
  message += "%0AVielen Dank 🌸";

  const phone = "491701234567"; // <-- HIER NUMMER EINTRAGEN
  whatsappBtn.href = `https://wa.me/${phone}?text=${message}`;
  whatsappBtn.removeAttribute("aria-disabled");
}

