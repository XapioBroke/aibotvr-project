import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, deleteDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './App.css';

// Lista de 50 avatares míticos
const AVATARES_DISPONIBLES = [
  // Mitología Griega/Romana
  { id: 1, nombre: "Zeus", mitologia: "Griega", icono: "⚡" },
  { id: 2, nombre: "Poseidón", mitologia: "Griega", icono: "🌊" },
  { id: 3, nombre: "Hades", mitologia: "Griega", icono: "💀" },
  { id: 4, nombre: "Atenea", mitologia: "Griega", icono: "🦉" },
  { id: 5, nombre: "Ares", mitologia: "Griega", icono: "⚔️" },
  { id: 6, nombre: "Medusa", mitologia: "Griega", icono: "🐍" },
  { id: 7, nombre: "Minotauro", mitologia: "Griega", icono: "🐂" },
  { id: 8, nombre: "Fénix", mitologia: "Griega", icono: "🔥" },
  { id: 9, nombre: "Pegaso", mitologia: "Griega", icono: "🦄" },
  { id: 10, nombre: "Cerbero", mitologia: "Griega", icono: "🐕" },
  
  // Mitología Nórdica
  { id: 11, nombre: "Thor", mitologia: "Nórdica", icono: "🔨" },
  { id: 12, nombre: "Loki", mitologia: "Nórdica", icono: "🎭" },
  { id: 13, nombre: "Odín", mitologia: "Nórdica", icono: "👁️" },
  { id: 14, nombre: "Valkiria", mitologia: "Nórdica", icono: "🗡️" },
  { id: 15, nombre: "Fenrir", mitologia: "Nórdica", icono: "🐺" },
  { id: 16, nombre: "Jörmundgander", mitologia: "Nórdica", icono: "🐉" },
  { id: 17, nombre: "Sleipnir", mitologia: "Nórdica", icono: "🐴" },
  { id: 18, nombre: "Yggdrasil", mitologia: "Nórdica", icono: "🌳" },
  
  // Mitología Egipcia
  { id: 19, nombre: "Ra", mitologia: "Egipcia", icono: "☀️" },
  { id: 20, nombre: "Anubis", mitologia: "Egipcia", icono: "🐺" },
  { id: 21, nombre: "Horus", mitologia: "Egipcia", icono: "🦅" },
  { id: 22, nombre: "Bastet", mitologia: "Egipcia", icono: "🐱" },
  { id: 23, nombre: "Sobek", mitologia: "Egipcia", icono: "🐊" },
  { id: 24, nombre: "Thot", mitologia: "Egipcia", icono: "📜" },
  { id: 25, nombre: "Esfinge", mitologia: "Egipcia", icono: "🦁" },
  
  // Mitología Azteca/Maya
  { id: 26, nombre: "Quetzalcóatl", mitologia: "Azteca", icono: "🐍" },
  { id: 27, nombre: "Huitzilopochtli", mitologia: "Azteca", icono: "🌞" },
  { id: 28, nombre: "Tezcatlipoca", mitologia: "Azteca", icono: "🐆" },
  { id: 29, nombre: "Xolotl", mitologia: "Azteca", icono: "🐕" },
  { id: 30, nombre: "Kukulkán", mitologia: "Maya", icono: "🐉" },
  { id: 31, nombre: "Camazotz", mitologia: "Maya", icono: "🦇" },
  
  // Criaturas Fantásticas
  { id: 32, nombre: "Dragón Occidental", mitologia: "Fantasía", icono: "🐲" },
  { id: 33, nombre: "Dragón Oriental", mitologia: "Fantasía", icono: "🐉" },
  { id: 34, nombre: "Grifo", mitologia: "Fantasía", icono: "🦅" },
  { id: 35, nombre: "Hidra", mitologia: "Fantasía", icono: "🐍" },
  { id: 36, nombre: "Kraken", mitologia: "Fantasía", icono: "🐙" },
  { id: 37, nombre: "Basilisco", mitologia: "Fantasía", icono: "🦎" },
  { id: 38, nombre: "Leviatán", mitologia: "Fantasía", icono: "🐋" },
  { id: 39, nombre: "Behemoth", mitologia: "Fantasía", icono: "🦏" },
  { id: 40, nombre: "Mantícora", mitologia: "Fantasía", icono: "🦁" },
  { id: 41, nombre: "Quimera", mitologia: "Fantasía", icono: "🦁" },
  
  // Seres Elementales
  { id: 42, nombre: "Golem de Piedra", mitologia: "Elemental", icono: "🗿" },
  { id: 43, nombre: "Ifrit", mitologia: "Elemental", icono: "🔥" },
  { id: 44, nombre: "Ondina", mitologia: "Elemental", icono: "💧" },
  { id: 45, nombre: "Sílfide", mitologia: "Elemental", icono: "💨" },
  { id: 46, nombre: "Rayo Viviente", mitologia: "Elemental", icono: "⚡" },
  { id: 47, nombre: "Espíritu de Hielo", mitologia: "Elemental", icono: "❄️" },
  { id: 48, nombre: "Ent", mitologia: "Elemental", icono: "🌲" },
  { id: 49, nombre: "Salamandra de Lava", mitologia: "Elemental", icono: "🌋" },
  { id: 50, nombre: "Fénix de Hielo", mitologia: "Elemental", icono: "🧊" }
];

const AVATARES_HISTORICOS_MX = [
  // MEXICO PREHISPANICO
  { id: 51, nombre: "Cuauhtémoc",             epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "CUAUHTEMOC.png", carpetaEvo: "EVO_CUAUHTEMOC", icono: "🦅" },
  { id: 52, nombre: "Cuitláhuac",              epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "CUITLAHUAC.png", carpetaEvo: "EVO_CUITLAHUAC", icono: "⚔️" },
  { id: 53, nombre: "Malintzin (La Malinche)", epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "MALINTZIN MARINA MALINCHE.png", carpetaEvo: "EVO_MALINTZIN", icono: "🌺" },
  { id: 54, nombre: "Moctezuma Xocoyotzin",    epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "MOCTEZUMA XOCOYOTZIN.png", carpetaEvo: "EVO_MOCTEZUMA", icono: "👑" },
  { id: 55, nombre: "Nezahualcóyotl",          epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "NEZAHUALCOYOTL.png", carpetaEvo: "EVO_NEZAHUALCOYOTL", icono: "📜" },
  { id: 56, nombre: "Pakal el Grande",         epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "PAKAL EL GRANDE.png", carpetaEvo: "EVO_PAKAL EL GRANDE", icono: "🏛️" },
  { id: 57, nombre: "Vasco de Quiroga",        epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "VASCO DE QUIROGA.png", carpetaEvo: "EVO_QUIROGA", icono: "✝️" },
  { id: 58, nombre: "Xicotencatl el Mozo",     epoca: "Prehispánico", carpeta: "MEXICO PREHISPANICO", archivo: "XICOTENCATL EL MOZO.png", carpetaEvo: "EVO_XICOTENCATL", icono: "🗡️" },
 
  // MEXICO INDEPENDENTISTA
  { id: 59, nombre: "Agustín de Iturbide",          epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "AGUSTIN DE ITURBIDE.png", carpetaEvo: "EVO_AGUTIN DE ITURBIDE", icono: "🎖️" },
  { id: 60, nombre: "Carlos de Sigüenza",           epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "CARLOS DE SIGUENZA.png", carpetaEvo: "EVO_SIGUENZA", icono: "🔭" },
  { id: 61, nombre: "Carlota Amalia de Bélgica",    epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "CARLOTA AMALIA DE BELGICA.png", carpetaEvo: "EVO_CARLOTA", icono: "👸" },
  { id: 62, nombre: "Fray Bartolomé de las Casas",  epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "FRAY BARTOLOME DE LAS CASAS.png", carpetaEvo: "EVO_BARTOLOME", icono: "📖" },
  { id: 63, nombre: "Ignacio Allende",              epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "IGNACIO ALLENDE.png", carpetaEvo: "EVO_IGNACIO ALLENDE", icono: "⚔️" },
  { id: 64, nombre: "Josefa Ortiz de Domínguez",    epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "JOSEFA ORTIZ DE DOMINGUEZ.png", carpetaEvo: "EVO_JOSEFA ORTIZ", icono: "🔔" },
  { id: 65, nombre: "Juan Ruiz de Alarcón",         epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "JUAN RUIZ DE ALARCON.png", carpetaEvo: "EVO_JUAN RUIZ", icono: "✍️" },
  { id: 66, nombre: "Leona Vicario",                epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "LEONA VICARIO.png", carpetaEvo: "EVO_LEONA VICARIO", icono: "🦁" },
  { id: 67, nombre: "Maximiliano de Habsburgo",     epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "MAXIMILIANO DE HABSBURGO.png", carpetaEvo: "EVO_MAXIMILIANO DE HABSBURGO", icono: "👑" },
  { id: 68, nombre: "Miguel Hidalgo y Costilla",    epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "MIGUEL HIDALGO Y COSTILLA.png", carpetaEvo: "EVO_MIGUEL HIDALGO", icono: "🔔" },
  { id: 69, nombre: "Vicente Guerrero",              epoca: "Independencia", carpeta: "MEXICO INDEPENDENTISTA", archivo: "VICENTE GUERRERO.png", carpetaEvo: "EVO_VICENTE GUERRERO", icono: "🏴" },
 
  // MEXICO REVOLUCIONARIO
  { id: 70, nombre: "Adelita",                    epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "ADELITA.png", carpetaEvo: "EVO_ADELITA", icono: "🌹" },
  { id: 71, nombre: "Álvaro Obregón",             epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "ALVARO OBREGON.png", carpetaEvo: "EVO_ALVARO OBREGON", icono: "⭐" },
  { id: 72, nombre: "Benito Juárez",              epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "BENITO JUAREZ.png", carpetaEvo: "EVO_BENITO JUAREZ", icono: "⚖️" },
  { id: 73, nombre: "Diego Rivera",                epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "DIEGO RIVERA.png", carpetaEvo: "EVO_DIEGO RIVERA", icono: "🎨" },
  { id: 74, nombre: "Pancho Villa",                epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "DOROTEO ARANGO PANCHO VILLA..png", carpetaEvo: "EVO_PANCHO VILLA", icono: "🐎" },
  { id: 75, nombre: "Emiliano Zapata",             epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "EMILIANO ZAPATA.png", carpetaEvo: "EVO_EMILIANO ZAPATA", icono: "🌽" },
  { id: 76, nombre: "Francisco I. Madero",         epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "FRANCISCO I. MADERO.png", carpetaEvo: "EVO_FRANCISCO I MADERO", icono: "📋" },
  { id: 77, nombre: "Frida Kahlo",                 epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "FRIDA KAHLO.png", carpetaEvo: "EVO_FRIDA KAHLO", icono: "🌸" },
  { id: 78, nombre: "Ignacio Zaragoza",            epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "IGNACIO ZARAGOZA.png", carpetaEvo: "EVO_IGNACIO ZARAGOZA", icono: "🎖️" },
  { id: 79, nombre: "José Vasconcelos",            epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "JOSE VASCONCELOS.png", carpetaEvo: "EVO_JOSE VASCONCELOS", icono: "📚" },
  { id: 80, nombre: "Melchor Ocampo",              epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "MELCHOR OCAMPO.png", carpetaEvo: "EVO_MORELOS", icono: "📜" },
  { id: 81, nombre: "Octavio Paz",                 epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "OCTAVIO PAZ.png", carpetaEvo: "EVO_OCTAVIO PAZ", icono: "✒️" },
  { id: 82, nombre: "Porfirio Díaz",              epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "PORFIRIO DIAZ.png", carpetaEvo: "EVO_PORFIRIO DIAZ", icono: "🎩" },
  { id: 83, nombre: "Rufino Tamayo",               epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "RUFINO TAMAYO.png", carpetaEvo: "EVO_RUFINO TAMAYO", icono: "🖌️" },
  { id: 84, nombre: "Sebastián Lerdo de Tejada",  epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "SEBASTIAN LERDO DE TEJADA.png", carpetaEvo: "EVO_LERDO DE TEJADA", icono: "⚖️" },
  { id: 85, nombre: "Sor Juana Inés de la Cruz",  epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "SOR JUANA INES DE LA CRUZ.png", carpetaEvo: "EVO_SOR JUANA", icono: "📖" },
  { id: 86, nombre: "Venustiano Carranza",         epoca: "Revolución", carpeta: "MEXICO REVOLUCIONARIO", archivo: "VENUSTIANO CARRANZA.png", carpetaEvo: "EVO_VENUSTIANO CARRANZA", icono: "📋" },
 
  // MEXICO ACTUAL
  { id: 87, nombre: "Chapulín Colorado",     epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "CHAPULIN COLORADO.png", carpetaEvo: "EVO_CHAPULIN", icono: "🦗" },
  { id: 88, nombre: "Hugo Sánchez",           epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "HUGO SANCHEZ.png", carpetaEvo: "EVO_HUGO SANCHEZ", icono: "⚽" },
  { id: 89, nombre: "Julio César Chávez",     epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "JULIO CESAR CHAVEZ.png", carpetaEvo: "EVO_JULIO CESAR", icono: "🥊" },
  { id: 90, nombre: "Mario Moreno Cantinflas", epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "MARIO MORENO CANTINFLAS.png", carpetaEvo: "EVO_CANTINFLAS", icono: "🎭" },
  { id: 91, nombre: "Ramón Valdez Don Ramón", epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "RAMON VALDEZ DON RAMON.png", carpetaEvo: "EVO_DON RAMON", icono: "😄" },
  { id: 92, nombre: "Vicente Fernández",     epoca: "México Actual", carpeta: "MEXICO ACTUAL", archivo: "VICENTE FERNANDEZ.png", carpetaEvo: "EVO_VICENTE FERNANDEZ", icono: "🎵" },
];

