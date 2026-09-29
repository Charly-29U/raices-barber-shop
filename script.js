/* ==========================================================================
   RAÍCES BARBER SHOP - JAVASCRIPT APLICACIÓN PRINCIPAL
   Exclusivo: Pagos por Transferencia (Nequi, Bancolombia, Nu, Davivienda)
   Envío de Comprobante / Finalización en WhatsApp y Sincronización con Admin
   ========================================================================== */

// 1. Valores por Defecto
const SERVICIOS_DEFAULT = [
  {
    id: 1,
    nombre: "Corte Clásico Pompadour & Taper",
    duracion: "45 min",
    precio: 30000,
    anticipo: 15000,
    descripcion: "Corte tradicional a tijera y máquina, lavado con champú mentolado y peinado con pomada premium.",
    imagen: "assets/corte-clasico.jpg"
  },
  {
    id: 2,
    nombre: "Skin Fade & Crop Texturizado",
    duracion: "50 min",
    precio: 35000,
    anticipo: 17500,
    descripcion: "Desvanecido rasurado a cero con navaja libre o shaver, textura superior y perfilado de patillas.",
    imagen: "assets/fade-moderno.jpg"
  },
  {
    id: 3,
    nombre: "Ritual Barba Imperial & Toalla Caliente",
    duracion: "40 min",
    precio: 25000,
    anticipo: 12500,
    descripcion: "Alineación de barba con navaja de afeitar, vapor de ozono, toallas calientes aromáticas y bálsamo nutritivo.",
    imagen: "assets/barba-vip.jpg"
  },
  {
    id: 4,
    nombre: "Paquete VIP: Corte + Barba + Exfoliación",
    duracion: "80 min",
    precio: 55000,
    anticipo: 27500,
    descripcion: "La experiencia completa de distinción: corte de cabello de autor, ritual de barba y mascarilla negra purificante.",
    imagen: "assets/barber-logo-bg.jpg"
  },
  {
    id: 5,
    nombre: "Diseño Urbano, Grecas & Freestyle",
    duracion: "60 min",
    precio: 40000,
    anticipo: 20000,
    descripcion: "Líneas de alta precisión y arte geométrico personalizado sobre degradado milimétrico.",
    imagen: "assets/corte-diseno.jpg"
  },
  {
    id: 6,
    nombre: "Camuflaje de Canas / Tinte Barba & Cabello",
    duracion: "50 min",
    precio: 60000,
    anticipo: 30000,
    descripcion: "Matización natural de canas sin efecto rojizo, hidratación capilar y definición de contornos.",
    imagen: "assets/fade-moderno.jpg"
  }
];

const BARBEROS_DEFAULT = [
  {
    id: 1,
    nombre: "Alejandro 'The King' Silva",
    especialidad: "Master Clásicos & Visagismo",
    experiencia: "12 años de experiencia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    nombre: "Mateo 'Razor' Mendoza",
    especialidad: "Especialista en Skin Fades & Texturas",
    experiencia: "8 años de experiencia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    nombre: "Sebastián 'Barba Negra' Cruz",
    especialidad: "Rituales de Barba & Navaja Libre",
    experiencia: "10 años de experiencia",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    nombre: "Cualquier Barbero Disponible",
    especialidad: "Primer turno disponible",
    experiencia: "Atención inmediata",
    avatar: "assets/logo.png"
  }
];

const BANCOS_DEFAULT = {
  nequi: {
    nombre: "Nequi",
    tagClass: "nequi-tag",
    icono: "fa-solid fa-mobile-screen-button",
    titular: "Raíces Barber Shop",
    numero: "3128914738",
    numeroFormateado: "312 891 4738",
    tipo: "Celular Nequi / Llave Transfiya",
    instrucciones: "Abre tu app Nequi, selecciona 'Envía plata' al número celular 312 891 4738."
  },
  bancolombia: {
    nombre: "Bancolombia",
    tagClass: "bancolombia-tag",
    icono: "fa-solid fa-building-columns",
    titular: "Raíces Barber Shop",
    numero: "45892014512",
    numeroFormateado: "458-920145-12",
    tipo: "Cuenta de Ahorros Bancolombia",
    instrucciones: "Transfiere desde la App Bancolombia a Cuenta de Ahorros."
  },
  nu: {
    nombre: "Nu (Nubank)",
    tagClass: "nu-tag",
    icono: "fa-solid fa-wallet",
    titular: "Raíces Barber Shop",
    numero: "1004829105",
    numeroFormateado: "1004829105",
    tipo: "Cuenta de Ahorros Nu Colombia",
    instrucciones: "Transfiere desde Nu o por Transfiya a la Cuenta de Ahorros Nu."
  },
  davivienda: {
    nombre: "Davivienda / Daviplata",
    tagClass: "davivienda-tag",
    icono: "fa-solid fa-landmark",
    titular: "Raíces Barber Shop",
    numero: "055084721920",
    numeroFormateado: "0550-8472-1920 (Daviplata: 312 891 4738)",
    tipo: "Ahorros Davivienda / Daviplata",
    instrucciones: "Daviplata o Ahorros al 312 891 4738."
  }
};

// Emojis seguros en código Unicode (inmunes a problemas de codificación)
const EMOJIS = {
  BARBER: "\u{1F488}",       // 💈
  TICKET: "\u{1F39F}\uFE0F", // 🎟️
  USER: "\u{1F464}",         // 👤
  PHONE: "\u{1F4F1}",        // 📱
  EMAIL: "\u2709\uFE0F",     // ✉️
  SCISSORS: "\u2702\uFE0F",  // ✂️
  CALENDAR: "\u{1F4C5}",     // 📅
  CLOCK: "\u23F0",           // ⏰
  MONEY: "\u{1F4B0}",        // 💰
  LOCK: "\u{1F512}",         // 🔒
  BANK: "\u{1F3E6}",         // 🏦
  CASH: "\u{1F4B5}",         // 💵
  ALERT: "\u26A0\uFE0F",     // ⚠️
  CAMERA: "\u{1F4F8}",       // 📸
  CHECK: "\u2705",           // ✅
  WAVE: "\u{1F44B}",         // 👋
  SPARKLES: "\u2728"         // ✨
};

// Variables dinámicas en memoria
let WHATSAPP_BARBERIA = "573128914738";
let SERVICIOS = SERVICIOS_DEFAULT;
let BARBEROS = BARBEROS_DEFAULT;
let BANCOS = BANCOS_DEFAULT;

