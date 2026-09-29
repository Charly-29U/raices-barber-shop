/* ==========================================================================
   RAÍCES BARBER SHOP - JAVASCRIPT PANEL DE ADMINISTRACIÓN
   Gestión completa de: Citas, Barberos, Servicios/Cortes, Galería,
   Cuentas Bancarias, Video de Fondo, Redes Sociales y Recordatorios
   ========================================================================== */

// CLAVES DE LOCALSTORAGE
const STORAGE_KEYS = {
  ADMIN_PASS: "raices_admin_pass",
  CITAS: "imperial_citas",
  SERVICIOS: "raices_servicios",
  BARBEROS: "raices_barberos",
  GALERIA: "raices_galeria",
  BANCOS: "raices_bancos",
  CONFIG: "raices_config"
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

// VALORES POR DEFECTO
const DEFAULTS = {
  adminPass: "raices2026",
  servicios: [
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
  ],
  barberos: [
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
  ],
  galeria: [
    { id: 1, titulo: "Corte Clásico Pompadour & Taper", badge: "El Más Solicitado", imagen: "assets/corte-clasico.jpg", servicioId: 1 },
    { id: 2, titulo: "Skin Fade & Crop Texturizado", badge: "Alta Precisión", imagen: "assets/fade-moderno.jpg", servicioId: 2 },
    { id: 3, titulo: "Ritual Barba Imperial & Toalla Caliente", badge: "Experiencia VIP", imagen: "assets/barba-vip.jpg", servicioId: 3 },
    { id: 4, titulo: "Diseño Urbano & Freestyle", badge: "Tendencia", imagen: "assets/corte-diseno.jpg", servicioId: 5 }
  ],
  bancos: {
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
  },
  config: {
    videoUrl: "assets/barbershop.mp4",
    whatsapp: "573128914738",
    instagram: "https://www.instagram.com/raicesbarbershop?stkn=MXc4dW14b3RsZGN5ZA%3D%3D&utm_source=qr",
    tiktok: "https://www.tiktok.com/@raices.barber.sho?_r=1&_t=ZS-9A7bO4knsSy",
    email: "citas@raicesbarbershop.com"
  }
};

// ==========================================================================
// INICIALIZACIÓN Y SEGURIDAD / LOGIN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarDatosStorage();
  verificarSesionAdmin();
});

function inicializarDatosStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PASS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, DEFAULTS.adminPass);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICIOS)) {
    localStorage.setItem(STORAGE_KEYS.SERVICIOS, JSON.stringify(DEFAULTS.servicios));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BARBEROS)) {
    localStorage.setItem(STORAGE_KEYS.BARBEROS, JSON.stringify(DEFAULTS.barberos));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALERIA)) {
    localStorage.setItem(STORAGE_KEYS.GALERIA, JSON.stringify(DEFAULTS.galeria));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANCOS)) {
    localStorage.setItem(STORAGE_KEYS.BANCOS, JSON.stringify(DEFAULTS.bancos));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULTS.config));
  }
}

function verificarSesionAdmin() {
  const isLogged = sessionStorage.getItem("raices_admin_logged") === "true";
  const loginOverlay = document.getElementById("loginOverlay");
  const adminApp = document.getElementById("adminApp");

  if (isLogged) {
    if (loginOverlay) loginOverlay.style.display = "none";
    if (adminApp) adminApp.style.display = "flex";
    cargarDatosPanel();
  } else {
    if (loginOverlay) loginOverlay.style.display = "flex";
    if (adminApp) adminApp.style.display = "none";
  }
}

function iniciarSesionAdmin(e) {
  e.preventDefault();
  const inputPass = document.getElementById("adminPass").value.trim();
  const currentPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULTS.adminPass;

  if (inputPass === currentPass) {
    sessionStorage.setItem("raices_admin_logged", "true");
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("adminApp").style.display = "flex";
    mostrarAdminToast("¡Bienvenido al Panel de Administración!", "success");
    cargarDatosPanel();
  } else {
    mostrarAdminToast("Contraseña incorrecta. Inténtalo de nuevo.", "error");
    document.getElementById("adminPass").classList.add("shake-error");
    setTimeout(() => {
      document.getElementById("adminPass")?.classList.remove("shake-error");
    }, 600);
  }
}

function cerrarSesionAdmin() {
  sessionStorage.removeItem("raices_admin_logged");
  window.location.reload();
}

function togglePassVisibility() {
  const passInput = document.getElementById("adminPass");
  const eyeIcon = document.getElementById("eyeIcon");
  if (passInput.type === "password") {
    passInput.type = "text";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passInput.type = "password";
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function toggleSidebarMobile() {
  document.getElementById("adminSidebar").classList.toggle("open");
}

// ==========================================================================
// TABS NAVIGATION
// ==========================================================================
let botPollTimer = null;

function cambiarTab(tabId) {
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.sidebar-nav .nav-item[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
  const activePane = document.getElementById(tabId);
  if (activePane) activePane.classList.add("active");

  const titles = {
    tabDashboard: "Dashboard de Control & Citas",
    tabServicios: "Gestión de Servicios & Cortes",
    tabBarberos: "Gestión de Maestros Barberos",
    tabGaleria: "Galería de Estilos & Fotos",
    tabBancos: "Cuentas Bancarias de Transferencia",
    tabConfig: "Configuración General, Video & Redes",
    tabWhatsAppBot: "Robot de WhatsApp Automático (Escaneo QR)"
  };
  const titleElem = document.getElementById("currentTabTitle");
  if (titleElem) titleElem.innerText = titles[tabId] || "Panel de Administración";

  // Manejo de polling para Código QR de WhatsApp
  if (tabId === "tabWhatsAppBot") {
    consultarEstadoBot();
    if (!botPollTimer) {
      botPollTimer = setInterval(consultarEstadoBot, 3500);
    }
  } else {
    if (botPollTimer) {
      clearInterval(botPollTimer);
      botPollTimer = null;
    }
  }

  // En móvil cerrar sidebar al tocar tab
  document.getElementById("adminSidebar")?.classList.remove("open");
}

function cargarDatosPanel() {
  cargarCitasDashboard();
  renderizarServiciosAdmin();
  renderizarBarberosAdmin();
  renderizarGaleriaAdmin();
  cargarConfigBancos();
  cargarConfigGeneral();
  consultarEstadoBot();
  sincronizarCitasConServidor();
}

// ==========================================================================
// TAB 1: DASHBOARD & GESTIÓN DE CITAS
// ==========================================================================
function getCitas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CITAS) || "[]");
  } catch (e) {
    return [];
  }
}

