import { useState } from 'react'
import './App.css'

// ─── DATA ─── (reemplaza con tu contenido real)
const CHARACTERS = [
  {
    id: 1,
    name: 'Eduardo Abaroa',
    archetype: 'Héroe Ciberpunk',
    class: 'cyber',
    badge: 'badge-cyber',
    bio: 'El defensor de Calama reencarnado como guerrero cibernético del altiplano. Implantes andinos y código patriota.',
    stats: { Fuerza: 72, Agilidad: 88, Defensa: 65, Poder: 95 },
    initials: 'EA',
  },
  {
    id: 2,
    name: 'Túpac Katari',
    archetype: 'Sayajín Andino',
    class: 'sayajin',
    badge: 'badge-sayajin',
    bio: 'El líder aymara transformado en guerrero supersayajín. Su poder aumenta con la ira de los pueblos oprimidos.',
    stats: { Fuerza: 98, Agilidad: 75, Defensa: 80, Poder: 90 },
    initials: 'TK',
  },
  {
    id: 3,
    name: 'Simón Bolívar',
    archetype: 'Guerrero del Imperio',
    class: 'guerrero',
    badge: 'badge-guerrero',
    bio: 'El Libertador rearmado con armadura imperial boliviana. Comanda ejércitos de ultratumba por la Gran Colombia.',
    stats: { Fuerza: 85, Agilidad: 68, Defensa: 92, Poder: 78 },
    initials: 'SB',
  },
  {
    id: 4,
    name: 'Evo Morales',
    archetype: 'El Comandante',
    class: 'libre',
    badge: 'badge-libre',
    bio: 'El comandante eterno en moto custom, con poderes políticos que doblan la realidad del Estado Plurinacional.',
    stats: { Fuerza: 78, Agilidad: 82, Defensa: 70, Poder: 88 },
    initials: 'EM',
  },
]

const ABILITIES = [
  { icon: '⚡', name: 'Descarga Patriota', type: 'Activo · Daño' },
  { icon: '🛡', name: 'Escudo del Altiplano', type: 'Pasivo · Defensa' },
  { icon: '🔥', name: 'Furia Ancestral', type: 'Ultimate · AOE' },
  { icon: '⚙', name: 'Protocolo Wiphala', type: 'Soporte · Buff' },
]

const GALLERY_ITEMS = [
  { span: 'gi-wide',   label: 'Concept Art — Diseño Final', sub: 'Vista de tres cuartos · Alta resolución' },
  { span: 'gi-tall',   label: 'Render de Turntable', sub: 'Vista completa 360°' },
  { span: 'gi-normal', label: 'Wireframe Base', sub: 'Topología del modelo' },
  { span: 'gi-normal', label: 'Texture Sheet', sub: 'PBR · 4K' },
  { span: 'gi-normal', label: 'Detalles de Equipamiento', sub: 'Close-up armas/accesorios' },
]

const CHECKLIST = [
  'Modelo .FBX o .OBJ',
  'Texturas PBR 4K',
  'Renders (3 vistas mín.)',
  'Concept art / referencia',
  'Ficha de personaje',
  'Archivo .ZIP nombrado',
]

// ─── COMPONENTS ───

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-title">BOLIVIA 3D</span>
        <span className="nav-brand-sub">Avatar Jam</span>
      </div>
      <ul className="nav-links">
        <li><a href="#lore">Universo</a></li>
        <li><a href="#roster">Personajes</a></li>
        <li><a href="#galeria">Galería</a></li>
        <li><a href="#equipo">Equipo</a></li>
        <li><a href="#entrega">Entrega</a></li>
      </ul>
      <button className="nav-cta">Ver Demo</button>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />

      {/* ← REEMPLAZA ESTE BLOQUE con tu key art del juego:
           <img src="/assets/hero-keyart.jpg" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}} />
      */}
      <div className="hero-img-slot">
        <div className="placeholder-frame">
          <p>KEY ART DEL JUEGO</p>
          <p>Imagen principal · 1920×1080</p>
        </div>
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Comunidad de Videojuegos — Presenta</p>
        <h1 className="hero-title">
          <em>BOLIVIA</em><br />
          <span className="block-red">UCRÓNICA</span><br />
          3D
        </h1>
        <p className="hero-tagline">
          Diseña el avatar de una Bolivia que nunca existió pero siempre debió existir.
          Historia, mito y tecnología fundidos en 48 horas.
        </p>
        <div className="hero-actions">
          <button className="btn-gold">Explorar Personajes</button>
          <button className="btn-outline">Ver Reglas</button>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}