// Cargar datos sincronizados del Admin (localStorage)
function cargarDatosDinamicos() {
  try {
    const s = localStorage.getItem("raices_servicios");
    if (s) SERVICIOS = JSON.parse(s);
  } catch (e) {
    SERVICIOS = SERVICIOS_DEFAULT;
  }

  try {
    const b = localStorage.getItem("raices_barberos");
    if (b) BARBEROS = JSON.parse(b);
  } catch (e) {
    BARBEROS = BARBEROS_DEFAULT;
  }

  try {
    const b = localStorage.getItem("raices_bancos");
    if (b) BANCOS = JSON.parse(b);
  } catch (e) {
    BANCOS = BANCOS_DEFAULT;
  }

  try {
    const cfg = JSON.parse(localStorage.getItem("raices_config") || "{}");
    if (cfg.whatsapp) WHATSAPP_BARBERIA = cfg.whatsapp;
  } catch (e) {
    WHATSAPP_BARBERIA = "573128914738";
  }
}

// Horarios de atención disponibles
const HORARIOS_BASE = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM", 
  "05:30 PM", "06:30 PM", "07:30 PM"
];

// Estado de la Reserva Actual
let citaActual = {
  servicio: SERVICIOS[0],
  barbero: BARBEROS[0],
  fecha: null,
  hora: null,
  cliente: {
    nombre: "",
    telefono: "",
    email: "",
    notas: ""
  },
  bancoSeleccionado: "nequi",
  comprobanteArchivo: null,
  pasoActual: 1
};

// Formateador de moneda en Pesos Colombianos (COP)
function formatoCOP(monto) {
  return "$" + Number(monto).toLocaleString("es-CO") + " COP";
}

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosDinamicos();
  aplicarConfiguracionWeb();
  renderizarGaleriaWeb();
  renderizarServiciosMenu();
  renderizarOpcionesServiciosWizard();
  renderizarBarberosWizard();
  configurarFechasYHorarios();
  configurarEventosNavegacion();
  renderizarDetallesBanco("nequi");
  actualizarResumenSidebar();
  actualizarContadorCitas();
});

// Aplicar configuración general (video de fondo, redes sociales, whatsapp)
function aplicarConfiguracionWeb() {
  try {
    const cfg = JSON.parse(localStorage.getItem("raices_config") || "{}");

    // Video de fondo
    if (cfg.videoUrl) {
      const video = document.getElementById("bgVideo");
      if (video) {
        const source = video.querySelector("source");
        if (source && source.getAttribute("src") !== cfg.videoUrl) {
          source.setAttribute("src", cfg.videoUrl);
          video.load();
        }
      }
    }

    // WhatsApp oficial
    if (cfg.whatsapp) {
      WHATSAPP_BARBERIA = cfg.whatsapp;
      document.querySelectorAll("a[href*='wa.me']").forEach(a => {
        a.href = `https://wa.me/${cfg.whatsapp}`;
      });
      document.querySelectorAll(".contact-line span").forEach(span => {
        if (span.innerText.includes("WhatsApp Oficial:")) {
          span.innerText = `WhatsApp Oficial: +${cfg.whatsapp.slice(0,2)} ${cfg.whatsapp.slice(2,5)} ${cfg.whatsapp.slice(5,8)} ${cfg.whatsapp.slice(8)}`;
        }
      });
    }

    // Redes sociales
    if (cfg.instagram) {
      document.querySelectorAll("a[href*='instagram.com']").forEach(a => {
        a.href = cfg.instagram;
      });
    }

    if (cfg.tiktok) {
      document.querySelectorAll("a[href*='tiktok.com']").forEach(a => {
        a.href = cfg.tiktok;
      });
    }

    if (cfg.email) {
      document.querySelectorAll(".contact-line span").forEach(span => {
        if (span.innerText.includes("@")) {
          span.innerText = cfg.email;
        }
      });
    }
  } catch (e) {
    console.error("Error aplicando configuración web:", e);
  }
}

