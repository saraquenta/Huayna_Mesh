import './App.css'

// ─── IMÁGENES DISPONIBLES ──────────────────────────────────────────────────
// /assets/MineroFullBody.png   → El Minero, cuerpo completo
// /assets/ElTio.png            → El Tío, estatua
// /assets/ManosMinero.png      → Manos del minero (vista FPS)
// /assets/Lampara.png          → Lámpara de carburo
// /assets/BolsaDeCoca.png      → Ch'uspa / Bolsa de coca
// /assets/cigarros.png         → Cigarros artesanales
// /assets/Singani.png          → Botella de Singani
// /assets/Cueva.png            → Caverna / Túnel minero
// /assets/MesaOfrenda.png      → Santuario / Mesa de ofrendas

// ─── UTILITY ───────────────────────────────────────────────────────────────

function Divider() { return <div className="divider" /> }

// ─── NAVBAR ────────────────────────────────────────────────────────────────

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
    </nav>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" />
      <div className="hero-grid" aria-hidden="true" />

      {/* Mesa de ofrendas como key art — derecha del hero */}
      <div className="hero-art-slot">
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src="/assets/MesaOfrenda.png"
            alt="El Santuario de El Tío"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Máscara que mezcla la imagen con el fondo oscuro */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(6,6,8,0.75) 0%, transparent 45%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(6,6,8,0.6) 0%, transparent 35%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Potosí · Bolivia · Bocamina 7</p>
        <h1 className="hero-title">
          <span className="title--white">EL PACTO</span>
          <span className="title--gold">DEL TÍO</span>
        </h1>
        <p className="hero-tagline">
          "En las profundidades de la montaña,<br />
          la oscuridad no es ausencia de luz.<br />
          Es una presencia con nombre y con reglas."
        </p>
        <div className="hero-actions">
          <button className="btn-gold">Explorar la Historia</button>
          <button className="btn-outline">Ver Arte Conceptual</button>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Descender</span>
      </div>
    </section>
  )
}

// ─── SINOPSIS ──────────────────────────────────────────────────────────────