const TODOS_LOS_AVATARES = [...AVATARES_DISPONIBLES, ...AVATARES_HISTORICOS_MX];

// Lista de avatares con capacidad de vuelo
const AVATARES_VOLADORES = [
  8, 9, 11, 13, 14, 16, 17, 18, // Fénix, Pegaso, Thor, Odín, Valkiria, Jörmundgander, Sleipnir, Yggdrasil
  19, 21, // Ra, Horus
  26, 30, 31, // Quetzalcóatl, Kukulkán, Camazotz
  32, 33, 34, 35, 38, // Dragones, Grifo, Hidra, Leviatán
  45, 46, 50 // Sílfide, Rayo Viviente, Fénix de Hielo
];

// Verificar si un avatar puede volar
const puedeVolar = (avatarId) => {
  return AVATARES_VOLADORES.includes(avatarId);
};

// Categorías de animación por tipo de criatura
const CATEGORIA_ANIMACION = {
  // Aves y voladores con alas
  alas: [8, 9, 14, 21, 30, 31, 34], // Fénix, Pegaso, Valkiria, Horus, Kukulkán, Camazotz, Grifo
  // Dragones y reptiles voladores
  dragon: [32, 33, 35, 50], // Dragón Occidental, Oriental, Hidra, Fénix de Hielo
  // Serpientes y criaturas ondulantes
  serpiente: [6, 16, 26, 28, 35], // Medusa, Jörmundgander, Quetzalcóatl, Tezcatlipoca, Hidra
  // Dioses flotantes y energía pura
  divino: [1, 2, 3, 11, 13, 19, 27, 45, 46], // Zeus, Poseidón, Hades, Thor, Odín, Ra, Huitzilopochtli, Sílfide, Rayo
  // Cuadrúpedos terrestres
  cuadrupedo: [7, 10, 15, 23, 29, 40, 41], // Minotauro, Cerbero, Fenrir, Sobek, Xolotl, Mantícora, Quimera
  // Humanoides
  humanoide: [4, 5, 17, 18, 20, 22, 24, 25, 38, 39, 42, 43, 44, 47, 48, 49], // Atenea, Ares, Sleipnir, etc.
  // Acuáticos
  acuatico: [2, 36, 38, 44], // Poseidón, Kraken, Leviatán, Ondina
  // Gigantes y masivos
  gigante: [39, 42], // Behemoth, Golem
};

const getCategoria = (avatarId) => {
  for (const [categoria, ids] of Object.entries(CATEGORIA_ANIMACION)) {
    if (ids.includes(avatarId)) {
      return categoria;
    }
  }
  return 'humanoide'; // Default
};

// Niveles de evolución MEJORADOS con sistema de sprites
const NIVELES = [
  { nivel: 0, nombre: "Huevo", puntos: 0, emoji: "🥚", mensaje: "esperando nacer", sprite: "huevo" },
  { nivel: 1, nombre: "Bebé", puntos: 10, emoji: "👶", mensaje: "¡Hola mundo!", sprite: "bebe" },
  { nivel: 2, nombre: "Joven", puntos: 30, emoji: "🦎", mensaje: "creciendo fuerte", sprite: "adulto" },
  { nivel: 3, nombre: "Guerrero", puntos: 60, emoji: "🐉", mensaje: "listo para la batalla", sprite: "adulto" },
  { nivel: 4, nombre: "Héroe", puntos: 100, emoji: "🔥", mensaje: "poder desatado", sprite: "adulto" },
  { nivel: 5, nombre: "Legendario", puntos: 150, emoji: "⚡", mensaje: "imparable", sprite: "adulto" },
  { nivel: 6, nombre: "Mítico", puntos: 200, emoji: "👑", mensaje: "supremacía total", sprite: "adulto" }
];

// Fondos por mitología
const FONDOS_MITOLOGIA = {
  "Griega": "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6dd5ed 100%)",
  "Nórdica": "linear-gradient(135deg, #2c3e50 0%, #4ca1af 50%, #c0c0c0 100%)",
  "Egipcia": "linear-gradient(135deg, #f2994a 0%, #f2c94c 50%, #d4a574 100%)",
  "Azteca": "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #f2994a 100%)",
  "Maya": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "Fantasía": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  "Elemental":       "linear-gradient(135deg, #00d2ff 0%, #928dab 50%, #ff6b6b 100%)",
  "Prehispánico":  "linear-gradient(135deg, #7B3F00 0%, #C68642 50%, #F4C842 100%)",
  "Independencia": "linear-gradient(135deg, #006847 0%, #FFFFFF 50%, #CE1126 100%)",
  "Revolución":    "linear-gradient(135deg, #3a1a00 0%, #8B4513 50%, #D2691E 100%)",
  "México Actual": "linear-gradient(135deg, #006847 0%, #003580 50%, #CE1126 100%)",
};

// Mensajes motivacionales por nivel
const MENSAJES_MOTIVACION = {
  1: [
    "¡Excelente inicio! Sigue así y llegarás lejos.",
    "¡Buen comienzo! Tu avatar despierta con energía.",
    "¡Primer paso completado! El camino al poder comienza."
  ],
  2: [
    "¡Vas por buen camino! Tu dedicación se nota.",
    "¡Impresionante progreso! Sigue demostrando tu valía.",
    "¡Cada vez más fuerte! Tu esfuerzo da frutos."
  ],
  3: [
    "¡Eres un guerrero nato! Tu poder crece exponencialmente.",
    "¡Magnífico! Estás dominando tu potencial.",
    "¡Extraordinario! Tu avatar alcanza nuevas alturas."
  ],
  4: [
    "¡HEROICO! Tu dedicación te convierte en leyenda.",
    "¡ASOMBROSO! Pocos alcanzan este nivel de grandeza.",
    "¡FORMIDABLE! Tu poder inspira a todos."
  ],
  5: [
    "¡LEGENDARIO! Has trascendido los límites normales.",
    "¡ÉPICO! Tu nombre será recordado en la historia.",
    "¡INCREÍBLE! Tu poder brilla como mil soles."
  ],
  6: [
    "¡MÍTICO! Has alcanzado la cúspide del poder absoluto.",
    "¡SUPREMO! Eres la personificación de la excelencia.",
    "¡TRASCENDENTAL! Tu grandeza no conoce límites."
  ]
};

// Mensajes de alerta por gravedad
const ALERTAS_NEGATIVAS = {
  leve: [
    "¡Atención! Tu avatar necesita que demuestres más.",
    "¡Cuidado! No dejes que tu poder se desvanezca.",
    "¡Alerta! Es momento de recuperar tu fuerza."
  ],
  moderado: [
    "¡PELIGRO! Tu avatar está en riesgo, reacciona ahora.",
    "¡URGENTE! Necesitas actuar de inmediato.",
    "¡CRÍTICO! Tu poder se debilita rápidamente."
  ],
  critico: [
    "¡EMERGENCIA EXTREMA! Tu avatar está al borde del colapso.",
    "¡CÓDIGO ROJO! ¡Actúa ahora o todo estará perdido!",
    "¡ÚLTIMA OPORTUNIDAD! ¡Tu avatar clama por salvación!"
  ]
};

// Gritos de guerra por mitología
const GRITOS_GUERRA = {
  "Griega": ["¡Por el Olimpo!", "¡Gloria eterna!", "¡Poder divino!"],
  "Nórdica": ["¡Por Asgard!", "¡Valhalla me espera!", "¡Odin me guía!"],
  "Egipcia": ["¡Gloria a Ra!", "¡Poder del Nilo!", "¡Eternidad!"],
  "Azteca": ["¡Fuerza ancestral!", "¡Por Tenochtitlán!", "¡Poder del sol!"],
  "Maya": ["¡Sabiduría maya!", "¡Fuerza de Kukulkán!", "¡Gloria eterna!"],
  "Fantasía": ["¡Poder supremo!", "¡Invencible!", "¡Imparable!"],
  "Elemental":       ["¡Fuerza natural!", "¡Poder elemental!", "¡Energía pura!"],
  "Prehispánico":  ["¡Por el quinto sol!", "¡Tlaltecuhtli me guía!", "¡Fuerza de Tenochtitlán!"],
  "Independencia": ["¡Viva México!", "¡Independencia o muerte!", "¡La patria nos llama!"],
  "Revolución":    ["¡Tierra y Libertad!", "¡Sufragio efectivo, no reelección!", "¡Viva la Revolución!"],
  "México Actual": ["¡Arriba México!", "¡Orgullo mexicano!", "¡Ánimo, campeón!"],
};

// Mensajes de ayuda por gravedad
const MENSAJES_AYUDA = {
  leve: (nombre) => `${nombre}... ¿me ayudas? 😟`,
  moderado: (nombre) => `¡${nombre}! ¡Te necesito! 😰`,
  critico: (nombre) => `¡AUXILIO ${nombre}! ¡Me estoy debilitando! 💀`
};