function setCitas(citas) {
  localStorage.setItem(STORAGE_KEYS.CITAS, JSON.stringify(citas));
}

async function cargarCitasDashboard() {
  try {
    const res = await fetch("/api/citas");
    if (res.ok) {
      const citasServidor = await res.json();
      if (Array.isArray(citasServidor) && citasServidor.length > 0) {
        setCitas(citasServidor);
      }
    }
  } catch (e) {}

  const citas = getCitas();
  const servicios = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICIOS) || "[]");

  // Calcular KPIs
  let totalAnticipos = 0;
  let totalSaldoPendiente = 0;

  citas.forEach(c => {
    totalAnticipos += Number(c.anticipoPagado) || 0;
    totalSaldoPendiente += Number(c.saldoPendiente) || 0;
  });

  document.getElementById("kpiTotalCitas").innerText = citas.length;
  document.getElementById("kpiAnticipos").innerText = formatoCOP(totalAnticipos);
  document.getElementById("kpiSaldoPendiente").innerText = formatoCOP(totalSaldoPendiente);
  document.getElementById("kpiTotalServicios").innerText = servicios.length;

  filtrarCitas();
}

function filtrarCitas() {
  const citas = getCitas();
  const filtro = document.getElementById("filterCitasEstado").value;
  const tbody = document.getElementById("citasTableBody");
  if (!tbody) return;

  const filtradas = filtro === "todos" 
    ? citas 
    : citas.filter(c => (c.estado || "Pendiente") === filtro);

  if (filtradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 30px; color: #777;">
          <i class="fa-regular fa-calendar-xmark" style="font-size: 2rem; margin-bottom: 8px; display:block;"></i>
          No hay citas que coincidan con el filtro seleccionado.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtradas.map((cita) => {
    const estado = cita.estado || "Pendiente";
    const fechaPartes = cita.fecha ? cita.fecha.split("-") : ["--", "--", "----"];
    const fechaStr = `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;

    // Cálculo de regla de 12 horas
    const diffHoras = calcularHorasRestantesCita(cita.fecha, cita.hora);
    let badgeRegla = "";
    if (diffHoras >= 12) {
      badgeRegla = `<span style="color:#25D366; font-size:0.72rem; display:block; margin-top:3px;"><i class="fa-solid fa-circle-check"></i> +12h (Editable)</span>`;
    } else if (diffHoras > 0) {
      badgeRegla = `<span style="color:#FF7777; font-size:0.72rem; display:block; margin-top:3px;"><i class="fa-solid fa-triangle-exclamation"></i> &lt;12h (Pierde 50%)</span>`;
    } else {
      badgeRegla = `<span style="color:#888; font-size:0.72rem; display:block; margin-top:3px;"><i class="fa-solid fa-hourglass-end"></i> Vencida</span>`;
    }

    // Has image data URL or file
    const hasVoucher = cita.comprobanteFoto || cita.comprobante;
    const voucherBtn = hasVoucher 
      ? `<button class="btn-voucher-thumb" onclick="verComprobante('${cita.id}')"><i class="fa-solid fa-image"></i> Ver Foto</button>`
      : `<span style="color: #666; font-size: 0.78rem;">Sin foto</span>`;

    return `
      <tr>
        <td><strong class="gold-text">#${cita.id}</strong></td>
        <td>
          <div class="client-cell">
            <strong>${cita.cliente ? cita.cliente.nombre : "Cliente"}</strong>
            <small><i class="fa-brands fa-whatsapp"></i> ${cita.cliente ? cita.cliente.telefono : ""}</small>
            <small style="display:block; color:#777;">${cita.cliente ? cita.cliente.email : ""}</small>
          </div>
        </td>
        <td>
          <div><strong>${cita.servicio}</strong></div>
          <small class="gold-text"><i class="fa-solid fa-user-tag"></i> ${cita.barbero}</small>
        </td>
        <td>
          <div><i class="fa-regular fa-calendar"></i> ${fechaStr}</div>
          <div class="gold-text"><strong><i class="fa-regular fa-clock"></i> ${cita.hora}</strong></div>
          ${badgeRegla}
        </td>
        <td>
          <div class="gold-text"><strong>${formatoCOP(cita.anticipoPagado)}</strong></div>
          <small style="color: #888;">Saldo: ${formatoCOP(cita.saldoPendiente)}</small>
        </td>
        <td>${voucherBtn}</td>
        <td>
          <select class="select-status-inline status-badge status-${estado}" onchange="cambiarEstadoCita('${cita.id}', this.value)">
            <option value="Pendiente" ${estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmada" ${estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
            <option value="Completada" ${estado === 'Completada' ? 'selected' : ''}>Completada</option>
            <option value="Cancelada" ${estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
          </select>
        </td>
        <td>
          <div class="actions-cell-flex">
            <button class="btn-act-ws-reminder" onclick="enviarRecordatorioWhatsApp('${cita.id}')" title="Avisar por WhatsApp 1 o 2 horas antes">
              <i class="fa-brands fa-whatsapp"></i> Avisar Cita
            </button>
            <button class="btn-act-email-reminder" onclick="enviarRecordatorioEmail('${cita.id}')" title="Enviar recordatorio por correo">
              <i class="fa-solid fa-envelope"></i> Email
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function cambiarEstadoCita(citaId, nuevoEstado) {
  const citas = getCitas();
  const cita = citas.find(c => c.id === citaId);
  if (cita) {
    cita.estado = nuevoEstado;
    setCitas(citas);
    mostrarAdminToast(`Cita #${citaId} marcada como ${nuevoEstado}`, "success");
    cargarCitasDashboard();

    // Sincronizar en el servidor y Supabase
    fetch(`/api/citas/${encodeURIComponent(citaId)}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    }).catch(e => console.error("Error sincronizando estado con servidor:", e));
  }
}

// Visualizador de Comprobante
function verComprobante(citaId) {
  const citas = getCitas();
  const cita = citas.find(c => c.id === citaId);
  if (!cita) return;

  const container = document.getElementById("comprobanteImgContainer");
  const title = document.getElementById("comprobanteModalTitle");
  const info = document.getElementById("comprobanteModalInfo");

  title.innerHTML = `<i class="fa-solid fa-receipt gold-text"></i> Comprobante Cita #${cita.id}`;
  info.innerText = `Cliente: ${cita.cliente.nombre} | Anticipo: ${formatoCOP(cita.anticipoPagado)} (${cita.banco || "Transferencia"})`;

  if (cita.comprobanteFoto) {
    container.innerHTML = `<img src="${cita.comprobanteFoto}" alt="Comprobante de ${cita.cliente.nombre}">`;
  } else {
    container.innerHTML = `
      <div style="text-align: center; color: #888;">
        <i class="fa-solid fa-file-image" style="font-size: 3rem; margin-bottom: 12px; display:block; color: #D4AF37;"></i>
        <p>Archivo adjuntado: <strong>${cita.comprobante || "comprobante.jpg"}</strong></p>
        <small>(El cliente confirmó el adjunto directamente en el chat de WhatsApp)</small>
      </div>
    `;
  }

  document.getElementById("modalComprobante").classList.add("open");
}

function cerrarModalComprobante() {
  document.getElementById("modalComprobante").classList.remove("open");
}

// ==========================================================================
// RECORDATORIO 1 O 2 HORAS ANTES POR WHATSAPP Y CORREO
// ==========================================================================
function enviarRecordatorioWhatsApp(citaId) {
  const citas = getCitas();
  const cita = citas.find(c => c.id === citaId);
  if (!cita || !cita.cliente) {
    mostrarAdminToast("No se encontraron datos del cliente", "error");
    return;
  }

  // Limpiar teléfono del cliente (quitar espacios, guiones o signos)
  let tel = cita.cliente.telefono.replace(/\D/g, "");
  if (tel.length === 10) {
    tel = "57" + tel; // Agregar código de Colombia si tiene 10 dígitos
  }

  const partes = cita.fecha ? cita.fecha.split("-") : ["--", "--", "----"];
  const fechaStr = `${partes[2]}/${partes[1]}/${partes[0]}`;

  const mensaje = [
    `${EMOJIS.BARBER} *RECORDATORIO DE CITA - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
    "",
    `\u00A1Hola *${cita.cliente.nombre}*! ${EMOJIS.WAVE}`,
    `Te saludamos de *Ra\u00EDces Barber Shop*. Te recordamos que tienes una cita de corte programada para hoy:`,
    "",
    `${EMOJIS.SCISSORS} *Servicio:* ${cita.servicio}`,
    `${EMOJIS.BARBER} *Barbero Especialista:* ${cita.barbero}`,
    `${EMOJIS.CALENDAR} *Fecha:* ${fechaStr}`,
    `${EMOJIS.CLOCK} *Hora:* ${cita.hora}`,
    "",
    `${EMOJIS.LOCK} *Anticipo del 50% Confirmado:* ${formatoCOP(cita.anticipoPagado)}`,
    `${EMOJIS.CASH} *Saldo Restante en Barber\u00EDa:* ${formatoCOP(cita.saldoPendiente)}`,
    "",
    "Te agradecemos llegar de 5 a 10 minutos antes para brindarte la mejor experiencia. Si requieres alg\u00FAn cambio de \u00FAltima hora, por favor av\u00EDsanos por este chat.",
    "",
    `\u00A1Te esperamos con la navaja afilada y el mejor estilo! ${EMOJIS.BARBER}${EMOJIS.SCISSORS}`
  ].join("\n");

  const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
  mostrarAdminToast(`Abriendo recordatorio de WhatsApp para ${cita.cliente.nombre}`, "success");
}

function enviarRecordatorioEmail(citaId) {
  const citas = getCitas();
  const cita = citas.find(c => c.id === citaId);
  if (!cita || !cita.cliente || !cita.cliente.email) {
    mostrarAdminToast("El cliente no registró un correo válido", "error");
    return;
  }

  const partes = cita.fecha ? cita.fecha.split("-") : ["--", "--", "----"];
  const fechaStr = `${partes[2]}/${partes[1]}/${partes[0]}`;

  const asunto = `Recordatorio de tu Cita de Corte hoy a las ${cita.hora} - Raíces Barber Shop`;
  const cuerpo = 
`Hola ${cita.cliente.nombre},

Te recordamos que hoy tienes una cita de corte en Raíces Barber Shop:

- Servicio: ${cita.servicio}
- Barbero: ${cita.barbero}
- Fecha: ${fechaStr}
- Hora: ${cita.hora}
- Anticipo 50%: ${formatoCOP(cita.anticipoPagado)}
- Saldo en local: ${formatoCOP(cita.saldoPendiente)}

¡Te esperamos en nuestro salón para darte una atención exclusiva!

Atentamente,
El Equipo de Raíces Barber Shop`;

  const mailtoUrl = `mailto:${cita.cliente.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = mailtoUrl;
  mostrarAdminToast(`Preparando correo de recordatorio para ${cita.cliente.email}`, "success");
}

// ==========================================================================
// TAB 2: GESTIÓN DE SERVICIOS & CORTES
// ==========================================================================
function getServicios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICIOS) || "[]");
  } catch (e) {
    return DEFAULTS.servicios;
  }
}

function setServicios(servicios) {
  localStorage.setItem(STORAGE_KEYS.SERVICIOS, JSON.stringify(servicios));
}

function renderizarServiciosAdmin() {
  const grid = document.getElementById("serviciosAdminGrid");
  if (!grid) return;
  const servicios = getServicios();

  if (servicios.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No hay servicios creados. Agrega uno con el botón superior.</p>`;
    return;
  }

  grid.innerHTML = servicios.map(s => `
    <div class="admin-item-card">
      <div class="item-card-media">
        <img src="${s.imagen || 'assets/corte-clasico.jpg'}" alt="${s.nombre}" onerror="this.src='assets/corte-clasico.jpg'">
        <div class="item-card-price-badge">${formatoCOP(s.precio)}</div>
      </div>
      <div class="item-card-body">
        <h4 class="item-card-title">${s.nombre}</h4>
        <div class="item-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${s.duracion}</span>
        </div>
        <p class="item-card-desc">${s.descripcion}</p>
        <div class="advance-calc-note">
          <i class="fa-solid fa-lock gold-text"></i> Anticipo (50%): <strong>${formatoCOP(s.anticipo || Math.round(s.precio * 0.5))}</strong>
        </div>
        <div class="item-card-actions">
          <button class="btn-card-edit" onclick="abrirModalServicio(${s.id})">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </button>
          <button class="btn-card-delete" onclick="eliminarServicio(${s.id})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function abrirModalServicio(servicioId = null) {
  const modal = document.getElementById("modalServicio");
  const title = document.getElementById("modalServicioTitle");
  const form = document.getElementById("formServicio");
  form.reset();
  document.getElementById("srvImgThumb").innerHTML = "";

  if (servicioId) {
    const servicios = getServicios();
    const serv = servicios.find(s => s.id === servicioId);
    if (!serv) return;

    title.innerHTML = `<i class="fa-solid fa-pen-to-square gold-text"></i> Editar Servicio / Corte`;
    document.getElementById("srvId").value = serv.id;
    document.getElementById("srvNombre").value = serv.nombre;
    document.getElementById("srvPrecio").value = serv.precio;
    actualizarCalculoAnticipo(serv.precio);
    document.getElementById("srvDuracion").value = serv.duracion;
    document.getElementById("srvDescripcion").value = serv.descripcion;
    document.getElementById("srvImagenUrl").value = serv.imagen || "";

    if (serv.imagen) {
      document.getElementById("srvImgThumb").innerHTML = `<img src="${serv.imagen}" alt="Preview">`;
    }
  } else {
    title.innerHTML = `<i class="fa-solid fa-scissors gold-text"></i> Nuevo Servicio / Corte`;
    document.getElementById("srvId").value = "";
    actualizarCalculoAnticipo(0);
  }

  modal.classList.add("open");
}

function cerrarModalServicio() {
  document.getElementById("modalServicio").classList.remove("open");
}

function actualizarCalculoAnticipo(precio) {
  const val = Number(precio) || 0;
  const anticipo = Math.round(val * 0.5);
  document.getElementById("srvAnticipoPreview").value = `${formatoCOP(anticipo)} (50% obligatorio)`;
}

function guardarServicio(e) {
  e.preventDefault();
  const id = document.getElementById("srvId").value;
  const nombre = document.getElementById("srvNombre").value.trim();
  const precio = Number(document.getElementById("srvPrecio").value);
  const duracion = document.getElementById("srvDuracion").value.trim();
  const descripcion = document.getElementById("srvDescripcion").value.trim();
  const imagen = document.getElementById("srvImagenUrl").value.trim() || "assets/corte-clasico.jpg";
  const anticipo = Math.round(precio * 0.5);

  const servicios = getServicios();

  if (id) {
    // Editar
    const idx = servicios.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      servicios[idx] = { ...servicios[idx], nombre, precio, duracion, descripcion, imagen, anticipo };
      mostrarAdminToast("Servicio actualizado correctamente", "success");
    }
  } else {
    // Nuevo
    const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
    servicios.push({ id: nuevoId, nombre, precio, duracion, descripcion, imagen, anticipo });
    mostrarAdminToast("Nuevo servicio creado con éxito", "success");
  }

  setServicios(servicios);
  renderizarServiciosAdmin();
  cerrarModalServicio();
}

function eliminarServicio(id) {
  if (confirm("¿Estás seguro de eliminar este corte o servicio del catálogo?")) {
    let servicios = getServicios();
    servicios = servicios.filter(s => s.id !== id);
    setServicios(servicios);
    renderizarServiciosAdmin();
    mostrarAdminToast("Servicio eliminado", "success");
  }
}

// ==========================================================================
// TAB 3: GESTIÓN DE BARBEROS
// ==========================================================================
function getBarberos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BARBEROS) || "[]");
  } catch (e) {
    return DEFAULTS.barberos;
  }
}

function setBarberos(barberos) {
  localStorage.setItem(STORAGE_KEYS.BARBEROS, JSON.stringify(barberos));
}

function renderizarBarberosAdmin() {
  const grid = document.getElementById("barberosAdminGrid");
  if (!grid) return;
  const barberos = getBarberos();

  if (barberos.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No hay barberos registrados. Agrega uno con el botón superior.</p>`;
    return;
  }

  grid.innerHTML = barberos.map(b => `
    <div class="admin-item-card">
      <div class="item-card-media" style="height: 180px;">
        <img src="${b.avatar || 'assets/logo.png'}" alt="${b.nombre}" onerror="this.src='assets/logo.png'">
      </div>
      <div class="item-card-body">
        <h4 class="item-card-title">${b.nombre}</h4>
        <div class="item-card-meta">
          <span><i class="fa-solid fa-scissors"></i> ${b.especialidad}</span>
        </div>
        <p class="item-card-desc"><i class="fa-solid fa-award gold-text"></i> ${b.experiencia}</p>
        <div class="item-card-actions">
          <button class="btn-card-edit" onclick="abrirModalBarbero(${b.id})">
            <i class="fa-solid fa-user-pen"></i> Editar
          </button>
          <button class="btn-card-delete" onclick="eliminarBarbero(${b.id})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function abrirModalBarbero(barberoId = null) {
  const modal = document.getElementById("modalBarbero");
  const title = document.getElementById("modalBarberoTitle");
  const form = document.getElementById("formBarbero");
  form.reset();
  document.getElementById("barberoAvatarThumb").innerHTML = "";

  if (barberoId) {
    const barberos = getBarberos();
    const b = barberos.find(x => x.id === barberoId);
    if (!b) return;

    title.innerHTML = `<i class="fa-solid fa-user-pen gold-text"></i> Editar Barbero`;
    document.getElementById("barberoId").value = b.id;
    document.getElementById("barberoNombre").value = b.nombre;
    document.getElementById("barberoEspecialidad").value = b.especialidad;
    document.getElementById("barberoExperiencia").value = b.experiencia;
    document.getElementById("barberoAvatarUrl").value = b.avatar || "";

    if (b.avatar) {
      document.getElementById("barberoAvatarThumb").innerHTML = `<img src="${b.avatar}" alt="Preview">`;
    }
  } else {
    title.innerHTML = `<i class="fa-solid fa-user-plus gold-text"></i> Agregar Nuevo Barbero`;
    document.getElementById("barberoId").value = "";
  }

  modal.classList.add("open");
}

function cerrarModalBarbero() {
  document.getElementById("modalBarbero").classList.remove("open");
}

function guardarBarbero(e) {
  e.preventDefault();
  const id = document.getElementById("barberoId").value;
  const nombre = document.getElementById("barberoNombre").value.trim();
  const especialidad = document.getElementById("barberoEspecialidad").value.trim();
  const experiencia = document.getElementById("barberoExperiencia").value.trim();
  const avatar = document.getElementById("barberoAvatarUrl").value.trim() || "assets/logo.png";

  const barberos = getBarberos();

  if (id) {
    const idx = barberos.findIndex(b => b.id === Number(id));
    if (idx !== -1) {
      barberos[idx] = { ...barberos[idx], nombre, especialidad, experiencia, avatar };
      mostrarAdminToast("Barbero actualizado con éxito", "success");
    }
  } else {
    const nuevoId = barberos.length > 0 ? Math.max(...barberos.map(b => b.id)) + 1 : 1;
    barberos.push({ id: nuevoId, nombre, especialidad, experiencia, avatar });
    mostrarAdminToast("Nuevo barbero agregado a la plantilla", "success");
  }

  setBarberos(barberos);
  renderizarBarberosAdmin();
  cerrarModalBarbero();
}

function eliminarBarbero(id) {
  if (confirm("¿Estás seguro de eliminar a este barbero?")) {
    let barberos = getBarberos();
    barberos = barberos.filter(b => b.id !== id);
    setBarberos(barberos);
    renderizarBarberosAdmin();
    mostrarAdminToast("Barbero eliminado", "success");
  }
}

// ==========================================================================
// TAB 4: GALERÍA DE CORTES & ESTILOS
// ==========================================================================
function getGaleria() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALERIA) || "[]");
  } catch (e) {
    return DEFAULTS.galeria;
  }
}