// Renderizar Galería de Cortes de Autor Dinámicamente
function renderizarGaleriaWeb() {
  const container = document.getElementById("cutsGalleryGrid");
  if (!container) return;

  let items = [];
  try {
    const g = localStorage.getItem("raices_galeria");
    if (g) items = JSON.parse(g);
  } catch (e) {}

  if (!items || items.length === 0) {
    items = SERVICIOS.slice(0, 4).map((s, idx) => ({
      id: s.id,
      titulo: s.nombre,
      badge: idx === 0 ? "El Más Solicitado" : (idx === 1 ? "Alta Precisión" : (idx === 2 ? "Experiencia VIP" : "Tendencia")),
      imagen: s.imagen,
      servicioId: s.id
    }));
  }

  container.innerHTML = items.map((item, idx) => {
    const servLigado = SERVICIOS.find(s => s.id === item.servicioId) || SERVICIOS[idx % SERVICIOS.length] || SERVICIOS[0];
    const precio = servLigado ? servLigado.precio : 35000;
    const anticipo = servLigado ? (servLigado.anticipo || Math.round(precio * 0.5)) : 17500;

    return `
      <div class="cut-card">
        <div class="cut-image-wrapper">
          <img src="${item.imagen}" alt="${item.titulo}" class="cut-img" onerror="this.src='assets/corte-clasico.jpg'">
          <span class="cut-badge">${item.badge || 'Estilo'}</span>
          <div class="cut-overlay">
            <button class="btn-select-cut" onclick="seleccionarServicioPorId(${servLigado ? servLigado.id : 1})">
              <i class="fa-solid fa-check"></i> Elegir este corte
            </button>
          </div>
        </div>
        <div class="cut-info">
          <h3 class="cut-name">${item.titulo}</h3>
          <p class="cut-desc">${servLigado ? servLigado.descripcion : 'Estilo personalizado de alta gama.'}</p>
          <div class="cut-price-row">
            <div class="price-full">
              <span class="lbl">Precio Total</span>
              <span class="val">${formatoCOP(precio)}</span>
            </div>
            <div class="price-advance">
              <span class="lbl">Anticipo (50%)</span>
              <span class="val-gold">${formatoCOP(anticipo)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Renderizar el catálogo de servicios en la sección pública
function renderizarServiciosMenu() {
  const container = document.getElementById("servicesContainer");
  if (!container) return;

  container.innerHTML = SERVICIOS.map(s => `
    <div class="service-card">
      <div class="service-top">
        <h3 class="service-title">${s.nombre}</h3>
        <span class="service-duration"><i class="fa-regular fa-clock"></i> ${s.duracion}</span>
      </div>
      <p class="service-description">${s.descripcion}</p>
      
      <div class="service-pricing-box">
        <div class="total">
          <span>Precio Total:</span>
          <strong>${formatoCOP(s.precio)}</strong>
        </div>
        <div class="advance">
          <span>Anticipo 50%:</span>
          <strong>${formatoCOP(s.anticipo)}</strong>
        </div>
      </div>

      <button class="btn-book-service" onclick="seleccionarServicioPorId(${s.id})">
        <i class="fa-solid fa-calendar-check"></i> Agendar con 50% (${formatoCOP(s.anticipo)})
      </button>
    </div>
  `).join("");
}

// Renderizar Opciones de Servicio en el Wizard de Reserva
function renderizarOpcionesServiciosWizard() {
  const container = document.getElementById("serviceOptionsGrid");
  if (!container) return;

  container.innerHTML = SERVICIOS.map(s => `
    <div class="service-opt-card ${citaActual.servicio && citaActual.servicio.id === s.id ? 'selected' : ''}" 
         onclick="elegirServicioWizard(${s.id}, this)">
      <div class="service-opt-info">
        <h4>${s.nombre}</h4>
        <span><i class="fa-regular fa-clock"></i> ${s.duracion} • ${s.descripcion.substring(0, 50)}...</span>
      </div>
      <div class="service-opt-pricing">
        <div class="price-sub">Total: ${formatoCOP(s.precio)}</div>
        <div class="deposit-pill">
          <i class="fa-solid fa-shield-halved"></i> 50% Anticipo: ${formatoCOP(s.anticipo)}
        </div>
      </div>
    </div>
  `).join("");
}

// Renderizar Barberos en el Wizard
function renderizarBarberosWizard() {
  const container = document.getElementById("barbersGrid");
  if (!container) return;

  container.innerHTML = BARBEROS.map(b => `
    <div class="barber-card ${citaActual.barbero && citaActual.barbero.id === b.id ? 'selected' : ''}" 
         onclick="elegirBarberoWizard(${b.id}, this)">
      <div class="barber-avatar">
        <img src="${b.avatar}" alt="${b.nombre}">
      </div>
      <h4 class="barber-name">${b.nombre}</h4>
      <p class="barber-role">${b.especialidad}</p>
    </div>
  `).join("");
}

// Configuración de Fechas y Horarios
function configurarFechasYHorarios() {
  const dateInput = document.getElementById("bookingDate");
  const quickDatesContainer = document.getElementById("quickDates");
  const today = new Date();
  
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDate = formatYMD(today);
  dateInput.min = minDate;
  dateInput.value = minDate;
  citaActual.fecha = minDate;

  dateInput.addEventListener("change", (e) => {
    citaActual.fecha = e.target.value;
    generarHorariosDisponibles(e.target.value);
    actualizarResumenSidebar();
  });

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  quickDatesContainer.innerHTML = `
    <button type="button" class="btn-quick-date active" onclick="seleccionarFechaRapida('${minDate}', this)">Hoy</button>
    <button type="button" class="btn-quick-date" onclick="seleccionarFechaRapida('${formatYMD(tomorrow)}', this)">Mañana</button>
    <button type="button" class="btn-quick-date" onclick="seleccionarFechaRapida('${formatYMD(dayAfter)}', this)">En 2 Días</button>
  `;

  generarHorariosDisponibles(minDate);
}

function seleccionarFechaRapida(fechaStr, btnElem) {
  document.querySelectorAll(".btn-quick-date").forEach(b => b.classList.remove("active"));
  btnElem.classList.add("active");
  const dateInput = document.getElementById("bookingDate");
  dateInput.value = fechaStr;
  citaActual.fecha = fechaStr;
  generarHorariosDisponibles(fechaStr);
  actualizarResumenSidebar();
}

function generarHorariosDisponibles(fechaSeleccionada) {
  const container = document.getElementById("timeSlotsGrid");
  if (!container) return;

  const sumChars = fechaSeleccionada.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  container.innerHTML = HORARIOS_BASE.map((hora, idx) => {
    const isOccupied = (sumChars + idx) % 5 === 0 && idx !== 0;
    const isSelected = citaActual.hora === hora;

    return `
      <button type="button" 
              class="time-slot ${isOccupied ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
              ${isOccupied ? 'disabled' : ''}
              onclick="seleccionarHora('${hora}', this)">
        ${hora}
      </button>
    `;
  }).join("");

  if (!citaActual.hora) {
    const primerDisponible = HORARIOS_BASE.find((_, idx) => (sumChars + idx) % 5 !== 0 || idx === 0);
    if (primerDisponible) {
      citaActual.hora = primerDisponible;
      const primerBtn = container.querySelector(".time-slot:not(.disabled)");
      if (primerBtn) primerBtn.classList.add("selected");
    }
  }
}

function seleccionarHora(hora, btnElem) {
  document.querySelectorAll(".time-slot").forEach(b => b.classList.remove("selected"));
  btnElem.classList.add("selected");
  citaActual.hora = hora;
  actualizarResumenSidebar();
}

// Selección de Servicios desde el Wizard
function elegirServicioWizard(servicioId, cardElem) {
  document.querySelectorAll(".service-opt-card").forEach(c => c.classList.remove("selected"));
  cardElem.classList.add("selected");
  citaActual.servicio = SERVICIOS.find(s => s.id === servicioId);
  actualizarResumenSidebar();
}

// Selección de Barbero desde el Wizard
function elegirBarberoWizard(barberoId, cardElem) {
  document.querySelectorAll(".barber-card").forEach(c => c.classList.remove("selected"));
  cardElem.classList.add("selected");
  citaActual.barbero = BARBEROS.find(b => b.id === barberoId);
  actualizarResumenSidebar();
}

// Selección rápida desde la galería de fotos de cortes
function seleccionarServicioYAgendar(index) {
  if (SERVICIOS[index]) {
    citaActual.servicio = SERVICIOS[index];
    renderizarOpcionesServiciosWizard();
    actualizarResumenSidebar();
    
    document.getElementById("agendador").scrollIntoView({ behavior: "smooth" });
    irAlPaso(2);
    mostrarToast(`Has seleccionado: ${citaActual.servicio.nombre}`);
  }
}

function seleccionarServicioPorId(id) {
  const serv = SERVICIOS.find(s => s.id === id);
  if (serv) {
    citaActual.servicio = serv;
    renderizarOpcionesServiciosWizard();
    actualizarResumenSidebar();
    document.getElementById("agendador").scrollIntoView({ behavior: "smooth" });
    irAlPaso(2);
    mostrarToast(`Servicio seleccionado: ${serv.nombre}`);
  }
}

// ==========================================================================
// SELECCIÓN Y RENDERIZADO DE BANCOS (TRANSFERENCIAS)
// ==========================================================================
function seleccionarBanco(bancoKey) {
  citaActual.bancoSeleccionado = bancoKey;
  
  document.querySelectorAll(".transfer-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-bank") === bancoKey);
  });

  renderizarDetallesBanco(bancoKey);
  actualizarResumenSidebar();
}

function renderizarDetallesBanco(bancoKey) {
  const container = document.getElementById("bankDetailsContainer");
  if (!container) return;

  const banco = BANCOS[bancoKey] || BANCOS.nequi;
  const anticipo = citaActual.servicio ? citaActual.servicio.anticipo : 15000;

  container.innerHTML = `
    <div class="bank-info-header">
      <div class="bank-info-title">
        <i class="${banco.icono} gold-text"></i>
        <span>Datos para Transferir a <strong class="gold-light">${banco.nombre}</strong></span>
      </div>
      <span class="bank-tag ${banco.tagClass}">${banco.nombre}</span>
    </div>

    <div class="bank-details-row">
      <span class="lbl">Tipo de Cuenta / Llave:</span>
      <span class="val">${banco.tipo}</span>
    </div>

    <div class="bank-details-row">
      <span class="lbl">Titular:</span>
      <span class="val">${banco.titular}</span>
    </div>

    <div class="bank-details-row">
      <span class="lbl">Número para Transferir:</span>
      <div class="val">
        <span class="account-number-pill">${banco.numeroFormateado}</span>
        <button type="button" class="btn-copy-account" onclick="copiarCuenta('${banco.numero}', '${banco.nombre}')">
          <i class="fa-solid fa-copy"></i> Copiar
        </button>
      </div>
    </div>

    <div class="deposit-required-highlight">
      <span><i class="fa-solid fa-lock"></i> Anticipo Exacto del 50% a Transferir:</span>
      <strong>${formatoCOP(anticipo)}</strong>
    </div>
  `;

  // Actualizar el botón de WhatsApp
  const btnFinishAmount = document.getElementById("btnFinishAmount");
  if (btnFinishAmount) {
    btnFinishAmount.innerText = formatoCOP(anticipo);
  }
}

function copiarCuenta(numero, nombreBanco) {
  navigator.clipboard.writeText(numero).then(() => {
    mostrarToast(`¡Número de ${nombreBanco} copiado al portapapeles!`);
  }).catch(() => {
    mostrarToast(`Número: ${numero}`);
  });
}

function comprobanteSeleccionado(input) {
  const feedback = document.getElementById("voucherFeedback");
  const fileName = document.getElementById("voucherFileName");
  const thumbWrap = document.getElementById("voucherThumbWrap");
  const card = document.getElementById("voucherCard");

  if (input.files && input.files[0]) {
    const file = input.files[0];
    citaActual.comprobanteArchivo = file.name;
    fileName.innerText = `${file.name}`;

    const reader = new FileReader();
    reader.onload = (e) => {
      citaActual.comprobanteDataUrl = e.target.result;
      if (thumbWrap) {
        thumbWrap.innerHTML = `<img src="${e.target.result}" alt="Comprobante">`;
      }
    };
    reader.readAsDataURL(file);

    feedback.style.display = "flex";
    if (card) {
      card.style.borderColor = "#25D366";
      card.classList.remove("shake-error");
    }
    mostrarToast("¡Foto de comprobante cargada con éxito! Ya puedes finalizar tu reserva.");
  }
}

// ==========================================================================
// NAVEGACIÓN ENTRE PASOS DEL WIZARD
// ==========================================================================
function irAlPaso(paso) {
  if (paso === 2 && !citaActual.servicio) {
    mostrarToast("Por favor selecciona un servicio para continuar", "error");
    return;
  }
  if (paso === 3 && !citaActual.barbero) {
    mostrarToast("Por favor selecciona a tu barbero especialista", "error");
    return;
  }
  if (paso === 4 && (!citaActual.fecha || !citaActual.hora)) {
    mostrarToast("Por favor selecciona una fecha y horario", "error");
    return;
  }
  if (paso === 5) {
    const nombre = document.getElementById("clientName").value.trim();
    const tel = document.getElementById("clientPhone").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const notas = document.getElementById("clientNotes").value.trim();

    if (!nombre || !tel || !email) {
      mostrarToast("Completa tus datos de contacto para ver las cuentas de transferencia", "error");
      return;
    }

    citaActual.cliente = { nombre, telefono: tel, email, notas };
    renderizarDetallesBanco(citaActual.bancoSeleccionado);
    actualizarResumenSidebar();
  }

  document.querySelectorAll(".wizard-step").forEach(step => step.classList.remove("active"));
  const targetStep = document.getElementById(`wizardStep${paso}`);
  if (targetStep) targetStep.classList.add("active");

  document.querySelectorAll(".step-indicator").forEach(ind => {
    const num = parseInt(ind.getAttribute("data-step"));
    ind.classList.remove("active", "completed");
    if (num === paso) {
      ind.classList.add("active");
    } else if (num < paso) {
      ind.classList.add("completed");
    }
  });

  document.querySelectorAll(".step-line").forEach((line, idx) => {
    if (idx + 1 < paso) {
      line.classList.add("completed");
    } else {
      line.classList.remove("completed");
    }
  });

  citaActual.pasoActual = paso;
  document.querySelector(".booking-steps-bar").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ==========================================================================
// ACTUALIZACIÓN DEL RESUMEN EN VIVO (CÁLCULO DEL 50%)
// ==========================================================================
function actualizarResumenSidebar() {
  const sumService = document.getElementById("sumService");
  const sumBarber = document.getElementById("sumBarber");
  const sumDate = document.getElementById("sumDate");
  const sumTime = document.getElementById("sumTime");
  const sumBank = document.getElementById("sumBank");
  const sumClient = document.getElementById("sumClient");
  
  const sumTotal = document.getElementById("sumTotal");
  const sumAdvance = document.getElementById("sumAdvance");
  const sumRemaining = document.getElementById("sumRemaining");

  if (citaActual.servicio) {
    sumService.innerText = citaActual.servicio.nombre;
    const total = citaActual.servicio.precio;
    const anticipo = Math.round(total * 0.5); // 50% exacto
    const restante = total - anticipo;

    sumTotal.innerText = formatoCOP(total);
    sumAdvance.innerText = formatoCOP(anticipo);
    sumRemaining.innerText = formatoCOP(restante);
  } else {
    sumService.innerText = "No seleccionado";
    sumTotal.innerText = "$0 COP";
    sumAdvance.innerText = "$0 COP";
    sumRemaining.innerText = "$0 COP";
  }

  sumBarber.innerText = citaActual.barbero ? citaActual.barbero.nombre : "Pendiente";
  
  if (citaActual.fecha) {
    const partes = citaActual.fecha.split("-");
    sumDate.innerText = `${partes[2]}/${partes[1]}/${partes[0]}`;
  } else {
    sumDate.innerText = "Pendiente";
  }

  sumTime.innerText = citaActual.hora || "Pendiente";
  
  const bancoInfo = BANCOS[citaActual.bancoSeleccionado] || BANCOS.nequi;
  sumBank.innerText = bancoInfo.nombre;

  const clientName = document.getElementById("clientName") ? document.getElementById("clientName").value.trim() : "";
  sumClient.innerText = clientName || "-";
}

document.getElementById("clientName")?.addEventListener("input", actualizarResumenSidebar);

// ==========================================================================
// FINALIZAR CITA Y ENVIAR COMPROBANTE DIRECTO A WHATSAPP
// ==========================================================================
function finalizarCitaEnWhatsApp() {
  // Validación estricta: La foto del comprobante es obligatoria
  if (!citaActual.comprobanteArchivo) {
    mostrarToast("⚠️ Es OBLIGATORIO subir la foto del comprobante de transferencia (50%) para confirmar tu cita", "error");
    const vCard = document.getElementById("voucherCard");
    if (vCard) {
      vCard.scrollIntoView({ behavior: "smooth", block: "center" });
      vCard.classList.add("shake-error");
      setTimeout(() => vCard.classList.remove("shake-error"), 800);
    }
    return;
  }

  const total = citaActual.servicio.precio;
  const anticipo50 = Math.round(total * 0.5);
  const saldoPendiente = total - anticipo50;
  const bancoInfo = BANCOS[citaActual.bancoSeleccionado] || BANCOS.nequi;

  const partes = citaActual.fecha ? citaActual.fecha.split("-") : ["--", "--", "----"];
  const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

  const idCita = "RBS-" + Math.floor(100000 + Math.random() * 900000);

  // Objeto de la cita
  const nuevaCita = {
    id: idCita,
    servicio: citaActual.servicio.nombre,
    precioTotal: total,
    anticipoPagado: anticipo50,
    saldoPendiente: saldoPendiente,
    barbero: citaActual.barbero.nombre,
    fecha: citaActual.fecha,
    hora: citaActual.hora,
    banco: bancoInfo.nombre,
    bancoNumero: bancoInfo.numeroFormateado,
    cliente: citaActual.cliente,
    comprobante: citaActual.comprobanteArchivo,
    comprobanteFoto: citaActual.comprobanteDataUrl || null,
    fechaCreacion: new Date().toISOString()
  };

  // Guardar en Storage local
  guardarCitaEnStorage(nuevaCita);

  // Formato del mensaje para WhatsApp usando Emojis Unicode 100% seguros
  const mensajeWhatsApp = [
    `${EMOJIS.BARBER} *RESERVA DE CITA - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
    `${EMOJIS.TICKET} *C\u00F3digo de Cita:* #${nuevaCita.id}`,
    "",
    `${EMOJIS.USER} *Cliente:* ${nuevaCita.cliente.nombre}`,
    `${EMOJIS.PHONE} *WhatsApp:* ${nuevaCita.cliente.telefono}`,
    `${EMOJIS.EMAIL} *Email:* ${nuevaCita.cliente.email}`,
    "",
    `${EMOJIS.SCISSORS} *Servicio / Corte:* ${nuevaCita.servicio}`,
    `${EMOJIS.BARBER} *Maestro Barbero:* ${nuevaCita.barbero}`,
    `${EMOJIS.CALENDAR} *Fecha:* ${fechaBonita}`,
    `${EMOJIS.CLOCK} *Hora:* ${nuevaCita.hora}`,
    "",
    `${EMOJIS.MONEY} *Valor Total:* ${formatoCOP(nuevaCita.precioTotal)}`,
    `${EMOJIS.LOCK} *Anticipo 50%:* ${formatoCOP(nuevaCita.anticipoPagado)}`,
    `${EMOJIS.BANK} *Transferencia por:* ${bancoInfo.nombre} (${bancoInfo.numeroFormateado})`,
    `${EMOJIS.CASH} *Saldo en Barber\u00EDa:* ${formatoCOP(nuevaCita.saldoPendiente)}`,
    "",
    `${EMOJIS.CLOCK} *POL\u00CDTICA ESTRICTA DE 12 HORAS:*`,
    "Puedo editar o cancelar mi cita con un m\u00EDnimo de 12 horas de anticipaci\u00F3n. Entiendo que si faltan menos de 12 horas ya no podr\u00E9 editar ni reagendar y si cancelo o no asisto, el 50% de anticipo enviado no ser\u00E1 reembolsable por respeto al turno apartado.",
    "",
    `${EMOJIS.CAMERA} *FOTO DEL COMPROBANTE ADJUNTA:*`,
    `Archivo: "${nuevaCita.comprobante}"`,
    `${EMOJIS.CHECK} *Te adjunto la foto de la transferencia del 50% en este chat para validar y confirmar mi turno.* \u00A1Muchas gracias!`
  ].join("\n");

  const urlWhatsApp = `https://wa.me/${WHATSAPP_BARBERIA}?text=${encodeURIComponent(mensajeWhatsApp)}`;

  mostrarToast("¡Comprobante verificado! Abriendo WhatsApp...", "success");

  // Abrir WhatsApp en nueva pestaña
  setTimeout(() => {
    window.open(urlWhatsApp, "_blank");
  }, 300);

  // Mostrar el Pase VIP Digital en pantalla
  mostrarTicketModal(nuevaCita, urlWhatsApp);
}

// ==========================================================================
// MODAL TICKET DIGITAL VIP
// ==========================================================================
function mostrarTicketModal(cita, urlWhatsApp) {
  document.getElementById("ticketId").innerText = `#${cita.id}`;
  document.getElementById("ticketClient").innerText = cita.cliente.nombre;
  document.getElementById("ticketPhone").innerText = cita.cliente.telefono;
  document.getElementById("ticketService").innerText = cita.servicio;
  document.getElementById("ticketBarber").innerText = cita.barbero;
  document.getElementById("ticketBankName").innerText = cita.banco;

  const partes = cita.fecha.split("-");
  document.getElementById("ticketDate").innerText = `${partes[2]}/${partes[1]}/${partes[0]}`;
  document.getElementById("ticketTime").innerText = cita.hora;
  
  document.getElementById("ticketPaid").innerText = formatoCOP(cita.anticipoPagado);
  document.getElementById("ticketPending").innerText = formatoCOP(cita.saldoPendiente);

  // Mostrar información del comprobante obligatorio
  const vName = document.getElementById("ticketVoucherName");
  const vThumb = document.getElementById("ticketVoucherThumb");
  if (vName && cita.comprobante) {
    vName.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${cita.comprobante}`;
  }
  if (vThumb) {
    if (cita.comprobanteFoto) {
      vThumb.innerHTML = `<img src="${cita.comprobanteFoto}" style="width:100%; height:100%; object-fit:cover; display:block;" alt="Comprobante">`;
      vThumb.style.display = "block";
    } else {
      vThumb.style.display = "none";
    }
  }

  const btnWS = document.getElementById("btnShareWhatsApp");
  if (btnWS) {
    btnWS.onclick = () => {
      window.open(urlWhatsApp, "_blank");
    };
  }

  document.getElementById("ticketModal").classList.add("open");
}

function cerrarTicketModal() {
  document.getElementById("ticketModal").classList.remove("open");
}

// ==========================================================================
// GUARDADO Y CONSULTA DE CITAS (LOCALSTORAGE + BACKEND NODE.JS)
// ==========================================================================
const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:3000"
  : (localStorage.getItem("raices_api_url") || window.location.origin);

function sincronizarCitaConServidor(cita) {
  try {
    fetch(`${API_URL}/api/citas/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cita)
    })
    .then(r => r.json())
    .then(d => console.log("📡 [SYNC BACKEND] Cita sincronizada:", d))
    .catch(err => console.log("Nota backend local:", err.message));
  } catch (e) {
    console.warn("Sync no disponible:", e);
  }
}