function App() {
  const [coleccionActiva, setColeccionActiva] = useState('miticos');
  const [escuelas, setEscuelas] = useState([]);
  const [mostrarAdminEscuelas, setMostrarAdminEscuelas] = useState(false);
  
  const [vista, setVista] = useState('menu'); // menu, profesor, proyeccion
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  
  // NUEVOS ESTADOS DE TIEMPO/CALENDARIO Y RESETEO
  const [trimestreActivo, setTrimestreActivo] = useState('T1'); 
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [mostrarOpcionesReset, setMostrarOpcionesReset] = useState(false);

  const [evolucionActual, setEvolucionActual] = useState(null);
  const [videoEvolucionUrl, setVideoEvolucionUrl] = useState(null);
  
  const [alumnoEnEvolucion, setAlumnoEnEvolucion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAlumno, setNuevoAlumno] = useState('');
  const [textoMasivo, setTextoMasivo] = useState('');
  const [cargandoArchivo, setCargandoArchivo] = useState(false);
  const [cargandoMasivo, setCargandoMasivo] = useState(false);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [mostrarListaAvatares, setMostrarListaAvatares] = useState(false);
  const [alertaMoribundo, setAlertaMoribundo] = useState(null);
  const [mostrarUploader, setMostrarUploader] = useState(false);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 });
  const [modoControlProyeccion, setModoControlProyeccion] = useState(false);
  const [alumnoSeleccionadoProyeccion, setAlumnoSeleccionadoProyeccion] = useState(null);
  const [imagenesAvatares, setImagenesAvatares] = useState({});
  const [modoInteractivo, setModoInteractivo] = useState(false);
  const [musicaActiva, setMusicaActiva] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const getColeccionAvatares = () => {
    return coleccionActiva === 'miticos' ? AVATARES_DISPONIBLES : AVATARES_HISTORICOS_MX;
  };

  // NUEVA FUNCIÓN: Ordenar alfabéticamente a los alumnos en base a su nombre
  const alumnosOrdenados = [...alumnos].sort((a, b) => a.nombre.localeCompare(b.nombre));

  // NUEVA FUNCIÓN: Obtener los puntos correctos según el trimestre activo
  const getPuntosActuales = (alumno) => {
    // T1 — vacío, el proyecto no existía
    if (trimestreActivo === 'T1') return 0;
    
    // T2 — datos reales, con fallback a puntosClase para alumnos viejos
    if (trimestreActivo === 'T2') {
      if (alumno.puntosT2 !== undefined) return alumno.puntosT2;
      return alumno.puntosClase || 0;
    }
    
    // T3 — solo datos nuevos desde hoy
    if (trimestreActivo === 'T3') return alumno.puntosT3 || 0;
    
    return 0;
  };

  const getCristalesActuales = (alumno) => {
    if (trimestreActivo === 'T1') return 0;
    if (trimestreActivo === 'T2') {
      if (alumno.cristalesT2 !== undefined) return alumno.cristalesT2;
      return alumno.cristalesPrestigio || 0;
    }
    if (trimestreActivo === 'T3') return alumno.cristalesT3 || 0;
    return 0;
  };

  const getCristalesTotales = (alumno) => {
    if (alumno.cristalesTotales !== undefined) return alumno.cristalesTotales;
    return alumno.cristalesPrestigio || 0;
  };

  useEffect(() => {
    cargarEscuelas();
  }, []);

  // Efecto para verificar si hay grupo seleccionado al cambiar a proyección
  useEffect(() => {
    if (escuelaSeleccionada && grupoSeleccionado) {
      cargarAlumnos();
    }
  }, [escuelaSeleccionada, grupoSeleccionado]);

  const cargarEscuelas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'escuelas'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Si no hay escuelas en Firestore, migra las del array hardcoded
      if (data.length === 0) {
        await migrarEscuelas();
      } else {
        setEscuelas(data);
      }
    } catch (error) {
      console.error('Error cargando escuelas:', error);
    }
  };

  const migrarEscuelas = async () => {
    const ESCUELAS_INICIALES = [
      { id: '1', nombre: "Secundaria Técnica 90",  grupos: ["2A","2B","2C","2D","1D"] },
      { id: '2', nombre: "Secundaria Técnica 131", grupos: ["1A","1B"] },
      { id: '3', nombre: "Secundaria Técnica 164", grupos: ["1A","1B"] },
      { id: '4', nombre: "Secundaria Foránea 17",  grupos: ["2B","2C"] },
      { id: '5', nombre: "Secundaria Foránea 8",   grupos: ["1C","2D","3C"] },
    ];
    for (const escuela of ESCUELAS_INICIALES) {
      await setDoc(doc(db, 'escuelas', escuela.id), {
        nombre: escuela.nombre,
        grupos: escuela.grupos
      });
    }
    console.log('Escuelas migradas a Firestore');
    cargarEscuelas();
  };

  const agregarEscuela = async (nombre) => {
    if (!nombre.trim()) return;
    await addDoc(collection(db, 'escuelas'), { nombre: nombre.trim(), grupos: [] });
    cargarEscuelas();
  };

  const eliminarEscuela = async (escuelaId, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"? Los alumnos de esta escuela no se borran.`)) return;
    await deleteDoc(doc(db, 'escuelas', escuelaId));
    cargarEscuelas();
  };

  const renombrarEscuela = async (escuelaId, nombreActual) => {
    const nuevoNombre = prompt('Nuevo nombre de la escuela:', nombreActual);
    if (!nuevoNombre || nuevoNombre.trim() === nombreActual) return;
    await updateDoc(doc(db, 'escuelas', escuelaId), { nombre: nuevoNombre.trim() });
    cargarEscuelas();
  };

  const agregarGrupo = async (escuelaId, gruposActuales) => {
    const nuevoGrupo = prompt('Nombre del nuevo grupo (ej: 3A):');
    if (!nuevoGrupo || gruposActuales.includes(nuevoGrupo.trim())) return;
    await updateDoc(doc(db, 'escuelas', escuelaId), {
      grupos: [...gruposActuales, nuevoGrupo.trim().toUpperCase()]
    });
    cargarEscuelas();
  };

  const eliminarGrupo = async (escuelaId, gruposActuales, grupo) => {
    if (!confirm(`¿Eliminar el grupo "${grupo}"? Los alumnos de este grupo no se borran.`)) return;
    await updateDoc(doc(db, 'escuelas', escuelaId), {
      grupos: gruposActuales.filter(g => g !== grupo)
    });
    cargarEscuelas();
  };

  const renombrarGrupo = async (escuelaId, gruposActuales, grupoActual) => {
    const nuevoGrupo = prompt('Nuevo nombre del grupo:', grupoActual);
    if (!nuevoGrupo || nuevoGrupo.trim() === grupoActual) return;
    await updateDoc(doc(db, 'escuelas', escuelaId), {
      grupos: gruposActuales.map(g => g === grupoActual ? nuevoGrupo.trim().toUpperCase() : g)
    });
    cargarEscuelas();
  };

  // Función para calcular el nivel actual según puntos
  const calcularNivel = (puntos) => {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (puntos >= NIVELES[i].puntos) {
        return NIVELES[i];
      }
    }
    return NIVELES[0];
  };

  // Función para asignar avatar aleatorio
  const asignarAvatarAleatorio = () => {
    const col = getColeccionAvatares();
    return col[Math.floor(Math.random() * col.length)].id;
  };

  // Asignar avatares aleatorios sin repetir a todo el grupo
  const asignarAvataresAleatoriosSinRepetir = async () => {
    if (!confirm('¿Asignar avatares aleatorios únicos a todos los alumnos? Esto cambiará los avatares actuales.')) return;

    try {
      const avatarDisponibles = [...getColeccionAvatares()];
      const alumnosShuffled = [...alumnos].sort(() => Math.random() - 0.5);

      for (let i = 0; i < alumnosShuffled.length; i++) {
        const avatarIndex = i % avatarDisponibles.length;
        await updateDoc(doc(db, 'alumnos', alumnosShuffled[i].id), {
          avatarId: avatarDisponibles[avatarIndex].id
        });
      }

      cargarAlumnos();
      alert('¡Avatares asignados exitosamente!');
    } catch (error) {
      console.error('Error asignando avatares:', error);
      alert('Error al asignar avatares');
    }
  };

  // Cargar alumnos del grupo seleccionado
  const cargarAlumnos = async () => {
    if (!escuelaSeleccionada || !grupoSeleccionado) return;
    
    try {
      const q = query(
        collection(db, 'alumnos'),
        where('escuelaNombre', '==', escuelaSeleccionada.nombre),
        where('grupo', '==', grupoSeleccionado)
      );
      const querySnapshot = await getDocs(q);
      const alumnosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlumnos(alumnosData);
      
      // Cargar imágenes de avatares
      cargarImagenesAvatares(alumnosData);
      // Migración automática: cristalesPrestigio → cristalesT2
      const alumnosSinMigrar = alumnosData.filter(a =>
        a.cristalesT2 === undefined && (a.cristalesPrestigio || 0) > 0
      );
      if (alumnosSinMigrar.length > 0) {
        const migraciones = alumnosSinMigrar.map(alumno =>
          updateDoc(doc(db, 'alumnos', alumno.id), {
            cristalesT1: 0,
            cristalesT2: alumno.cristalesPrestigio || 0,
            cristalesT3: 0,
            cristalesTotales: alumno.cristalesPrestigio || 0,
          })
        );
        await Promise.all(migraciones);
        console.log(`Migrados ${alumnosSinMigrar.length} alumnos a cristales por trimestre`);
        cargarAlumnos();
      }
    } catch (error) {
      console.error('Error cargando alumnos:', error);
      alert('Error al cargar alumnos. Verifica tu conexión a internet.');
    }
  };

  // Cargar imágenes de avatares desde Firebase Storage
  const cargarImagenesAvatares = async (alumnosData) => {
    const imagenesTemp = {};
    
    for (const alumno of alumnosData) {
      if (!imagenesTemp[alumno.avatarId]) {
        try {
          const url = await getAvatarImageUrl(alumno.avatarId);
          if (url) {
            imagenesTemp[alumno.avatarId] = url;
          }
        } catch (error) {
          // Silenciosamente usar emoji si falla
          console.log(`Usando emoji para avatar ID ${alumno.avatarId}`);
        }
      }
    }
    
    setImagenesAvatares(imagenesTemp);
  };

  const MAPEO_VIDEO = { 1: null, 2: 1, 3: 1, 4: 2, 5: 3, 6: 4 };
  const getVideoEvoUrl = async (avatarId, nivelNumero) => {
    try {
      const avatar = AVATARES_HISTORICOS_MX.find(a => a.id === avatarId);
      if (!avatar?.carpetaEvo) return null;
      const videoNumero = MAPEO_VIDEO[nivelNumero];
      if (!videoNumero) return null;
      const storageRef = ref(storage, `evoluciones/${avatar.carpetaEvo}/EVO_${videoNumero}.mp4`);
      return await getDownloadURL(storageRef);
    } catch (e) {
      return null;
    }
  };

  // Agregar alumno individual (Actualizado para Trimestres)
  const agregarAlumnoIndividual = async () => {
    if (!nuevoAlumno.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    try {
      await addDoc(collection(db, 'alumnos'), {
        nombre: nuevoAlumno.trim(),
        escuelaId: escuelaSeleccionada.id,
        escuelaNombre: escuelaSeleccionada.nombre,
        grupo: grupoSeleccionado,
        avatarId: asignarAvatarAleatorio(),
        puntosT1: 0, 
        puntosT2: 0, 
        puntosT3: 0,
        asistencias: [],
        cristalesPrestigio: 0,
        cristalesT1: 0,
        cristalesT2: 0,
        cristalesT3: 0,
        cristalesTotales: 0,
        fechaCreacion: new Date().toISOString()
      });

      setNuevoAlumno('');
      setMostrarFormulario(false);
      cargarAlumnos();
      alert('¡Alumno agregado exitosamente!');
    } catch (error) {
      console.error('Error agregando alumno:', error);
      alert('Error al agregar alumno. Verifica tu conexión.');
    }
  };

  // Agregar alumnos masivos (Actualizado para Trimestres)
  const agregarAlumnosMasivos = async () => {
    if (!textoMasivo.trim()) {
      alert('Por favor ingresa al menos un nombre');
      return;
    }

    setCargandoMasivo(true);

    try {
      const nombres = textoMasivo
        .split('\n')
        .map(n => n.trim())
        .filter(n => n);
      
      let agregados = 0;
      for (const nombre of nombres) {
        await addDoc(collection(db, 'alumnos'), {
          nombre: nombre,
          escuelaId: escuelaSeleccionada.id,
          escuelaNombre: escuelaSeleccionada.nombre,
          grupo: grupoSeleccionado,
          avatarId: asignarAvatarAleatorio(),
          puntosT1: 0, 
          puntosT2: 0, 
          puntosT3: 0,
          asistencias: [],
          cristalesPrestigio: 0,
          cristalesT1: 0,
          cristalesT2: 0,
          cristalesT3: 0,
          cristalesTotales: 0,
          fechaCreacion: new Date().toISOString()
        });
        agregados++;
      }

      setTextoMasivo('');
      setMostrarFormulario(false);
      setCargandoMasivo(false);
      cargarAlumnos();
      alert(`¡${agregados} alumnos agregados exitosamente!`);
    } catch (error) {
      console.error('Error agregando alumnos:', error);
      setCargandoMasivo(false);
      alert('Error al agregar alumnos. Verifica tu conexión.');
    }
  };

  // Procesar archivo CSV/TXT (Actualizado para Trimestres)
  const procesarArchivo = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    setCargandoArchivo(true);

    try {
      const texto = await archivo.text();
      const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
      
      let agregados = 0;
      for (const nombre of lineas) {
        if (nombre) {
          await addDoc(collection(db, 'alumnos'), {
            nombre: nombre,
            escuelaId: escuelaSeleccionada.id,
            escuelaNombre: escuelaSeleccionada.nombre,
            grupo: grupoSeleccionado,
            avatarId: asignarAvatarAleatorio(),
            puntosT1: 0, 
            puntosT2: 0, 
            puntosT3: 0,
            asistencias: [],
            cristalesPrestigio: 0,
            cristalesT1: 0,
            cristalesT2: 0,
            cristalesT3: 0,
            cristalesTotales: 0,
            fechaCreacion: new Date().toISOString()
          });
          agregados++;
        }
      }

      setCargandoArchivo(false);
      cargarAlumnos();
      alert(`¡${agregados} alumnos agregados exitosamente!`);
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setCargandoArchivo(false);
      alert('Error al procesar archivo. Asegúrate que sea un archivo de texto con un nombre por línea.');
    }

    event.target.value = '';
  };

  // Eliminar alumno
  const eliminarAlumno = async (alumnoId, nombreAlumno) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombreAlumno}?`)) return;

    try {
      await deleteDoc(doc(db, 'alumnos', alumnoId));
      cargarAlumnos();
      alert('Alumno eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando alumno:', error);
      alert('Error al eliminar alumno');
    }
  };

  // Cambiar avatar de un alumno
  const cambiarAvatar = async (alumnoId, nuevoAvatarId) => {
    try {
      await updateDoc(doc(db, 'alumnos', alumnoId), {
        avatarId: nuevoAvatarId
      });
      setAlumnoEditando(null);
      cargarAlumnos();
    } catch (error) {
      console.error('Error cambiando avatar:', error);
      alert('Error al cambiar avatar');
    }
  };

  // Obtener avatares disponibles (no repetidos en el grupo)
  const getAvataresDisponibles = () => {
    const avatarUsados = alumnos.map(a => a.avatarId);
    return getColeccionAvatares().map(avatar => ({
      ...avatar,
      enUso: avatarUsados.filter(id => id === avatar.id).length
    }));
  };

  // Copiar lista de avatares al portapapeles
  const copiarListaAvatares = () => {
    const texto = getColeccionAvatares().map(a => `${a.icono} ${a.nombre} (${a.mitologia || a.epoca})`).join('\n');
    navigator.clipboard.writeText(texto);
    alert('¡Lista de avatares copiada al portapapeles!');
  };

  // Subir imágenes a Firebase Storage
  const subirImagenes = async (archivos) => {
    setSubiendoImagenes(true);
    const archivosArray = Array.from(archivos);
    setProgreso({ actual: 0, total: archivosArray.length });

    try {
      for (let i = 0; i < archivosArray.length; i++) {
        const archivo = archivosArray[i];
        const extension = archivo.name.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.png';
        
        // Limpiamos el nombre original del archivo para quitarle extensiones o prefijos de id si los tiene
        const nombreArchivo = archivo.name.toLowerCase().replace(/\.(jpg|jpeg|png)$/i, '');
        const nombreSinId = nombreArchivo.replace(/^\d+_/, ''); // quita el "26_" si lo pusiste manualmente
        
        // Buscar el avatar ignorando acentos completamente
        const avatar = AVATARES_DISPONIBLES.find(a => {
          const nombreLimpio = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          return nombreLimpio.replace(/\s+/g, '-') === nombreSinId ||
                 nombreLimpio.replace(/\s+/g, '_') === nombreSinId ||
                 nombreLimpio === nombreSinId ||
                 a.nombre.toLowerCase() === nombreSinId;
        });

        if (avatar) {
          const storageRef = ref(storage, `avatares/${avatar.id}_${nombreArchivo}${extension}`);
          await uploadBytes(storageRef, archivo);
          console.log(`Subida exitosa: ${avatar.nombre}`);
        } else {
          console.error(`No se reconoció el avatar para: ${archivo.name}`);
        }

        setProgreso({ actual: i + 1, total: archivosArray.length });
      }

      alert('¡Todas las imágenes se subieron exitosamente!');
      setMostrarUploader(false);
      setSubiendoImagenes(false);
      
      // Recargar imágenes
      if (alumnos.length > 0) {
        cargarAlumnos();
      }
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('Error al subir imágenes. Revisa la consola.');
      setSubiendoImagenes(false);
    }
  };

  // Obtener URL de imagen del avatar
  const getAvatarImageUrl = async (avatarId) => {
    try {
      if (avatarId <= 50) {
        const avatar = AVATARES_DISPONIBLES.find(a => a.id === avatarId);
        if (!avatar) return null;
        
        // Normalización estricta sin acentos
        const sinAcentos = avatar.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        
        // Orden de búsqueda optimizado
        const posiblesNombres = [
          `${avatarId}_${sinAcentos.replace(/\s+/g, '-')}`,
          `${avatarId}_${sinAcentos.replace(/\s+/g, '_')}`,
          sinAcentos.replace(/\s+/g, '-'),
          sinAcentos.replace(/\s+/g, '_'),
          `${avatarId}_${avatar.nombre.toLowerCase().replace(/\s+/g, '-')}`
        ];
        
        const extensiones = ['.png', '.jpg', '.jpeg'];
        
        for (const nombre of posiblesNombres) {
          for (const ext of extensiones) {
            try {
              return await getDownloadURL(ref(storage, `avatares/${nombre}${ext}`));
            } catch (e) { 
              // Es normal que falle aquí (genera 404 en consola), probará la siguiente extensión
              continue; 
            }
          }
        }
        return null; // Si llega aquí, de verdad no existe
      } else {
        const avatar = AVATARES_HISTORICOS_MX.find(a => a.id === avatarId);
        if (!avatar) return null;
        try {
          return await getDownloadURL(ref(storage, `avatares/${avatar.carpeta}/${avatar.archivo}`));
        } catch (e) {
          return null;
        }
      }
    } catch (error) {
      return null;
    }
  };

  // Componente de Avatar (imagen o emoji)
  const AvatarDisplay = ({ avatarId, className = "", style = {} }) => {
    const avatar = TODOS_LOS_AVATARES.find(a => a.id === avatarId);
    const imagenUrl = imagenesAvatares[avatarId];

    if (imagenUrl) {
      return (
        <div style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style 
        }}>
          <img 
            src={imagenUrl} 
            alt={avatar?.nombre || "Avatar"} 
            className={className}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              background: 'transparent',
              isolation: 'isolate',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
            }}
          />
        </div>
      );
    }

    return <span className={className} style={style}>{avatar?.icono || "👤"}</span>;
  };

  // Reproducir música ambiente
  const toggleMusica = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
      reproducirMusicaEpica(ctx);
      setMusicaActiva(true);
    } else {
      if (musicaActiva) {
        audioContext.suspend();
        setMusicaActiva(false);
      } else {
        audioContext.resume();
        setMusicaActiva(true);
      }
    }
  };

  // Reproducir sonido
  const reproducirSonido = (tipo) => {
    try {
      if (tipo === 'evolucion') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (tipo === 'moribundo') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (error) {
      console.log('Audio no disponible');
    }
  };

  // Voz en off mejorada con más emoción
  const reproducirVoz = (texto, tipo = 'normal') => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-MX';
        
        // Configuración según tipo
        switch(tipo) {
          case 'evolucion':
            utterance.rate = 1.15;
            utterance.pitch = 1.3;
            utterance.volume = 1.0;
            break;
          case 'critico':
            utterance.rate = 1.3;
            utterance.pitch = 0.8;
            utterance.volume = 1.0;
            break;
          case 'motivacion':
            utterance.rate = 1.1;
            utterance.pitch = 1.25;
            utterance.volume = 0.95;
            break;
          default:
            utterance.rate = 1.1;
            utterance.pitch = 1.2;
            utterance.volume = 0.9;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Voz no disponible');
    }
  };

  // Música de fondo épica mejorada
  const reproducirMusicaEpica = (ctx) => {
    const acordes = [
      [220, 277, 330], // Am
      [247, 311, 370], // Bm
      [196, 247, 294], // Gm
      [262, 330, 392], // C
    ];
    
    let indiceAcorde = 0;
    
    const tocarAcorde = () => {
      if (ctx.state !== 'running') return;
      
      const acorde = acordes[indiceAcorde];
      acorde.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2);
      });
      
      indiceAcorde = (indiceAcorde + 1) % acordes.length;
      setTimeout(tocarAcorde, 2000);
    };
    
    tocarAcorde();
  };

  // NUEVA FUNCIÓN: Resetear Puntos (Específico o Todo)
  const resetearPuntos = async (tipoReset) => {
    const mensaje = tipoReset === 'todos' 
      ? '⚠️ ¿Estás COMPLETAMENTE SEGURO de RESETEAR TODOS LOS PUNTOS de los 3 trimestres de este grupo? Esta acción NO se puede deshacer.'
      : `¿Quieres poner en 0 los puntos del Trimestre ${tipoReset}?`;

    if (!confirm(mensaje)) return;

    try {
      const updates = alumnos.map(alumno => {
        let updateData = {};
        if (tipoReset === 'todos') {
          updateData = {
            puntosT1: 0,
            puntosT2: 0,
            puntosT3: 0,
            puntosClase: 0 // También limpiamos el histórico viejo por si acaso
          };
        } else {
          // Solo resetea el trimestre seleccionado
          updateData = {
            [`puntos${tipoReset}`]: 0
          };
        }
        return updateDoc(doc(db, 'alumnos', alumno.id), updateData);
      });

      await Promise.all(updates);
      cargarAlumnos();
      alert('¡Puntos reseteados exitosamente!');
      setMostrarOpcionesReset(false); // Cierra el submenú
    } catch (error) {
      console.error('Error reseteando puntos:', error);
      alert('Error al resetear puntos');
    }
  };

  const iniciarNuevaClase = async () => {
    if (!confirm(`¿Iniciar nueva clase? Se resetean los puntos de ${trimestreActivo}. Los cristales se conservan.`)) return;
    try {
      const updates = alumnos.map(alumno =>
        updateDoc(doc(db, 'alumnos', alumno.id), {
          [`puntos${trimestreActivo}`]: 0,
        })
      );
      await Promise.all(updates);
      cargarAlumnos();
      alert('¡Nueva clase iniciada! Los cristales se conservan.');
    } catch (error) {
      console.error('Error iniciando clase:', error);
    }
  };

  // Agregar puntos y asistencias (Actualizado para Trimestres y Calendario)
  const agregarPuntos = async (alumnoId, cantidad, tipo) => {
    try {
      const alumno = alumnos.find(a => a.id === alumnoId);
      const avatar = TODOS_LOS_AVATARES.find(a => a.id === alumno.avatarId);
      
      // Obtener puntos del trimestre activo
      const puntosActuales = getPuntosActuales(alumno);
      const nuevosPuntos = Math.max(0, puntosActuales + cantidad);
      
      const nivelAnterior = calcularNivel(puntosActuales);
      const nivelNuevo = calcularNivel(nuevosPuntos);
      
      // Preparar los datos a actualizar en Firebase
      let updateData = {
        [`puntos${trimestreActivo}`]: nuevosPuntos, // Guarda en T1, T2 o T3 dinámicamente
        [`cristales${trimestreActivo}`]: Math.max(0, getCristalesActuales(alumno) + Math.floor(cantidad / 10)),
        cristalesTotales: Math.max(0, getCristalesTotales(alumno) + Math.floor(cantidad / 10)),
        cristalesPrestigio: Math.max(0, getCristalesTotales(alumno) + Math.floor(cantidad / 10)),
        ultimaActualizacion: new Date().toISOString()
      };

      // Si es una asistencia, guardar la fecha en el array de asistencias
      if (tipo === 'asistencia') {
        const asistenciasActuales = alumno.asistencias || [];
        // Solo la agregamos si esa fecha no existe ya para ese alumno
        if (!asistenciasActuales.includes(fechaSeleccionada)) {
          updateData.asistencias = [...asistenciasActuales, fechaSeleccionada];
        }
      }
      
      // Ejecutar la actualización
      let urlVideo = null;
        if (avatar?.carpetaEvo) {
          urlVideo = await getVideoEvoUrl(avatar.id, nivelNuevo.nivel);
        }
      await updateDoc(doc(db, 'alumnos', alumnoId), updateData);

      // Si subió de nivel, mostrar animación épica
      if (nivelNuevo.nivel > nivelAnterior.nivel) {
        const grupoVoz = avatar?.mitologia || avatar?.epoca || "Fantasía";
        const gritosDelGrupo = GRITOS_GUERRA[grupoVoz] || GRITOS_GUERRA["Fantasía"];
        const gritoAleatorio = gritosDelGrupo[Math.floor(Math.random() * gritosDelGrupo.length)];
        const mensajeMotivacion = (MENSAJES_MOTIVACION[nivelNuevo.nivel] || MENSAJES_MOTIVACION[1])[
          Math.floor(Math.random() * 3)
        ];

        reproducirSonido('evolucion');

        // Voz completa: nombre alumno + personaje + nivel + motivación + grito
        const mensajeVoz = nivelNuevo.nivel === 1
          ? `${alumno.nombre} ha eclosionado. ${avatar?.nombre}. ¡Bienvenido!`
          : `${alumno.nombre} ha evolucionado. ${avatar?.nombre}. Nivel ${nivelNuevo.nombre}. ${mensajeMotivacion} ${gritoAleatorio}`;
        reproducirVoz(mensajeVoz, 'evolucion');
        setVideoEvolucionUrl(urlVideo);

        setEvolucionActual({
          alumno: alumno,
          avatar: avatar,
          nivelNuevo: nivelNuevo,
          motivacion: mensajeMotivacion,
          grito: gritoAleatorio
        });
        
        const duracionModal = nivelNuevo.nivel === 1 ? 3500 : 15000;
setTimeout(() => {
  const video = document.querySelector('.video-evolucion');
  if (video) { video.pause(); video.src = ''; }
  setEvolucionActual(null);
  setVideoEvolucionUrl(null);
}, duracionModal);
      }
      // Si perdió puntos o está en 0, mostrar alerta
      else if (nuevosPuntos === 0 || cantidad < 0) {
        const gravedad = cantidad < -10 ? 'critico' : cantidad < 0 ? 'moderado' : 'leve';
        
        reproducirSonido('moribundo');
        
        // Voz de auxilio
        const mensajeAuxilio = gravedad === 'critico' 
          ? `¡Auxilio ${alumno.nombre}! Tu ${avatar?.nombre} está en peligro crítico.`
          : `${alumno.nombre}, tu ${avatar?.nombre} necesita ayuda.`;
        reproducirVoz(mensajeAuxilio);
        
        setAlertaMoribundo({
          alumno: alumno,
          avatar: avatar,
          mensaje: MENSAJES_AYUDA[gravedad](alumno.nombre)
        });
        setTimeout(() => setAlertaMoribundo(null), 3000);
      }

      cargarAlumnos();
    } catch (error) {
      console.error('Error agregando puntos:', error);
    }
  };

  // Exportar a Excel (POTENCIADO CON TRIMESTRES Y ASISTENCIAS)
  const exportarAExcel = () => {
    if (alumnosOrdenados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear encabezados detallados
    const todasLasFechas = [...new Set(
  alumnosOrdenados.flatMap(a => a.asistencias || [])
)].sort();

const headers = [
  'Nombre',
  'Avatar',
  'Puntos T1',
  'Puntos T2',
  'Puntos T3',
  'Cristales T1', 'Cristales T2', 'Cristales T3', 'Cristales Total',
  'Total Asistencias',
  ...todasLasFechas,
  'Nivel Actual (T. Activo)',
  'Escuela',
  'Grupo'
];
    
    // Mapear los datos de cada alumno
    const rows = alumnosOrdenados.map(alumno => {
      const avatar = TODOS_LOS_AVATARES.find(a => a.id === alumno.avatarId);
      const nivel = calcularNivel(getPuntosActuales(alumno));
      
      return [
        alumno.nombre,
        avatar?.nombre || 'Sin avatar',
        alumno.puntosT1 || alumno.puntosClase || 0, // Fallback por datos viejos
        alumno.puntosT2 || 0,
        alumno.puntosT3 || 0,
        alumno.cristalesT1 || 0,
        alumno.cristalesT2 || alumno.cristalesPrestigio || 0,
        alumno.cristalesT3 || 0,
        getCristalesTotales(alumno),
        (alumno.asistencias || []).length,
...todasLasFechas.map(fecha => 
  (alumno.asistencias || []).includes(fecha) ? '✓' : ''
), // Cuenta la cantidad de fechas guardadas
        nivel.nombre,
        alumno.escuelaNombre,
        alumno.grupo
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Descargar archivo CSV para abrir en Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_${escuelaSeleccionada?.nombre}_${grupoSeleccionado}_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calcular estadísticas del grupo
  const calcularEstadisticas = () => {
    if (alumnos.length === 0) return null;

    const puntosActuales = alumnos.map(a => getPuntosActuales(a));
    const cristales = alumnos.map(a => a.cristalesPrestigio || 0);

    return {
      totalAlumnos: alumnos.length,
      promedioPuntos: (puntosActuales.reduce((a, b) => a + b, 0) / alumnos.length).toFixed(1),
      promedioCristales: (cristales.reduce((a, b) => a + b, 0) / alumnos.length).toFixed(1),
      mayorPuntaje: Math.max(...puntosActuales),
      menorPuntaje: Math.min(...puntosActuales),
      alumnoDestacado: alumnos.find(a => getPuntosActuales(a) === Math.max(...puntosActuales)),
      alumnosRiesgo: alumnos.filter(a => getPuntosActuales(a) === 0).length,
      distribucionNiveles: NIVELES.map(nivel => ({
        nivel: nivel.nombre,
        cantidad: alumnos.filter(a => calcularNivel(getPuntosActuales(a)).nivel === nivel.nivel).length
      }))
    };
  };

  // VISTA: MENÚ PRINCIPAL
  if (vista === 'menu') {
    return (
      <div className="menu-principal">
        <div className="logo-container">
          <h1 className="titulo-principal">
            <span className="logo-icon">✨</span> EvoQuest
            <span className="didactico"> Didáctico</span>
          </h1>
          <p className="subtitulo">Forjando Leyendas</p>
        </div>

        {/* Mostrar grupo seleccionado si existe */}
        {escuelaSeleccionada && grupoSeleccionado && (
          <div className="grupo-actual">
            <p className="texto-grupo-actual">
              📌 Grupo actual: <strong>{escuelaSeleccionada.nombre} - {grupoSeleccionado}</strong>
            </p>
            <button 
              className="boton-cambiar-grupo"
              onClick={() => {
                setEscuelaSeleccionada(null);
                setGrupoSeleccionado(null);
                setVista('profesor');
              }}
            >
              Cambiar Grupo
            </button>
          </div>
        )}
        
        <div className="botones-menu">
          <button 
            className="boton-menu boton-profesor"
            onClick={() => setVista('profesor')}
          >
            👨‍🏫 Panel del Profesor
          </button>
          
          <button 
            className="boton-menu boton-proyeccion"
            onClick={() => setVista('proyeccion')}
          >
            📺 Pantalla de Proyección
          </button>
        </div>
        
        <div className="info-footer">
          <p>Selecciona el modo de uso</p>
          {!escuelaSeleccionada && (
            <p className="aviso-small">⚠️ Primero configura tu grupo en el Panel del Profesor</p>
          )}
        </div>
      </div>
    );
  }

  // VISTA: PANEL DEL PROFESOR
  if (vista === 'profesor') {
    return (
      <div className="panel-profesor">
        <header className="header-profesor">
          <button className="boton-volver" onClick={() => setVista('menu')}>
            ← Volver al Menú
          </button>
          <h2>Panel del Profesor</h2>
          <button 
            className="boton-lista-avatares" 
            onClick={() => setMostrarAdminEscuelas(!mostrarAdminEscuelas)} 
            style={{ marginLeft: 'auto' }}>
            {mostrarAdminEscuelas ? '❌ Cerrar' : '🏫 Administrar Escuelas'}
          </button>
        </header>

        {/* PANEL ADMIN ESCUELAS */}
        {mostrarAdminEscuelas && (
          <div style={{
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '1.5rem', margin: '1rem 0'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h3 style={{ color:'white', margin:0 }}>🏫 Administrar Escuelas y Grupos</h3>
              <button
                onClick={() => {
                  const nombre = prompt('Nombre de la nueva escuela:');
                  if (nombre) agregarEscuela(nombre);
                }}
                style={{ padding:'0.5rem 1rem', background:'#4CAF50', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' }}
              >
                ➕ Nueva Escuela
              </button>
            </div>
            {escuelas.map(escuela => (
              <div key={escuela.id} style={{
                background:'rgba(255,255,255,0.05)', borderRadius:'10px',
                padding:'1rem', marginBottom:'0.8rem',
                border:'1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
                  <span style={{ color:'white', fontWeight:'600', fontSize:'1rem' }}>{escuela.nombre}</span>
                  <div style={{ display:'flex', gap:'0.4rem' }}>
                    <button onClick={() => renombrarEscuela(escuela.id, escuela.nombre)}
                      style={{ padding:'0.3rem 0.7rem', background:'#2196F3', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem' }}>
                      ✏️ Renombrar
                    </button>
                    <button onClick={() => agregarGrupo(escuela.id, escuela.grupos || [])}
                      style={{ padding:'0.3rem 0.7rem', background:'#4CAF50', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem' }}>
                      ➕ Grupo
                    </button>
                    <button onClick={() => eliminarEscuela(escuela.id, escuela.nombre)}
                      style={{ padding:'0.3rem 0.7rem', background:'#f44336', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem' }}>
                      🗑️
                    </button>
                  </div>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {(escuela.grupos || []).map(grupo => (
                    <div key={grupo} style={{
                      display:'flex', alignItems:'center', gap:'0.3rem',
                      background:'rgba(255,255,255,0.1)', borderRadius:'20px',
                      padding:'0.2rem 0.6rem'
                    }}>
                      <span style={{ color:'white', fontSize:'0.85rem' }}>{grupo}</span>
                      <button onClick={() => renombrarGrupo(escuela.id, escuela.grupos, grupo)}
                        style={{ background:'none', border:'none', color:'#90CAF9', cursor:'pointer', fontSize:'0.75rem', padding:'0' }}>
                        ✏️
                      </button>
                      <button onClick={() => eliminarGrupo(escuela.id, escuela.grupos, grupo)}
                        style={{ background:'none', border:'none', color:'#EF9A9A', cursor:'pointer', fontSize:'0.75rem', padding:'0' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selector de Escuela */}
        {!escuelaSeleccionada && (
          <div className="selector-container">
            <h3>Selecciona una Escuela:</h3>
            <div className="grid-escuelas">
              {escuelas.map(escuela => (
                <button
                  key={escuela.id}
                  className="card-escuela"
                  onClick={() => setEscuelaSeleccionada(escuela)}
                >
                  <div className="escuela-nombre">{escuela.nombre}</div>
                  <div className="escuela-grupos">{(escuela.grupos || []).length} grupos</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector de Grupo */}
        {escuelaSeleccionada && !grupoSeleccionado && (
          <div className="selector-container">
            <button 
              className="boton-volver-small"
              onClick={() => setEscuelaSeleccionada(null)}
            >
              ← Cambiar Escuela
            </button>
            <h3>{escuelaSeleccionada.nombre} - Selecciona un Grupo:</h3>
            <div className="grid-grupos">
              {(escuelaSeleccionada.grupos || []).map(grupo => (
                <button
                  key={grupo}
                  className="card-grupo"
                  onClick={() => setGrupoSeleccionado(grupo)}
                >
                  Grupo {grupo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Panel de Control de Alumnos */}
        {escuelaSeleccionada && grupoSeleccionado && (
          <div className="control-alumnos">
            
            <div className="selector-coleccion">
              <button
                className={`boton-coleccion ${coleccionActiva === 'miticos' ? 'activo' : ''}`}
                onClick={() => setColeccionActiva('miticos')}
              >
                🌟 Seres Míticos
              </button>
              <button
                className={`boton-coleccion ${coleccionActiva === 'historicos_mx' ? 'activo' : ''}`}
                onClick={() => setColeccionActiva('historicos_mx')}
              >
                🇲🇽 Personajes Históricos MX
              </button>
            </div>
            
            <div className="header-control">
              <div>
                <button 
                  className="boton-volver-small"
                  onClick={() => {
                    setGrupoSeleccionado(null);
                    setMostrarFormulario(false);
                  }}
                >
                  ← Cambiar Grupo
                </button>
                <h3>{escuelaSeleccionada.nombre} - Grupo {grupoSeleccionado}</h3>
                <p className="contador-alumnos">Total: {alumnosOrdenados.length} alumnos</p>
              </div>
              <div className="botones-header">
                <button className="boton-uploader" onClick={() => setMostrarUploader(!mostrarUploader)}>
                  {mostrarUploader ? '❌ Cerrar' : '📤 Subir Imágenes Avatares'}
                </button>
                <button className="boton-exportar" onClick={exportarAExcel}>
                  📥 Exportar a Excel
                </button>
                <button className="boton-lista-avatares" onClick={() => setMostrarListaAvatares(!mostrarListaAvatares)}>
                  {mostrarListaAvatares ? '❌ Cerrar Lista' : '👾 Ver Avatares Disponibles'}
                </button>
                <button className="boton-aleatorio" onClick={asignarAvataresAleatoriosSinRepetir}>
                  🎲 Asignar Aleatorios Sin Repetir
                </button>
                <button className="boton-agregar" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                  {mostrarFormulario ? '❌ Cerrar' : '➕ Agregar Alumnos'}
                </button>
                
                <button className="boton-resetear" onClick={iniciarNuevaClase}>
                  🔄 Iniciar Nueva Clase
                </button>
                
                {/* BOTÓN Y MENÚ DE RESETEO */}
                <div style={{ position: 'relative' }}>
                  <button 
                    className="boton-resetear" 
                    onClick={() => setMostrarOpcionesReset(!mostrarOpcionesReset)}
                  >
                    🔄 Gestionar Puntos
                  </button>
                  
                  {mostrarOpcionesReset && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '1rem',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      zIndex: 100,
                      border: '1px solid rgba(255,255,255,0.2)',
                      width: '200px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                      <button 
                        onClick={() => resetearPuntos('T1')} 
                        style={{ padding: '0.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: '0.3s' }}
                      >
                        Resetear Trimestre 1
                      </button>
                      <button 
                        onClick={() => resetearPuntos('T2')} 
                        style={{ padding: '0.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: '0.3s' }}
                      >
                        Resetear Trimestre 2
                      </button>
                      <button 
                        onClick={() => resetearPuntos('T3')} 
                        style={{ padding: '0.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: '0.3s' }}
                      >
                        Resetear Trimestre 3
                      </button>
                      <button 
                        onClick={() => resetearPuntos('todos')} 
                        style={{ padding: '0.5rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '0.5rem', fontWeight: 'bold' }}
                      >
                        Resetear TODOS
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTROLES DE TIEMPO (TABS Y FECHA) */}
            <div className="controles-tiempo">
              <div className="tabs-trimestres">
                <button 
                  className={`tab-trimestre ${trimestreActivo === 'T1' ? 'activo' : ''}`} 
                  onClick={() => setTrimestreActivo('T1')}
                >
                  Trimestre 1
                </button>
                <button 
                  className={`tab-trimestre ${trimestreActivo === 'T2' ? 'activo' : ''}`} 
                  onClick={() => setTrimestreActivo('T2')}
                >
                  Trimestre 2
                </button>
                <button 
                  className={`tab-trimestre ${trimestreActivo === 'T3' ? 'activo' : ''}`} 
                  onClick={() => setTrimestreActivo('T3')}
                >
                  Trimestre 3
                </button>
              </div>

              <div className="selector-fecha">
                <label>📅 Fecha de Asistencia/Eclosión:</label>
                <input 
                  type="date" 
                  className="input-fecha"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                />
              </div>
            </div>

            {/* UPLOADER DE IMÁGENES */}
            {mostrarUploader && (
              <div className="panel-uploader">
                <h3>📤 Subir Imágenes de Avatares</h3>
                <div className="instrucciones-upload">
                  <p>✅ Formatos aceptados: JPG, JPEG, PNG</p>
                  <p>✅ Los nombres de archivo deben coincidir con los nombres de avatares</p>
                  <p>✅ Ejemplo: "zeus.jpg", "poseidon.jpg", "quetzalcoatl.jpg"</p>
                  <p>⚠️ Puedes seleccionar múltiples archivos a la vez</p>
                </div>

                <div className="zona-upload">
                  <label className="boton-seleccionar-archivos">
                    📁 Seleccionar Imágenes
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => subirImagenes(e.target.files)}
                      disabled={subiendoImagenes}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {subiendoImagenes && (
                    <div className="progreso-subida">
                      <p>Subiendo imágenes... {progreso.actual} / {progreso.total}</p>
                      <div className="barra-progreso">
                        <div 
                          className="barra-progreso-fill"
                          style={{ width: `${(progreso.actual / progreso.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="referencia-nombres">
                  <h4>📋 Referencia de Nombres de Avatares:</h4>
                  <div className="lista-nombres-scroll">
                    {getColeccionAvatares().map(avatar => (
                      <div key={avatar.id} className="item-referencia">
                        <span className="nombre-archivo">{avatar.nombre.toLowerCase().replace(/\s+/g, '-')}.jpg</span>
                        <span className="nombre-avatar">{avatar.icono} {avatar.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Avatares Disponibles */}
            {mostrarListaAvatares && (
              <div className="panel-avatares">
                <div className="header-avatares">
                  <h3>👾 Avatares Disponibles ({getAvataresDisponibles().length} total)</h3>
                  <button className="boton-copiar-lista" onClick={copiarListaAvatares}>
                    📋 Copiar Lista Completa
                  </button>
                </div>
                <div className="grid-avatares-referencia">
                  {getAvataresDisponibles().map(avatar => (
                    <div key={avatar.id} className={`card-avatar-ref ${avatar.enUso > 0 ? 'en-uso' : ''}`}>
                      <div className="avatar-icono-grande">{avatar.icono}</div>
                      <div className="avatar-nombre">{avatar.nombre}</div>
                      <div className="avatar-mitologia">{avatar.mitologia || avatar.epoca} </div>
                      {avatar.enUso > 0 && (
                        <div className="badge-en-uso">✓ {avatar.enUso} en uso</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario para agregar alumnos */}
            {mostrarFormulario && (
              <div className="formulario-agregar">
                <div className="metodo-agregar">
                  <div className="metodo-individual">
                    <h4>📝 Agregar Individual</h4>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Nombre del alumno"
                        value={nuevoAlumno}
                        onChange={(e) => setNuevoAlumno(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && agregarAlumnoIndividual()}
                      />
                      <button onClick={agregarAlumnoIndividual}>Agregar</button>
                    </div>
                  </div>

                  <div className="separador-o">O</div>

                  <div className="metodo-masivo">
                    <h4>📋 Copiar y Pegar Múltiples</h4>
                    <p className="instrucciones">
                      Pega varios nombres (uno por línea) y agrégalos todos juntos
                    </p>
                    <textarea
                      placeholder="Juan Pérez&#10;María García&#10;Carlos López&#10;Ana Martínez&#10;..."
                      value={textoMasivo}
                      onChange={(e) => setTextoMasivo(e.target.value)}
                      rows="5"
                    />
                    <button 
                      className="boton-agregar-masivo"
                      onClick={agregarAlumnosMasivos}
                      disabled={cargandoMasivo}
                    >
                      {cargandoMasivo ? '⏳ Agregando...' : '➕ Agregar Todos'}
                    </button>
                  </div>

                  <div className="separador-o">O</div>

                  <div className="metodo-archivo">
                    <h4>📄 Importar desde Archivo</h4>
                    <p className="instrucciones">
                      Sube un archivo .txt o .csv con un nombre por línea
                    </p>
                    <label className="boton-archivo">
                      {cargandoArchivo ? '⏳ Procesando...' : '📁 Seleccionar Archivo'}
                      <input
                        type="file"
                        accept=".txt,.csv"
                        onChange={procesarArchivo}
                        disabled={cargandoArchivo}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {alumnosOrdenados.length === 0 ? (
              <div className="mensaje-vacio">
                <p>No hay alumnos registrados en este grupo.</p>
                <p className="texto-pequeño">Usa el botón "➕ Agregar Alumnos" para comenzar</p>
              </div>
            ) : (
              <>
                {/* Modal de edición de avatar */}
                {alumnoEditando && (
                  <div className="modal-overlay" onClick={() => setAlumnoEditando(null)}>
                    <div className="modal-avatar" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h3>Cambiar Avatar de {alumnoEditando.nombre}</h3>
                        <button className="boton-cerrar-modal" onClick={() => setAlumnoEditando(null)}>
                          ✕
                        </button>
                      </div>
                      <div className="grid-avatares-seleccion">
                        {getAvataresDisponibles().map(avatar => (
                          <button
                            key={avatar.id}
                            className={`card-avatar-seleccion ${
                              avatar.id === alumnoEditando.avatarId ? 'seleccionado' : ''
                            } ${avatar.enUso > 0 && avatar.id !== alumnoEditando.avatarId ? 'en-uso' : ''}`}
                            onClick={() => cambiarAvatar(alumnoEditando.id, avatar.id)}
                          >
                            <div className="avatar-icono">{avatar.icono}</div>
                            <div className="avatar-info">
                              <div className="avatar-nombre-sel">{avatar.nombre}</div>
                              <div className="avatar-mitologia-sel">{avatar.mitologia}</div>
                              {avatar.enUso > 0 && avatar.id !== alumnoEditando.avatarId && (
                                <div className="badge-usado">En uso ({avatar.enUso})</div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="lista-alumnos">
                  {alumnosOrdenados.map(alumno => {
                    // Calculamos los puntos en base al trimestre activo
                    const puntosActuales = getPuntosActuales(alumno);
                    const nivel = calcularNivel(puntosActuales);
                    const avatar = TODOS_LOS_AVATARES.find(a => a.id === alumno.avatarId);
                    
                    return (
                      <div key={alumno.id} className="card-alumno">
                        <div className="alumno-info">
                          <div 
                            className="alumno-avatar clickable"
                            onClick={() => setAlumnoEditando(alumno)}
                            title="Clic para cambiar avatar"
                          >
                            <AvatarDisplay avatarId={alumno.avatarId} />
                            <div className="hover-editar">✏️</div>
                          </div>
                          <div className="alumno-datos">
                            <h4>{alumno.nombre}</h4>
                            <p className="alumno-avatar-nombre">{avatar?.nombre || "Sin avatar"}</p>
                            <div className="nivel-badge">
                              {nivel.emoji} {nivel.nombre} - {puntosActuales} pts ({trimestreActivo})
                            </div>
                            <div className="cristales">
                              💎 {getCristalesActuales(alumno)} Cristales ({trimestreActivo}) | 👑 Total: {getCristalesTotales(alumno)} | 📅 {(alumno.asistencias || []).length} Asistencias
                            </div>
                          </div>
                        </div>
                        
                        <div className="botones-puntos">
                          <button 
                            className="boton-punto asistencia"
                            onClick={() => agregarPuntos(alumno.id, 10, 'asistencia')}
                          >
                            ✅ Asist +10
                          </button>
                          <button 
                            className="boton-punto participacion"
                            onClick={() => agregarPuntos(alumno.id, 15, 'participacion')}
                          >
                            🙋 Part +15
                          </button>
                          <button 
                            className="boton-punto trabajo"
                            onClick={() => agregarPuntos(alumno.id, 20, 'trabajo')}
                          >
                            📝 Trab +20
                          </button>
                          <button 
                            className="boton-punto tarea"
                            onClick={() => agregarPuntos(alumno.id, 25, 'tarea')}
                          >
                            📚 Tarea +25
                          </button>
                          <button 
                            className="boton-punto disciplina"
                            onClick={() => agregarPuntos(alumno.id, 5, 'disciplina')}
                          >
                            ⭐ Discip +5
                          </button>
                          <button 
                            className="boton-punto negativo"
                            onClick={() => agregarPuntos(alumno.id, -10, 'indisciplina')}
                          >
                            ⚠️ Indisc -10
                          </button>
                          <button 
                            className="boton-eliminar"
                            onClick={() => eliminarAlumno(alumno.id, alumno.nombre)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // VISTA: PANTALLA DE PROYECCIÓN
  if (vista === 'proyeccion') {
    // Si no hay escuela o grupo seleccionado, mostrar mensaje
    if (!escuelaSeleccionada || !grupoSeleccionado) {
      return (
        <div className="pantalla-proyeccion">
          <button 
            className="boton-volver-proyeccion"
            onClick={() => setVista('menu')}
          >
            ← Salir
          </button>

          <div className="mensaje-seleccionar">
            <h3>⚠️ Primero debes seleccionar una escuela y grupo</h3>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
              Ve al Panel del Profesor para configurar tu grupo
            </p>
            <button 
              className="boton-ir-profesor"
              onClick={() => setVista('profesor')}
            >
              👨‍🏫 Ir al Panel del Profesor
            </button>
          </div>
        </div>
      );
    }

    // Si hay escuela y grupo seleccionado, mostrar pantalla normal
    return (
      <div className="pantalla-proyeccion">
        <button 
          className="boton-volver-proyeccion"
          onClick={() => setVista('menu')}
        >
          ← Salir
        </button>

        {/* Botón de control flotante */}
        {escuelaSeleccionada && grupoSeleccionado && alumnosOrdenados.length > 0 && (
          <>
            <button 
              className="boton-control-flotante"
              onClick={() => setModoControlProyeccion(!modoControlProyeccion)}
            >
              {modoControlProyeccion ? '👁️ Ver Avatares' : '🎮 Controles'}
            </button>
            <button 
              className="boton-modo-interactivo"
              onClick={() => setModoInteractivo(!modoInteractivo)}
            >
              {modoInteractivo ? '📊 Vista Normal' : '🌍 Mundo 2D'}
            </button>
            {modoInteractivo && (
              <button 
                className="boton-musica"
                onClick={toggleMusica}
              >
                {musicaActiva ? '🔇 Silenciar' : '🎵 Música'}
              </button>
            )}
          </>
        )}

        {escuelaSeleccionada && grupoSeleccionado ? (
          <>
            <h2 className="titulo-proyeccion">
              {escuelaSeleccionada.nombre} - Grupo {grupoSeleccionado} ({trimestreActivo})
            </h2>
            <div style={{
  display: 'flex', justifyContent: 'center', gap: '2rem',
  marginBottom: '1rem', flexWrap: 'wrap'
}}>
  {[...alumnosOrdenados]
    .sort((a, b) => getCristalesTotales(b) - getCristalesTotales(a))
    .slice(0, 3)
    .map((alumno, i) => (
      <div key={alumno.id} style={{
        background: ['rgba(255,215,0,0.2)', 'rgba(192,192,192,0.2)', 'rgba(205,127,50,0.2)'][i],
        border: `1px solid ${['#D4AF37','#C0C0C0','#CD7F32'][i]}`,
        borderRadius: '12px', padding: '0.5rem 1.2rem',
        fontSize: '1rem', fontWeight: '600', color: 'white',
        textAlign: 'center'
      }}>
        {['🥇','🥈','🥉'][i]} {alumno.nombre.split(' ')[0]}
        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          👑 {getCristalesTotales(alumno)} cristales
        </div>
      </div>
    ))
  }
</div>

            {/* Animación de EVOLUCIÓN ÉPICA */}
            {evolucionActual && (
              <div className="modal-evolucion">
                <div className="evolucion-epica">
                  <div className="particulas-fondo"></div>
                  
                  {/* Información del alumno y avatar */}
                  <div className="info-evolucion">
                    <div className="alumno-evoluciona">{evolucionActual.alumno.nombre}</div>
                    <div className="avatar-name-evolucion">{evolucionActual.avatar?.nombre}</div>
                  </div>

                  <div className={`avatar-evolucionando ${!videoEvolucionUrl ? 'animacion-evolucion-real' : ''}`}>
                    {videoEvolucionUrl ? (
                      <div style={{
  width: '20rem',
  height: '20rem',
  borderRadius: '50%',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 0 60px rgba(255,255,255,0.15)',
}}>
  <video
  key={videoEvolucionUrl}
  className="video-evolucion"
  playsInline
  preload="auto"
  onCanPlay={(e) => e.target.play()}
  onEnded={() => {
  setTimeout(() => {
    setEvolucionActual(null);
    setVideoEvolucionUrl(null);
  }, 1500);
}}
  onError={() => {
    setEvolucionActual(null);
    setVideoEvolucionUrl(null);
  }}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  >
                          <source src={videoEvolucionUrl} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <AvatarDisplay 
                        avatarId={evolucionActual.avatar?.id} 
                        style={{ width: '15rem', height: '15rem', fontSize: '15rem' }}
                      />
                    )}
                  </div>
                  <div className="nivel-alcanzado">
                    {evolucionActual.nivelNuevo.emoji} {evolucionActual.nivelNuevo.nombre}
                  </div>
                  <div className="mensaje-motivacion">{evolucionActual.motivacion}</div>
                  <div className="mensaje-nivel">{evolucionActual.nivelNuevo.mensaje}</div>
                  <div className="grito-guerra">{evolucionActual.grito}</div>
                  <div className="rayo-poder"></div>
                </div>
              </div>
            )}

            {/* Alerta de MORIBUNDO */}
            {alertaMoribundo && (
              <div className="alerta-moribundo">
                <div className="contenido-moribundo">
                  <div className="info-moribundo-top">
                    <div className="nombre-moribundo">{alertaMoribundo.alumno.nombre}</div>
                    <div className="avatar-name-moribundo">{alertaMoribundo.avatar?.nombre}</div>
                  </div>
                  <div className="avatar-moribundo tembloroso animacion-moribundo-real">
                    <AvatarDisplay 
                      avatarId={alertaMoribundo.avatar?.id} 
                      style={{ width: '12rem', height: '12rem', fontSize: '12rem' }}
                    />
                  </div>
                  <div className="mensaje-auxilio">{alertaMoribundo.mensaje}</div>
                </div>
              </div>
            )}

            {/* Panel de control en proyección */}
            {alumnoSeleccionadoProyeccion && (
              <div className="panel-control-proyeccion" onClick={() => setAlumnoSeleccionadoProyeccion(null)}>
                <div className="contenido-panel-control" onClick={(e) => e.stopPropagation()}>
                  <h3>{alumnoSeleccionadoProyeccion.nombre}</h3>
                  <div className="botones-control-rapido">
                    <button onClick={() => {
                      agregarPuntos(alumnoSeleccionadoProyeccion.id, 10, 'asistencia');
                      setAlumnoSeleccionadoProyeccion(null);
                    }}>✅ +10</button>
                    <button onClick={() => {
                      agregarPuntos(alumnoSeleccionadoProyeccion.id, 15, 'participacion');
                      setAlumnoSeleccionadoProyeccion(null);
                    }}>🙋 +15</button>
                    <button onClick={() => {
                      agregarPuntos(alumnoSeleccionadoProyeccion.id, 20, 'trabajo');
                      setAlumnoSeleccionadoProyeccion(null);
                    }}>📝 +20</button>
                    <button onClick={() => {
                      agregarPuntos(alumnoSeleccionadoProyeccion.id, 25, 'tarea');
                      setAlumnoSeleccionadoProyeccion(null);
                    }}>📚 +25</button>
                    <button onClick={() => {
                      agregarPuntos(alumnoSeleccionadoProyeccion.id, -10, 'indisciplina');
                      setAlumnoSeleccionadoProyeccion(null);
                    }} className="negativo">⚠️ -10</button>
                  </div>
                  <button onClick={() => setAlumnoSeleccionadoProyeccion(null)} className="cerrar">Cerrar</button>
                </div>
              </div>
            )}

            {alumnosOrdenados.length === 0 ? (
              <div className="mensaje-vacio">
                <p>No hay alumnos en este grupo</p>
                <p className="texto-pequeño">Configura el grupo desde el Panel del Profesor</p>
              </div>
            ) : modoInteractivo ? (
              // MUNDO INTERACTIVO 2D
              <MundoInteractivo2D 
                alumnos={alumnosOrdenados}
                calcularNivel={calcularNivel}
                getPuntosActuales={getPuntosActuales}
                imagenesAvatares={imagenesAvatares}
                AAVATARES_DISPONIBLES={TODOS_LOS_AVATARES}
                setAlumnoSeleccionadoProyeccion={setAlumnoSeleccionadoProyeccion}
              />
            ) : modoControlProyeccion ? (
              // MODO CONTROL: Vista compacta con botones
              <div className="grid-control">
                {alumnosOrdenados.map(alumno => {
                  const puntosActuales = getPuntosActuales(alumno);
                  const nivel = calcularNivel(puntosActuales);
                  const avatar = TODOS_LOS_AVATARES.find(a => a.id === alumno.avatarId);
                  const esMoribundo = puntosActuales === 0;
                  
                  return (
                    <div key={alumno.id} className={`card-control ${esMoribundo ? 'moribundo' : ''}`}>
                      <div className="info-control">
                        <div className="avatar-mini">{avatar?.icono}</div>
                        <div className="datos-mini">
                          <div className="nombre-mini">{alumno.nombre}</div>
                          <div className="nivel-mini">{nivel.emoji} {puntosActuales} pts</div>
                        </div>
                      </div>
                      <div className="botones-mini">
                        <button onClick={() => agregarPuntos(alumno.id, 10, 'asistencia')} className="btn-mini">+10</button>
                        <button onClick={() => agregarPuntos(alumno.id, 20, 'trabajo')} className="btn-mini">+20</button>
                        <button onClick={() => agregarPuntos(alumno.id, -10, 'indisciplina')} className="btn-mini neg">-10</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // MODO VISUALIZACIÓN: Vista normal
              <div className="grid-proyeccion">
                {alumnosOrdenados.map(alumno => {
                  const puntosActuales = getPuntosActuales(alumno);
                  const nivel = calcularNivel(puntosActuales);
                  const avatar = TODOS_LOS_AVATARES.find(a => a.id === alumno.avatarId);
                  const esMoribundo = puntosActuales === 0;
                  
                  return (
                    <div 
                      key={alumno.id} 
                      className={`card-proyeccion ${esMoribundo ? 'moribundo' : ''}`}
                      onClick={() => setAlumnoSeleccionadoProyeccion(alumno)}
                    >
                      <div className="avatar-grande">
                        <AvatarDisplay avatarId={alumno.avatarId} />
                      </div>
                      <div className="nombre-alumno">{alumno.nombre}</div>
                      <div className="nivel-proyeccion">
                        {nivel.emoji} {nivel.nombre}
                      </div>
                      <div className="puntos-proyeccion">
                        {puntosActuales} pts
                      </div>
                      {esMoribundo && (
                        <div className="badge-moribundo parpadeante">⚠️ ¡Ayuda!</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="mensaje-seleccionar">
            <h3>Selecciona una escuela y grupo desde el Panel del Profesor primero</h3>
            <button 
              className="boton-ir-profesor"
              onClick={() => setVista('profesor')}
            >
              Ir al Panel del Profesor
            </button>
          </div>
        )}
      </div>
    );
  }
}

// COMPONENTE: MUNDO INTERACTIVO 2D PROFESIONAL
function MundoInteractivo2D({ alumnos, calcularNivel, getPuntosActuales, imagenesAvatares, AAVATARES_DISPONIBLES, setAlumnoSeleccionadoProyeccion }) {
  const [posiciones, setPosiciones] = useState({});
  const [direcciones, setDirecciones] = useState({});
  const [animaciones, setAnimaciones] = useState({});
  const [efectos, setEfectos] = useState([]);
  const [fondoActual, setFondoActual] = useState("Fantasía");

  useEffect(() => {
    // Inicializar posiciones
    const posicionesIniciales = {};
    const direccionesIniciales = {};
    const animacionesIniciales = {};
    
    alumnos.forEach((alumno, index) => {
      const puntos = getPuntosActuales(alumno);
      const nivel = calcularNivel(puntos);
      const avatar = AAVATARES_DISPONIBLES.find(a => a.id === alumno.avatarId);
      const esVolador = puedeVolar(alumno.avatarId);
      
      // Si es huevo, va al nido (derecha)
      if (nivel.sprite === 'huevo') {
        posicionesIniciales[alumno.id] = {
          x: 88, // Posición fija en el nido
          y: 15 + (index * 8), // Apilados verticalmente
          enNido: true
        };
        direccionesIniciales[alumno.id] = { dx: 0, dy: 0 };
      } else {
        // Avatares activos
        const velocidadBase = nivel.nivel >= 5 ? 0.5 : 0.3;
        
        if (esVolador) {
          // Voladores en la parte superior
          posicionesIniciales[alumno.id] = {
            x: Math.random() * 70 + 15,
            y: Math.random() * 30 + 15, // 15%-45% altura
            enNido: false
          };
        } else {
          // Terrestres en el suelo (70%-80% altura)
          posicionesIniciales[alumno.id] = {
            x: Math.random() * 70 + 15,
            y: 75, // Suelo fijo
            enNido: false
          };
        }
        
        direccionesIniciales[alumno.id] = {
          dx: (Math.random() - 0.5) * velocidadBase,
          dy: esVolador ? (Math.random() - 0.5) * velocidadBase * 0.3 : 0, // Terrestres no se mueven en Y
        };
      }
      
      animacionesIniciales[alumno.id] = {
        estado: 'idle',
        frame: 0,
        atacando: false,
        volando: esVolador && nivel.sprite === 'adulto',
      };
    });
    
    setPosiciones(posicionesIniciales);
    setDirecciones(direccionesIniciales);
    setAnimaciones(animacionesIniciales);

    // Determinar fondo por mitología mayoritaria
    const mitologias = alumnos.map(a => AAVATARES_DISPONIBLES.find(av => av.id === a.avatarId)?.mitologia || 'Fantasía');
    const mitologiaMayoritaria = mitologias.sort((a,b) =>
      mitologias.filter(v => v === a).length - mitologias.filter(v => v === b).length
    ).pop();
    setFondoActual(mitologiaMayoritaria);
  }, [alumnos]);

  useEffect(() => {
    // Movimiento continuo con animaciones
    const interval = setInterval(() => {
      setPosiciones(prev => {
        const nuevas = { ...prev };
        
        alumnos.forEach(alumno => {
          if (!nuevas[alumno.id] || nuevas[alumno.id].enNido) return;
          
          const puntos = getPuntosActuales(alumno);
          const nivel = calcularNivel(puntos);
          const esVolador = puedeVolar(alumno.avatarId);
          const velocidadMultiplicador = nivel.nivel >= 5 ? 1.5 : 1;
          
          let { x, y } = nuevas[alumno.id];
          const { dx, dy } = direcciones[alumno.id] || { dx: 0, dy: 0 };
          
          x += dx * velocidadMultiplicador;
          
          if (esVolador) {
            y += dy * velocidadMultiplicador;
          } else {
            // Terrestres se quedan en el suelo
            y = 75;
          }
          
          // Rebotar en los bordes
          if (x <= 10 || x >= 85) {
            setDirecciones(prevDir => ({
              ...prevDir,
              [alumno.id]: { ...prevDir[alumno.id], dx: -prevDir[alumno.id].dx }
            }));
          }
          
          if (esVolador) {
            if (y <= 15 || y >= 50) {
              setDirecciones(prevDir => ({
                ...prevDir,
                [alumno.id]: { ...prevDir[alumno.id], dy: -prevDir[alumno.id].dy }
              }));
            }
          }
          
          nuevas[alumno.id] = {
            x: Math.max(10, Math.min(85, x)),
            y: esVolador ? Math.max(15, Math.min(50, y)) : 75,
            enNido: false
          };

          // Actualizar animación
          setAnimaciones(prevAnim => ({
            ...prevAnim,
            [alumno.id]: {
              ...prevAnim[alumno.id],
              estado: Math.abs(dx) > 0.2 ? 'moviendo' : 'idle',
              frame: (prevAnim[alumno.id]?.frame || 0) + 1
            }
          }));
        });
        
        return nuevas;
      });

      // Limpiar efectos viejos
      setEfectos(prev => prev.filter(e => Date.now() - e.timestamp < 2000));
    }, 50);

    return () => clearInterval(interval);
  }, [alumnos, direcciones]);

  // Crear efecto de impacto al dar puntos
  const crearEfecto = (alumnoId, tipo) => {
    const pos = posiciones[alumnoId];
    if (!pos) return;

    const nuevoEfecto = {
      id: Date.now() + Math.random(),
      x: pos.x,
      y: pos.y,
      tipo: tipo,
      timestamp: Date.now()
    };

    setEfectos(prev => [...prev, nuevoEfecto]);

    setAnimaciones(prev => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], atacando: true }
    }));

    setTimeout(() => {
      setAnimaciones(prev => ({
        ...prev,
        [alumnoId]: { ...prev[alumnoId], atacando: false }
      }));
    }, 500);
  };

  // Obtener sprite según nivel
  const obtenerSprite = (alumno) => {
    const puntos = getPuntosActuales(alumno);
    const nivel = calcularNivel(puntos);
    const avatar = AAVATARES_DISPONIBLES.find(a => a.id === alumno.avatarId);

    if (nivel.sprite === 'huevo') {
      return { tipo: 'huevo', contenido: '🥚' };
    } else if (nivel.sprite === 'bebe') {
      // Versión bebé simplificada - emoji más pequeño
      return { tipo: 'bebe', contenido: avatar?.icono, filtro: 'brightness(1.3) saturate(0.8) blur(0.5px)' };
    } else {
      return { tipo: 'adulto', contenido: imagenesAvatares[alumno.avatarId], avatar: avatar };
    }
  };

  return (
    <div className="mundo-2d-profesional" style={{ background: FONDOS_MITOLOGIA[fondoActual] }}>
      {/* Línea del suelo */}
      <div className="linea-suelo"></div>

      {/* Nido de huevos (derecha) */}
      <div className="nido-huevos">
        <div className="titulo-nido">🪺 Nido de Huevos</div>
        {alumnos.filter(a => calcularNivel(getPuntosActuales(a)).sprite === 'huevo').map(alumno => {
          const pos = posiciones[alumno.id] || { x: 88, y: 20 };
          
          return (
            <div
              key={alumno.id}
              className="huevo-nido"
              style={{
                top: `${pos.y}%`,
              }}
              onClick={() => setAlumnoSeleccionadoProyeccion(alumno)}
            >
              <span className="huevo-emoji">🥚</span>
              <span className="nombre-huevo">{alumno.nombre}</span>
            </div>
          );
        })}
      </div>

      {/* Partículas de fondo */}
      <div className="particulas-ambiente">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particula-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Efectos de impacto */}
      {efectos.map(efecto => (
        <div
          key={efecto.id}
          className={`efecto-impacto ${efecto.tipo}`}
          style={{
            left: `${efecto.x}%`,
            top: `${efecto.y}%`,
          }}
        >
          {efecto.tipo === 'poder' && '⚡'}
          {efecto.tipo === 'ataque' && '💥'}
          {efecto.tipo === 'legendario' && '✨'}
        </div>
      ))}

      {/* Avatares activos (no huevos) */}
      {alumnos.filter(a => calcularNivel(getPuntosActuales(a)).sprite !== 'huevo').map(alumno => {
        const puntos = getPuntosActuales(alumno);
        const nivel = calcularNivel(puntos);
        const pos = posiciones[alumno.id] || { x: 50, y: 50 };
        const anim = animaciones[alumno.id] || { estado: 'idle', atacando: false, volando: false };
        const esMoribundo = puntos === 0;
        const sprite = obtenerSprite(alumno);
        const esLegendario = nivel.nivel >= 5;
        const esVolador = puedeVolar(alumno.avatarId);
        const categoria = getCategoria(alumno.avatarId);

        return (
          <div
            key={alumno.id}
            className={`avatar-mundo-pro ${anim.estado} ${anim.atacando ? 'atacando' : ''} ${esMoribundo ? 'moribundo-mundo' : ''} ${esVolador ? 'volando' : 'terrestre'} categoria-${categoria}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            onClick={() => {
              setAlumnoSeleccionadoProyeccion(alumno);
              crearEfecto(alumno.id, 'poder');
            }}
          >
            {/* Rastro para legendarios */}
            {esLegendario && <div className="rastro-legendario" />}

            {/* Nombre flotante */}
            <div className="nombre-flotante-pro">{alumno.nombre}</div>

            {/* Avatar Sprite */}
            <div className="avatar-sprite-pro">
              {sprite.tipo === 'bebe' && (
                <span style={{ fontSize: '2.5rem', filter: sprite.filtro }}>{sprite.contenido}</span>
              )}
              {sprite.tipo === 'adulto' && sprite.contenido && (
                <img 
                  src={sprite.contenido} 
                  alt={sprite.avatar?.nombre}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    filter: esMoribundo ? 'grayscale(0.8) brightness(0.5)' : 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                  }}
                />
              )}
              {sprite.tipo === 'adulto' && !sprite.contenido && (
                <span style={{ fontSize: '3.5rem' }}>{sprite.avatar?.icono || "👤"}</span>
              )}
            </div>

            {/* Barra de vida mejorada */}
            <div className="barra-vida-pro">
              <div 
                className="barra-vida-fill-pro" 
                style={{ 
                  width: `${Math.min(100, ((puntos || 0) / 200) * 100)}%`,
                  background: esMoribundo ? '#f44336' : esLegendario ? 'linear-gradient(90deg, #FFD700, #FFA500)' : 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                }}
              ></div>
            </div>

            {/* Indicador de nivel */}
            <div className="nivel-mundo-pro">{nivel.emoji}</div>

            {/* Efecto de poder al atacar */}
            {anim.atacando && (
              <div className="poder-visual">
                {sprite.avatar?.mitologia === 'Griega' && '⚡'}
                {sprite.avatar?.mitologia === 'Nórdica' && '🔨'}
                {sprite.avatar?.mitologia === 'Egipcia' && '☀️'}
                {sprite.avatar?.mitologia === 'Azteca' && '🐍'}
                {sprite.avatar?.mitologia === 'Elemental' && '🔥'}
                {(!sprite.avatar || sprite.avatar?.mitologia === 'Fantasía') && '✨'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;