function setGaleria(galeria) {
  localStorage.setItem(STORAGE_KEYS.GALERIA, JSON.stringify(galeria));
}

function renderizarGaleriaAdmin() {
  const grid = document.getElementById("galeriaAdminGrid");
  if (!grid) return;
  const galeria = getGaleria();

  if (galeria.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No hay imágenes en la galería. Sube una con el botón superior.</p>`;
    return;
  }

  grid.innerHTML = galeria.map(item => `
    <div class="gal-card">
      <img src="${item.imagen}" alt="${item.titulo}">
      <button class="btn-gal-del" onclick="eliminarFotoGaleria(${item.id})" title="Eliminar de Galería">
        <i class="fa-solid fa-trash"></i>
      </button>
      <div class="gal-overlay">
        <span class="gal-badge">${item.badge || 'Corte'}</span>
        <h5 class="gal-title">${item.titulo}</h5>
      </div>
    </div>
  `).join("");
}

function abrirModalGaleria() {
  document.getElementById("formGaleria").reset();
  document.getElementById("galeriaImgThumb").innerHTML = "";
  document.getElementById("modalGaleria").classList.add("open");
}

function cerrarModalGaleria() {
  document.getElementById("modalGaleria").classList.remove("open");
}

function guardarFotoGaleria(e) {
  e.preventDefault();
  const titulo = document.getElementById("galeriaTitulo").value.trim();
  const badge = document.getElementById("galeriaBadge").value.trim() || "Estilo";
  const imagen = document.getElementById("galeriaImgUrl").value.trim();

  if (!imagen) {
    mostrarAdminToast("Por favor selecciona o sube una imagen", "error");
    return;
  }

  const galeria = getGaleria();
  const nuevoId = galeria.length > 0 ? Math.max(...galeria.map(g => g.id)) + 1 : 1;
  galeria.unshift({ id: nuevoId, titulo, badge, imagen });

  setGaleria(galeria);
  renderizarGaleriaAdmin();
  cerrarModalGaleria();
  mostrarAdminToast("¡Foto añadida a la galería con éxito!", "success");
}

function eliminarFotoGaleria(id) {
  if (confirm("¿Deseas eliminar esta fotografía de la galería?")) {
    let galeria = getGaleria();
    galeria = galeria.filter(g => g.id !== id);
    setGaleria(galeria);
    renderizarGaleriaAdmin();
    mostrarAdminToast("Fotografía eliminada de la galería", "success");
  }
}

// ==========================================================================
// TAB 5: CONFIGURACIÓN DE CUENTAS BANCARIAS
// ==========================================================================
function cargarConfigBancos() {
  try {
    const bancos = JSON.parse(localStorage.getItem(STORAGE_KEYS.BANCOS) || JSON.stringify(DEFAULTS.bancos));
    
    // Nequi
    if (bancos.nequi) {
      document.getElementById("nequiNumero").value = bancos.nequi.numero || "";
      document.getElementById("nequiTitular").value = bancos.nequi.titular || "";
      document.getElementById("nequiInstrucciones").value = bancos.nequi.instrucciones || "";
    }
    // Bancolombia
    if (bancos.bancolombia) {
      document.getElementById("bancolombiaNumero").value = bancos.bancolombia.numero || "";
      document.getElementById("bancolombiaTipo").value = bancos.bancolombia.tipo || "";
      document.getElementById("bancolombiaTitular").value = bancos.bancolombia.titular || "";
    }
    // Nu
    if (bancos.nu) {
      document.getElementById("nuNumero").value = bancos.nu.numero || "";
      document.getElementById("nuTitular").value = bancos.nu.titular || "";
      document.getElementById("nuInstrucciones").value = bancos.nu.instrucciones || "";
    }
    // Davivienda
    if (bancos.davivienda) {
      document.getElementById("daviviendaNumero").value = bancos.davivienda.numero || "";
      document.getElementById("daviviendaTitular").value = bancos.davivienda.titular || "";
      document.getElementById("daviviendaInstrucciones").value = bancos.davivienda.instrucciones || "";
    }
  } catch (e) {
    console.error(e);
  }
}

function guardarConfigBancos() {
  const bancos = {
    nequi: {
      nombre: "Nequi",
      tagClass: "nequi-tag",
      icono: "fa-solid fa-mobile-screen-button",
      titular: document.getElementById("nequiTitular").value.trim(),
      numero: document.getElementById("nequiNumero").value.trim(),
      numeroFormateado: document.getElementById("nequiNumero").value.trim(),
      tipo: "Celular Nequi / Llave Transfiya",
      instrucciones: document.getElementById("nequiInstrucciones").value.trim()
    },
    bancolombia: {
      nombre: "Bancolombia",
      tagClass: "bancolombia-tag",
      icono: "fa-solid fa-building-columns",
      titular: document.getElementById("bancolombiaTitular").value.trim(),
      numero: document.getElementById("bancolombiaNumero").value.trim(),
      numeroFormateado: document.getElementById("bancolombiaNumero").value.trim(),
      tipo: document.getElementById("bancolombiaTipo").value.trim(),
      instrucciones: "Transfiere desde la App Bancolombia a Cuenta de Ahorros."
    },
    nu: {
      nombre: "Nu (Nubank)",
      tagClass: "nu-tag",
      icono: "fa-solid fa-wallet",
      titular: document.getElementById("nuTitular").value.trim(),
      numero: document.getElementById("nuNumero").value.trim(),
      numeroFormateado: document.getElementById("nuNumero").value.trim(),
      tipo: "Cuenta de Ahorros Nu Colombia",
      instrucciones: document.getElementById("nuInstrucciones").value.trim()
    },
    davivienda: {
      nombre: "Davivienda / Daviplata",
      tagClass: "davivienda-tag",
      icono: "fa-solid fa-landmark",
      titular: document.getElementById("daviviendaTitular").value.trim(),
      numero: document.getElementById("daviviendaNumero").value.trim(),
      numeroFormateado: document.getElementById("daviviendaNumero").value.trim(),
      tipo: "Ahorros Davivienda / Daviplata",
      instrucciones: document.getElementById("daviviendaInstrucciones").value.trim()
    }
  };

  localStorage.setItem(STORAGE_KEYS.BANCOS, JSON.stringify(bancos));
  mostrarAdminToast("¡Cuentas bancarias de transferencia guardadas con éxito!", "success");
}

// ==========================================================================
// TAB 6: CONFIGURACIÓN GENERAL, VIDEO, REDES & CLAVE
// ==========================================================================
function cargarConfigGeneral() {
  try {
    const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || JSON.stringify(DEFAULTS.config));
    
    document.getElementById("cfgVideoUrl").value = config.videoUrl || "assets/barbershop.mp4";
    document.getElementById("cfgWhatsApp").value = config.whatsapp || "573128914738";
    document.getElementById("cfgInstagram").value = config.instagram || "";
    document.getElementById("cfgTikTok").value = config.tiktok || "";
    document.getElementById("cfgEmail").value = config.email || "";

    const preview = document.getElementById("cfgVideoPreview");
    if (preview && config.videoUrl) {
      preview.src = config.videoUrl;
    }
  } catch (e) {
    console.error(e);
  }
}

function cargarVideoArchivo(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    document.getElementById("videoFileName").innerText = `Archivo seleccionado: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      document.getElementById("cfgVideoUrl").value = dataUrl;
      const preview = document.getElementById("cfgVideoPreview");
      if (preview) {
        preview.src = dataUrl;
        preview.load();
      }
      mostrarAdminToast("Video cargado en memoria listo para guardar.", "success");
    };
    reader.readAsDataURL(file);
  }
}

