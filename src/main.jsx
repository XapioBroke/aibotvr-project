import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously, signOut } from 'firebase/auth'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'

const firebaseConfig = {
  apiKey: "AIzaSyCPn0kMMrx4tRW1XJfrTenqPB08XzAc1x0",
  authDomain: "aibotvr1.firebaseapp.com",
  projectId: "aibotvr1",
  storageBucket: "aibotvr1.firebasestorage.app",
  messagingSenderId: "524453697028",
  appId: "1:524453697028:web:08d175b825238dbf590751"
}

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db   = getFirestore(firebaseApp)

function getRol(user) {
  if (!user) return null
  if (user.isAnonymous) return localStorage.getItem('iapprende_rol') || 'invitado'
  if (user.email?.endsWith('@jaliscoedu.mx')) return 'docente'
  return 'invitado'
}

// ── Acceso denegado para invitados ────────────────────────────
const AccesoDenegado = () => (
  <div style={{ background:'#0a0010', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', padding:'24px', fontFamily:'system-ui' }}>
    <div style={{ fontSize:'4rem' }}>🚫</div>
    <h1 style={{ color:'#ff453a', fontFamily:'Georgia,serif', fontSize:'clamp(1.3rem,4vw,2rem)', margin:0, textAlign:'center' }}>
      Acceso Restringido
    </h1>
    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.95rem', textAlign:'center', maxWidth:'400px', lineHeight:1.7, margin:0 }}>
      <strong style={{ color:'#fff' }}>EvoQuest Didáctico</strong> requiere una cuenta institucional{' '}
      <strong>@jaliscoedu.mx</strong> o un código de alumno proporcionado por tu docente.
    </p>
    <div style={{ background:'rgba(255,69,58,0.08)', border:'1px solid rgba(255,69,58,0.2)', borderRadius:'14px', padding:'16px 24px', maxWidth:'380px', textAlign:'center' }}>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', margin:0, lineHeight:1.7 }}>
        🎒 ¿Eres alumno? Solicita tu código a tu docente.<br/>
        👩‍🏫 ¿Eres docente? Inicia sesión con tu cuenta <strong>@jaliscoedu.mx</strong>.
      </p>
    </div>
    <button onClick={() => window.location.replace('https://iapprende.com')}
      style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'10px', padding:'12px 32px', fontSize:'0.95rem', fontWeight:'600', cursor:'pointer' }}>
      ← Volver al inicio
    </button>
  </div>
)

