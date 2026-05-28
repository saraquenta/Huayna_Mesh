import { useEffect, useRef, useState } from 'react'

// ─── URLs directas — archivos en public/assets/models/ ───────────────────
const LamparaURL     = '/assets/models/Lampara.glb'
const BolsaDeCocaURL = '/assets/models/BolsaDeCoca.glb'
const CigarrosURL    = '/assets/models/Cigarros.glb'
const SinganiURL     = '/assets/models/Singani.glb'
const MineroURL      = '/assets/models/mineroboceto.glb'
const TioURL         = '/assets/models/tio3d.glb'
const TunelURL       = '/assets/models/tunel.glb'
const AltarURL       = '/assets/models/altar.glb'

const MV = 'model-viewer'

// ─── Wrapper model-viewer ─────────────────────────────────────────────────
function ModelViewer({ src, alt, rotSpeed = '20deg' }) {
  const ref = useRef(null)
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    el.setAttribute('auto-rotate', '')
    el.setAttribute('camera-controls', '')
    el.setAttribute('shadow-intensity', '0.4')
    el.setAttribute('exposure', '0.9')
    el.setAttribute('auto-rotate-delay', '600')
    el.setAttribute('rotation-per-second', rotSpeed)

    const onLoad  = () => setLoaded(true)
    const onError = () => setErrored(true)
    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)
    return () => { el.removeEventListener('load', onLoad); el.removeEventListener('error', onError) }
  }, [src, rotSpeed])

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      {!loaded && !errored && (
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.7rem' }}>
          <div className="mv-spinner" />
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.5rem', letterSpacing:'0.2em', color:'rgba(201,168,76,0.4)', textTransform:'uppercase' }}>
            Cargando 3D…
          </span>
        </div>
      )}
      {errored && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
          <span style={{ fontSize:'1.8rem', opacity:0.15 }}>◈</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.48rem', color:'rgba(201,168,76,0.2)', textAlign:'center' }}>
            Error al cargar modelo
          </span>
        </div>
      )}
      <MV ref={ref} src={src} alt={alt}
        style={{ width:'100%', height:'100%', backgroundColor:'transparent' }} />
      {loaded && <div className="mv-hint">⟳ Arrastrar · Scroll zoom</div>}
    </div>
  )
}

// ─── Datos ───────────────────────────────────────────────────────────────
const PROPS_3D = [
  { name:'Lámpara de Carburo', glb:LamparaURL,     section:'Herramienta · Luz',      accent:'#c9a84c', glow:'rgba(201,168,76,0.12)', rotSpeed:'18deg', desc:'La herramienta más preciada. Sin ella, el Tío empieza a verte.' },
  { name:"Ch'uspa de Coca",    glb:BolsaDeCocaURL, section:'Consumible · Cordura',   accent:'#4a7c59', glow:'rgba(74,124,89,0.12)',   rotSpeed:'15deg', desc:'Las hojas anclan la mente. Sin ellas, la realidad se deshace.' },
  { name:'Cigarros',           glb:CigarrosURL,    section:'Ofrenda · Pacto',        accent:'#8b5e3c', glow:'rgba(139,94,60,0.12)',   rotSpeed:'20deg', desc:'Primera ofrenda. El humo lleva el mensaje a las profundidades.' },
  { name:'Botella de Singani', glb:SinganiURL,     section:'Ofrenda · Pacto',        accent:'#2d5a8e', glow:'rgba(45,90,142,0.12)',   rotSpeed:'16deg', desc:'La primera copa es siempre para el Tío, nunca para el minero.' },
]

const CHARS_3D = [
  { name:'Santos Mamani',     glb:MineroURL, section:'Protagonista · Full Body', accent:'#c9a84c', glow:'rgba(201,168,76,0.1)',  rotSpeed:'12deg', desc:'38 años. 21 en la mina. Una cruz de plata y el ukhu pacha en la sangre.' },
  { name:'El Tío',            glb:TioURL,    section:'Entidad · Deidad',         accent:'#c0392b', glow:'rgba(192,57,43,0.15)',  rotSpeed:'8deg',  desc:'Deidad real. Señor del Ukhu Pacha. Justo, impersonal, antiquísimo.' },
  { name:'Túnel Modular',     glb:TunelURL,  section:'Entorno · Kit Modular',    accent:'#525252', glow:'rgba(82,82,82,0.12)',   rotSpeed:'5deg',  desc:'Las galerías de Potosí. Cada paso en la oscuridad es una decisión.' },
  { name:'Santuario — Altar', glb:AltarURL,  section:'Entorno · Punto de Pacto', accent:'#7a5e1f', glow:'rgba(122,94,31,0.12)', rotSpeed:'6deg',  desc:'El punto de contacto. Donde las ofrendas abren caminos.' },
]

// ─── Hook scroll reveal ───────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

// ─── Card individual ──────────────────────────────────────────────────────
function PropCard({ p, delay, height, onView3D }) {
  const ref = useReveal(0.08)
  return (
    <div ref={ref} className="reveal prop3d-card" style={{ transitionDelay:`${delay}s` }}>
      <div style={{ height:'2px', background:p.accent, opacity:0.75 }} />
      <div style={{ padding:'0.5rem 1rem', borderBottom:'1px solid var(--border)',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.5rem', letterSpacing:'0.13em', color:p.accent, textTransform:'uppercase' }}>
          {p.section}
        </span>
        <button className="prop3d-fullscreen-btn" onClick={() => onView3D(p)}>
          ⛶ PANTALLA COMPLETA
        </button>
      </div>
      <div className="prop3d-viewer" style={{ height:height+'px',
        background:`radial-gradient(ellipse at 50% 60%, ${p.glow} 0%, transparent 70%)` }}>
        <ModelViewer src={p.glb} alt={p.name} rotSpeed={p.rotSpeed} />
      </div>
      <div className="prop3d-info">
        <h3 className="prop3d-name">{p.name}</h3>
        <p className="prop3d-desc">{p.desc}</p>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function Props3D({ onView3D }) {
  const t1 = useReveal(0.1)
  const t2 = useReveal(0.1)

  return (
    <div className="props3d-wrap" id="modelos3d">
      <div className="section">
        <div ref={t1} className="reveal">
          <div className="section-label">// V.A — Objetos del Pacto</div>
          <h2 className="section-title">Props <em>Interactivos</em></h2>
          <p className="section-desc">Arrastrá para rotar · Scroll para zoom · ⛶ pantalla completa</p>
        </div>
        <div className="props3d-grid props3d-grid--4">
          {PROPS_3D.map((p,i) => (
            <PropCard key={p.name} p={p} delay={i*0.1} height={260} onView3D={onView3D} />
          ))}
        </div>

        <div ref={t2} className="reveal" style={{ marginTop:'5rem' }}>
          <div className="section-label">// V.B — Personajes y Entorno</div>
          <h2 className="section-title">El Mundo <em>en 3D</em></h2>
          <p className="section-desc">Santos, El Tío, y los espacios donde se decide el pacto.</p>
        </div>
        <div className="props3d-grid props3d-grid--4">
          {CHARS_3D.map((p,i) => (
            <PropCard key={p.name} p={p} delay={i*0.08} height={320} onView3D={onView3D} />
          ))}
        </div>
      </div>
    </div>
  )
}