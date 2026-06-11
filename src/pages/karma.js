import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── PALETTE (from Karma Trio EPK) ───────────────────
const K = { dark: '#080504', gold: '#c8a05a', cream: '#f2ebd9', off: '#fdfaf4', tan: '#a89880' }

const ACCESS_CODE = 'karma2026'

// ─── VARIANTS ─────────────────────────────────────────
const stamp   = { hidden: { opacity:0, scale:1.6, rotate:-4 }, visible: { opacity:1, scale:1, rotate:0, transition:{ type:'spring', stiffness:280, damping:18 } } }
const wipe    = { hidden: { clipPath:'inset(0 100% 0 0)' }, visible: { clipPath:'inset(0 0% 0 0)', transition:{ duration:0.7, ease:[0.77,0,0.18,1] } } }
const dropHard= { hidden: { opacity:0, y:-80 }, visible: { opacity:1, y:0, transition:{ type:'spring', stiffness:500, damping:28 } } }
const fadeUp  = { hidden: { opacity:0, y:50 }, visible: { opacity:1, y:0, transition:{ duration:0.6, ease:'easeOut' } } }
const burst   = { hidden: { scale:0, opacity:0 }, visible: { scale:1, opacity:1, transition:{ type:'spring', stiffness:600, damping:14 } } }
const sg      = (d=0.1) => ({ hidden:{}, visible:{ transition:{ staggerChildren:d } } })

// ─── HELPERS ──────────────────────────────────────────
function Scene({ children, style={} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'}
      variants={sg(0.1)} style={style}>
      {children}
    </motion.div>
  )
}

function Rule({ color=K.gold, my='2rem' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  return <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'}
    variants={wipe} style={{ height:1.5, background:color, margin:`${my} 0`, originX:0 }} />
}

function Tag({ n, label, light=false }) {
  return (
    <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.5rem' }}>
      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.3em',
        color: light ? K.off : K.gold, border:`1px solid ${light?K.off:K.gold}`, padding:'3px 8px', opacity:0.8 }}>
        {n}
      </span>
      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.25em',
        color: light ? 'rgba(242,235,217,0.5)' : 'rgba(200,160,90,0.6)', textTransform:'uppercase' }}>
        {label}
      </span>
    </motion.div>
  )
}