function guardarCitaEnStorage(cita) {
  try {
    const guardadas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    guardadas.unshift(cita);
    localStorage.setItem("imperial_citas", JSON.stringify(guardadas));
    actualizarContadorCitas();
    sincronizarCitaConServidor(cita);
  } catch (err) {
    console.error("Error al guardar cita:", err);
  }
}

function actualizarContadorCitas() {
  const badge = document.getElementById("citasCount");
  if (!badge) return;
  try {
    const guardadas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    badge.innerText = guardadas.length;
  } catch (e) {
    badge.innerText = "0";
  }
}

// Modal "Mis Citas"
document.getElementById("btnOpenMisCitas")?.addEventListener("click", (e) => {
  e.preventDefault();
  abrirMisCitasModal();
});

// ==========================================================================
// SISTEMA DE REGLA ESTRICTA DE 12 HORAS (EDITAR / CANCELAR)
// ==========================================================================
let citaParaCancelarIdx = null;

// Cálculo exacto de horas restantes entre el momento actual y la cita
function calcularHorasRestantesCita(fechaStr, horaStr) {
  if (!fechaStr || !horaStr) return 999;
  try {
    const [year, month, day] = fechaStr.split("-").map(Number);
    const partesHora = horaStr.trim().split(" ");
    const tiempo = partesHora[0].split(":");
    let horas = parseInt(tiempo[0], 10);
    const minutos = parseInt(tiempo[1], 10);
    const periodo = partesHora[1] ? partesHora[1].toUpperCase() : "AM";

    if (periodo === "PM" && horas < 12) horas += 12;
    if (periodo === "AM" && horas === 12) horas = 0;

    const fechaCita = new Date(year, month - 1, day, horas, minutos, 0);
    const ahora = new Date();

    const diffMs = fechaCita.getTime() - ahora.getTime();
    return diffMs / (1000 * 60 * 60);
  } catch (e) {
    return 999;
  }
}

