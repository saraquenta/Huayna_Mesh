import { useEffect, useRef, useState } from 'react'
import './App.css'
import Props3D from './Props3D'

// ═══════════════════════════════════════════════════════════════════════════
// GLB URLs — archivos en public/assets/models/, se acceden como URLs directas
// NO usar import para archivos en public/, solo strings con la ruta
// ═══════════════════════════════════════════════════════════════════════════
const MineroURL      = '/assets/models/mineroboceto.glb'
const TioURL         = '/assets/models/tio3d.glb'
const ManosURL       = null   // no existe Manos.glb todavía
const LamparaURL     = '/assets/models/Lampara.glb'
const BolsaDeCocaURL = '/assets/models/BolsaDeCoca.glb'
const cigarroURL     = '/assets/models/Cigarros.glb'
const SinganiURL     = '/assets/models/Singani.glb'
const TunelURL       = '/assets/models/tunel.glb'
const AltarURL       = '/assets/models/altar.glb'

const MV = 'model-viewer'

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useReveal(t = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() }
    }, { threshold: t })
    obs.observe(el)
    return () => obs.disconnect()
  }, [t])
  return ref
}

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const fn = () => setY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return y
}

// ═══════════════════════════════════════════════════════════════════════════
// AMBIENT AUDIO
// ═══════════════════════════════════════════════════════════════════════════
function AmbientAudio() {
  const [on, setOn] = useState(false)
  const aRef = useRef(null)

  const toggle = () => {
    if (!aRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctx.createGain(); master.gain.value = 0
      master.connect(ctx.destination)
      master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 3)

      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 40
      const oscF = ctx.createBiquadFilter(); oscF.type = 'lowpass'; oscF.frequency.value = 120
      const oscG = ctx.createGain(); oscG.gain.value = 0.1
      osc.connect(oscF); oscF.connect(oscG); oscG.connect(master); osc.start()

      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.07
      const lfoG = ctx.createGain(); lfoG.gain.value = 0.02
      lfo.connect(lfoG); lfoG.connect(oscG.gain); lfo.start()

      const bufSz = ctx.sampleRate * 4
      const buf = ctx.createBuffer(2, bufSz, ctx.sampleRate)
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c)
        for (let i = 0; i < bufSz; i++) d[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true
      const noiseF = ctx.createBiquadFilter(); noiseF.type = 'bandpass'; noiseF.frequency.value = 320; noiseF.Q.value = 0.35
      const noiseG = ctx.createGain(); noiseG.gain.value = 0.025
      noise.connect(noiseF); noiseF.connect(noiseG); noiseG.connect(master); noise.start()

      const drip = () => {
        if (!aRef.current) return
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 800
        o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)
        const g = ctx.createGain(); g.gain.value = 0.08
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + 0.35)
        setTimeout(drip, 4000 + Math.random() * 8000)
      }
      setTimeout(drip, 3000)
      aRef.current = { ctx, master }
    }

    const { ctx, master } = aRef.current
    if (on) {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => ctx.suspend(), 1700)
    } else {
      ctx.resume().then(() => master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2))
    }
    setOn(!on)
  }

  return (
    <button className="audio-toggle" onClick={toggle} title={on ? 'Silenciar' : 'Sonido ambiente de mina'}>
      <span className="audio-icon">{on ? '🔊' : '🔇'}</span>
      <span className="audio-label">{on ? 'MINA ON' : 'AMBIENTE'}</span>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL 3D
// ═══════════════════════════════════════════════════════════════════════════
function Modal3D({ model, onClose }) {
  const mvRef = useRef(null)
  const [loaded,  setLoaded]  = useState(false)
  const [anims,   setAnims]   = useState([])
  const [curAnim, setCurAnim] = useState(null)
  const [playing, setPlaying] = useState(true)

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC para cerrar
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  // Configurar model-viewer — ORDEN IMPORTA
  useEffect(() => {
    const el = mvRef.current
    if (!el) return

    // Reset
    setLoaded(false)
    setAnims([])
    setCurAnim(null)
    setPlaying(true)

    // 1. PRIMERO agregar el listener de carga
    const onLoad = () => {
      setLoaded(true)
      const available = el.availableAnimations || []
      setAnims(available)
      if (available.length > 0) {
        el.animationName = available[0]
        el.play({ repetitions: Infinity })
        setCurAnim(available[0])
      }
    }
    el.addEventListener('load', onLoad)

    // 2. DESPUÉS setear los atributos (incluyendo src al final)
    el.setAttribute('camera-controls', '')
    el.setAttribute('auto-rotate', '')
    el.setAttribute('shadow-intensity', '0.5')
    el.setAttribute('exposure', '1.0')
    el.setAttribute('auto-rotate-delay', '1000')
    el.setAttribute('rotation-per-second', '14deg')
    el.setAttribute('min-field-of-view', '10deg')
    el.setAttribute('max-field-of-view', '90deg')
    // src AL ÚLTIMO — esto dispara la descarga, el listener ya está listo
    el.setAttribute('src', model.glb)

    return () => el.removeEventListener('load', onLoad)
  }, [model.glb])

  const playAnim = (name) => {
    const el = mvRef.current; if (!el) return
    el.animationName = name; el.play({ repetitions: Infinity })
    setCurAnim(name); setPlaying(true)
  }

  const togglePlay = () => {
    const el = mvRef.current; if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else { el.play({ repetitions: Infinity }); setPlaying(true) }
  }

  const animLabel = (name) => {
    const map = { idle:'⏸ Idle', walk:'🚶 Caminar', run:'🏃 Correr', jump:'⬆ Saltar', attack:'⚔ Atacar', death:'💀 Muerte' }
    const l = name.toLowerCase()
    for (const [k,v] of Object.entries(map)) { if (l.includes(k)) return v }
    return name
  }

  const MV = 'model-viewer'

  return (
    <div className="modal3d-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal3d-box">

        {/* Header */}
        <div className="modal3d-header">
          <div>
            <span className="modal3d-tag">{model.section || 'MODELO 3D'}</span>
            <h3 className="modal3d-title">{model.alt || model.name}</h3>
          </div>
          <button className="modal3d-close" onClick={onClose}>✕</button>
        </div>

        {/* Stage — altura explícita, no flex:1 */}
        <div className="modal3d-stage">
          {!loaded && (
            <div className="modal3d-loading">
              <div className="mv-spinner" style={{ width:40, height:40 }} />
              <span>Descargando modelo ({model.alt || model.name})…</span>
              <span style={{ fontSize:'0.45rem', opacity:0.5 }}>Los modelos son grandes, puede tomar unos segundos</span>
            </div>
          )}
          {/* NO poner src aquí — se setea via setAttribute en useEffect */}
          <MV
            ref={mvRef}
            alt={model.alt || model.name}
            style={{
              width: '100%',
              height: '500px',       // ← explícito, nunca 100% en flex
              display: 'block',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Controles de animación */}
        {anims.length > 0 && (
          <div className="modal3d-controls">
            <span className="anim-section-label">ANIMACIONES</span>
            <div className="anim-btns">
              {anims.map(a => (
                <button key={a} className={`anim-btn ${curAnim===a?'anim-btn--active':''}`} onClick={() => playAnim(a)}>
                  {animLabel(a)}
                </button>
              ))}
            </div>
            <button className="anim-playpause" onClick={togglePlay}>
              {playing ? '⏸ PAUSAR' : '▶ PLAY'}
            </button>
          </div>
        )}

        <div className="modal3d-hint">
          Arrastrá para rotar · Scroll para zoom · ESC para cerrar
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DUST + DIVIDER
// ═══════════════════════════════════════════════════════════════════════════
const DUST = [
  {left:'8%',delay:'0s',dur:'7s',size:2},{left:'15%',delay:'1.2s',dur:'9s',size:3},
  {left:'22%',delay:'0.5s',dur:'6s',size:2},{left:'31%',delay:'2.8s',dur:'8s',size:2},
  {left:'42%',delay:'1.8s',dur:'10s',size:3},{left:'51%',delay:'0.3s',dur:'7s',size:2},
  {left:'63%',delay:'3.5s',dur:'9s',size:2},{left:'71%',delay:'1.1s',dur:'6s',size:3},
  {left:'79%',delay:'2.2s',dur:'8s',size:2},{left:'87%',delay:'0.8s',dur:'11s',size:2},
  {left:'93%',delay:'4.0s',dur:'7s',size:3},{left:'38%',delay:'3.0s',dur:'9s',size:2},
]
function Divider() { return <div className="divider" /> }

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-title">El Pacto del Tío</span>
        <span className="nav-brand-sub">Survival Horror · Potosí, Bolivia</span>
      </div>
      <ul className="nav-links">
        <li><a href="#historia">Historia</a></li>
        <li><a href="#personajes">Personajes</a></li>
        <li><a href="#mecanicas">El Pacto</a></li>
        <li><a href="#arte">Arte</a></li>
        <li><a href="#mundo">El Mundo</a></li>
      </ul>
      <AmbientAudio />
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════
function Hero() {
  const scrollY = useScrollY()
  const heroRef = useRef(null)
  const [heroH, setHeroH] = useState(800)
  useEffect(() => { if (heroRef.current) setHeroH(heroRef.current.offsetHeight) }, [])
  const prog = Math.min(scrollY / heroH, 1)
  const imgScale = 1 + prog * 0.42
  const eyeOpacity = prog > 0.25 ? Math.min((prog - 0.25) / 0.5, 1) : 0

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <div className="hero-bg" /><div className="hero-grid" aria-hidden="true" />
      <div className="dust-layer" aria-hidden="true">
        {DUST.map((d,i) => (
          <div key={i} className="dust-particle" style={{left:d.left,width:d.size+'px',height:d.size+'px',animationDelay:d.delay,animationDuration:d.dur}}/>
        ))}
      </div>
      <div className="hero-art-slot">
        <div style={{position:'relative',width:'100%',aspectRatio:'3/4',overflow:'hidden'}}>
          <img src="/assets/MesaOfrenda.png" alt="El Santuario"
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block',
              transform:`scale(${imgScale})`,transformOrigin:'center 40%',willChange:'transform'}}/>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',
            background:`linear-gradient(to right,rgba(6,6,8,${0.65+prog*0.3}) 0%,transparent 50%)`}}/>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',
            background:'linear-gradient(to top,rgba(6,6,8,0.7) 0%,transparent 40%)'}}/>
          <div className="tio-eyes-wrap" style={{opacity:eyeOpacity}}>
            <div className="tio-eye"/><div className="tio-eye"/>
          </div>
          <div className="tio-whisper" style={{opacity:eyeOpacity*0.8}}>
            <span>Ya sabe que estás aquí.</span>
          </div>
        </div>
      </div>
      <div className="hero-content">
        <p className="hero-eyebrow">Potosí · Bolivia · Bocamina 7</p>
        <h1 className="hero-title">
          <span className="title--white">EL PACTO</span>
          <span className="title--gold">DEL TÍO</span>
        </h1>
        <p className="hero-tagline">
          "En las profundidades de la montaña,<br/>
          la oscuridad no es ausencia de luz.<br/>
          Es una presencia con nombre y con reglas."
        </p>
        <div className="hero-actions">
          <button className="btn-gold">Explorar la Historia</button>
          <button className="btn-outline">Ver Arte Conceptual</button>
        </div>
      </div>
      <div className="scroll-hint"><div className="scroll-line"/><span>Descender</span></div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SINOPSIS