// ── Métricas solo lectura para alumno ────────────────────────
const MetricasAlumno = ({ onSalir }) => {
  const [alumnos, setAlumnos]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [periodo, setPeriodo]   = useState('T2')
  const grupo   = localStorage.getItem('iapprende_grupo')   || ''
  const escuela = localStorage.getItem('iapprende_escuela') || ''

  const getPts = (a, p) => {
    if (p==='T1') return a.puntosT1||0
    if (p==='T2') return a.puntosT2??a.puntosClase??0
    if (p==='T3') return a.puntosT3||0
    return (a.puntosT1||0)+(a.puntosT2??a.puntosClase??0)+(a.puntosT3||0)
  }

  const NIVELES = [
    {pts:0,  emoji:'🥚', nombre:'Huevo'},
    {pts:10, emoji:'👶', nombre:'Bebé'},
    {pts:30, emoji:'🦎', nombre:'Joven'},
    {pts:60, emoji:'🐉', nombre:'Guerrero'},
    {pts:100,emoji:'🔥', nombre:'Héroe'},
    {pts:150,emoji:'⚡', nombre:'Legendario'},
    {pts:200,emoji:'👑', nombre:'Mítico'},
  ]
  const getNivel = (pts) => [...NIVELES].reverse().find(n => pts>=n.pts) || NIVELES[0]

  useEffect(() => {
    const cargar = async () => {
      if (!grupo || !escuela) { setCargando(false); return }
      try {
        const q = query(collection(db,'alumnos'), where('escuelaNombre','==',escuela), where('grupo','==',grupo))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id:d.id, ...d.data() }))
        data.sort((a,b) => getPts(b,periodo) - getPts(a,periodo))
        setAlumnos(data)
      } catch(e) { console.error(e) }
      finally { setCargando(false) }
    }
    cargar()
  }, [grupo, escuela, periodo])

  return (
    <div style={{ background:'#0a0010', minHeight:'100vh', color:'#fff', fontFamily:'system-ui', display:'flex', flexDirection:'column' }}>
      <header style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 20px', background:'rgba(0,0,0,0.6)', borderBottom:'1px solid rgba(99,102,241,0.3)' }}>
        <span style={{ color:'#a78bfa', fontWeight:'bold', fontFamily:'Georgia,serif' }}>⚔️ EvoQuest — ALUMNO</span>
        {grupo && <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)' }}>· {escuela} / Gpo {grupo}</span>}
        <div style={{ flex:1 }}/>
        <button onClick={onSalir} style={{ background:'rgba(255,69,58,0.15)', border:'1px solid rgba(255,69,58,0.3)', borderRadius:'8px', color:'#ff453a', fontSize:'0.75rem', padding:'5px 12px', cursor:'pointer' }}>Salir</button>
      </header>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'28px 20px', gap:'20px' }}>
        <div style={{ textAlign:'center' }}>
          <h2 style={{ color:'#a78bfa', fontFamily:'Georgia,serif', fontSize:'1.6rem', margin:'0 0 4px' }}>📊 Métricas del Grupo</h2>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.82rem', margin:0 }}>{escuela} · Grupo {grupo} · 🔒 Solo lectura</p>
        </div>

        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', justifyContent:'center' }}>
          {[{id:'T1',l:'Tri 1'},{id:'T2',l:'Tri 2'},{id:'T3',l:'Tri 3'},{id:'total',l:'Total'}].map(p => (
            <button key={p.id} onClick={() => setPeriodo(p.id)}
              style={{ padding:'5px 14px', borderRadius:'100px', border:`1px solid ${periodo===p.id?'#a78bfa':'rgba(255,255,255,0.2)'}`, background:periodo===p.id?'rgba(167,139,250,0.2)':'transparent', color:periodo===p.id?'#a78bfa':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'0.7rem', fontWeight:'600', transition:'all .2s' }}>
              {p.l}
            </button>
          ))}
        </div>

        {cargando ? <p style={{ color:'rgba(255,255,255,0.4)' }}>Cargando...</p> : !grupo ? (
          <p style={{ color:'rgba(255,255,255,0.3)', textAlign:'center' }}>No se encontró grupo. Verifica con tu docente.</p>
        ) : (
          <div style={{ width:'100%', maxWidth:'540px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.95rem' }}>
              <thead>
                <tr style={{ background:'rgba(167,139,250,0.1)', color:'#a78bfa', textAlign:'left' }}>
                  <th style={{ padding:'10px 12px', borderBottom:'2px solid rgba(167,139,250,0.3)' }}>#</th>
                  <th style={{ padding:'10px 12px', borderBottom:'2px solid rgba(167,139,250,0.3)' }}>Alumno</th>
                  <th style={{ padding:'10px 12px', borderBottom:'2px solid rgba(167,139,250,0.3)' }}>Nivel</th>
                  <th style={{ padding:'10px 12px', borderBottom:'2px solid rgba(167,139,250,0.3)', textAlign:'right' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((a,i) => {
                  const pts = getPts(a, periodo)
                  const niv = getNivel(pts)
                  return (
                    <tr key={a.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding:'9px 12px', color:i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#fff', fontWeight:'bold' }}>#{i+1}</td>
                      <td style={{ padding:'9px 12px' }}>{a.nombre}</td>
                      <td style={{ padding:'9px 12px' }}>{niv.emoji} <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem' }}>{niv.nombre}</span></td>
                      <td style={{ padding:'9px 12px', color:'#a78bfa', fontWeight:'bold', textAlign:'right' }}>{pts}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.7rem', textAlign:'center', marginTop:'10px' }}>🔒 Solo lectura</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Root render ───────────────────────────────────────────────
const root = createRoot(document.getElementById('root'))

root.render(
  <div style={{ background:'#0a0010', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <p style={{ color:'#a78bfa', fontFamily:'Georgia,serif', fontSize:'1.2rem' }}>✨ Cargando EvoQuest...</p>
  </div>
)

const handleSalir = async () => {
  await signOut(auth)
  ;['iapprende_rol','iapprende_codigo','iapprende_grupo','iapprende_escuela','iapprende_proyecto']
    .forEach(k => localStorage.removeItem(k))
  window.location.replace('https://iapprende.com')
}

async function init() {
  const params  = new URLSearchParams(window.location.search)
  const token   = params.get('token')
  const rol     = params.get('rol')
  const grupo   = params.get('grupo')
  const escuela = params.get('escuela')

  if (rol)     localStorage.setItem('iapprende_rol', rol)
  if (grupo)   localStorage.setItem('iapprende_grupo', grupo)
  if (escuela) localStorage.setItem('iapprende_escuela', escuela)

  if (params.toString()) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  if (token) {
    try {
      await signInWithCustomToken(auth, token)
    } catch(e) {
      console.warn('Error custom token:', e.message)
      window.location.replace('https://iapprende.com')
      return
    }
  } else if (rol === 'alumno' || rol === 'invitado') {
    try {
      await signInAnonymously(auth)
    } catch(e) {
      console.warn('Error sesión anónima:', e.message)
      window.location.replace('https://iapprende.com')
      return
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.replace('https://iapprende.com'); return }

    const rolEfectivo = getRol(user)

    if (rolEfectivo === 'invitado') {
      root.render(<StrictMode><AccesoDenegado /></StrictMode>)
    } else if (rolEfectivo === 'alumno') {
      root.render(<StrictMode><MetricasAlumno onSalir={handleSalir} /></StrictMode>)
    } else {
      root.render(<StrictMode><App /></StrictMode>)
    }
  })
}

init()