function abrirMisCitasModal() {
  const container = document.getElementById("citasListContainer");
  const modal = document.getElementById("misCitasModal");
  if (!container || !modal) return;

  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    
    if (citas.length === 0) {
      container.innerHTML = `
        <div class="empty-citas-msg">
          <i class="fa-regular fa-calendar-xmark" style="font-size: 2.5rem; color: #555; margin-bottom: 12px; display:block;"></i>
          <p>No tienes citas agendadas por el momento.</p>
          <small>Elige un servicio y reserva tu horario con el 50% de anticipo por transferencia.</small>
        </div>
      `;
    } else {
      container.innerHTML = citas.map((c, idx) => {
        const diffHoras = calcularHorasRestantesCita(c.fecha, c.hora);
        const partesFecha = c.fecha ? c.fecha.split("-") : ["--", "--", "----"];
        const fechaBonita = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
        const estaCancelada = (c.estado || "").toLowerCase().includes("cancelada");

        let badgeTiempo = "";
        let botonesAccion = "";

        if (estaCancelada) {
          badgeTiempo = `<span class="badge-time-rule badge-danger"><i class="fa-solid fa-ban"></i> ${c.estado}</span>`;
          botonesAccion = `<span style="font-size:0.8rem; color:#888;">Cita Inactiva</span>`;
        } else if (diffHoras >= 12) {
          const horasRedondeadas = Math.round(diffHoras);
          badgeTiempo = `<span class="badge-time-rule badge-ok"><i class="fa-solid fa-clock-rotate-left"></i> Faltan ~${horasRedondeadas}h: Puedes Editar o Cancelar</span>`;
          botonesAccion = `
            <div class="cita-actions-row">
              <button class="btn-edit-cita" onclick="abrirModalEditarCita(${idx})">
                <i class="fa-solid fa-pen-to-square"></i> Reagendar / Editar
              </button>
              <button class="btn-cancel-cita" onclick="solicitarCancelacion(${idx})">
                <i class="fa-solid fa-xmark"></i> Cancelar
              </button>
            </div>
          `;
        } else {
          const horasRedondeadas = Math.max(0, Math.round(diffHoras));
          badgeTiempo = `<span class="badge-time-rule badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Faltan ~${horasRedondeadas}h (&lt;12h): NO editable. Cancelar pierde el 50%</span>`;
          botonesAccion = `
            <div class="cita-actions-row">
              <button class="btn-edit-cita disabled" title="Bloqueado: Faltan menos de 12 horas para tu cita">
                <i class="fa-solid fa-lock"></i> Bloqueado (&lt;12h)
              </button>
              <button class="btn-cancel-cita" onclick="solicitarCancelacion(${idx})" title="Al cancelar pierdes el 50% de anticipo">
                <i class="fa-solid fa-triangle-exclamation"></i> Cancelar (Pierde 50%)
              </button>
            </div>
          `;
        }

        return `
          <div class="saved-cita-item">
            <div class="saved-cita-info">
              <h5>#${c.id} - ${c.servicio}</h5>
              <p><i class="fa-regular fa-calendar"></i> ${fechaBonita} • <i class="fa-regular fa-clock"></i> ${c.hora} con <strong>${c.barbero}</strong></p>
              <span class="saved-cita-deposit"><i class="fa-solid fa-lock"></i> Anticipo 50% (${c.banco}): ${formatoCOP(c.anticipoPagado)} | Saldo en barbería: ${formatoCOP(c.saldoPendiente)}</span>
              ${badgeTiempo}
            </div>
            <div>
              ${botonesAccion}
            </div>
          </div>
        `;
      }).join("");
    }

    modal.classList.add("open");
  } catch (err) {
    console.error(err);
  }
}