// ═══════════════════════════════════════════════════════════════════════════
function Sinopsis() {
  const tR = useReveal(0.1); const txR = useReveal(0.1); const aR = useReveal(0.1)
  return (
    <section className="section" id="historia">
      <div ref={tR} className="reveal">
        <div className="section-label">// I — La Historia</div>
        <h2 className="section-title">El <em>Descenso</em></h2>
      </div>
      <div className="sinopsis-grid">
        <div ref={txR} className="reveal sinopsis-text">
          <p className="body-text">El 14 de agosto, <strong>Santos Mamani Quispe</strong> bajó a la Bocamina 7 como cualquier otro día. No hizo la ch'alla de la mañana. Se dijo a sí mismo, como llevaba años diciéndose, que esas tradiciones eran del pasado — cosa de su padre, de otra generación.</p>
          <p className="body-text">Cuarenta minutos después, el techo de la galería E-7 colapsó.</p>
          <p className="body-text">Santos quedó solo en la oscuridad con una lámpara de carburo con aceite para doce horas, una bolsa de coca casi vacía, y la certeza de que nadie lo escuchaba — ni Dios, ni el Tío, ni nadie.</p>
          <p className="body-text body-text--em">Estaba equivocado en las tres.</p>
          <p className="body-text"><em>El Pacto del Tío</em> es un survival horror sin combate. El enemigo es la oscuridad, el tiempo, y la distancia entre lo que Santos cree y lo que la mina sabe.</p>
          <div className="sinopsis-stats">
            {[['12','Horas de aceite'],['0','Combates'],['∞','Decisiones']].map(([v,l])=>(
              <div key={l} className="stat-block"><span className="stat-val">{v}</span><span className="stat-lbl">{l}</span></div>
            ))}
          </div>
        </div>
        <div ref={aR} className="reveal reveal--right sinopsis-art">
          <div style={{position:'relative',width:'100%',aspectRatio:'3/4',overflow:'hidden'}}>
            <img src="/assets/MineroFullBody.png" alt="Santos Mamani"
              style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            <div style={{position:'absolute',inset:0,pointerEvents:'none',
              background:'linear-gradient(to top,rgba(6,6,8,0.7) 0%,transparent 50%)'}}/>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSONAJES
// ═══════════════════════════════════════════════════════════════════════════
function Personajes({ onView3D }) {
  const tR = useReveal(0.1); const sR = useReveal(0.1); const tioR = useReveal(0.1)
  return (
    <section className="section" id="personajes">
      <div ref={tR} className="reveal">
        <div className="section-label">// II — Los Actores del Pacto</div>
        <h2 className="section-title">Los <em>Personajes</em></h2>
      </div>
      <div className="chars-grid">
        <div ref={sR} className="reveal reveal--left char-card">
          <div className="char-portrait">
            <img src="/assets/MineroFullBody.png" alt="Santos Mamani"
              style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',display:'block'}}/>
            <div style={{position:'absolute',inset:0,pointerEvents:'none',
              background:'linear-gradient(to top,rgba(6,6,8,0.65) 0%,transparent 45%)'}}/>
            <span className="char-badge char-badge--gold">PROTAGONISTA</span>
            <button className="char-btn3d" onClick={() => onView3D({glb:MineroURL,alt:'Santos Mamani Quispe',section:'Avatar · Protagonista'})}>◈ Ver en 3D</button>
          </div>
          <div className="char-info">
            <h3 className="char-name">Santos Mamani Quispe</h3>
            <p className="char-role">Minero de estaño · 38 años · Bocamina 7, Potosí</p>
            <div className="char-sep"/>
            <p className="char-bio">Hombre de pocas palabras y fe declarada. Santos lleva 21 años bajando a la mina, siguiendo los pasos de su padre Dionisio — el palliri más respetado de Llallagua. Cuando Dionisio murió en un derrumbe hace 14 años, Santos abandonó las tradiciones andinas y se aferró a la Iglesia. Llamó a eso "madurar".</p>
            <p className="char-bio">La contradicción que lleva dentro es la misma que lleva Bolivia entera: una cruz de plata en el pecho y el ukhu pacha en la sangre.</p>
            <div className="char-attrs">
              {[['Fe declarada','Católico practicante'],['Fe real','Sincretismo en negación'],['Motivación','Volver con Rosa y sus hijos'],['Herida','La muerte de su padre, Dionisio']].map(([k,v])=>(
                <div key={k} className="attr"><span className="attr-k">{k}</span><span className="attr-v">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div ref={tioR} className="reveal reveal--right char-card char-card--tio">
          <div className="char-portrait">
            <img src="/assets/ElTio.png" alt="El Tío"
              style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',display:'block'}}/>
            <div style={{position:'absolute',inset:0,pointerEvents:'none',
              background:'linear-gradient(to top,rgba(10,4,4,0.75) 0%,transparent 45%)'}}/>
            <span className="char-badge char-badge--red">ENTIDAD — SEÑOR DEL UKHU PACHA</span>
            <button className="char-btn3d char-btn3d--red" onClick={() => onView3D({glb:TioURL,alt:'El Tío',section:'Entidad · Deidad'})}>◈ Ver en 3D</button>
          </div>
          <div className="char-info">
            <h3 className="char-name char-name--red">El Tío</h3>
            <p className="char-role">Señor del Ukhu Pacha · El Mundo de Abajo · Siempre estuvo aquí</p>
            <div className="char-sep char-sep--red"/>
            <p className="char-bio">El Tío no es una leyenda. No es una metáfora cultural. No es el producto de la mente hambrienta de un hombre atrapado en la oscuridad.</p>
            <p className="char-bio">Es tan real como la plata en la roca. Existe antes que la mina, antes que los españoles que la abrieron. El Tío ES la montaña — su voluntad, su hambre, su código.</p>
            <div className="char-attrs">
              {[['Naturaleza','Deidad real — no metáfora',true],['Carácter','Justo, impersonal, antiguo'],['Regla','La ofrenda correcta siempre funciona'],['Advertencia','No engaña. Tampoco perdona el olvido.',true]].map(([k,v,r])=>(
                <div key={k} className="attr"><span className="attr-k">{k}</span><span className={`attr-v${r?' attr-v--red':''}`}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MECÁNICAS
// ═══════════════════════════════════════════════════════════════════════════
const MECS = [
  { icon:'◉', accentColor:'#c9a84c', cardClass:'', sepColor:'rgba(201,168,76,0.3)',
    title:'La Lámpara de Carburo', mechanic:'Tu única fuente de luz. Gestiona el aceite como gestionas el tiempo.',
    lore:'Cuando la lámpara se apaga, El Tío empieza a verte. La oscuridad no es peligro — es jurisdicción.',
    img:'/assets/Lampara.png', glb:LamparaURL, section:'Prop · Luz' },
  { icon:'◈', accentColor:'#4a7c59', cardClass:'mec-card--green', sepColor:'rgba(74,124,89,0.4)',
    title:'Las Hojas de Coca', mechanic:'Masticadas lentamente, anclan la mente en lo real.',
    lore:'La coca no distorsiona la realidad — la aclara. Santos no está alucinando. Está viendo demasiado.',
    img:'/assets/BolsaDeCoca.png', glb:BolsaDeCocaURL, section:'Prop · Cordura' },
  { icon:'◆', accentColor:'#8b1a1a', cardClass:'mec-card--red', sepColor:'rgba(139,26,26,0.5)',
    title:'El Ritual de Ofrendas', mechanic:'Singani, cigarros, coca. Cada ofrenda correcta abre un camino.',
    lore:'El Tío no habla. No aparece. Pero la mina responde: un túnel cerrado tiene corriente de aire.',
    img:'/assets/cigarros.png', glb:cigarroURL, section:'Prop · Ofrenda' },
]

function Mecanicas({ onView3D }) {
  const tR = useReveal(0.1)
  const refs = [useReveal(0.08), useReveal(0.08), useReveal(0.08)]
  return (
    <div className="mecanicas-wrap" id="mecanicas">
      <div className="section">
        <div ref={tR} className="reveal">
          <div className="section-label">// III — El Sistema de Supervivencia</div>
          <h2 className="section-title">El <em>Pacto</em></h2>
          <p className="section-desc">En la Bocamina 7, cada decisión tiene nombre en aymara.</p>
        </div>
        <div className="mecanicas-grid">
          {MECS.map((m,i) => (
            <div key={m.title} ref={refs[i]} className={`reveal mec-card ${m.cardClass}`} style={{transitionDelay:`${i*0.12}s`}}>
              <span className="mec-icon" style={{color:m.accentColor}}>{m.icon}</span>
              <h3 className="mec-title">{m.title}</h3>
              <p className="mec-mechanic">{m.mechanic}</p>
              <div className="mec-sep" style={{background:m.sepColor}}/>
              <p className="mec-lore">{m.lore}</p>
              <div className="mec-art" style={{position:'relative'}}>
                <img src={m.img} alt={m.title} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',display:'block'}}/>
                {m.glb && <button className="btn-view3d btn-view3d--always" onClick={() => onView3D(m)}>◈ Ver en 3D</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE
// ═══════════════════════════════════════════════════════════════════════════
const ACTOS = [
  { num:'I', dotClass:'tl-dot--gold', actClass:'tl-act--gold', titleClass:'tl-title--gold',
    titulo:'El Derrumbe', tiempo:'Hora 0 — Hora 1',
    texto:'Santos reza. El Padre Nuestro, tres veces. La oscuridad no responde. Por primera vez en su vida adulta, siente que nadie lo escucha. Caminando a tientas encuentra un santuario antiguo tallado en roca natural — más viejo que la mina. Los ojos de cuarzo rojo del Tío brillan solos, sin fuente de luz.' },
  { num:'II', dotClass:'tl-dot--red', actClass:'tl-act--red', titleClass:'tl-title--red',
    titulo:'El Trato', tiempo:'Hora 1 — Hora 8',
    texto:'Por desesperación — no por fe — Santos deja las hojas de coca ante el Tío. El túnel que estaba cerrado tiene corriente de aire. Funcionó. No puede negarlo. Por primera vez en 14 años piensa en Dionisio — en cómo le explicaba el Tío con la misma voz técnica que usaba para el martillo: "Es una herramienta, hijo."' },
  { num:'III', dotClass:'tl-dot--gold', actClass:'tl-act--gold', titleClass:'tl-title--gold',
    titulo:'El Pacto', tiempo:'Hora 8 — Hora 12',
    texto:'Santos llega al santuario más profundo. Deja las últimas ofrendas — esta vez no por miedo, sino porque quiere. La mina respira. Santos sale con dos cosas en el bolsillo: una piedra del santuario, y la cruz de plata. No elige entre las dos. Las guarda a las dos.' },
]

function Timeline() {
  const tR = useReveal(0.1)
  const aR = [useReveal(0.08), useReveal(0.08), useReveal(0.08)]
  return (
    <section className="section" id="arco">
      <div ref={tR} className="reveal">
        <div className="section-label">// IV — Las Doce Horas</div>
        <h2 className="section-title">Una línea de tiempo <em>del alma</em></h2>
      </div>
      <div className="timeline">
        {ACTOS.map((a,i) => (
          <div key={a.num} ref={aR[i]} className="reveal tl-item" style={{transitionDelay:`${i*0.15}s`}}>
            <div className="tl-connector">
              <div className={`tl-dot ${a.dotClass}`}/>
              {i < ACTOS.length-1 && <div className="tl-line"/>}
            </div>
            <div className="tl-body">
              <div className="tl-meta">
                <span className={`tl-act ${a.actClass}`}>ACTO {a.num}</span>
                <span className="tl-time">{a.tiempo}</span>
              </div>
              <h3 className={`tl-title ${a.titleClass}`}>{a.titulo}</h3>
              <p className="tl-text">{a.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GALERÍA — botón Ver en 3D en cada imagen
// ═══════════════════════════════════════════════════════════════════════════
const SLOTS = [
  { span:'wide',   src:'/assets/MineroFullBody.png', alt:'El Minero',  glb:MineroURL,      label:'EL MINERO',          sub:'Avatar · Cuerpo Completo',   section:'Avatar · Protagonista' },
  { span:'tall',   src:'/assets/ElTio.png',          alt:'El Tío',     glb:TioURL,         label:'EL TÍO',             sub:'Entidad · Vista frontal',    section:'Entidad · Deidad' },
  { span:'normal', src:'/assets/ManosMinero.png',    alt:'Manos FPS',  glb:ManosURL,       label:'MANOS FPS',          sub:'Avatar · Primera persona',   section:'Avatar · FPS' },
  { span:'normal', src:'/assets/Lampara.png',        alt:'Lámpara',    glb:LamparaURL,     label:'LÁMPARA DE CARBURO', sub:'Prop · Herramienta de luz',  section:'Prop · Luz' },
  { span:'normal', src:'/assets/BolsaDeCoca.png',    alt:"Ch'uspa",    glb:BolsaDeCocaURL, label:"CH'USPA DE COCA",    sub:'Prop · Mecánica de cordura', section:'Prop · Cordura' },
  { span:'normal', src:'/assets/cigarros.png',       alt:'Cigarros',   glb:cigarroURL,     label:'CIGARROS',           sub:'Prop · Ofrenda al Tío',      section:'Prop · Ofrenda' },
  { span:'normal', src:'/assets/Singani.png',        alt:'Singani',    glb:SinganiURL,     label:'SINGANI',            sub:'Prop · Ofrenda al Tío',      section:'Prop · Ofrenda' },
  { span:'wide',   src:'/assets/Cueva.png',          alt:'Caverna',    glb:TunelURL,       label:'KIT CAVERNA',        sub:'Entorno · Túnel minero',     section:'Entorno · Caverna' },
  { span:'normal', src:'/assets/MesaOfrenda.png',    alt:'Santuario',  glb:AltarURL,       label:'SANTUARIO',          sub:'Entorno · Escena completa',  section:'Entorno · Santuario' },
]

function Galeria({ onView3D }) {
  const tR = useReveal(0.1); const gR = useReveal(0.05)
  return (
    <section className="section" id="arte">
      <div ref={tR} className="reveal">
        <div className="section-label">// V — Arte Conceptual y Assets 3D</div>
        <h2 className="section-title">Los <em>Assets</em></h2>
        <p className="section-desc">
          Pulsá <span style={{color:'var(--gold)'}}>◈ Ver en 3D</span> para explorar cada modelo interactivamente.
        </p>
      </div>
      <div ref={gR} className="reveal gallery-grid">
        {SLOTS.map((s,i) => (
          <div key={i} className={`g-slot g-slot--${s.span} g-slot--hover`}>
            <div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',
              minHeight:s.span==='wide'?'280px':s.span==='tall'?'100%':'200px'}}>
              <img src={s.src} alt={s.alt} className="g-img"
                style={{width:'100%',height:'100%',objectFit:'cover',display:'block',minHeight:'inherit'}}/>
              <div className="g-scan" aria-hidden="true"/>
              {s.glb && (
                <button className="btn-view3d" onClick={() => onView3D(s)}>
                  ◈ Ver en 3D
                </button>
              )}
              <div style={{position:'absolute',bottom:0,left:0,right:0,pointerEvents:'none',
                background:'linear-gradient(to top,rgba(6,6,8,0.88) 0%,transparent 100%)',
                padding:'1.5rem 1rem 0.75rem'}}>
                <p style={{fontFamily:'var(--font-mono)',fontSize:'0.58rem',letterSpacing:'0.16em',color:'rgba(201,168,76,0.75)',textTransform:'uppercase',marginBottom:'2px'}}>{s.label}</p>
                <p style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.1em',color:'rgba(232,220,200,0.4)'}}>{s.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EL MUNDO
// ═══════════════════════════════════════════════════════════════════════════
const STATS_MUNDO = [
  {val:'4.782m',lbl:'Altitud del Cerro Rico'},{val:'+470',lbl:'Años de extracción'},
  {val:'~15K',lbl:'Mineros activos hoy'},{val:'8–15M',lbl:'Vidas cobradas 1545–1800'},
  {val:'4.090m',lbl:'Altitud de Potosí'},{val:'12H',lbl:'Duración del juego'},
]

function ElMundo() {
  const tR = useReveal(0.1); const txR = useReveal(0.1); const sR = useReveal(0.1)
  return (
    <div className="mundo-wrap" id="mundo">
      <div className="section">
        <div ref={tR} className="reveal">
          <div className="section-label">// VI — El Contexto Real</div>
          <h2 className="section-title">El Cerro que se <em>Come a los Hombres</em></h2>
        </div>
        <div className="mundo-grid">
          <div ref={txR} className="reveal">
            <p className="body-text">El Cerro Rico de Potosí es la montaña más letal de la historia humana. Se estima que entre 8 y 15 millones de personas murieron extrayendo su plata entre 1545 y 1800.</p>
            <p className="body-text">Los mineros que trabajan hoy en sus galerías saben esto. Lo saben y bajan igual, con su lámpara y su coca y su fe dividida entre el Cristo de la Catedral y el Tío de la mina.</p>
            <p className="body-text body-text--em">El Pacto del Tío no es fantasía. Es documentación con polígonos.</p>
          </div>
          <div ref={sR} className="reveal reveal--right mundo-stats">
            {STATS_MUNDO.map(s=>(
              <div key={s.lbl} className="mundo-stat">
                <span className="mundo-stat__val">{s.val}</span>
                <span className="mundo-stat__lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMAS
// ═══════════════════════════════════════════════════════════════════════════
const TEMAS = [
  {icon:'✝',titulo:'Sincretismo Religioso Boliviano',texto:'Bolivia es el único lugar donde el Cristo de la Catedral y el Tío de la mina coexisten en la misma persona sin contradicción.'},
  {icon:'⛓',titulo:'La Herencia Rechazada',texto:'Santos pasó 14 años llamando "superstición" a algo que su padre trataba con el mismo respeto técnico que una herramienta.'},
  {icon:'⚖',titulo:'Justicia Como Espiritualidad',texto:'El Tío no pide fe ciega — pide cumplimiento honesto. La justicia es más dura que la misericordia.'},
  {icon:'🕯',titulo:'El Luto Mal Procesado',texto:'Cuando Dionisio Mamani murió, Santos culpó al Tío. En la oscuridad comprende que confundió el contrato.'},
]

function Temas() {
  const tR = useReveal(0.1)
  const refs = [useReveal(0.08),useReveal(0.08),useReveal(0.08),useReveal(0.08)]
  return (
    <section className="section" id="temas">
      <div ref={tR} className="reveal">
        <div className="section-label">// VII — Lo que está debajo</div>
        <h2 className="section-title">Los <em>Temas</em></h2>
        <p className="section-desc">Un juego sobre Bolivia. Sobre fe. Sobre lo que heredamos y lo que rechazamos.</p>
      </div>
      <div className="temas-grid">
        {TEMAS.map((t,i)=>(
          <div key={t.titulo} ref={refs[i]} className="reveal tema-card" style={{transitionDelay:`${i*0.1}s`}}>
            <span className="tema-icon">{t.icon}</span>
            <h3 className="tema-title">{t.titulo}</h3>
            <p className="tema-text">{t.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-title">El Pacto del Tío</span>
        <span className="footer-sub">Survival Horror · Potosí, Bolivia · En desarrollo</span>
      </div>
      <span className="footer-copy">Proyecto Hackathon 2025</span>
      <div className="footer-links">
        <a href="#historia">Historia</a><a href="#personajes">Personajes</a>
        <a href="#mecanicas">El Pacto</a><a href="#arte">Arte</a><a href="#mundo">El Mundo</a>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [modal3D, setModal3D] = useState(null)
  return (
    <>
      <div className="noise"/><div className="stripe-bg"/>
      <div className="app">
        <Navbar/>
        <Hero/>
        <Divider/>
        <Sinopsis/>
        <Divider/>
        <Personajes   onView3D={setModal3D}/>
        <Mecanicas    onView3D={setModal3D}/>
        <Divider/>
        <Timeline/>
        <Divider/>
        <Galeria      onView3D={setModal3D}/>
        <Props3D      onView3D={setModal3D}/>
        <ElMundo/>
        <Divider/>
        <Temas/>
        <Footer/>
      </div>
      {modal3D && <Modal3D model={modal3D} onClose={() => setModal3D(null)}/>}
    </>
  )
}