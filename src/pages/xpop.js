import Head from 'next/head'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── PALETTE (matches Memorias / Visual Brief) ──────────
const C = {
  dark: '#110a04',
  paper: '#f2e8d4',
  paperDark: '#e6d8bd',
  terra: '#c4521a',
  green: '#2d5016',
  ink: '#1a0e05',
  inkLight: '#4a2e10',
}

const ACCESS_KEY = 'xpop2026'

// ─── ANIMATION VARIANTS ─────────────────────────────────
const stamp  = { hidden:{ opacity:0, scale:1.6, rotate:-4 }, visible:{ opacity:1, scale:1, rotate:0, transition:{ type:'spring', stiffness:280, damping:18 } } }
const wipe   = { hidden:{ clipPath:'inset(0 100% 0 0)' }, visible:{ clipPath:'inset(0 0% 0 0)', transition:{ duration:0.7, ease:[0.77,0,0.18,1] } } }
const fadeUp = { hidden:{ opacity:0, y:40 }, visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:'easeOut' } } }
const slideL = { hidden:{ opacity:0, x:-40 }, visible:{ opacity:1, x:0, transition:{ duration:0.55, ease:'easeOut' } } }
const sg     = (d=0.1) => ({ hidden:{}, visible:{ transition:{ staggerChildren:d } } })

// ─── SCENE WRAPPER ───────────────────────────────────────
function Scene({ children, style={}, delay=0.05 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'}
      variants={sg(delay)} style={style}>
      {children}
    </motion.div>
  )
}