function Sinopsis() {
  return (
    <section className="section" id="historia">
      <div className="section-label">// I — La Historia</div>
      <h2 className="section-title">El <em>Descenso</em></h2>

      <div className="sinopsis-grid">
        <div className="sinopsis-text">
          <p className="body-text">
            El 14 de agosto, <strong>Santos Mamani Quispe</strong> bajó a la Bocamina 7 como cualquier
            otro día. No hizo la ch'alla de la mañana. Se dijo a sí mismo, como llevaba años diciéndose,
            que esas tradiciones eran del pasado — cosa de su padre, de otra generación.
          </p>
          <p className="body-text">
            Cuarenta minutos después, el techo de la galería E-7 colapsó.
          </p>
          <p className="body-text">
            Santos quedó solo en la oscuridad con una lámpara de carburo con aceite para doce horas,
            una bolsa de coca casi vacía, y la certeza de que nadie lo escuchaba —
            ni Dios, ni el Tío, ni nadie.
          </p>
          <p className="body-text body-text--em">
            Estaba equivocado en las tres.
          </p>
          <p className="body-text">
            <em>El Pacto del Tío</em> es un survival horror sin combate. No hay monstruos que matar
            ni jefes que derrotar. El enemigo es la oscuridad, el tiempo, y la distancia entre lo que
            Santos cree y lo que la mina sabe. La única salida es aprender el idioma de algo
            más viejo que la plata en la roca.
          </p>
          <div className="sinopsis-stats">
            <div className="stat-block">
              <span className="stat-val">12</span>
              <span className="stat-lbl">Horas de aceite</span>
            </div>
            <div className="stat-block">
              <span className="stat-val">0</span>
              <span className="stat-lbl">Combates</span>
            </div>
            <div className="stat-block">
              <span className="stat-val">∞</span>
              <span className="stat-lbl">Decisiones</span>
            </div>
          </div>
        </div>

        {/* MineroFullBody como imagen de sinopsis */}
        <div className="sinopsis-art">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
            <img
              src="/assets/MineroFullBody.png"
              alt="Santos Mamani Quispe"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(6,6,8,0.7) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PERSONAJES ────────────────────────────────────────────────────────────

function Personajes() {
  return (
    <section className="section" id="personajes">
      <div className="section-label">// II — Los Actores del Pacto</div>
      <h2 className="section-title">Los <em>Personajes</em></h2>

      <div className="chars-grid">

        {/* ── SANTOS ── */}
        <div className="char-card">
          <div className="char-portrait">
            <img
              src="/assets/MineroFullBody.png"
              alt="Santos Mamani Quispe"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradiente inferior para legibilidad del badge */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(6,6,8,0.65) 0%, transparent 45%)',
              pointerEvents: 'none',
            }} />
            <span className="char-badge char-badge--gold">PROTAGONISTA</span>
          </div>
          <div className="char-info">
            <h3 className="char-name">Santos Mamani Quispe</h3>
            <p className="char-role">Minero de estaño · 38 años · Bocamina 7, Potosí</p>
            <div className="char-sep" />
            <p className="char-bio">
              Hombre de pocas palabras y fe declarada. Santos lleva 21 años bajando a la mina,
              siguiendo los pasos de su padre Dionisio — el palliri más respetado de Llallagua.
              Cuando Dionisio murió en un derrumbe hace 14 años, Santos abandonó las tradiciones
              andinas y se aferró a la Iglesia. Llamó a eso "madurar".
            </p>
            <p className="char-bio">
              La contradicción que lleva dentro es la misma que lleva Bolivia entera: una cruz de
              plata en el pecho y el ukhu pacha en la sangre.
            </p>
            <div className="char-attrs">
              <div className="attr">
                <span className="attr-k">Fe declarada</span>
                <span className="attr-v">Católico practicante</span>
              </div>
              <div className="attr">
                <span className="attr-k">Fe real</span>
                <span className="attr-v">Sincretismo en negación</span>
              </div>
              <div className="attr">
                <span className="attr-k">Motivación</span>
                <span className="attr-v">Volver con Rosa y sus hijos</span>
              </div>
              <div className="attr">
                <span className="attr-k">Herida</span>
                <span className="attr-v">La muerte de su padre, Dionisio</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── EL TÍO ── */}
        <div className="char-card char-card--tio">
          <div className="char-portrait">
            <img
              src="/assets/ElTio.png"
              alt="El Tío — Señor del Ukhu Pacha"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,4,4,0.75) 0%, transparent 45%)',
              pointerEvents: 'none',
            }} />
            <span className="char-badge char-badge--red">ENTIDAD — SEÑOR DEL UKHU PACHA</span>
          </div>
          <div className="char-info">
            <h3 className="char-name char-name--red">El Tío</h3>
            <p className="char-role">Señor del Ukhu Pacha · El Mundo de Abajo · Siempre estuvo aquí</p>
            <div className="char-sep char-sep--red" />
            <p className="char-bio">
              El Tío no es una leyenda. No es una metáfora cultural. No es el producto de la mente
              hambrienta de un hombre atrapado en la oscuridad.
            </p>
            <p className="char-bio">
              Es tan real como la plata en la roca. Existe antes que la mina, antes que los españoles
              que la abrieron, antes que los incas que la conocían. El Tío ES la montaña — su voluntad,
              su hambre, su código. Y el código es simple: la mina da lo que recibe.
              Si la abandonas, ella te abandona a ti.
            </p>
            <div className="char-attrs">
              <div className="attr">
                <span className="attr-k">Naturaleza</span>
                <span className="attr-v attr-v--red">Deidad real — no metáfora</span>
              </div>
              <div className="attr">
                <span className="attr-k">Carácter</span>
                <span className="attr-v">Justo, impersonal, antiguo</span>
              </div>
              <div className="attr">
                <span className="attr-k">Regla</span>
                <span className="attr-v">La ofrenda correcta siempre funciona</span>
              </div>
              <div className="attr">
                <span className="attr-k">Advertencia</span>
                <span className="attr-v attr-v--red">No engaña. Tampoco perdona el olvido.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── MECÁNICAS ─────────────────────────────────────────────────────────────

