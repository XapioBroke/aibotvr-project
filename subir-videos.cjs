const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyCPn0kMMrx4tRW1XJfrTenqPB08XzAc1x0",
  authDomain: "aibotvr1.firebaseapp.com",
  projectId: "aibotvr1",
  storageBucket: "aibotvr1.firebasestorage.app",
  messagingSenderId: "524453697028",
  appId: "1:524453697028:web:08d175b825238dbf590751"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// RUTA LOCAL DE TUS VIDEOS — ajusta si es diferente
const CARPETA_LOCAL = "C:\\Users\\User\\Videos\\ANIMACIONES EVOQUEST";
// RUTA EN FIREBASE STORAGE
const DESTINO_STORAGE = "evoluciones";

async function subirArchivo(rutaLocal, rutaStorage) {
  const fileBuffer = fs.readFileSync(rutaLocal);
  const storageRef = ref(storage, rutaStorage);
  await uploadBytes(storageRef, fileBuffer, { contentType: 'video/mp4' });
  console.log(`✅ Subido: ${rutaStorage}`);
}

async function subirTodo() {
  console.log('🚀 Iniciando subida de videos...\n');
  
  let total = 0;
  let subidos = 0;
  let errores = 0;

  // Leer carpetas de personajes (EVO_ADELITA, EVO_BENITO JUAREZ, etc.)
  const carpetasPersonaje = fs.readdirSync(CARPETA_LOCAL).filter(nombre => {
    const rutaCompleta = path.join(CARPETA_LOCAL, nombre);
    return fs.statSync(rutaCompleta).isDirectory();
  });

  console.log(`📁 Encontradas ${carpetasPersonaje.length} carpetas de personajes\n`);

  // Contar total de archivos
  for (const carpeta of carpetasPersonaje) {
    const rutaCarpeta = path.join(CARPETA_LOCAL, carpeta);
    const archivos = fs.readdirSync(rutaCarpeta).filter(f => f.endsWith('.mp4'));
    total += archivos.length;
  }
  console.log(`🎬 Total de videos a subir: ${total}\n`);

  // Subir cada carpeta y sus videos
  for (const carpeta of carpetasPersonaje) {
    const rutaCarpetaLocal = path.join(CARPETA_LOCAL, carpeta);
    const archivos = fs.readdirSync(rutaCarpetaLocal).filter(f => f.endsWith('.mp4'));
    
    console.log(`📂 Subiendo ${carpeta} (${archivos.length} videos)...`);
    
    for (const archivo of archivos) {
      const rutaLocal = path.join(rutaCarpetaLocal, archivo);
      const rutaStorage = `${DESTINO_STORAGE}/${carpeta}/${archivo}`;
      
      try {
        await subirArchivo(rutaLocal, rutaStorage);
        subidos++;
        console.log(`   Progreso: ${subidos}/${total}`);
      } catch (error) {
        errores++;
        console.error(`❌ Error subiendo ${archivo}: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('\n=============================');
  console.log(`✅ Subidos exitosamente: ${subidos}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📊 Total procesados: ${subidos + errores}/${total}`);
  console.log('=============================\n');
  
  if (subidos === total) {
    console.log('🎉 ¡Todos los videos subidos exitosamente!');
  } else {
    console.log('⚠️  Algunos videos no se subieron. Revisa los errores arriba.');
  }
  
  process.exit(0);
}

subirTodo().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});