function Rule({ color=C.terra, my='2rem' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  return <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'}
    variants={wipe} style={{ height:1.5, background:color, margin:`${my} 0`, originX:0 }} />
}

function SectionLabel({ children, light=false, center=false }) {
  return (
    <motion.div variants={fadeUp} style={{
      fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.35em',
      color: light ? 'rgba(242,232,212,0.5)' : C.terra,
      textAlign: center ? 'center' : 'left', marginBottom:'0.75rem',
      textTransform:'uppercase',
    }}>{children}</motion.div>
  )
}

function Marquee({ text }) {
  const rep = Array(6).fill(text).join('  ◆  ')
  return (
    <div style={{ overflow:'hidden', background:C.terra, padding:'10px 0' }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:20, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap' }}>
        {[0,1].map(k=>(
          <span key={k} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.3em', color:C.paper, paddingRight:'3rem' }}>{rep}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── MEMBER CARD ─────────────────────────────────────────
function MemberCard({ name, role, note=null, light=false }) {
  return (
    <motion.div variants={slideL} style={{
      borderTop:`1px solid ${light ? 'rgba(242,232,212,0.2)' : 'rgba(196,82,26,0.25)'}`,
      padding:'1rem 0 1rem',
    }}>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(0.85rem,2vw,1rem)',
        color: light ? C.paper : C.ink, letterSpacing:'0.05em', marginBottom:'0.2rem' }}>{name}</div>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.25em',
        color: light ? C.terra : C.terra, textTransform:'uppercase' }}>{role}</div>
      {note && <div style={{ fontSize:'0.82rem', color: light ? 'rgba(242,232,212,0.5)' : C.inkLight,
        marginTop:'0.25rem', fontStyle:'italic' }}>{note}</div>}
    </motion.div>
  )
}

// ─── SET BLOCK ───────────────────────────────────────────
function SetBlock({ header, title, songs }) {
  return (
    <Scene style={{ marginBottom:'2rem' }}>
      <SectionLabel>{header}</SectionLabel>
      <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1.1rem',
        color:C.ink, marginBottom:'0.75rem', letterSpacing:'0.04em' }}>{title}</motion.div>
      {songs.map(([song, composer]) => (
        <motion.div key={song} variants={fadeUp} style={{ display:'flex', justifyContent:'space-between',
          padding:'0.45rem 0', borderBottom:`1px solid rgba(196,82,26,0.15)`,
          gap:'1rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'1rem', color:C.ink }}>{song}</span>
          <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.15em',
            color:C.terra, opacity:0.8, alignSelf:'center', whiteSpace:'nowrap' }}>{composer}</span>
        </motion.div>
      ))}
    </Scene>
  )
}

// ─── PASSWORD GATE ───────────────────────────────────────
function Gate({ onUnlock }) {
  const [val, setVal]   = useState('')
  const [err, setErr]   = useState(false)
  const [shake, setShake] = useState(false)

  function attempt() {
    if (val.trim() === ACCESS_KEY) { onUnlock() }
    else {
      setErr(true); setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:C.dark, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', padding:'2rem',
      fontFamily:"'EB Garamond',serif" }}>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2rem,8vw,3.5rem)',
        color:C.terra, letterSpacing:'0.05em', marginBottom:'0.5rem', textAlign:'center' }}>
        X POP LATINO
      </div>
      <div style={{ height:1.5, width:200, background:C.terra, margin:'0.75rem auto 0.75rem' }} />
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.35em',
        color:'rgba(242,232,212,0.4)', marginBottom:'3rem', textAlign:'center' }}>
        PRIVATE · CONCERT OFFER
      </div>
      <motion.div animate={shake ? { x:[-8,8,-6,6,-3,3,0] } : {}} transition={{ duration:0.35 }}
        style={{ width:'100%', maxWidth:320 }}>
        <input
          type="password"
          placeholder="Access code"
          value={val}
          onChange={e => { setVal(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{ width:'100%', padding:'0.85rem 1rem', background:'transparent',
            border:`1px solid ${err ? C.terra : 'rgba(242,232,212,0.25)'}`,
            color:C.paper, fontFamily:"'Alfa Slab One',serif", fontSize:'0.7rem', letterSpacing:'0.2em',
            outline:'none', marginBottom:'0.75rem', textAlign:'center' }}
        />
        <button onClick={attempt} style={{ width:'100%', padding:'0.85rem',
          background:C.terra, color:C.paper, border:'none', cursor:'pointer',
          fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.3em' }}>
          ENTER
        </button>
        {err && <div style={{ textAlign:'center', marginTop:'0.75rem', fontSize:'0.85rem',
          color:C.terra, fontStyle:'italic' }}>Incorrect access code</div>}
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
export default function XPopOffer() {
  const [unlocked, setUnlocked] = useState(false)
  const [checked,  setChecked]  = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ok = sessionStorage.getItem('xpop_ok') === '1'
      setUnlocked(ok)
      setChecked(true)
    }
  }, [])

  function unlock() {
    sessionStorage.setItem('xpop_ok', '1')
    setUnlocked(true)
  }

  if (!checked) return null

  return (
    <>
      <Head>
        <title>X Pop Latino — Concert Offer · Warsaw July 11, 2026</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Private concert offer — X Pop Latino, Warsaw, July 11 2026." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }
          body { background:${C.dark}; overflow-x:hidden }
          .xpop::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:900;
            background:repeating-linear-gradient(transparent 0,transparent 3px,rgba(0,0,0,.025) 3px,rgba(0,0,0,.025) 4px) }
          .grain::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:2; opacity:.05;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E") }
          @media(max-width:600px) {
            .members-grid { grid-template-columns: 1fr !important }
            .sets-grid    { grid-template-columns: 1fr !important }
            .fee-row      { flex-direction: column !important; gap: 1.5rem !important }
          }
        `}</style>
      </Head>

      {!unlocked ? <Gate onUnlock={unlock} /> : (
        <div className="xpop" style={{ fontFamily:"'EB Garamond',serif", color:C.paper }}>

          {/* ── NAV ─────────────────────────────────────── */}
          <div style={{ position:'fixed', top:'1.25rem', left:'1.5rem', right:'1.5rem', zIndex:800,
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <a href="/" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
              letterSpacing:'0.25em', color:C.terra, textDecoration:'none', opacity:0.6 }}>
              ← ANIELSOMEILLAN.COM
            </a>
            <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
              letterSpacing:'0.2em', color:'rgba(242,232,212,0.25)' }}>
              PRIVATE · CONFIDENTIAL
            </span>
          </div>

          {/* ══════════════════════════════════════════════
              HERO — SECTION 1
          ══════════════════════════════════════════════ */}
          <section className="grain" style={{ position:'relative', minHeight:'100vh',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            overflow:'hidden', padding:'6rem 2rem 4rem' }}>
            <Image src="/images/xpop/band-hero.jpg" alt="X Pop Latino" fill priority
              style={{ objectFit:'cover', objectPosition:'center 35%',
                filter:'sepia(30%) brightness(22%) contrast(1.2)', zIndex:0 }} />
            <div style={{ position:'absolute', inset:0, zIndex:1,
              background:`linear-gradient(to bottom,${C.dark}aa 0%,rgba(17,10,4,.45) 50%,${C.dark}cc 100%)` }} />
            <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:800 }}>
              <Scene>
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'0.6rem', letterSpacing:'0.4em', color:C.terra, marginBottom:'1.5rem' }}>
                  CONCERT OFFER · PRIVATE
                </motion.div>
                <motion.div variants={wipe} style={{ height:1.5, background:C.terra, marginBottom:'2.5rem', originX:0.5 }} />
                {['X POP', 'LATINO'].map((line, i) => (
                  <motion.div key={i} variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(4rem,13vw,7.5rem)', color:C.paper, letterSpacing:'0.04em', lineHeight:1.0 }}>
                    {line}
                  </motion.div>
                ))}
                <motion.div variants={wipe} style={{ height:1.5, background:C.paper, opacity:0.35,
                  margin:'1.75rem auto', originX:0.5, maxWidth:400 }} />
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(0.8rem,2.5vw,1.2rem)', color:C.paper, letterSpacing:'0.2em', marginBottom:'1.5rem' }}>
                  ANIEL SOMEILLAN
                </motion.div>
                <motion.div variants={fadeUp} style={{ display:'inline-block', padding:'6px 20px',
                  border:`1.5px solid ${C.terra}` }}>
                  <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem',
                    letterSpacing:'0.25em', color:C.terra }}>
                    JULY 11, 2026  ·  WARSAW
                  </span>
                </motion.div>
              </Scene>
            </div>
          </section>

          <Marquee text="SON CUBANO  ·  BOLERO  ·  MAMBO  ·  CHA-CHÁ-CHÁ  ·  GUARACHA  ·  3 SETS  ·  40 MIN EACH" />

          {/* ══════════════════════════════════════════════
              AT A GLANCE — SECTION 2
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.paper, padding:'4rem 2rem', borderTop:`3px solid ${C.terra}` }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel center>The Event at a Glance</SectionLabel>
              </Scene>
              <Rule />
              <Scene style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0px' }}>
                {[
                  { n:'3', label:'SETS OF LIVE MUSIC', body:'Son · Bolero · Mambo\nCha-Chá-Chá · Guaracha' },
                  { n:'40', label:'MINUTES PER SET', body:'2 hours live music\n20-min breaks between sets' },
                  { n:'5', label:'MUSICIANS', body:'Full formation\nSpecial guest vocalist included' },
                ].map(({ n, label, body }) => (
                  <motion.div key={n} variants={fadeUp} style={{ textAlign:'center', padding:'2rem 1rem',
                    borderRight:`1px solid rgba(196,82,26,0.2)` }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2.5rem,6vw,4rem)',
                      color:C.terra, lineHeight:1, marginBottom:'0.4rem' }}>{n}</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                      letterSpacing:'0.25em', color:C.green, marginBottom:'0.75rem' }}>{label}</div>
                    <div style={{ fontSize:'0.9rem', color:C.inkLight, lineHeight:1.7,
                      whiteSpace:'pre-line' }}>{body}</div>
                  </motion.div>
                ))}
              </Scene>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              THE ENSEMBLE — SECTION 3
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.dark, padding:'5rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel light>The Ensemble</SectionLabel>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(2rem,6vw,3.5rem)', color:C.paper, marginBottom:'0.5rem' }}>
                  THE BAND
                </motion.div>
              </Scene>
              <Rule color={C.terra} my="2rem" />

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 2rem' }}
                className="members-grid">
                <Scene delay={0.08}>
                  <MemberCard light name="ANIEL SOMEILLAN" role="Double Bass · Voice · Director"
                    note="MJAF Laureate · Montreux Jazz Academy · Jazz Junior Champion" />
                  <MemberCard light name="CRISTIAN MORA" role="Piano · Voice" />
                  <MemberCard light name="ADRIANO BRIZUELA" role="Congas · Bongos · Percussion" />
                  <MemberCard light name="MICHELLE WELCHONS" role="Congas · Voice" />
                </Scene>
                <Scene delay={0.05}>
                  <motion.div variants={fadeUp} style={{ position:'relative', height:400, marginBottom:'1rem' }}>
                    <Image src="/images/xpop/band-stage.jpg" alt="X Pop Latino on stage"
                      fill style={{ objectFit:'cover', objectPosition:'center center',
                        filter:'sepia(20%) brightness(0.85)' }} />
                    <div style={{ position:'absolute', inset:0,
                      background:`linear-gradient(to top, ${C.dark}99 0%, transparent 50%)` }} />
                  </motion.div>
                  <div style={{ borderTop:`1px solid rgba(196,82,26,0.35)`, paddingTop:'1rem' }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                      letterSpacing:'0.3em', color:'rgba(196,82,26,0.6)', marginBottom:'0.4rem' }}>
                      SPECIAL GUEST
                    </div>
                    <MemberCard light name="YAREMI KORDOS" role="Voice · Classical Guitar"
                      note="Amadeo Roldán alumna · 'Music of Buena Vista' · Club Tropical" />
                  </div>
                </Scene>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              THE EXPERIENCE — SECTION 4 (HAVANA PHOTO)
          ══════════════════════════════════════════════ */}
          <section className="grain" style={{ position:'relative', minHeight:'60vh',
            display:'flex', alignItems:'center', overflow:'hidden', padding:'5rem 2rem' }}>
            <Image src="/images/xpop/havana.jpg" alt="Havana" fill
              style={{ objectFit:'cover', objectPosition:'center 30%',
                filter:'sepia(45%) brightness(25%) contrast(1.1)', zIndex:0 }} />
            <div style={{ position:'absolute', inset:0, zIndex:1,
              background:`linear-gradient(to right, ${C.dark}ee 0%, ${C.dark}88 60%, transparent 100%)` }} />
            <div style={{ position:'relative', zIndex:2, maxWidth:560 }}>
              <Scene>
                <SectionLabel light>The Experience</SectionLabel>
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.8rem,4vw,2.8rem)', color:C.paper, lineHeight:1.15, marginBottom:'1.5rem' }}>
                  Three sets.<br/>One night.<br/>The entire golden age of Cuban music — live.
                </motion.div>
                <Rule color={C.terra} my="1.5rem" />
                <motion.div variants={fadeUp} style={{ fontSize:'1.05rem', lineHeight:1.8,
                  color:'rgba(242,232,212,0.8)', maxWidth:480 }}>
                  X Pop Latino opens with the romantic intimacy of <em>son cubano</em> and <em>bolero</em> —
                  music for the table, for the candlelit room. The second set turns up the heat with
                  <em> mambo</em> and <em>cha-chá-chá</em>. By the finale, the room has been transformed.
                  This is the music that built Latin nightlife — alive, urgent, impossible to resist.
                </motion.div>
              </Scene>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              THE PROGRAMME — SECTION 5
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.paper, padding:'5rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel center>The Programme</SectionLabel>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(2rem,5vw,3rem)', color:C.ink, textAlign:'center', marginBottom:'0.5rem' }}>
                  JULY 11, 2026 · WARSAW
                </motion.div>
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'0.55rem', letterSpacing:'0.3em', color:C.terra, textAlign:'center',
                  marginBottom:'1rem' }}>
                  CUBAN CLASSICS
                </motion.div>
              </Scene>
              <Rule />

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'2rem 3rem' }}
                className="sets-grid">
                <SetBlock
                  header="SET I · 20:00 – 20:40"
                  title="El Son y el Bolero"
                  songs={[
                    ['Chan Chan','Compay Segundo'],
                    ['Guantanamera','Joseíto Fernández'],
                    ['Dos Gardenias','Isolina Carrillo'],
                    ['Bésame Mucho','Consuelo Velázquez'],
                    ['Lágrimas Negras','Miguel Matamoros'],
                    ['Quizás, Quizás, Quizás','Osvaldo Farrés'],
                    ['Bilongo','G. Rodríguez Fiffe'],
                    ['El Cuarto de Tula','Traditional'],
                  ]}
                />
                <SetBlock
                  header="SET II · 21:00 – 21:40"
                  title="Mambo & Cha-Chá-Chá"
                  songs={[
                    ['Mambo Nº5','Pérez Prado'],
                    ['La Engañadora','Enrique Jorrín'],
                    ['El Bodeguero','Richard Egüés'],
                    ['Oye Como Va','Tito Puente'],
                    ['Cachita','Rafael Hernández'],
                    ['El Manisero','Moisés Simons'],
                    ['La Negra Tiene Tumbao','Celia Cruz'],
                    ['Quimbara','Jr. Cepeda / Celia Cruz'],
                  ]}
                />
                <SetBlock
                  header="SET III · 22:00 – 22:40"
                  title="Guaracha & Fuego Final"
                  songs={[
                    ['La Conga','Gloria Estefan'],
                    ['Rhythm Is Gonna Get You','Gloria Estefan'],
                    ['La Isla Bonita','Madonna'],
                    ['Cara Luna','Finale'],
                  ]}
                />
              </div>

              <Scene>
                <motion.div variants={fadeUp} style={{ marginTop:'2rem', padding:'1.25rem 1.5rem',
                  border:`1px solid rgba(196,82,26,0.3)`, background:'rgba(196,82,26,0.04)' }}>
                  <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                    letterSpacing:'0.2em', color:C.terra, marginBottom:'0.4rem' }}>ALSO AVAILABLE</div>
                  <div style={{ fontSize:'0.95rem', color:C.inkLight, lineHeight:1.75 }}>
                    Buena Vista Social Club tribute night · Celia Cruz dedicated programme ·
                    Cuban Bolero Night (intimate format) · Custom themed selections on request
                  </div>
                </motion.div>
              </Scene>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              THE FEE — SECTION 6
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.dark, padding:'5rem 2rem', borderTop:`3px solid ${C.terra}` }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel light center>Fee for This Offer</SectionLabel>
              </Scene>
              <Rule color={C.terra} my="1.5rem" />
              <Scene>
                <motion.div variants={fadeUp} className="fee-row"
                  style={{ display:'flex', alignItems:'center', gap:'3rem', flexWrap:'wrap' }}>
                  <div style={{ flex:'0 0 auto', textAlign:'center', position:'relative',
                    border:`1.5px solid ${C.terra}`, padding:'2rem 2.5rem' }}>
                    <div style={{ position:'absolute', inset:4, border:`0.5px solid ${C.terra}`, opacity:0.3 }} />
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                      letterSpacing:'0.3em', color:C.terra, marginBottom:'0.5rem' }}>THIS OFFER</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2.5rem,8vw,4rem)',
                      color:C.paper, lineHeight:1 }}>8 500</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1.1rem',
                      color:C.terra, letterSpacing:'0.1em' }}>PLN</div>
                    <div style={{ fontSize:'0.8rem', color:'rgba(242,232,212,0.45)',
                      marginTop:'0.4rem', fontStyle:'italic' }}>net · July 11, 2026</div>
                  </div>
                  <div style={{ flex:1, minWidth:260 }}>
                    <ul style={{ listStyle:'none', padding:0 }}>
                      {[
                        'Full formation — 5 musicians',
                        'Special guest Yaremi Kordos included',
                        '3 × 40-minute sets',
                        '50% deposit to confirm · balance on day',
                        'Travel & accommodation (if required) agreed separately',
                        'Technical rider available on request',
                      ].map(item => (
                        <li key={item} style={{ display:'flex', gap:'0.75rem',
                          padding:'0.5rem 0', borderBottom:`1px solid rgba(242,232,212,0.08)`,
                          fontSize:'1rem', color:'rgba(242,232,212,0.75)', lineHeight:1.5 }}>
                          <span style={{ color:C.terra, flexShrink:0 }}>◆</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Scene>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              TECHNICAL BRIEF — SECTION 7
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.paperDark, padding:'4rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel>Technical Requirements</SectionLabel>
              </Scene>
              <Rule />
              <Scene style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}
                className="members-grid">
                <div>
                  {[
                    ['Stage', 'Minimum 4 × 4 m · preferred 5 × 5 m'],
                    ['Piano', 'Grand preferred · Nord Stage acceptable · Nord provided if no house piano'],
                    ['PA', 'Stereo PA for venue · min 800W · subwoofer recommended'],
                    ['Power', '2 × 16A independent circuits'],
                    ['Monitors', '4 wedge monitors (or IEM) · one per musician'],
                    ['Sound engineer', 'Provided by venue · 90-min soundcheck required'],
                    ['Lighting', 'Stage wash minimum · warm tones preferred · no strobes'],
                  ].map(([k,v]) => (
                    <motion.div key={k} variants={fadeUp} style={{ display:'grid',
                      gridTemplateColumns:'120px 1fr', gap:'0.5rem',
                      padding:'0.6rem 0', borderBottom:`1px solid rgba(196,82,26,0.15)`,
                      fontSize:'0.9rem' }}>
                      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                        letterSpacing:'0.15em', color:C.terra, alignSelf:'center' }}>{k}</span>
                      <span style={{ color:C.inkLight, lineHeight:1.55 }}>{v}</span>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'0.55rem', letterSpacing:'0.25em', color:C.green,
                    marginBottom:'0.75rem' }}>CHANNEL LIST</motion.div>
                  {[
                    ['1','Vocal — Aniel Someillan'],
                    ['2','Vocal — Cristian Mora'],
                    ['3','Vocal — Michelle Welchons'],
                    ['4','Vocal — Yaremi Kordos'],
                    ['5','Double Bass DI + DPA 4099 mic'],
                    ['6','Electric Bass DI'],
                    ['7–8','Piano / Keyboard stereo L+R'],
                    ['9','Computer Playback (stereo)'],
                    ['10–11','Congas — Michelle'],
                    ['12','Bongos — Adriano'],
                  ].map(([ch, src]) => (
                    <motion.div key={ch} variants={fadeUp} style={{ display:'grid',
                      gridTemplateColumns:'36px 1fr', gap:'0.5rem',
                      padding:'0.5rem 0', borderBottom:`1px solid rgba(196,82,26,0.12)`,
                      fontSize:'0.85rem', color:C.inkLight }}>
                      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                        color:C.terra, alignSelf:'center' }}>{ch}</span>
                      <span>{src}</span>
                    </motion.div>
                  ))}
                </div>
              </Scene>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              BOOKING — SECTION 8
          ══════════════════════════════════════════════ */}
          <section style={{ background:C.dark, padding:'5rem 2rem 6rem', borderTop:`3px solid ${C.terra}` }}>
            <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
              <Scene>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.5rem,5vw,2.8rem)', color:C.terra, marginBottom:'0.5rem' }}>
                  READY TO CONFIRM
                </motion.div>
                <motion.div variants={fadeUp} style={{ fontSize:'1.05rem',
                  color:'rgba(242,232,212,0.65)', lineHeight:1.8, maxWidth:540, margin:'0 auto 2.5rem' }}>
                  July 11, 2026 · Warsaw.<br/>
                  Contact Aniel directly to confirm availability and secure the date.
                </motion.div>
              </Scene>
              <Rule my="2rem" />
              <Scene>
                {[
                  ['Artist & Director','Aniel Someillan'],
                  ['Email','anielsomeillan@icloud.com'],
                  ['Phone / WhatsApp','+48 784 161 684'],
                  ['Website','www.anielsomeillan.com'],
                  ['Instagram','@anielsomeillan'],
                ].map(([label, val]) => (
                  <motion.div key={label} variants={fadeUp} style={{ display:'grid',
                    gridTemplateColumns:'160px 1fr', gap:'1rem', padding:'0.75rem 0',
                    borderBottom:`1px solid rgba(242,232,212,0.08)`, textAlign:'left',
                    maxWidth:520, margin:'0 auto' }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.52rem',
                      letterSpacing:'0.2em', color:C.terra, alignSelf:'center' }}>{label}</span>
                    <span style={{ fontSize:'1rem', color:'rgba(242,232,212,0.8)' }}>{val}</span>
                  </motion.div>
                ))}
              </Scene>
              <Scene>
                <motion.div variants={fadeUp} style={{ marginTop:'3rem', display:'flex',
                  gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                  <a href="mailto:anielsomeillan@icloud.com"
                    style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                      padding:'1rem 2.5rem', background:C.terra, color:C.paper,
                      textDecoration:'none', display:'inline-block' }}>
                    SEND EMAIL
                  </a>
                  <a href="tel:+48784161684"
                    style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                      padding:'1rem 2.5rem', border:`1.5px solid ${C.terra}`, color:C.terra,
                      textDecoration:'none', display:'inline-block' }}>
                    CALL / WHATSAPP
                  </a>
                </motion.div>
              </Scene>

              <div style={{ marginTop:'5rem', height:1, background:C.terra, opacity:0.3 }} />
              <div style={{ marginTop:'1.5rem', fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem',
                letterSpacing:'0.3em', color:'rgba(242,232,212,0.25)' }}>
                X POP LATINO  ·  CONCERT PROPOSAL  ·  JULY 11 2026  ·  WARSAW  ·  CONFIDENTIAL
              </div>
            </div>
          </section>

        </div>
      )}
    </>
  )
}