const MECANICAS = [
  {
    icon: '◉',
    accentColor: '#c9a84c',
    cardClass: '',
    sepColor: 'rgba(201,168,76,0.3)',
    title: 'La Lámpara de Carburo',
    mechanic: 'Tu única fuente de luz. Gestiona el aceite como gestionas el tiempo.',
    lore: 'Cuando la lámpara se apaga, El Tío empieza a verte de otra manera. La oscuridad no es peligro — es jurisdicción. Sin luz, Santos deja de pertenecer al mundo de arriba. El Tío no distingue entre los vivos y los muertos cuando no puede ver su aliento.',
    img: '/assets/Lampara.png',
    imgAlt: 'Lámpara de carburo',
  },
  {
    icon: '◈',
    accentColor: '#4a7c59',
    cardClass: 'mec-card--green',
    sepColor: 'rgba(74,124,89,0.4)',
    title: 'Las Hojas de Coca',
    mechanic: 'Masticadas lentamente, anclan la mente en lo real. Sin ellas, la cordura se deshace.',
    lore: 'La coca no distorsiona la realidad — la aclara. En la tradición andina abre el akhulli: el estado de percepción ampliada. Santos no está alucinando cuando ve cosas en la oscuridad. Está viendo demasiado. La cordura es saber cuándo dejar de mirar.',
    img: '/assets/BolsaDeCoca.png',
    imgAlt: "Ch'uspa — Bolsa de hojas de coca",
  },
  {
    icon: '◆',
    accentColor: '#8b1a1a',
    cardClass: 'mec-card--red',
    sepColor: 'rgba(139,26,26,0.5)',
    title: 'El Ritual de Ofrendas',
    mechanic: 'Singani, cigarros, coca. Cada ofrenda correcta abre un camino.',
    lore: 'El Tío no habla. No aparece. No amenaza. Pero la mina responde: un túnel cerrado tiene corriente de aire. Una roca que bloqueaba el paso amanece corrida. El trato funciona. Siempre funcionó. Santos lo sabía — solo que no quería saberlo.',
    img: '/assets/cigarros.png',
    imgAlt: 'Cigarros artesanales — ofrenda al Tío',
  },
]