function Marquee({ text, color=K.gold, bg='transparent' }) {
  const rep = Array(8).fill(text).join('  ◆  ')
  return (
    <div style={{ overflow:'hidden', background:bg, padding:'10px 0' }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:22, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap' }}>
        {[0,1].map(k=>(
          <span key={k} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.3em', color, paddingRight:'4rem' }}>{rep}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────
const PROGRAMME = [
  { n:'01', title:'A Night in Tunisia',            credit:'D. Gillespie' },
  { n:'02', title:'Karma Blues',                   credit:'Karma Trio',   original:true },
  { n:'03', title:'Dos Gardenias',                 credit:'Isolina Carrillo' },
  { n:'04', title:'Nardis',                        credit:'Miles Davis' },
  { n:'05', title:'Coffee Blues',                  credit:'A. Someillan', original:true },
  { n:'06', title:'Invitation',                    credit:'B. Kaper' },
  { n:'07', title:'Besame Mucho',                  credit:'C. Velázquez' },
  { n:'08', title:'Black Narcissus',               credit:'A. Someillan', original:true },
  { n:'09', title:'Quizás Quizás Quizás',          credit:'Osvaldo Farrés' },
  { n:'10', title:'Andando en Polaquito',          credit:'A. Someillan', original:true },
]

const MUSICIANS = [
  {
    img:'/images/karma/aniel-someillan.jpg', objectPosition:'65% 40%',
    instrument:'DOUBLE BASS', name:'Aniel Someillan', origin:'CUBA · POLAND',
    bio:"Cuban-born double bassist and composer based in Warsaw. A graduate of the Amadeo Roldán Music Conservatory in Havana, Someillan has built an international career at the crossroads of Afro-Cuban jazz, son cubano and contemporary improvised music.",
    bio2:"MJAF laureate at the 41st Festival Internacional Jazz Plaza, Havana 2026 — performing alongside Rodney Barreto, Yilian Cañizares, Harold López Nussa and Héctor Quintana. Winner, Jazz Junior Competition 2022. Montreux Jazz Academy 2023. Stage credits include Giovanni Hidalgo, Daymé Arocena, Shabaka Hutchings, Amaro Freitas, Shai Maestro and Roberto Carcassés.",
    badges:['JAZZ PLAZA 2026','MONTREUX 2023','JAZZ JUNIOR 2022'],
  },
  {
    img:'/images/karma/shahar-elatan.jpg', objectPosition:'53% 22%',
    instrument:'GUITAR', name:'Shahar Elatan', origin:'ISRAEL · INTERNATIONAL',
    bio:"Born in Jerusalem in 1993 into a family of musicians, Shahar Elatan began his guitar studies at the age of six under his father, guitarist Zohar Elnatan. At seventeen, he moved to New York to study under masters including Peter Bernstein, Lage Lund, Gilad Hekselman and Ari Hoenig.",
    bio2:"A laureate of the Israeli-American Cultural Foundation and winner of the Rimon School Jazz Competition, Elatan has performed at the IASJ conference in Graz and released his debut album One World (Razdaz Recordz, 2016) — co-produced with bassist Avishai Cohen. Active across New York, Berlin and Tel Aviv, his playing bridges jazz tradition with Mediterranean lyricism and world music colour.",
    badges:['IACF AWARD','AVISHAI COHEN','NYC / BERLIN'],
  },
  {
    img:'/images/karma/adriano-brizuela.jpg', objectPosition:'center 22%',
    instrument:'DRUMS & PERCUSSION', name:'Adriano Brizuela', origin:'"EL FRESCO" · CUBA · POLAND',
    bio:"Born in Florida, Camagüey, Cuba (1997), Adriano Brizuela trained at the Luis Casas Romero School of Art and graduated from the Conservatorio de Música de Camagüey in symphonic percussion and popular Cuban music — where he founded and directed the timba ensemble Timba a Media.",
    bio2:"His career spans international Latin jazz — including the award-winning ensemble Maracujazz and an EGREM studio recording with the Orquesta Maravilla de Florida. He represented Cuba at Festival Internacional Jojazz 2015. Based in Poland since 2021, he performs with José Torres y Habana Dreams and Rey Ceballo y Tripulación Cubana across Europe. As a solo artist, El Fresco released \"Confieso\" (2024) and \"Almas Gemelas\" (2025).",
    badges:['JOJAZZ 2015','EGREM','MARACUJAZZ','WARSAW'],
  },
]

const CREDENTIALS = [
  { year:'2026', title:'Festival Internacional Jazz Plaza, Havana', sub:'MJAF Laureate concert, 41st edition' },
  { year:'2023', title:'Montreux Jazz Academy', sub:'Invited by the Montreux Jazz Artist Foundation' },
  { year:'2022', title:'Jazz Junior Competition', sub:'1st Place, Kraków, Poland' },
  { year:'2021', title:'Radio Katowice Young Talents', sub:'Winner' },
]

// ─── ACCESS GATE ──────────────────────────────────────
function AccessGate({ onUnlock }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      sessionStorage.setItem('karma_access', '1')
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:K.dark,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'2rem', fontFamily:"'EB Garamond',serif" }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
        style={{ textAlign:'center', maxWidth:380, width:'100%' }}>
        <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.4em', color:K.gold, marginBottom:'1.5rem' }}>
          ELECTRONIC PRESS KIT · 2026
        </div>
        <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2rem,8vw,3rem)', color:K.off, letterSpacing:'0.06em', marginBottom:'2rem' }}>
          KARMA TRIO
        </div>
        <div style={{ height:1, background:K.gold, opacity:0.4, marginBottom:'2rem' }} />
        <p style={{ color:K.tan, fontSize:'0.95rem', lineHeight:1.7, marginBottom:'2rem' }}>
          This is a private press kit. Enter the access code provided by Aniel Someillan to continue.
        </p>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value); setError(false) }}
            placeholder="ACCESS CODE"
            style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.8rem', letterSpacing:'0.2em',
              textAlign:'center', textTransform:'uppercase', padding:'1rem', background:'transparent',
              border:`1px solid ${error ? '#c44' : K.gold}`, color:K.off, outline:'none' }}
          />
          {error && (
            <div style={{ color:'#d96a4a', fontSize:'0.8rem', letterSpacing:'0.1em' }}>Incorrect code — please try again.</div>
          )}
          <button type="submit" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.25em',
            padding:'0.9rem 2rem', background:K.gold, color:K.dark, border:'none', cursor:'pointer' }}>
            ENTER
          </button>
        </form>
        <Link href="/" style={{ display:'inline-block', marginTop:'2rem', fontFamily:"'Alfa Slab One',serif",
          fontSize:'0.55rem', letterSpacing:'0.25em', color:K.tan, textDecoration:'none', opacity:0.6 }}>
          ← BACK TO ANIELSOMEILLAN.COM
        </Link>
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
export default function Karma() {
  const [unlocked, setUnlocked] = useState(false)
  const [checked, setChecked]   = useState(false)
  const [gone, setGone]         = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('karma_access') === '1') setUnlocked(true)
    setChecked(true)
  }, [])

  useEffect(() => {
    if (!unlocked) return
    const tm = setTimeout(()=>setGone(true), 2200)
    return ()=>clearTimeout(tm)
  }, [unlocked])

  if (!checked) return <div style={{ position:'fixed', inset:0, background:K.dark }} />
  if (!unlocked) return <AccessGate onUnlock={()=>setUnlocked(true)} />

  return (
    <>
      <Head>
        <title>Karma Trio — Electronic Press Kit | Aniel Someillan</title>
        <meta name="description" content="Karma Trio — Afro-Cuban jazz trio led by Aniel Someillan. Electronic Press Kit." />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:${K.dark};overflow-x:hidden}
          .karma::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:900;
            background:repeating-linear-gradient(transparent 0,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)}
          .karma::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:901;
            background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.45) 100%)}
          .grain::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.055;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")}
          @keyframes flicker{0%,97%,100%{opacity:1}98%{opacity:.88}99%{opacity:.95}}
          .flicker{animation:flicker 6s infinite}
          @keyframes pd{0%,100%{opacity:1}50%{opacity:0}}
          .rec{animation:pd 1s infinite}
          .musician-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
          @media(max-width:800px){
            .musician-grid{grid-template-columns:1fr!important}
            .programme-grid{grid-template-columns:1fr!important}
            .credentials-grid{grid-template-columns:1fr!important}
          }
        `}</style>
      </Head>

      {/* ── INTRO ───────────────────────────────────── */}
      <AnimatePresence>
        {!gone && (
          <motion.div exit={{ opacity:0 }} transition={{ duration:0.25 }}
            style={{ position:'fixed', inset:0, zIndex:9999, background:K.dark,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
              style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="rec" style={{ display:'block', width:10, height:10, borderRadius:'50%', background:K.gold }} />
              <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.4em', color:K.gold }}>ON AIR</span>
            </motion.div>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:[0,1,1,1,0] }}
              transition={{ duration:1.6, delay:0.4, times:[0,0.1,0.5,0.9,1] }}
              style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2.5rem,9vw,5rem)', color:K.off, lineHeight:1, letterSpacing:'0.06em' }}>KARMA TRIO</motion.div>
            <motion.div initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
              transition={{ delay:0.6, duration:0.8 }}
              style={{ width:120, height:1, background:K.gold, originX:0 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="karma flicker" style={{ fontFamily:"'EB Garamond',serif", color:K.cream }}>

        {/* ── NAV BAR ─────────────────────────────── */}
        <div style={{ position:'fixed', top:'1.25rem', left:'1.5rem', right:'1.5rem', zIndex:800,
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
            letterSpacing:'0.25em', color:K.gold, textDecoration:'none', opacity:0.6 }}>
            ← BACK
          </Link>
          <div style={{ display:'flex', gap:'0.6rem' }}>
            <Link href="/karma/gallery"
              style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
              letterSpacing:'0.2em', color:K.gold, textDecoration:'none', opacity:0.7,
              border:`1px solid ${K.gold}`, padding:'4px 10px' }}>
              PHOTO GALLERY
            </Link>
            <a href="/images/karma/KarmaTrio_EPK_2026.pdf" download
              style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
              letterSpacing:'0.2em', color:K.gold, textDecoration:'none', opacity:0.7,
              border:`1px solid ${K.gold}`, padding:'4px 10px' }}>
              DOWNLOAD PDF
            </a>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            S1 — HERO
        ════════════════════════════════════════════ */}
        <section className="grain" style={{ position:'relative', minHeight:'100vh',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          overflow:'hidden', padding:'6rem 2rem 4rem' }}>
          <Image src="/images/karma/aniel-someillan.jpg" alt="Karma Trio" fill priority
            style={{ objectFit:'cover', objectPosition:'center 30%', filter:'sepia(20%) brightness(22%) contrast(1.2)', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1,
            background:`linear-gradient(to bottom,${K.dark}cc 0%,rgba(8,5,4,.55) 50%,${K.dark}cc 100%)` }} />
          <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:800 }}>
            <Scene>
              <Tag n="EPK · 2026" label="Presenting" light />
              <motion.div variants={wipe} style={{ height:1.5, background:K.gold, marginBottom:'2.5rem', originX:0.5 }} />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.7rem,2vw,0.9rem)', letterSpacing:'0.4em', color:K.gold, marginBottom:'1rem' }}>
                AFRO-CUBAN JAZZ · CONTEMPORARY IMPROVISATION
              </motion.p>
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(3.5rem,12vw,8rem)', color:K.off, letterSpacing:'0.04em', lineHeight:1.0, marginBottom:'0.2em' }}>KARMA</motion.div>
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(3.5rem,12vw,8rem)', color:K.gold, letterSpacing:'0.04em', lineHeight:1.0 }}>TRIO</motion.div>
              <motion.div variants={wipe} style={{ height:1.5, background:K.cream, opacity:0.3, margin:'2rem auto', originX:0.5, maxWidth:500 }} />
              <motion.p variants={fadeUp} style={{ fontSize:'clamp(1rem,2.5vw,1.3rem)', color:K.cream, fontStyle:'italic',
                lineHeight:1.7, marginBottom:'2.5rem' }}>
                Three voices. One language.<br/>Rooted in Havana, refined by the world.
              </motion.p>
              <motion.div variants={fadeUp} style={{ display:'inline-block', padding:'6px 18px',
                border:`1px solid ${K.gold}`, marginBottom:'2.5rem' }}>
                <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
                  letterSpacing:'0.25em', color:K.gold }}>LIVE · 75 MIN · SINGLE SET</span>
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize:'0.7rem', letterSpacing:'0.3em',
                color:'rgba(242,235,217,0.4)', fontFamily:"'Alfa Slab One',serif" }}>↓ SCROLL</motion.div>
            </Scene>
          </div>
        </section>

        <Marquee text="DOUBLE BASS · GUITAR · DRUMS & PERCUSSION · SON CUBANO · RUMBA · CHANGÜÍ · HAVANA · TEL AVIV · WARSAW"
          color={K.gold} bg={K.dark} />

        {/* ════════════════════════════════════════════
            S2 — THE CONCEPT
        ════════════════════════════════════════════ */}
        <section style={{ background:K.dark, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <Scene>
              <Tag n="01" label="The Concept" light />
              <Rule />
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(2rem,6vw,3.5rem)', color:K.off, lineHeight:1.1, marginBottom:'2rem' }}>
                Afro-Cuban Jazz<br/>in Three Voices
              </motion.div>
              <motion.p variants={fadeUp} style={{ fontSize:'1.1rem', lineHeight:1.85, color:'rgba(242,235,217,0.75)', marginBottom:'1.5rem' }}>
                Karma Trio is a meeting of three distinct musical worlds — Cuban roots, Mediterranean lyricism, and Latin
                virtuosity — channelled through the shared language of jazz improvisation. Built around the interplay of
                double bass, guitar, and drums and percussion, the trio explores the ancestral rhythmic vocabulary of son
                cubano, rumba and changüí alongside original compositions that push that tradition into contemporary territory.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize:'1.1rem', lineHeight:1.85, color:'rgba(242,235,217,0.75)', marginBottom:'2.5rem' }}>
                The name Karma reflects the trio&apos;s core conviction: that the music you have received shapes the music
                you give back. Drawing on the deep wells of Afro-Cuban tradition — from the innovations of Cachao and Frank
                Emilio Flynn to the fire of Irakere and Celia Cruz — and filtered through each musician&apos;s individual
                journey across Havana, Tel Aviv, Warsaw and beyond, Karma Trio presents a programme both deeply rooted and
                entirely of the present moment.
              </motion.p>
              <motion.div variants={fadeUp} style={{ padding:'1.75rem 2rem', borderLeft:`3px solid ${K.gold}`,
                background:'rgba(200,160,90,0.06)' }}>
                <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:K.cream, fontStyle:'italic', marginBottom:'1rem' }}>
                  &quot;At the heart of this sonic journey is an artist of instinctive innovation and boundless curiosity —
                  crafting a musical tapestry as nuanced as it is compelling. A radiant fusion where harmony, melody, and
                  rhythm unfold with poetic elegance.&quot;
                </p>
                <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.25em', color:K.gold }}>
                  — ANIEL SOMEILLAN, PROJECT STATEMENT
                </div>
              </motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S3 — PROGRAMME
        ════════════════════════════════════════════ */}
        <section style={{ background:K.cream, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <Scene>
              <Tag n="02" label="Proposed Programme" />
              <Rule color={K.gold} />
              <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(1.6rem,5vw,2.8rem)', color:K.dark, lineHeight:1.1, marginBottom:'1rem' }}>
                Concert — 75 Minutes<br/>Single Set
              </motion.div>
              <motion.p variants={fadeUp} style={{ fontSize:'1rem', color:'rgba(8,5,4,0.6)', marginBottom:'2.5rem', lineHeight:1.7 }}>
                Programme is indicative and fully adaptable. All performances include extended improvisation.
                No intermission · Full technical rider available on request.
              </motion.p>
              <motion.div variants={sg(0.06)}>
                {PROGRAMME.map(track=>(
                  <motion.div key={track.n} variants={wipe} style={{ display:'grid',
                    gridTemplateColumns:'3.5rem 1fr auto', gap:'0 1.5rem', alignItems:'center',
                    padding:'1rem 0', borderBottom:'1px solid rgba(8,5,4,0.1)' }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1rem', color:K.gold }}>{track.n}</span>
                    <div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif",
                        fontSize:'clamp(1rem,2.6vw,1.4rem)', color:K.dark, letterSpacing:'0.02em', lineHeight:1.2 }}>{track.title}</div>
                      <div style={{ fontSize:'0.85rem', color:'rgba(8,5,4,0.5)', fontStyle:'italic', marginTop:3 }}>{track.credit}</div>
                    </div>
                    {track.original && (
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.15em',
                        color:K.gold, border:`1px solid ${K.gold}`, padding:'4px 8px', whiteSpace:'nowrap' }}>ORIGINAL</div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </Scene>
          </div>
        </section>

        <Marquee text="JAZZ PLAZA HAVANA 2026 · MONTREUX JAZZ ACADEMY 2023 · JAZZ JUNIOR KRAKÓW 2022 · RADIO KATOWICE YOUNG TALENTS 2021"
          color={K.dark} bg={K.gold} />

        {/* ════════════════════════════════════════════
            S3.5 — LIVE PERFORMANCE VIDEOS
        ════════════════════════════════════════════ */}
        <section style={{ background:K.cream, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <Scene>
              <Tag n="03" label="Live Performance" />
              <Rule color={K.gold} />
              <motion.div variants={fadeUp} style={{ display:'grid', gap:'2rem',
                gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))' }}>
                {[
                  { id:'KgXOH8UFUzI', title:'PAS Trio — Patrick Dobosz, Aniel Someillan & Shahar Elatan' },
                  { id:'e0pLBzbEkC0', title:'Sandunga Mondongo Gandinga — PAS Trio' },
                ].map(v=>(
                  <motion.div key={v.id} variants={fadeUp}>
                    <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', background:K.dark }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
                      />
                    </div>
                    <div style={{ fontSize:'0.85rem', color:'rgba(8,5,4,0.6)', marginTop:'0.75rem', fontStyle:'italic' }}>
                      {v.title}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S4 — THE MUSICIANS
        ════════════════════════════════════════════ */}
        <section style={{ background:K.dark, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <Scene>
              <Tag n="04" label="Three Worlds. One Sound." light />
              <Rule />
            </Scene>
            <Scene>
              <motion.div variants={fadeUp} style={{ position:'relative', width:'100%', maxWidth:560,
                aspectRatio:'4/5', margin:'0 auto 4rem', overflow:'hidden' }}>
                <Image src="/images/karma/karma-trio-stage.jpg" alt="Karma Trio — live on stage"
                  fill style={{ objectFit:'cover', filter:'sepia(15%) contrast(1.05)' }} />
              </motion.div>
            </Scene>
            <div className="musician-grid">
              {MUSICIANS.map(m=>(
                <Scene key={m.name}>
                  <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
                    letterSpacing:'0.3em', color:K.gold, marginBottom:'0.5rem' }}>{m.instrument}</motion.div>
                  <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(1.4rem,3.5vw,2rem)',
                    color:K.off, lineHeight:1.1, marginBottom:'0.4rem' }}>{m.name}</motion.div>
                  <motion.div variants={fadeUp} style={{ fontSize:'0.75rem', letterSpacing:'0.15em', color:K.tan, marginBottom:'1rem' }}>{m.origin}</motion.div>
                  <motion.p variants={fadeUp} style={{ fontSize:'0.95rem', lineHeight:1.75, color:'rgba(242,235,217,0.7)', marginBottom:'1rem' }}>{m.bio}</motion.p>
                  <motion.p variants={fadeUp} style={{ fontSize:'0.95rem', lineHeight:1.75, color:'rgba(242,235,217,0.55)', marginBottom:'1.25rem' }}>{m.bio2}</motion.p>
                  <motion.div variants={sg(0.05)} style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {m.badges.map(b=>(
                      <motion.span key={b} variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                        letterSpacing:'0.15em', color:K.gold, border:`1px solid ${K.gold}`, padding:'4px 8px' }}>{b}</motion.span>
                    ))}
                  </motion.div>
                </Scene>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S5 — CREDENTIALS / TECHNICAL
        ════════════════════════════════════════════ */}
        <section style={{ background:K.gold, padding:'6rem 2rem', overflow:'hidden' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <Scene>
              <Tag n="05" label="Key Credentials" light />
              <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(2rem,6vw,3.5rem)', color:K.dark, lineHeight:1.1, marginBottom:'2.5rem' }}>
                A Pedigree Built<br/>on Stage
              </motion.div>
              <motion.div variants={sg(0.08)} className="credentials-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                {CREDENTIALS.map(c=>(
                  <motion.div key={c.year} variants={stamp} style={{ padding:'1.5rem', border:`2px solid ${K.dark}` }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(1.8rem,4vw,2.5rem)', color:K.dark, lineHeight:1, marginBottom:'0.6rem' }}>{c.year}</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.85rem', color:K.dark, lineHeight:1.4, marginBottom:'0.4rem' }}>{c.title}</div>
                    <div style={{ fontSize:'0.85rem', color:'rgba(8,5,4,0.65)', fontStyle:'italic' }}>{c.sub}</div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.p variants={fadeUp} style={{ fontSize:'1rem', color:'rgba(8,5,4,0.7)', lineHeight:1.7, marginTop:'2.5rem' }}>
                Full stage &amp; production rider available on request — double bass amplification, guitar DI, percussion
                requirements and shared venue provision (PA, monitors, FOH engineer, minimum 60 min soundcheck).
              </motion.p>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S6 — CLOSING / CONTACT
        ════════════════════════════════════════════ */}
        <section className="grain" style={{ position:'relative', background:K.dark,
          padding:'7rem 2rem 6rem', overflow:'hidden' }}>
          <Image src="/images/karma/adriano-brizuela.jpg" alt="Karma Trio live" fill
            style={{ objectFit:'cover', objectPosition:'center 25%', filter:'sepia(40%) brightness(14%) contrast(1.2)', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1, background:'rgba(8,5,4,0.8)' }} />
          <div style={{ position:'relative', zIndex:2, maxWidth:700, margin:'0 auto', textAlign:'center' }}>
            <Scene>
              <Tag n="06" label="Get In Touch" light />
              <motion.div variants={wipe} style={{ height:1.5, background:K.gold, margin:'0 auto 2.5rem', originX:0.5, maxWidth:300 }} />
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(2rem,6vw,4rem)', color:K.off, letterSpacing:'0.06em', marginBottom:'3rem' }}>
                KARMA TRIO
              </motion.div>
              <motion.div variants={sg(0.1)} style={{ marginBottom:'3rem' }}>
                {[
                  { label:'BOOKING',   value:'anielsomeillan@icloud.com', href:'mailto:anielsomeillan@icloud.com' },
                  { label:'WHATSAPP',  value:'+48 784 161 684', href:'tel:+48784161684' },
                  { label:'WEB',       value:'anielsomeillan.com', href:'https://anielsomeillan.com' },
                  { label:'LIVE VIDEO',value:'YouTube — Full Live Set', href:'https://www.youtube.com/live/QtgpURPdVQc' },
                  { label:'MUSIC',     value:'Bandcamp — Ilú', href:'https://anielsomeillan.bandcamp.com' },
                ].map(({label,value,href})=>(
                  <motion.a key={label} href={href} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                    variants={fadeUp} style={{ display:'grid',
                    gridTemplateColumns:'110px 1fr', gap:'0 1rem', padding:'0.6rem 0',
                    borderBottom:'1px solid rgba(242,235,217,0.08)', textAlign:'left', textDecoration:'none' }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                      color:K.gold, letterSpacing:'0.2em', paddingTop:3 }}>{label}</span>
                    <span style={{ fontSize:'1rem', color:'rgba(242,235,217,0.85)' }}>{value}</span>
                  </motion.a>
                ))}
              </motion.div>
              <motion.div variants={wipe} style={{ height:1.5, background:K.gold, margin:'0 auto 2rem', originX:0.5, maxWidth:300 }} />
              <motion.div variants={burst} style={{ display:'inline-flex', alignItems:'center', gap:10,
                border:`1px solid ${K.gold}`, padding:'8px 20px', marginBottom:'2rem' }}>
                <span className="rec" style={{ display:'block', width:8, height:8, borderRadius:'50%', background:K.gold }} />
                <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.35em', color:K.gold }}>
                  ELECTRONIC PRESS KIT · 2026
                </span>
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize:'0.75rem', letterSpacing:'0.1em',
                color:'rgba(242,235,217,0.25)', fontFamily:"'Alfa Slab One',serif" }}>
                CONFIDENTIAL — FOR PROMOTIONAL USE ONLY
              </motion.div>
            </Scene>
          </div>
        </section>

      </div>
    </>
  )
}