// Abrir Modal de Edición (+12 Horas de anticipación)
function abrirModalEditarCita(index) {
  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    const cita = citas[index];
    if (!cita) return;

    const diffHoras = calcularHorasRestantesCita(cita.fecha, cita.hora);
    if (diffHoras < 12) {
      mostrarToast("⚠️ No se puede editar: Faltan menos de 12 horas para tu turno.", "error");
      return;
    }

    document.getElementById("editCitaIndex").value = index;
    document.getElementById("editCitaId").value = cita.id;
    document.getElementById("editCitaServicioNombre").innerText = `${cita.servicio} (${formatoCOP(cita.precioTotal)})`;

    // Fechas mínimas (a partir de hoy)
    const fechaInput = document.getElementById("editNuevaFecha");
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    fechaInput.min = minDate;
    fechaInput.value = cita.fecha || minDate;

    // Horarios
    const horaSelect = document.getElementById("editNuevaHora");
    horaSelect.innerHTML = HORARIOS_BASE.map(h => `
      <option value="${h}" ${h === cita.hora ? 'selected' : ''}>${h}</option>
    `).join("");

    // Barberos
    const barberoSelect = document.getElementById("editNuevoBarbero");
    barberoSelect.innerHTML = BARBEROS.map(b => `
      <option value="${b.nombre}" ${b.nombre === cita.barbero ? 'selected' : ''}>${b.nombre} (${b.especialidad})</option>
    `).join("");

    document.getElementById("modalEditarCita").classList.add("open");
  } catch (e) {
    console.error(e);
  }
}