function guardarConfigGeneral() {
  const videoUrl = document.getElementById("cfgVideoUrl").value.trim() || "assets/barbershop.mp4";
  const whatsapp = document.getElementById("cfgWhatsApp").value.trim() || "573128914738";
  const instagram = document.getElementById("cfgInstagram").value.trim();
  const tiktok = document.getElementById("cfgTikTok").value.trim();
  const email = document.getElementById("cfgEmail").value.trim();

  const config = { videoUrl, whatsapp, instagram, tiktok, email };
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));

  // Actualizar clave si ingresó una nueva
  const nuevaClave = document.getElementById("cfgNuevaClave").value.trim();
  if (nuevaClave) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, nuevaClave);
    document.getElementById("cfgNuevaClave").value = "";
    mostrarAdminToast("¡Configuración y nueva contraseña guardadas con éxito!", "success");
  } else {
    mostrarAdminToast("¡Configuración del sitio guardada exitosamente!", "success");
  }

  // Refrescar preview de video
  const preview = document.getElementById("cfgVideoPreview");
  if (preview) {
    preview.src = videoUrl;
  }
}

// Exportar copia de seguridad en JSON
function exportarDatosJSON() {
  const datosCompletos = {
    citas: getCitas(),
    servicios: getServicios(),
    barberos: getBarberos(),
    galeria: getGaleria(),
    bancos: JSON.parse(localStorage.getItem(STORAGE_KEYS.BANCOS) || "{}"),
    config: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || "{}"),
    fechaExportacion: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datosCompletos, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `raices_barber_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  mostrarAdminToast("Copia de seguridad descargada correctamente.", "success");
}

function restaurarPorDefecto() {
  if (confirm("⚠️ ¿Estás seguro de restablecer todos los servicios, barberos, cuentas y configuración a los valores iniciales? (Las citas registradas no se perderán)")) {
    localStorage.setItem(STORAGE_KEYS.SERVICIOS, JSON.stringify(DEFAULTS.servicios));
    localStorage.setItem(STORAGE_KEYS.BARBEROS, JSON.stringify(DEFAULTS.barberos));
    localStorage.setItem(STORAGE_KEYS.GALERIA, JSON.stringify(DEFAULTS.galeria));
    localStorage.setItem(STORAGE_KEYS.BANCOS, JSON.stringify(DEFAULTS.bancos));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULTS.config));
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, DEFAULTS.adminPass);

    cargarDatosPanel();
    mostrarAdminToast("Valores iniciales restaurados con éxito", "success");
  }
}

// ==========================================================================
// UTILIDADES COMPARTIDAS
// ==========================================================================
function formatoCOP(numero) {
  return "$ " + Number(numero || 0).toLocaleString("es-CO") + " COP";
}

function procesarFotoArchivo(input, targetInputId, thumbContainerId) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById(targetInputId).value = e.target.result;
      const thumb = document.getElementById(thumbContainerId);
      if (thumb) {
        thumb.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      }
    };
    reader.readAsDataURL(file);
  }
}

function mostrarAdminToast(mensaje, tipo = "info") {
  const toast = document.getElementById("adminToast");
  const msgElem = document.getElementById("adminToastMessage");
  const icon = document.getElementById("adminToastIcon");
  if (!toast || !msgElem) return;

  msgElem.innerText = mensaje;
  if (tipo === "error") {
    icon.className = "fa-solid fa-circle-exclamation";
    icon.style.color = "#E63946";
  } else if (tipo === "success") {
    icon.className = "fa-solid fa-circle-check";
    icon.style.color = "#25D366";
  } else {
    icon.className = "fa-solid fa-bell";
    icon.style.color = "#D4AF37";
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

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

// ==========================================================================
// FUNCIONES DEL BOT AUTOMÁTICO DE WHATSAPP (API CLIENT)
// ==========================================================================
const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:3000"
  : window.location.origin;

async function consultarEstadoBot() {
  const badge = document.getElementById("botStatusBadge");
  const qrImg = document.getElementById("botQrImg");
  const connectedBox = document.getElementById("botConnectedBox");
  const disconnectedBox = document.getElementById("botDisconnectedBox");
  const phoneLabel = document.getElementById("botConnectedPhoneLabel");
  const spinner = document.getElementById("qrLoadingSpinner");

  try {
    const res = await fetch(`${API_URL}/api/whatsapp/status`);
    if (!res.ok) throw new Error("Servidor offline");
    const data = await res.json();

    if (spinner) spinner.style.display = "none";

    if (data.status === "conectado") {
      if (badge) {
        badge.className = "status-badge status-Confirmada";
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Conectado`;
      }
      if (qrImg) qrImg.style.display = "none";
      if (disconnectedBox) disconnectedBox.style.display = "none";
      if (connectedBox) connectedBox.style.display = "block";
      if (phoneLabel) phoneLabel.innerText = `+${data.phone || '573128914738'}`;
    } else if (data.status === "esperando_qr") {
      if (badge) {
        badge.className = "status-badge status-Pendiente";
        badge.innerHTML = `<i class="fa-solid fa-qrcode"></i> Esperando Escaneo`;
      }
      if (connectedBox) connectedBox.style.display = "none";
      if (disconnectedBox) disconnectedBox.style.display = "none";
      await obtenerQrBot();
    } else {
      if (badge) {
        badge.className = "status-badge status-Cancelada";
        badge.innerHTML = `<i class="fa-solid fa-plug-circle-xmark"></i> Desconectado`;
      }
      if (connectedBox) connectedBox.style.display = "none";
      if (qrImg) qrImg.style.display = "none";
      if (disconnectedBox) disconnectedBox.style.display = "block";
    }

    // Configuración actual
    if (data.botConfig) {
      const horasSelect = document.getElementById("botHorasAnticipacion");
      const checkConf = document.getElementById("botCheckConfirmacion");
      const checkActivo = document.getElementById("botCheckActivo");

      if (horasSelect) horasSelect.value = String(data.botConfig.horasAnticipacionRecordatorio || 1);
      if (checkConf) checkConf.checked = data.botConfig.enviarConfirmacionInmediata !== false;
      if (checkActivo) checkActivo.checked = data.botConfig.activo !== false;
    }

  } catch (err) {
    if (badge) {
      badge.className = "status-badge status-Cancelada";
      badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Servidor Local Inactivo`;
    }
  }
}

async function obtenerQrBot() {
  const qrImg = document.getElementById("botQrImg");
  const spinner = document.getElementById("qrLoadingSpinner");
  try {
    const res = await fetch(`${API_URL}/api/whatsapp/qr`);
    const data = await res.json();
    if (data.qr && qrImg) {
      qrImg.src = data.qr;
      qrImg.style.display = "block";
      if (spinner) spinner.style.display = "none";
    }
  } catch (e) {
    console.error(e);
  }
}

async function recargarQrBot() {
  const spinner = document.getElementById("qrLoadingSpinner");
  const qrImg = document.getElementById("botQrImg");
  if (spinner) spinner.style.display = "block";
  if (qrImg) qrImg.style.display = "none";

  try {
    await fetch(`${API_URL}/api/whatsapp/connect`, { method: "POST" });
    mostrarAdminToast("Generando código QR nuevo...", "info");
    setTimeout(consultarEstadoBot, 2500);
  } catch (e) {
    mostrarAdminToast("No se pudo conectar con el servidor backend en el puerto 3000", "error");
  }
}

async function desvincularBot() {
  if (confirm("¿Deseas cerrar sesión del bot de WhatsApp en este celular? Tendrás que escanear un nuevo código QR para volver a vincular.")) {
    try {
      await fetch(`${API_URL}/api/whatsapp/logout`, { method: "POST" });
      mostrarAdminToast("Sesión de WhatsApp cerrada. Listo para nuevo QR.", "success");
      setTimeout(consultarEstadoBot, 2000);
    } catch (e) {
      mostrarAdminToast("Error al desvincular", "error");
    }
  }
}

async function guardarConfigBot() {
  const horasAnticipacionRecordatorio = Number(document.getElementById("botHorasAnticipacion").value) || 1;
  const enviarConfirmacionInmediata = document.getElementById("botCheckConfirmacion").checked;
  const activo = document.getElementById("botCheckActivo").checked;

  try {
    const res = await fetch(`${API_URL}/api/whatsapp/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ horasAnticipacionRecordatorio, enviarConfirmacionInmediata, activo })
    });
    if (res.ok) {
      mostrarAdminToast("¡Reglas del robot de WhatsApp guardadas con éxito!", "success");
    }
  } catch (e) {
    mostrarAdminToast("Error guardando configuración del bot", "error");
  }
}

async function enviarMensajePruebaBot() {
  const phone = document.getElementById("testPhone").value.trim();
  const message = document.getElementById("testMessage").value.trim();

  if (!phone || !message) {
    mostrarAdminToast("Por favor ingresa un número de celular y un mensaje", "error");
    return;
  }

  mostrarAdminToast("Enviando mensaje de prueba por WhatsApp...", "info");

  try {
    const res = await fetch(`${API_URL}/api/whatsapp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message })
    });
    const data = await res.json();
    if (data.success) {
      mostrarAdminToast(`¡Mensaje enviado con éxito al número ${phone}!`, "success");
    } else {
      mostrarAdminToast(`Error: ${data.error}`, "error");
    }
  } catch (err) {
    mostrarAdminToast("Error de conexión con el bot de WhatsApp", "error");
  }
}

// Sincronizar citas de localStorage con el servidor para que el cron las recuerde
async function sincronizarCitasConServidor() {
  try {
    const citas = JSON.parse(localStorage.getItem(STORAGE_KEYS.CITAS) || "[]");
    if (citas.length > 0) {
      await fetch(`${API_URL}/api/citas/sincronizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citas })
      });
    }
  } catch (e) {}
}