function Mecanicas() {
  return (
    <div className="mecanicas-wrap" id="mecanicas">
      <div className="section">
        <div className="section-label">// III — El Sistema de Supervivencia</div>
        <h2 className="section-title">El <em>Pacto</em></h2>
        <p className="section-desc">En la Bocamina 7, cada decisión tiene nombre en aymara.</p>

        <div className="mecanicas-grid">
          {MECANICAS.map((m) => (
            <div key={m.title} className={`mec-card ${m.cardClass}`}>
              <span className="mec-icon" style={{ color: m.accentColor }}>{m.icon}</span>
              <h3 className="mec-title">{m.title}</h3>
              <p className="mec-mechanic">{m.mechanic}</p>
              <div className="mec-sep" style={{ background: m.sepColor }} />
              <p className="mec-lore">{m.lore}</p>
              <div className="mec-art">
                <img
                  src={m.img}
                  alt={m.imgAlt}
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TIMELINE ──────────────────────────────────────────────────────────────

const ACTOS = [
  {
    num: 'I', dotClass: 'tl-dot--gold', actClass: 'tl-act--gold', titleClass: 'tl-title--gold',
    titulo: 'El Derrumbe', tiempo: 'Hora 0 — Hora 1',
    texto: 'Santos reza. El Padre Nuestro, tres veces. La oscuridad no responde. Por primera vez en su vida adulta, siente que nadie lo escucha. Caminando a tientas encuentra un santuario antiguo tallado en roca natural — más viejo que la mina, más viejo que la ciudad. Los ojos de cuarzo rojo del Tío brillan solos, sin fuente de luz. Santos siente algo que no quiere nombrar: presencia.',
  },
  {
    num: 'II', dotClass: 'tl-dot--red', actClass: 'tl-act--red', titleClass: 'tl-title--red',
    titulo: 'El Trato', tiempo: 'Hora 1 — Hora 8',
    texto: 'Por desesperación — no por fe — Santos deja las hojas de coca ante el Tío. El túnel que estaba cerrado tiene corriente de aire. Funcionó. No puede negarlo. El segundo pilar de su racionalidad cae. Por primera vez en 14 años piensa en Dionisio — en cómo le explicaba el Tío no con misticismo sino con la misma voz técnica con que explicaba cómo usar el martillo: "Es una herramienta, hijo. Hay que saber usarla."',
  },
  {
    num: 'III', dotClass: 'tl-dot--gold', actClass: 'tl-act--gold', titleClass: 'tl-title--gold',
    titulo: 'El Pacto', tiempo: 'Hora 8 — Hora 12',
    texto: 'Santos llega al santuario más profundo — el original. Deja las últimas ofrendas. Esta vez no por miedo, sino porque quiere. La mina respira. Comprende la última cosa: el Tío no mató a su padre. Lo protegió durante 40 años. El día que murió Dionisio, fue rápido. El Tío cumplió. Santos sale a la superficie con dos cosas en el bolsillo: una piedra del santuario, y la cruz de plata. No elige entre las dos. Las guarda a las dos.',
  },
]

function Timeline() {
  return (
    <section className="section" id="arco">
      <div className="section-label">// IV — Las Doce Horas</div>
      <h2 className="section-title">Una línea de tiempo <em>del alma</em></h2>
      <div className="timeline">
        {ACTOS.map((a, i) => (
          <div key={a.num} className="tl-item">
            <div className="tl-connector">
              <div className={`tl-dot ${a.dotClass}`} />
              {i < ACTOS.length - 1 && <div className="tl-line" />}
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

// ─── GALERÍA ───────────────────────────────────────────────────────────────

// 9 assets = 9 slots exactos
const SLOTS = [
  { span: 'wide',   src: '/assets/MineroFullBody.png', alt: 'El Minero — Cuerpo completo',        label: 'EL MINERO — BOCETO FRONTAL',    sub: 'Avatar · Vista frontal' },
  { span: 'tall',   src: '/assets/ElTio.png',          alt: 'El Tío — Deidad del subsuelo',        label: 'EL TÍO — BOCETO FRONTAL',       sub: 'Entidad · Vista frontal' },
  { span: 'normal', src: '/assets/ManosMinero.png',    alt: 'Manos del minero — Vista FPS',        label: 'EL MINERO — MANOS FPS',         sub: 'Avatar · Primera persona' },
  { span: 'normal', src: '/assets/Lampara.png',        alt: 'Lámpara de carburo',                  label: 'LÁMPARA DE CARBURO',            sub: 'Prop · Herramienta de luz' },
  { span: 'normal', src: '/assets/BolsaDeCoca.png',    alt: "Ch'uspa — Bolsa de coca",             label: "CH'USPA — BOLSA DE COCA",       sub: 'Prop · Mecánica de cordura' },
  { span: 'normal', src: '/assets/cigarros.png',       alt: 'Cigarros artesanales',                label: 'CIGARROS ARTESANALES',          sub: 'Prop · Ofrenda al Tío' },
  { span: 'normal', src: '/assets/Singani.png',        alt: 'Botella de Singani',                  label: 'BOTELLA DE SINGANI',            sub: 'Prop · Ofrenda al Tío' },
  { span: 'wide',   src: '/assets/Cueva.png',          alt: 'Caverna — Kit modular',               label: 'KIT CAVERNA — MÓDULO RECTO',    sub: 'Entorno · Túnel minero' },
  { span: 'normal', src: '/assets/MesaOfrenda.png',    alt: 'Santuario — Mesa de ofrendas',        label: 'SANTUARIO DE EL TÍO',           sub: 'Entorno · Escena completa' },
]

function Galeria() {
  return (
    <section className="section" id="arte">
      <div className="section-label">// V — Arte Conceptual y Bocetos</div>
      <h2 className="section-title">Los <em>Assets</em></h2>
      <p className="section-desc">
        Todos los elementos del MVP visual — personajes, props y entornos — en estilo
        low poly estilizado. Fondo negro puro, luz ámbar desde abajo.
      </p>

      <div className="gallery-grid">
        {SLOTS.map((s, i) => (
          <div key={i} className={`g-slot g-slot--${s.span}`}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: s.span === 'wide' ? '280px' : s.span === 'tall' ? '100%' : '200px' }}>
              <img
                src={s.src}
                alt={s.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 'inherit' }}
              />
              {/* Overlay oscuro con caption */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(6,6,8,0.85) 0%, transparent 100%)',
                padding: '1.5rem 1rem 0.75rem',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.16em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(232,220,200,0.4)' }}>
                  {s.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── EL MUNDO ──────────────────────────────────────────────────────────────

const STATS_MUNDO = [
  { val: '4.782m', lbl: 'Altitud del Cerro Rico' },
  { val: '+470', lbl: 'Años de extracción continua' },
  { val: '~15K', lbl: 'Mineros activos hoy' },
  { val: '8–15M', lbl: 'Vidas cobradas, 1545–1800' },
  { val: '4.090m', lbl: 'Altitud de la ciudad de Potosí' },
  { val: '12H', lbl: 'Duración del juego' },
]

function ElMundo() {
  return (
    <div className="mundo-wrap" id="mundo">
      <div className="section">
        <div className="section-label">// VI — El Contexto Real</div>
        <h2 className="section-title">El Cerro que se <em>Come a los Hombres</em></h2>
        <div className="mundo-grid">
          <div>
            <p className="body-text">
              El Cerro Rico de Potosí es la montaña más letal de la historia humana. Se estima que entre
              8 y 15 millones de personas murieron extrayendo su plata entre 1545 y 1800 — una cifra que
              hace palidecer a cualquier guerra del período.
            </p>
            <p className="body-text">
              Los mineros que trabajan hoy en sus galerías saben esto. Lo saben y bajan igual, cada mañana,
              con su lámpara y su coca y su fe dividida entre el Cristo de la Catedral y el Tío de la mina.
              No como contradicción — como necesidad. La montaña tiene dos señores y ambos cobran.
            </p>
            <p className="body-text">
              El Tío existe en cada bocamina activa del Cerro Rico. Hay estatuas suyas talladas en la roca
              desde hace siglos. Se le ofrece coca el primer viernes de cada mes — la ch'alla. Los mineros
              que no respetan la tradición tienen más accidentes. Nadie lo puede probar. Nadie lo duda.
            </p>
            <p className="body-text body-text--em">
              El Pacto del Tío no es fantasía. Es documentación con polígonos.
            </p>
          </div>
          <div className="mundo-stats">
            {STATS_MUNDO.map(s => (
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

// ─── TEMAS ─────────────────────────────────────────────────────────────────

const TEMAS = [
  {
    icon: '✝',
    titulo: 'Sincretismo Religioso Boliviano',
    texto: 'Bolivia es el único lugar donde el Cristo de la Catedral y el Tío de la mina coexisten en la misma persona sin contradicción. La historia no elige bando — muestra esa coexistencia como lo que es: real, compleja, y profundamente boliviana.',
  },
  {
    icon: '⛓',
    titulo: 'La Herencia Rechazada',
    texto: 'Santos pasó 14 años llamando "superstición" a algo que su padre trataba con el mismo respeto técnico que una herramienta. La mina lo obliga a terminar ese duelo. Recuperar la tradición no es regresión — es completar algo que quedó roto.',
  },
  {
    icon: '⚖',
    titulo: 'Justicia Como Espiritualidad',
    texto: 'El Tío no pide fe ciega — pide cumplimiento honesto. No puedes rezar sin ofrenda, no puedes creer a medias, no puedes fingirlo. La justicia es más dura que la misericordia, y más justa que el milagro.',
  },
  {
    icon: '🕯',
    titulo: 'El Luto Mal Procesado',
    texto: 'Cuando Dionisio Mamani murió, Santos culpó al Tío en silencio. En la oscuridad comprende que confundió el contrato: el Tío le dio 40 años de trabajo sin accidente grave a su padre. El día que murió, fue rápido. El Tío cumplió su parte.',
  },
]

function Temas() {
  return (
    <section className="section" id="temas">
      <div className="section-label">// VII — Lo que está debajo de la historia</div>
      <h2 className="section-title">Los <em>Temas</em></h2>
      <p className="section-desc">
        El Pacto del Tío es un juego sobre Bolivia. Sobre fe. Sobre lo que heredamos y lo que rechazamos.
      </p>
      <div className="temas-grid">
        {TEMAS.map(t => (
          <div key={t.titulo} className="tema-card">
            <span className="tema-icon">{t.icon}</span>
            <h3 className="tema-title">{t.titulo}</h3>
            <p className="tema-text">{t.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── FOOTER ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-title">El Pacto del Tío</span>
        <span className="footer-sub">Survival Horror · Potosí, Bolivia · En desarrollo</span>
      </div>
      <span className="footer-copy">Proyecto Hackathon 2025</span>
      <div className="footer-links">
        <a href="#historia">Historia</a>
        <a href="#personajes">Personajes</a>
        <a href="#mecanicas">El Pacto</a>
        <a href="#arte">Arte</a>
        <a href="#mundo">El Mundo</a>
      </div>
    </footer>
  )
}

// ─── ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <div className="noise" />
      <div className="stripe-bg" />
      <div className="app">
        <Navbar />
        <Hero />
        <Divider />
        <Sinopsis />
        <Divider />
        <Personajes />
        <Mecanicas />
        <Divider />
        <Timeline />
        <Divider />
        <Galeria />
        <ElMundo />
        <Divider />
        <Temas />
        <Footer />
      </div>
    </>
  )
}