function cerrarModalEditarCita() {
  document.getElementById("modalEditarCita")?.classList.remove("open");
}

function guardarReagendamiento(e) {
  e.preventDefault();
  const index = parseInt(document.getElementById("editCitaIndex").value, 10);
  const nuevaFecha = document.getElementById("editNuevaFecha").value;
  const nuevaHora = document.getElementById("editNuevaHora").value;
  const nuevoBarbero = document.getElementById("editNuevoBarbero").value;

  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    const cita = citas[index];
    if (!cita) return;

    // Actualizar datos
    cita.fecha = nuevaFecha;
    cita.hora = nuevaHora;
    cita.barbero = nuevoBarbero;
    cita.estado = "Reagendada (+12h)";

    localStorage.setItem("imperial_citas", JSON.stringify(citas));
    sincronizarCitaConServidor(cita);

    cerrarModalEditarCita();
    abrirMisCitasModal();
    mostrarToast("¡Cita reagendada con éxito! Abriendo WhatsApp...", "success");

    const partes = nuevaFecha.split("-");
    const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

    // Mensaje para WhatsApp notificando el cambio con Emojis seguros
    const msg = [
      `${EMOJIS.BARBER} *MODIFICACI\u00D3N DE CITA (+12H) - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
      `${EMOJIS.TICKET} *C\u00F3digo de Cita:* #${cita.id}`,
      `${EMOJIS.USER} *Cliente:* ${cita.cliente.nombre}`,
      `${EMOJIS.PHONE} *WhatsApp:* ${cita.cliente.telefono}`,
      "",
      `${EMOJIS.SCISSORS} *Servicio:* ${cita.servicio}`,
      `${EMOJIS.BARBER} *Nuevo Barbero:* ${nuevoBarbero}`,
      `${EMOJIS.CALENDAR} *Nueva Fecha:* ${fechaBonita}`,
      `${EMOJIS.CLOCK} *Nuevo Horario:* ${nuevaHora}`,
      "",
      `${EMOJIS.LOCK} *Anticipo del 50% Conservado:* ${formatoCOP(cita.anticipoPagado)}`,
      `${EMOJIS.CASH} *Saldo Pendiente:* ${formatoCOP(cita.saldoPendiente)}`,
      "",
      `${EMOJIS.CHECK} *Cumplimiento de Pol\u00EDtica:* He realizado esta modificaci\u00F3n con m\u00E1s de 12 horas de anticipaci\u00F3n. Por favor conf\u00EDrmame este nuevo horario. \u00A1Muchas gracias!`
    ].join("\n");

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_BARBERIA}?text=${encodeURIComponent(msg)}`, "_blank");
    }, 400);

  } catch (err) {
    console.error(err);
  }
}

let citaParaCancelarMas12hIdx = null;

function cerrarModalCancelarMas12h() {
  const modal = document.getElementById("modalCancelarMas12h");
  if (modal) modal.classList.remove("open");
  citaParaCancelarMas12hIdx = null;
}

function ejecutarCancelacionMas12h() {
  if (citaParaCancelarMas12hIdx === null) return;
  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    const cita = citas[citaParaCancelarMas12hIdx];
    if (!cita) return;

    cerrarModalCancelarMas12h();

    cita.estado = "Cancelada (+12h)";
    localStorage.setItem("imperial_citas", JSON.stringify(citas));
    sincronizarCitaConServidor(cita);
    actualizarContadorCitas();
    abrirMisCitasModal();
    mostrarToast("Cita cancelada con anticipación.");

    const partes = cita.fecha ? cita.fecha.split("-") : ["--", "--", "----"];
    const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

    const msg = [
      `${EMOJIS.BARBER} *CANCELACI\u00D3N CON ANTICIPACI\u00D3N (+12H) - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
      `${EMOJIS.TICKET} *C\u00F3digo de Cita:* #${cita.id}`,
      `${EMOJIS.USER} *Cliente:* ${cita.cliente.nombre}`,
      `${EMOJIS.SCISSORS} *Servicio:* ${cita.servicio}`,
      `${EMOJIS.CALENDAR} *Fecha:* ${fechaBonita} a las ${cita.hora}`,
      `${EMOJIS.LOCK} *Anticipo 50%:* ${formatoCOP(cita.anticipoPagado)}`,
      "",
      "Aviso que cancelo mi turno con m\u00E1s de 12 horas de anticipaci\u00F3n seg\u00FAn la pol\u00EDtica. Por favor ind\u00EDquenme para reprogramar o resolver mi turno."
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_BARBERIA}?text=${encodeURIComponent(msg)}`, "_blank");
  } catch (err) {
    console.error(err);
  }
}

// Proceso de Cancelación (Evalúa si >=12h o <12h)
function solicitarCancelacion(index) {
  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    const cita = citas[index];
    if (!cita) return;

    const diffHoras = calcularHorasRestantesCita(cita.fecha, cita.hora);

    if (diffHoras >= 12) {
      // Caso A: Más de 12 horas -> Abre modal VIP de confirmación elegante
      citaParaCancelarMas12hIdx = index;
      const modal = document.getElementById("modalCancelarMas12h");
      if (modal) {
        modal.classList.add("open");
        const btnEjecutar = document.getElementById("btnEjecutarCancelacionMas12h");
        if (btnEjecutar) {
          btnEjecutar.onclick = ejecutarCancelacionMas12h;
        }
      }
    } else {
      // Caso B: Menos de 12 horas -> Pierde el 50% de anticipo
      citaParaCancelarIdx = index;
      document.getElementById("cancelLossAmount").innerText = formatoCOP(cita.anticipoPagado);
      document.getElementById("modalCancelarMenos12h").classList.add("open");
    }
  } catch (e) {
    console.error(e);
  }
}

function cerrarModalCancelarAlerta() {
  document.getElementById("modalCancelarMenos12h")?.classList.remove("open");
  citaParaCancelarIdx = null;
}

function ejecutarCancelacionConPerdida() {
  if (citaParaCancelarIdx === null) return;

  try {
    const citas = JSON.parse(localStorage.getItem("imperial_citas") || "[]");
    const cita = citas[citaParaCancelarIdx];
    if (!cita) return;

    // Marcar como cancelada con pérdida de anticipo
    cita.estado = "Cancelada (Anticipo Perdido <12h)";
    localStorage.setItem("imperial_citas", JSON.stringify(citas));
    sincronizarCitaConServidor(cita);
    actualizarContadorCitas();

    cerrarModalCancelarAlerta();
    abrirMisCitasModal();
    mostrarToast("Cita cancelada. Anticipo del 50% retenido por política de <12h.", "error");

    const partes = cita.fecha ? cita.fecha.split("-") : ["--", "--", "----"];
    const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

    // Mensaje WhatsApp formal
    const msg = [
      `${EMOJIS.BARBER} *CANCELACI\u00D3N TARD\u00CDA (<12H) - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
      `${EMOJIS.TICKET} *C\u00F3digo de Cita:* #${cita.id}`,
      `${EMOJIS.USER} *Cliente:* ${cita.cliente.nombre}`,
      `${EMOJIS.PHONE} *WhatsApp:* ${cita.cliente.telefono}`,
      `${EMOJIS.SCISSORS} *Servicio:* ${cita.servicio}`,
      `${EMOJIS.CALENDAR} *Turno:* ${fechaBonita} a las ${cita.hora}`,
      "",
      `${EMOJIS.ALERT} *CONFIRMACI\u00D3N DE P\u00C9RDIDA DE ANTICIPO:*`,
      `Cancelo mi cita con MENOS de 12 horas de antelaci\u00F3n. Entiendo y acepto que el 50% de anticipo (${formatoCOP(cita.anticipoPagado)}) que envi\u00E9 NO es reembolsable debido a que el espacio del barbero ya hab\u00EDa sido apartado.`
    ].join("\n");

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_BARBERIA}?text=${encodeURIComponent(msg)}`, "_blank");
    }, 400);

  } catch (e) {
    console.error(e);
  }
}

function cerrarMisCitasModal() {
  document.getElementById("misCitasModal")?.classList.remove("open");
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
let toastTimer = null;
function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast");
  const msgElem = document.getElementById("toastMessage");
  const iconElem = document.getElementById("toastIcon");

  if (!toast || !msgElem) return;

  msgElem.innerText = mensaje;
  if (tipo === "error") {
    iconElem.className = "fa-solid fa-circle-exclamation";
    iconElem.style.color = "#FF4444";
  } else {
    iconElem.className = "fa-solid fa-circle-check";
    iconElem.style.color = "var(--gold-primary)";
  }

  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ==========================================================================
// EVENTOS DE NAVEGACIÓN, AUDIO Y SCROLL
// ==========================================================================
function configurarEventosNavegacion() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const audioToggle = document.getElementById("audioToggle");
  const bgVideo = document.getElementById("bgVideo");
  const audioIcon = document.getElementById("audioIcon");

  if (audioToggle && bgVideo && audioIcon) {
    audioToggle.addEventListener("click", () => {
      bgVideo.muted = !bgVideo.muted;
      if (bgVideo.muted) {
        audioIcon.className = "fa-solid fa-volume-xmark";
        mostrarToast("Audio silenciado");
      } else {
        bgVideo.volume = 0.5;
        audioIcon.className = "fa-solid fa-volume-high";
        mostrarToast("Audio ambiental activado");
      }
    });
  }
}