function LoreSection() {
  return (
    <section className="section" id="lore">
      <div className="section-label">// UNIVERSO</div>
      <h2 className="section-title">El Mundo de<br /><em>Bolivia Ucrónica</em></h2>

      <div className="lore-grid">
        {/* ← REEMPLAZA con un mapa/arte del mundo del juego */}
        <div className="lore-map-slot">
          <div className="slot-icon">◈</div>
          <span className="slot-label">Mapa del Mundo · Arte Conceptual</span>
          <span className="slot-label">Imagen / Video 4:3</span>
        </div>

        <div className="lore-text-block">
          <p className="section-desc">
            Una Bolivia alternativa donde las civilizaciones precolombinas nunca fueron conquistadas.
            Tecnología inca-punk, magia aymara y conflictos ucromáticos dan vida a guerreros
            que trascienden el tiempo.
          </p>
          <p className="lore-paragraph">
            Cada personaje es una versión ucrónica de una figura histórica real, rediseñada
            en un arquetipo de videojuego — cyberpunk, sayajín, guerrero imperial o héroe libre —
            manteniendo su esencia cultural boliviana.
          </p>
          <div className="lore-stat-row">
            <div className="lore-stat">
              <div className="lore-stat-val">48H</div>
              <div className="lore-stat-lbl">Duración</div>
            </div>
            <div className="lore-stat">
              <div className="lore-stat-val">4</div>
              <div className="lore-stat-lbl">Arquetipos</div>
            </div>
            <div className="lore-stat">
              <div className="lore-stat-val">3D</div>
              <div className="lore-stat-lbl">Formato</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBar({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-name">{label}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="stat-val">{value}</span>
    </div>
  )
}

function CharCard({ char }) {
  return (
    <div className="char-card">
      {/* SLOT: reemplaza con <img src={char.portrait} /> */}
      <div className="char-portrait-slot">
        <div className="portrait-placeholder">
          <div className="portrait-silhouette" />
        </div>
        <span className={`char-class-badge ${char.badge}`}>{char.class.toUpperCase()}</span>
      </div>

      <div className="char-info">
        <h3 className="char-name">{char.name}</h3>
        <p className="char-archetype">{char.archetype}</p>
        <div className="char-stats">
          {Object.entries(char.stats).map(([k, v]) => (
            <StatBar key={k} label={k.slice(0, 3)} value={v} />
          ))}
        </div>
      </div>

      {/* Hover overlay con bio */}
      <div className="char-hover-overlay">
        <h3 className="char-name">{char.name}</h3>
        <p className="hover-bio">{char.bio}</p>
        <button className="hover-btn">Ver Ficha Completa →</button>
      </div>
    </div>
  )
}

function RosterSection() {
  const filters = ['Todos', 'Cyber', 'Sayajin', 'Guerrero', 'Libre']
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos'
    ? CHARACTERS
    : CHARACTERS.filter(c => c.class === active.toLowerCase())

  return (
    <section className="section" id="roster">
      <div className="roster-header">
        <div>
          <div className="section-label">// ROSTER</div>
          <h2 className="section-title">Los <em>Personajes</em></h2>
        </div>
        <div className="roster-filter">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn ${active === f ? 'active' : ''}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="roster-grid">
        {filtered.map(char => <CharCard key={char.id} char={char} />)}
      </div>
    </section>
  )
}

function FeaturedSection() {
  return (
    <div className="featured-section">
      <div className="featured-inner">
        <div className="featured-text">
          <p className="featured-eyebrow">// Personaje Destacado</p>
          <h2 className="featured-name">
            EDUARDO<br /><span>ABAROA</span>
          </h2>
          <p className="featured-desc">
            El héroe de Calama reimaginado como soldado cibernético del altiplano. Prótesis mecánicas
            forjadas con plata potosina y código patriota grabado en sus chips corticales.
          </p>
          <div className="featured-abilities">
            {ABILITIES.map((ab, i) => (
              <div className="ability-row" key={i}>
                <div className="ability-icon">{ab.icon}</div>
                <span className="ability-name">{ab.name}</span>
                <span className="ability-type">{ab.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ← REEMPLAZA con render/arte del personaje destacado */}
        <div className="featured-art-slot">
          <div className="art-placeholder">
            <div className="slot-icon" style={{ fontSize: '3rem' }}>◈</div>
            <span className="slot-label">Render Principal</span>
            <span className="slot-label">Full Body · Pose de Combate</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function GallerySection() {
  return (
    <section className="section" id="galeria">
      <div className="section-label">// GALERÍA</div>
      <h2 className="section-title">Proceso y <em>Resultados</em></h2>
      <p className="section-desc">
        Concept art, wireframes, renders finales y hojas de textura de cada personaje del jam.
      </p>

      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item, i) => (
          <div className={`gallery-item ${item.span}`} key={i}>
            {/* ← Reemplaza gallery-img-slot con <img src={item.src} /> */}
            <div className="gallery-img-slot">
              <div className="slot-icon">◈</div>
              <span className="slot-label">{item.label}</span>
            </div>
            <div className="gallery-caption">
              <p className="gallery-caption-title">{item.label}</p>
              <p className="gallery-caption-sub">{item.sub}</p>
            </div>
            <div className="gallery-overlay">
              <span className="gallery-overlay-icon">⊕</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const TEAM = [
  { name: 'Ana Mamani', role: 'Art Director', initials: 'AM' },
  { name: 'Carlos Quispe', role: '3D Modeler', initials: 'CQ' },
  { name: 'Diego Flores', role: 'Concept Artist', initials: 'DF' },
  { name: 'Luisa Torrez', role: 'Texture Artist', initials: 'LT' },
]

function TeamSection() {
  return (
    <section className="section" id="equipo">
      <div className="section-label">// EQUIPO</div>
      <h2 className="section-title">Los <em>Creadores</em></h2>

      <div className="team-grid">
        {TEAM.map((m) => (
          <div className="team-card" key={m.name}>
            {/* ← SLOT: reemplaza con <img src={m.avatar} /> dentro del team-avatar-slot */}
            <div className="team-avatar-slot">
              <span className="team-initials">{m.initials}</span>
            </div>
            <p className="team-name">{m.name}</p>
            <p className="team-role">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SubmitSection() {
  return (
    <div className="submit-section" id="entrega">
      <div className="submit-inner">
        <div className="section-label" style={{ justifyContent: 'center' }}>// ENTREGA</div>
        <h2 className="section-title">Checklist de<br /><em>Submission</em></h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Asegúrate de incluir todos los archivos requeridos antes del deadline.
        </p>
        <div className="submit-checklist">
          {CHECKLIST.map((item, i) => (
            <div className="checklist-item" key={i}>
              <div className="check-icon">✓</div>
              <span className="check-text">{item}</span>
            </div>
          ))}
        </div>
        <button className="btn-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.25em' }}>
          SUBIR PROYECTO →
        </button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-brand">BOLIVIA UCRÓNICA 3D</span>
      <span className="footer-copy">Comunidad de Videojuegos © 2025</span>
      <div className="footer-links">
        <a href="#lore">Universo</a>
        <a href="#roster">Personajes</a>
        <a href="#galeria">Galería</a>
        <a href="#entrega">Entrega</a>
      </div>
    </footer>
  )
}

// ─── ROOT ───
export default function App() {
  return (
    <>
      <div className="noise" />
      <div className="stripe-bg" />
      <div className="app">
        <Navbar />
        <Hero />
        <div className="divider" />
        <LoreSection />
        <div className="divider" />
        <RosterSection />
        <FeaturedSection />
        <GallerySection />
        <div className="divider" />
        <TeamSection />
        <SubmitSection />
        <Footer />
      </div>
    </>
  )
}
