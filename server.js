/* ==========================================================================
   RAÍCES BARBER SHOP - SERVIDOR BACKEND & BOT AUTOMÁTICO DE WHATSAPP
   Tecnología: Node.js, Express, Baileys WebSocket & QR Code
   Funciones:
     1. Generación de Código QR para vincular WhatsApp en 10 segundos
     2. Envío automático de confirmación de cita al cliente
     3. Tarea automática programada: Recordatorio 1 o 2 horas antes de la cita
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const pino = require('pino');
const { createClient } = require('@supabase/supabase-js');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('⚡ [SUPABASE] Cliente inicializado correctamente para:', SUPABASE_URL);
  } catch (err) {
    console.error('❌ [SUPABASE] Error iniciando cliente:', err.message);
  }
} else {
  console.log('ℹ️ [SUPABASE] Variables SUPABASE_URL o SUPABASE_KEY no detectadas. Usando almacenamiento local.');
}

// Configuración de Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del sitio web (HTML, CSS, JS, Assets)
app.use(express.static(__dirname));

// Rutas de almacenamiento local
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');
const CITAS_FILE = path.join(__dirname, 'citas.json');
const CONFIG_FILE = path.join(__dirname, 'bot_config.json');

// Crear archivo de citas si no existe
if (!fs.existsSync(CITAS_FILE)) {
  fs.writeFileSync(CITAS_FILE, JSON.stringify([], null, 2));
}

// Configuración del Bot de WhatsApp (1 o 2 horas antes)
let botConfig = {
  activo: true,
  horasAnticipacionRecordatorio: 1, // 1 hora antes por defecto
  enviarConfirmacionInmediata: true
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    botConfig = { ...botConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
  } catch (e) {
    console.error('Error leyendo bot_config.json:', e);
  }
}

function guardarBotConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(botConfig, null, 2));
  } catch (e) {
    console.error('Error guardando bot_config.json:', e);
  }
}

// ==========================================================================
// ESTADO EN MEMORIA DEL BOT DE WHATSAPP
// ==========================================================================
let sock = null;
let qrCodeDataUrl = null;
let rawQrCode = null;
let connectionStatus = 'desconectado'; // 'desconectado', 'esperando_qr', 'conectando', 'conectado'
let connectedNumber = null;
let historialMensajes = [];

// Emojis seguros en código Unicode para WhatsApp
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

function formatoCOP(numero) {
  return "$ " + Number(numero || 0).toLocaleString("es-CO") + " COP";
}

// ==========================================================================
// CONEXIÓN BAILEYS (WHATSAPP WEB PROTOCOL)
// ==========================================================================
async function iniciarWhatsAppBot() {
  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    connectionStatus = 'conectando';

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
      browser: ['Raices Barber Shop', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        rawQrCode = qr;
        connectionStatus = 'esperando_qr';
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            width: 320,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          console.log('\n[WHATSAPP BOT] Código QR generado listo para escanear en Panel Admin o Terminal.\n');
        } catch (err) {
          console.error('Error generando QR data URL:', err);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[WHATSAPP BOT] Conexión cerrada. Código: ${statusCode}. Reconectar: ${shouldReconnect}`);
        
        connectionStatus = 'desconectado';
        qrCodeDataUrl = null;
        connectedNumber = null;

        if (shouldReconnect) {
          setTimeout(iniciarWhatsAppBot, 5000);
        }
      } else if (connection === 'open') {
        connectionStatus = 'conectado';
        qrCodeDataUrl = null;
        rawQrCode = null;
        connectedNumber = sock.user?.id ? sock.user.id.split(':')[0] : 'Conectado';
        console.log(`\n======================================================`);
        console.log(`✅ [WHATSAPP BOT CONECTADO] Número: +${connectedNumber}`);
        console.log(`======================================================\n`);
      }
    });

  } catch (error) {
    console.error('Error iniciando WhatsApp socket:', error);
    connectionStatus = 'desconectado';
  }
}

// Función para enviar mensaje a cualquier número
async function enviarMensajeWhatsApp(telefonoDestino, texto) {
  if (connectionStatus !== 'conectado' || !sock) {
    throw new Error('El bot de WhatsApp no está conectado actualmente.');
  }

  // Limpiar y formatear número de teléfono a formato internacional
  let cleanNumber = String(telefonoDestino).replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '57' + cleanNumber; // Colombia
  }
  const jid = `${cleanNumber}@s.whatsapp.net`;

  const resultado = await sock.sendMessage(jid, { text: texto });
  
  // Guardar en historial
  historialMensajes.unshift({
    id: Date.now(),
    telefono: cleanNumber,
    fecha: new Date().toISOString(),
    textoPrevio: texto.substring(0, 100) + '...',
    tipo: 'Automático'
  });
  if (historialMensajes.length > 50) historialMensajes.pop();

  return resultado;
}

// ==========================================================================
// TAREA AUTOMÁTICA PROGRAMADA: REVISIÓN DE RECORDATORIOS (1 O 2 HORAS ANTES)
// ==========================================================================
function calcularHorasRestantes(fechaStr, horaStr) {
  if (!fechaStr || !horaStr) return 999;
  try {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const partesHora = horaStr.trim().split(' ');
    const tiempo = partesHora[0].split(':');
    let horas = parseInt(tiempo[0], 10);
    const minutos = parseInt(tiempo[1], 10);
    const periodo = partesHora[1] ? partesHora[1].toUpperCase() : 'AM';

    if (periodo === 'PM' && horas < 12) horas += 12;
    if (periodo === 'AM' && horas === 12) horas = 0;

    const fechaCita = new Date(year, month - 1, day, horas, minutos, 0);
    const ahora = new Date();

    const diffMs = fechaCita.getTime() - ahora.getTime();
    return diffMs / (1000 * 60 * 60);
  } catch (e) {
    return 999;
  }
}

// Cron cada 60 segundos
setInterval(async () => {
  if (!botConfig.activo || connectionStatus !== 'conectado' || !sock) return;

  try {
    let citas = [];
    if (fs.existsSync(CITAS_FILE)) {
      citas = JSON.parse(fs.readFileSync(CITAS_FILE, 'utf8') || '[]');
    }

    if (citas.length === 0) return;

    let cambios = false;
    const limiteHoras = botConfig.horasAnticipacionRecordatorio || 1; // 1 o 2 horas

    for (const cita of citas) {
      if (cita.recordatorioEnviado || cita.estado?.toLowerCase().includes('cancelada')) {
        continue;
      }

      const diffHoras = calcularHorasRestantes(cita.fecha, cita.hora);

      // Si falta entre 0.1h (6 minutos) y el límite configurado (ej: 1.2h o 2.2h)
      if (diffHoras > 0.05 && diffHoras <= (limiteHoras + 0.25)) {
        console.log(`[ROBOT WHATSAPP] Disparando recordatorio automático para cita #${cita.id} de ${cita.cliente?.nombre}`);

        const partes = cita.fecha ? cita.fecha.split('-') : ['--', '--', '----'];
        const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

        const mensajeRecordatorio = [
          `${EMOJIS.BARBER} *RECORDATORIO AUTOM\u00C1TICO - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
          "",
          `\u00A1Hola *${cita.cliente.nombre}*! ${EMOJIS.WAVE}`,
          `Te recordamos que tu cita de corte est\u00E1 programada para hoy en aproximadamente *${limiteHoras} hora(s)*:`,
          "",
          `${EMOJIS.SCISSORS} *Servicio:* ${cita.servicio}`,
          `${EMOJIS.BARBER} *Barbero Especialista:* ${cita.barbero}`,
          `${EMOJIS.CALENDAR} *Fecha:* ${fechaBonita}`,
          `${EMOJIS.CLOCK} *Hora:* ${cita.hora}`,
          "",
          `${EMOJIS.LOCK} *Anticipo 50% Recibido:* ${formatoCOP(cita.anticipoPagado)}`,
          `${EMOJIS.CASH} *Saldo Pendiente en Sal\u00F3n:* ${formatoCOP(cita.saldoPendiente)}`,
          "",
          "Te recomendamos llegar 5 a 10 minutos antes para brindarte la mejor experiencia con toalla caliente y atenci\u00F3n VIP.",
          "",
          `\u00A1Te esperamos en Ra\u00EDces Barber Shop! ${EMOJIS.BARBER}${EMOJIS.SPARKLES}`
        ].join('\n');

        try {
          await enviarMensajeWhatsApp(cita.cliente.telefono, mensajeRecordatorio);
          cita.recordatorioEnviado = true;
          cita.fechaEnvioRecordatorio = new Date().toISOString();
          cambios = true;
          console.log(`✅ [RECORDATORIO ENTREGADO] Cita #${cita.id} a ${cita.cliente.telefono}`);
        } catch (err) {
          console.error(`Error enviando recordatorio a ${cita.cliente.telefono}:`, err.message);
        }
      }
    }

    if (cambios) {
      fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));
    }
  } catch (error) {
    console.error('Error en cron de recordatorios:', error);
  }
}, 60 * 1000); // Cada 1 minuto

// ==========================================================================
// RUTAS DE LA API REST (PARA INDEX.HTML Y ADMIN.HTML)
// ==========================================================================

// Health check para Render / Monitoreo
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()), service: 'Raíces Barber Shop Bot' });
});

// 1. Estado de la conexión
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    status: connectionStatus,
    phone: connectedNumber,
    hasQr: Boolean(qrCodeDataUrl),
    botConfig
  });
});

// 2. Obtener Código QR
app.get('/api/whatsapp/qr', (req, res) => {
  res.json({
    status: connectionStatus,
    qr: qrCodeDataUrl
  });
});

// 3. Forzar inicio o reinicio de conexión
app.post('/api/whatsapp/connect', async (req, res) => {
  if (connectionStatus !== 'conectado') {
    iniciarWhatsAppBot();
  }
  res.json({ success: true, message: 'Iniciando conexión...' });
});

// 4. Cerrar sesión / Desvincular dispositivo
app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }
  } catch (e) {}

  connectionStatus = 'desconectado';
  connectedNumber = null;
  qrCodeDataUrl = null;

  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Error borrando auth_info_baileys:', e);
  }

  setTimeout(iniciarWhatsAppBot, 2000);
  res.json({ success: true, message: 'Sesión de WhatsApp cerrada. Listo para nuevo QR.' });
});

// 5. Enviar mensaje manual o de prueba
app.post('/api/whatsapp/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Faltan parámetros phone o message.' });
  }

  try {
    await enviarMensajeWhatsApp(phone, message);
    res.json({ success: true, message: 'Mensaje enviado con éxito por WhatsApp.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Registrar Cita y Enviar Confirmación Automática (Supabase + Local)
app.post('/api/citas/registrar', async (req, res) => {
  const nuevaCita = req.body;
  if (!nuevaCita || !nuevaCita.id) {
    return res.status(400).json({ success: false, error: 'Datos de cita inválidos' });
  }

  try {
    // 1. Guardar en Supabase (PostgreSQL) si está disponible
    if (supabase) {
      try {
        await supabase.from('citas').upsert({
          id: String(nuevaCita.id),
          codigo: String(nuevaCita.codigo || nuevaCita.id),
          cliente: nuevaCita.cliente || {},
          servicio: String(nuevaCita.servicio || ''),
          barbero: String(nuevaCita.barbero || ''),
          fecha: nuevaCita.fecha,
          hora: String(nuevaCita.hora || ''),
          total: Number(nuevaCita.total || 0),
          anticipo_pagado: Number(nuevaCita.anticipoPagado || 0),
          saldo_pendiente: Number(nuevaCita.saldoPendiente || 0),
          comprobante: nuevaCita.comprobante || null,
          estado: nuevaCita.estado || 'Pendiente',
          notas: nuevaCita.notas || '',
          recordatorio_enviado: false
        });
        console.log(`✅ [SUPABASE] Cita #${nuevaCita.id} sincronizada en la nube.`);
      } catch (errSupa) {
        console.error('Error insertando en Supabase:', errSupa.message);
      }
    }

    // 2. Respaldo en archivo local
    let citas = [];
    if (fs.existsSync(CITAS_FILE)) {
      citas = JSON.parse(fs.readFileSync(CITAS_FILE, 'utf8') || '[]');
    }

    const idx = citas.findIndex(c => c.id === nuevaCita.id);
    if (idx !== -1) {
      citas[idx] = { ...citas[idx], ...nuevaCita };
    } else {
      citas.unshift(nuevaCita);
    }
    fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));

    // 3. Notificación de WhatsApp inmediata
    if (botConfig.enviarConfirmacionInmediata && connectionStatus === 'conectado' && nuevaCita.cliente?.telefono) {
      const partes = nuevaCita.fecha ? nuevaCita.fecha.split('-') : ['--', '--', '----'];
      const fechaBonita = `${partes[2]}/${partes[1]}/${partes[0]}`;

      const mensajeConfirmacion = [
        `${EMOJIS.BARBER} *\u00A1RESERVA REGISTRADA CON \u00C9XITO! - RA\u00CDCESS BARBER SHOP* ${EMOJIS.BARBER}`,
        `${EMOJIS.TICKET} *C\u00F3digo de Turno:* #${nuevaCita.id}`,
        "",
        `\u00A1Hola *${nuevaCita.cliente.nombre}*! Hemos recibido tu solicitud de agendamiento y tu comprobante de anticipo del 50%.`,
        "",
        `${EMOJIS.SCISSORS} *Servicio:* ${nuevaCita.servicio}`,
        `${EMOJIS.BARBER} *Maestro Barbero:* ${nuevaCita.barbero}`,
        `${EMOJIS.CALENDAR} *Fecha:* ${fechaBonita}`,
        `${EMOJIS.CLOCK} *Hora:* ${nuevaCita.hora}`,
        "",
        `${EMOJIS.LOCK} *Anticipo 50% Registrado:* ${formatoCOP(nuevaCita.anticipoPagado)}`,
        `${EMOJIS.CASH} *Saldo en Barber\u00EDa:* ${formatoCOP(nuevaCita.saldoPendiente)}`,
        "",
        `${EMOJIS.CLOCK} *Recordatorio Autom\u00E1tico:* Te avisaremos 1 hora antes de tu turno por este mismo chat.`,
        "",
        `\u00A1Muchas gracias por confiar en Ra\u00EDces Barber Shop! ${EMOJIS.BARBER}${EMOJIS.CHECK}`
      ].join('\n');

      try {
        await enviarMensajeWhatsApp(nuevaCita.cliente.telefono, mensajeConfirmacion);
        console.log(`✅ [CONFIRMACIÓN AUTOMÁTICA ENVIADA] Cita #${nuevaCita.id} a ${nuevaCita.cliente.telefono}`);
      } catch (err) {
        console.error('Error enviando confirmación automática:', err.message);
      }
    }

    res.json({ success: true, message: 'Cita registrada con éxito en Supabase y localmente.' });
  } catch (err) {
    console.error('Error registrando cita en server:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Sincronizar Citas desde el Panel Admin
app.post('/api/citas/sincronizar', async (req, res) => {
  const { citas } = req.body;
  if (Array.isArray(citas)) {
    try {
      if (supabase && citas.length > 0) {
        for (const c of citas) {
          await supabase.from('citas').upsert({
            id: String(c.id),
            codigo: String(c.codigo || c.id),
            cliente: c.cliente || {},
            servicio: String(c.servicio || ''),
            barbero: String(c.barbero || ''),
            fecha: c.fecha,
            hora: String(c.hora || ''),
            total: Number(c.total || 0),
            anticipo_pagado: Number(c.anticipoPagado || 0),
            saldo_pendiente: Number(c.saldoPendiente || 0),
            comprobante: c.comprobante || null,
            estado: c.estado || 'Pendiente',
            notas: c.notas || '',
            recordatorio_enviado: !!c.recordatorioEnviado
          });
        }
      }
      fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));
      return res.json({ success: true, count: citas.length });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }
  res.status(400).json({ success: false, error: 'Formato inválido' });
});

// 8. Obtener Citas (Supabase primero, fallback a local)
app.get('/api/citas', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        const citasFormateadas = data.map(c => ({
          id: c.id,
          codigo: c.codigo || c.id,
          cliente: c.cliente,
          servicio: c.servicio,
          barbero: c.barbero,
          fecha: c.fecha,
          hora: c.hora,
          total: Number(c.total || 0),
          anticipoPagado: Number(c.anticipo_pagado || 0),
          saldoPendiente: Number(c.saldo_pendiente || 0),
          comprobante: c.comprobante,
          estado: c.estado || 'Pendiente',
          notas: c.notas || '',
          recordatorioEnviado: c.recordatorio_enviado,
          created_at: c.created_at
        }));
        return res.json(citasFormateadas);
      }
    } catch (e) {
      console.error('Error leyendo de Supabase:', e.message);
    }
  }

  try {
    const citas = JSON.parse(fs.readFileSync(CITAS_FILE, 'utf8') || '[]');
    res.json(citas);
  } catch (e) {
    res.json([]);
  }
});

// 8b. Actualizar Estado de Cita
app.put('/api/citas/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!id || !estado) {
    return res.status(400).json({ success: false, error: 'Faltan parámetros' });
  }

  if (supabase) {
    try {
      await supabase.from('citas').update({ estado }).eq('id', id);
    } catch (e) {
      console.error('Error actualizando en Supabase:', e.message);
    }
  }

  try {
    let citas = JSON.parse(fs.readFileSync(CITAS_FILE, 'utf8') || '[]');
    const idx = citas.findIndex(c => c.id === id);
    if (idx !== -1) {
      citas[idx].estado = estado;
      fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));
    }
    res.json({ success: true, id, estado });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 8c. Endpoints para Servicios
app.get('/api/servicios', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('servicios').select('*').order('orden', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json([]);
});

app.post('/api/servicios', async (req, res) => {
  const servicio = req.body;
  if (!servicio || !servicio.id) return res.status(400).json({ error: 'Datos inválidos' });
  if (supabase) {
    try {
      await supabase.from('servicios').upsert(servicio);
    } catch (e) {}
  }
  res.json({ success: true, servicio });
});

// 8d. Endpoints para Barberos
app.get('/api/barberos', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('barberos').select('*');
      if (!error && Array.isArray(data) && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json([]);
});

app.post('/api/barberos', async (req, res) => {
  const barbero = req.body;
  if (!barbero || !barbero.id) return res.status(400).json({ error: 'Datos inválidos' });
  if (supabase) {
    try {
      await supabase.from('barberos').upsert(barbero);
    } catch (e) {}
  }
  res.json({ success: true, barbero });
});

// 8e. Endpoints para Cuentas Bancarias
app.get('/api/bancos', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('bancos').select('*');
      if (!error && Array.isArray(data) && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json([]);
});

app.post('/api/bancos', async (req, res) => {
  const banco = req.body;
  if (!banco || !banco.id) return res.status(400).json({ error: 'Datos inválidos' });
  if (supabase) {
    try {
      await supabase.from('bancos').upsert(banco);
    } catch (e) {}
  }
  res.json({ success: true, banco });
});

// 8f. Estado Supabase
app.get('/api/supabase/status', (req, res) => {
  res.json({
    connected: !!supabase,
    url: SUPABASE_URL ? `${SUPABASE_URL.slice(0, 18)}...` : null
  });
});

// 9. Actualizar Configuración del Bot de WhatsApp
app.post('/api/whatsapp/config', (req, res) => {
  const { activo, horasAnticipacionRecordatorio, enviarConfirmacionInmediata } = req.body;
  if (typeof activo === 'boolean') botConfig.activo = activo;
  if (typeof horasAnticipacionRecordatorio === 'number') botConfig.horasAnticipacionRecordatorio = horasAnticipacionRecordatorio;
  if (typeof enviarConfirmacionInmediata === 'boolean') botConfig.enviarConfirmacionInmediata = enviarConfirmacionInmediata;

  guardarBotConfig();
  res.json({ success: true, botConfig });
});

// 10. Historial de mensajes de WhatsApp
app.get('/api/whatsapp/historial', (req, res) => {
  res.json(historialMensajes);
});

// ==========================================================================
// INICIAR SERVIDOR HTTP Y SOCKET
// ==========================================================================
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`💈 SERVIDOR RAÍCES BARBER SHOP CORRIENDO EN:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 Panel Admin: http://localhost:${PORT}/admin.html`);
  console.log(`======================================================\n`);

  // Iniciar conexión Baileys
  iniciarWhatsAppBot();
});
