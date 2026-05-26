import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

import enLocale from '../../locales/en.json'
import esLocale from '../../locales/es.json'
import ptLocale from '../../locales/pt.json'
import plLocale from '../../locales/pl.json'

// ─── i18n ─────────────────────────────────────────────
const LOCALES = { en: enLocale.memorias, es: esLocale.memorias, pt: ptLocale.memorias, pl: plLocale.memorias }

export async function getStaticProps({ locale }) {
  return { props: { locale: locale || 'en' } }
}

// ─── PALETTE ──────────────────────────────────────────
const C = { paper: '#f2e8d4', paperDark: '#e6d8bd', dark: '#110a04', terra: '#c4521a', green: '#2d5016', ink: '#1a0e05', inkLight: '#4a2e10' }

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

function Rule({ color=C.terra, my='2rem' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  return <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'}
    variants={wipe} style={{ height:1.5, background:color, margin:`${my} 0`, originX:0 }} />
}

function Tag({ n, label, light=false }) {
  return (
    <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.5rem' }}>
      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.3em',
        color: light ? C.paper : C.terra, border:`1px solid ${light?C.paper:C.terra}`, padding:'3px 8px', opacity:0.8 }}>
        {n}
      </span>
      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.25em',
        color: light ? 'rgba(242,232,212,0.5)' : 'rgba(196,82,26,0.5)', textTransform:'uppercase' }}>
        {label}
      </span>
    </motion.div>
  )
}

function Marquee({ text, color=C.terra, bg='transparent' }) {
  const rep = Array(8).fill(text).join('  ◆  ')
  return (
    <div style={{ overflow:'hidden', background:bg, padding:'10px 0' }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:18, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap' }}>
        {[0,1].map(k=>(
          <span key={k} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.3em', color, paddingRight:'4rem' }}>{rep}</span>
        ))}
      </motion.div>
    </div>
  )
}

function Starburst({ children, size=160, bg=C.terra, color=C.paper }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'} variants={burst}
      style={{ width:size, height:size, flexShrink:0, background:bg, color,
        display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center',
        clipPath:'polygon(50% 0%,54% 21%,73% 5%,68% 25%,89% 16%,79% 34%,100% 32%,85% 47%,100% 57%,82% 62%,93% 79%,73% 76%,79% 95%,60% 86%,57% 100%,46% 83%,38% 100%,35% 84%,16% 95%,22% 76%,2% 79%,13% 62%,0% 57%,16% 47%,0% 32%,21% 34%,11% 16%,32% 25%,27% 5%,46% 21%)' }}>
      {children}
    </motion.div>
  )
}

// ─── AUDIO PREVIEW ────────────────────────────────────
const PREVIEW_TRACKS = [
  { title:'Romance Social',  trackNum:'V',    src:'/audio/romance-social.mp3' },
  { title:'Vienes y te Vas', trackNum:'VIII', src:'/audio/vienes-y-te-vas.mp3' },
]

function AudioPreview() {
  const audioRef   = useRef(null)
  const playingRef = useRef(false)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [playing, setPlaying]         = useState(false)
  const [progress, setProgress]       = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)

  useEffect(() => { playingRef.current = playing }, [playing])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.src = PREVIEW_TRACKS[activeIdx].src
    el.load()
    setProgress(0); setCurrentTime(0)
    if (playingRef.current) el.play().catch(() => {})
  }, [activeIdx])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    playing ? el.pause() : el.play().catch(() => {})
  }

  const seek = (e) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    const r = e.currentTarget.getBoundingClientRect()
    el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration
  }

  const fmt = s => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  }

  return (
    <div>
      <audio ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0) }}
        onTimeUpdate={() => {
          const el = audioRef.current
          if (!el || !el.duration) return
          setProgress(el.currentTime / el.duration)
          setCurrentTime(el.currentTime)
        }}
        onLoadedMetadata={() => { const el = audioRef.current; if (el) setDuration(el.duration) }}
      />

      {/* Track selector */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.75rem' }}>
        {PREVIEW_TRACKS.map((tr, i) => (
          <button key={tr.title}
            onClick={() => i === activeIdx ? toggle() : setActiveIdx(i)}
            style={{
              background: i===activeIdx ? 'rgba(196,82,26,0.15)' : 'rgba(242,232,212,0.04)',
              border:`1px solid ${i===activeIdx ? C.terra : 'rgba(242,232,212,0.1)'}`,
              padding:'1rem 1.25rem', cursor:'pointer', textAlign:'left', transition:'all 0.2s'
            }}>
            <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.3em',
              color: i===activeIdx ? C.terra : 'rgba(242,232,212,0.35)', marginBottom:6 }}>
              TRACK {tr.trackNum}
            </div>
            <div style={{ fontFamily:"'Alfa Slab One',serif",
              fontSize:'clamp(0.9rem,2.5vw,1.25rem)', color: i===activeIdx ? C.paper : 'rgba(242,232,212,0.45)',
              letterSpacing:'0.03em', lineHeight:1.1 }}>{tr.title}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
        <button onClick={toggle} style={{
          width:52, height:52, borderRadius:'50%', flexShrink:0,
          background: playing ? 'transparent' : C.terra,
          border:`2px solid ${C.terra}`, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s'
        }}>
          {playing
            ? <svg width="14" height="16" viewBox="0 0 14 16" fill={C.terra}><rect x="0" y="0" width="4" height="16" rx="1"/><rect x="10" y="0" width="4" height="16" rx="1"/></svg>
            : <svg width="14" height="16" viewBox="0 0 14 16" fill={C.paper}><polygon points="2,0 14,8 2,16"/></svg>
          }
        </button>
        <div style={{ flex:1 }}>
          <div onClick={seek} style={{ height:3, background:'rgba(242,232,212,0.12)',
            cursor:'pointer', position:'relative', marginBottom:8 }}>
            <div style={{ position:'absolute', left:0, top:0, height:'100%',
              width:`${progress*100}%`, background:C.terra, transition:'width 0.1s linear' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
              letterSpacing:'0.15em', color:'rgba(242,232,212,0.4)' }}>{fmt(currentTime)}</span>
            <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
              letterSpacing:'0.15em', color:'rgba(242,232,212,0.25)' }}>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LOCALE SWITCHER ──────────────────────────────────
const LANG_LABELS = { en:'EN', es:'ES', pt:'PT', pl:'PL' }

function LangSwitcher({ currentLocale }) {
  const router = useRouter()
  return (
    <div style={{ display:'flex', gap:8 }}>
      {Object.entries(LANG_LABELS).map(([loc, label]) => (
        <button key={loc}
          onClick={() => router.push('/memorias', '/memorias', { locale: loc })}
          style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.2em',
            color: loc===currentLocale ? C.terra : 'rgba(242,232,212,0.35)',
            background:'none', border:'none', cursor:'pointer', padding:'2px 4px',
            borderBottom: loc===currentLocale ? `1px solid ${C.terra}` : '1px solid transparent',
          }}>
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── CAST DATA (names are static, credits translated) ─
const CAST_KEYS = [
  { name:'ANIEL SOMEILLAN',    creditKey:'aniel',    note:null },
  { name:'ADEL GONZÁLEZ',      creditKey:'adel',     note:null },
  { name:'DAVID ALFARO',       creditKey:'david',    note:null },
  { name:'DAGOBERTO GONZÁLEZ', creditKey:'dagoberto',note:'ORQUESTA ARAGÓN' },
  { name:'JOAQUÍN BETANCOURT', creditKey:'joaquin',  note:null },
  { name:'LUEDJI LUNA',        creditKey:'luedji',   note:null },
  { name:'EDUARDO ESPASANDE  ·  PEPE CISNEROS', creditKey:'guests', note:null },
]

const RHYTHMS = ['GUARACHA','CHA-CHÁ-CHÁ','MAMBO','BOSSA NOVA','CHARANGA','SAMBA']

// ════════════════════════════════════════════════════════
export default function Memorias({ locale: localeProp }) {
  const router       = useRouter()
  const locale       = router.locale || localeProp || 'en'
  const t            = LOCALES[locale] || LOCALES.en
  const [gone, setGone] = useState(false)

  useEffect(() => { const tm = setTimeout(()=>setGone(true), 2400); return ()=>clearTimeout(tm) }, [])

  return (
    <>
      <Head>
        <title>Memorias de Bras Cubas — Aniel Someillan</title>
        <meta name="description" content="Album campaign — Memorias de Bras Cubas by Aniel Someillan. Afro-Cuban jazz." />
        <meta name="robots" content="noindex" />
        {['en','es','pt','pl'].map(l=>(
          <link key={l} rel="alternate" hrefLang={l} href={`https://anielsomeillan.com${l==='en'?'':'/'+l}/memorias`} />
        ))}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:${C.dark};overflow-x:hidden}
          .mem::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:900;
            background:repeating-linear-gradient(transparent 0,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)}
          .mem::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:901;
            background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.45) 100%)}
          .grain::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.055;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")}
          @keyframes flicker{0%,97%,100%{opacity:1}98%{opacity:.88}99%{opacity:.95}}
          .flicker{animation:flicker 6s infinite}
          @keyframes pd{0%,100%{opacity:1}50%{opacity:0}}
          .rec{animation:pd 1s infinite}
          @media(max-width:600px){
            .journey-grid{grid-template-columns:1fr!important;gap:0.5rem!important}
            .journey-arrow{display:none!important}
            .tiers-grid{grid-template-columns:1fr 1fr!important}
            .tiers-grid .tier-reward{grid-column:1/-1;padding-top:0!important;padding-bottom:0.5rem!important;border-top:none!important}
            .tiers-grid{row-gap:0.25rem!important}
            .ask-grid{grid-template-columns:1fr!important}
            .ask-grid>div{border-left:none!important}
          }
          @media(max-width:400px){
            .tiers-grid{grid-template-columns:1fr!important}
            .tiers-grid .tier-reward{grid-column:unset}
          }
        `}</style>
      </Head>

      {/* ── INTRO ───────────────────────────────────── */}
      <AnimatePresence>
        {!gone && (
          <motion.div exit={{ opacity:0 }} transition={{ duration:0.25 }}
            style={{ position:'fixed', inset:0, zIndex:9999, background:C.dark,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
              style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="rec" style={{ display:'block', width:10, height:10, borderRadius:'50%', background:C.terra }} />
              <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.4em', color:C.terra }}>{t.onAir}</span>
            </motion.div>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:[0,1,1,1,0] }}
              transition={{ duration:1.8, delay:0.5, times:[0,0.1,0.5,0.9,1] }}
              style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(4rem,15vw,8rem)', color:C.paper, lineHeight:1 }}>3</motion.div>
            <motion.div initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
              transition={{ delay:0.6, duration:0.8 }}
              style={{ width:120, height:1, background:C.terra, originX:0 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mem flicker" style={{ fontFamily:"'EB Garamond',serif", color:C.paper }}>

        {/* ── NAV BAR ─────────────────────────────── */}
        <div style={{ position:'fixed', top:'1.25rem', left:'1.5rem', right:'1.5rem', zIndex:800,
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
            letterSpacing:'0.25em', color:C.terra, textDecoration:'none', opacity:0.6 }}>
            {t.back}
          </Link>
          <LangSwitcher currentLocale={locale} />
        </div>

        {/* ════════════════════════════════════════════
            S1 — ANNOUNCEMENT / HERO
        ════════════════════════════════════════════ */}
        <section className="grain" style={{ position:'relative', minHeight:'100vh',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          overflow:'hidden', padding:'6rem 2rem 4rem' }}>
          <Image src="/images/press/memorias-hero.jpg" alt="Aniel Someillan" fill priority
            style={{ objectFit:'cover', objectPosition:'30% center', filter:'sepia(40%) brightness(28%) contrast(1.15)', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1,
            background:`linear-gradient(to bottom,${C.dark}aa 0%,rgba(17,10,4,.55) 50%,${C.dark}aa 100%)` }} />
          <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:800 }}>
            <Scene>
              <Tag n={`${t.scene} I`} label={t.s1.label} light />
              <motion.div variants={wipe} style={{ height:1.5, background:C.terra, marginBottom:'2.5rem', originX:0.5 }} />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.7rem,2vw,0.9rem)', letterSpacing:'0.4em', color:C.terra, marginBottom:'1rem' }}>
                {t.s1.line1}
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.7rem,2vw,0.9rem)', letterSpacing:'0.35em', color:'rgba(242,232,212,0.6)', marginBottom:'3rem' }}>
                {t.s1.line2}
              </motion.p>
              {['MEMORIAS DE','BRAS CUBAS'].map((line,i)=>(
                <motion.div key={i} variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(3.5rem,10vw,7rem)', color:C.terra, letterSpacing:'0.03em', lineHeight:1.0 }}>{line}</motion.div>
              ))}
              <motion.div variants={wipe} style={{ height:1.5, background:C.paper, opacity:0.5, margin:'2rem auto', originX:0.5, maxWidth:500 }} />
              <motion.div variants={dropHard} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(1rem,3vw,1.6rem)', color:C.paper, letterSpacing:'0.15em', marginBottom:'1.5rem' }}>
                ANIEL SOMEILLAN
              </motion.div>
              <motion.div variants={fadeUp} style={{ display:'inline-block', padding:'6px 18px',
                border:`1px solid ${C.terra}`, marginBottom:'2.5rem' }}>
                <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
                  letterSpacing:'0.25em', color:C.terra }}>{t.s1.badge}</span>
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize:'0.7rem', letterSpacing:'0.3em',
                color:'rgba(242,232,212,0.4)', fontFamily:"'Alfa Slab One',serif" }}>{t.scroll}</motion.div>
            </Scene>
          </div>
        </section>

        <Marquee text="AFRO-CUBAN JAZZ  ·  SON CUBANO  ·  BOSSA NOVA  ·  SAMBA  ·  GUARACHA  ·  CHA-CHÁ-CHÁ  ·  MAMBO"
          color={C.terra} bg={C.dark} />

        {/* ════════════════════════════════════════════
            ASK STRIP — OPPORTUNITY AT A GLANCE
        ════════════════════════════════════════════ */}
        <section id="opportunity" style={{ background:C.paper, padding:'4rem 2rem', borderTop:`3px solid ${C.terra}` }}>
          <div style={{ maxWidth:860, margin:'0 auto' }}>
            <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem',
              letterSpacing:'0.35em', color:C.terra, textAlign:'center', marginBottom:'2.5rem' }}>
              {t.ask.title}
            </div>

            <div className="ask-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', marginBottom:'2rem' }}>
              {[
                { label: t.ask.what,    value: t.ask.whatVal },
                { label: t.ask.need,    value: t.ask.needVal },
                { label: t.ask.returns, value: t.ask.returnsVal },
                { label: t.ask.status,  value: t.ask.statusVal },
              ].map(({label, value}, i) => (
                <div key={label} style={{
                  padding:'1rem 1.25rem',
                  borderTop:`1px solid rgba(196,82,26,0.2)`,
                  borderLeft: i%2===1 ? `1px solid rgba(196,82,26,0.2)` : 'none',
                }}>
                  <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                    letterSpacing:'0.25em', color:C.terra, marginBottom:'0.4rem' }}>{label}</div>
                  <div style={{ fontSize:'1rem', color:C.ink, lineHeight:1.5 }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
              <a href="mailto:anielsomeillan@icloud.com"
                style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                  padding:'0.85rem 2rem', background:C.terra, color:C.paper,
                  textDecoration:'none', display:'inline-block' }}>
                {t.ask.cta}
              </a>
              <a href="#s8"
                onClick={e => { e.preventDefault(); document.getElementById('s8')?.scrollIntoView({behavior:'smooth'}) }}
                style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                  padding:'0.85rem 2rem', border:`1px solid ${C.terra}`, color:C.terra,
                  textDecoration:'none', display:'inline-block' }}>
                {t.ask.tiers}
              </a>
              <a href="/EPK-Memorias-de-Bras-Cubas.pdf" download
                style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                  padding:'0.85rem 2rem', border:`1px solid rgba(196,82,26,0.4)`, color:'rgba(196,82,26,0.6)',
                  textDecoration:'none', display:'inline-block' }}>
                DOWNLOAD EPK ↓
              </a>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S2 — THE YEAR WAS
        ════════════════════════════════════════════ */}
        <section style={{ background:C.paper, padding:'7rem 2rem', overflow:'hidden' }}>
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <Scene>
              <Tag n={`${t.scene} II`} label={t.s2.label} />
              <Rule />
              {[
                { label:t.s2.year,     value:'2019' },
                { label:t.s2.city,     value:'SÃO PAULO' },
                { label:t.s2.musician, value:'ANIEL SOMEILLAN' },
              ].map(({label,value})=>(
                <motion.div key={label} variants={wipe} style={{ display:'flex', alignItems:'baseline', gap:'2rem',
                  padding:'1.25rem 0', borderBottom:`1px solid rgba(196,82,26,0.2)` }}>
                  <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.3em',
                    color:C.terra, minWidth:100 }}>{label}</span>
                  <span style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(1.8rem,5vw,3.5rem)', color:C.ink, letterSpacing:'0.04em', lineHeight:1 }}>{value}</span>
                </motion.div>
              ))}
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(2rem,6vw,4.5rem)', color:C.terra, marginTop:'2.5rem', letterSpacing:'0.04em' }}>
                {t.s2.then}
              </motion.div>
              <motion.p variants={fadeUp} style={{ fontSize:'1.1rem', lineHeight:1.8,
                color:'rgba(26,14,5,0.7)', maxWidth:580, marginTop:'2rem' }}>{t.s2.body}</motion.p>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S3 — THE DREAM
        ════════════════════════════════════════════ */}
        <section className="grain" style={{ position:'relative', minHeight:'90vh',
          display:'flex', alignItems:'center', justifyContent:'center',
          overflow:'hidden', padding:'6rem 2rem', background:C.dark }}>
          <Image src="/images/press/press-performance-jazz-plaza.jpg" alt="Jazz Plaza Havana 2026" fill
            style={{ objectFit:'cover', filter:'sepia(80%) brightness(18%) contrast(1.3)', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1, background:'rgba(17,10,4,0.6)' }} />
          <div style={{ position:'relative', zIndex:2, maxWidth:800, textAlign:'center', padding:'0 1rem' }}>
            <Scene>
              <Tag n={`${t.scene} III`} label={t.s3.label} light />
              <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.65rem,1.5vw,0.8rem)', letterSpacing:'0.35em',
                color:'rgba(242,232,212,0.5)', marginBottom:'2rem' }}>{t.s3.night}</motion.div>
              {[t.s3.q1,t.s3.q2,t.s3.q3,t.s3.q4].map((line,i)=>(
                <motion.div key={i} variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize: i===0 ? 'clamp(1.5rem,4.5vw,3.5rem)' : 'clamp(2rem,6vw,4.5rem)',
                  color: i===0 ? 'rgba(242,232,212,0.7)' : C.paper,
                  lineHeight:1.1, marginBottom:'0.4rem', letterSpacing:'0.03em' }}>{line}</motion.div>
              ))}
              <motion.div variants={wipe} style={{ height:1.5, background:C.terra, margin:'2.5rem auto', originX:0.5, maxWidth:400 }} />
              <motion.p variants={fadeUp} style={{ fontSize:'1.1rem', lineHeight:1.75,
                color:'rgba(242,232,212,0.65)', fontStyle:'italic', maxWidth:560, margin:'0 auto' }}>{t.s3.body}</motion.p>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S4 — THE SOUND (TERRACOTTA BURST)
        ════════════════════════════════════════════ */}
        <section style={{ background:C.terra, padding:'6rem 2rem', overflow:'hidden', position:'relative' }}>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <Scene>
              <Tag n={`${t.scene} IV`} label={t.s4.label} light />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.7rem,2vw,0.9rem)', letterSpacing:'0.35em',
                color:'rgba(242,232,212,0.7)', marginBottom:'2.5rem' }}>{t.s4.announcer}</motion.p>
              <motion.div variants={sg(0.1)} style={{ display:'flex', flexWrap:'wrap',
                justifyContent:'center', gap:'0.5rem 2rem', marginBottom:'3rem' }}>
                {RHYTHMS.map(r=>(
                  <motion.span key={r} variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(2rem,6vw,4.5rem)', color:C.paper, letterSpacing:'0.03em', lineHeight:1.15 }}>
                    {r}!
                  </motion.span>
                ))}
              </motion.div>
              <motion.div variants={wipe} style={{ height:1.5, background:C.paper, opacity:0.4, margin:'0 auto 2rem', originX:0.5, maxWidth:400 }} />
              <motion.p variants={fadeUp} style={{ fontSize:'1.15rem', lineHeight:1.75,
                color:'rgba(242,232,212,0.85)', maxWidth:560, margin:'0 auto' }}>{t.s4.body}</motion.p>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S5 — STUDIO REVEAL
        ════════════════════════════════════════════ */}
        <section style={{ background:C.dark, padding:'7rem 2rem', overflow:'hidden' }}>
          <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center' }}>
            <Scene>
              <Tag n={`${t.scene} V`} label={t.s5.label} light />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.65rem,1.8vw,0.85rem)', letterSpacing:'0.35em',
                color:'rgba(242,232,212,0.5)', marginBottom:'2rem' }}>{t.s5.where}</motion.p>
              {[{text:'HABANA.',size:'clamp(3rem,8vw,6rem)',color:C.paper},{text:'CUBA.',size:'clamp(2.5rem,7vw,5rem)',color:'rgba(242,232,212,0.5)'}].map(({text,size,color})=>(
                <motion.div key={text} variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:size, color, lineHeight:1.05, letterSpacing:'0.06em', marginBottom:'0.5rem' }}>{text}</motion.div>
              ))}
              <motion.div variants={wipe} style={{ height:1.5, background:C.terra, margin:'2rem auto', originX:0.5, maxWidth:300 }} />
              <motion.div variants={burst} style={{ display:'inline-block', padding:'1.5rem 3rem',
                border:`2px solid ${C.terra}`, margin:'0.5rem 0 2rem' }}>
                <div style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.8rem,5vw,3.5rem)', color:C.terra, letterSpacing:'0.06em', lineHeight:1 }}>STUDIO OJALA</div>
                <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.3em',
                  color:'rgba(242,232,212,0.5)', marginTop:8 }}>{t.s5.studioLabel}</div>
              </motion.div>
              <motion.p variants={fadeUp} style={{ fontSize:'1rem', color:'rgba(242,232,212,0.55)',
                lineHeight:1.8, maxWidth:520, margin:'0 auto 3rem' }}>{t.s5.body}</motion.p>
              {/* Journey */}
              <motion.div variants={sg(0.15)} className="journey-grid" style={{ display:'grid',
                gridTemplateColumns:'1fr 40px 1fr 40px 1fr', alignItems:'center', maxWidth:680, margin:'0 auto' }}>
                {[
                  { city:'HABANA',     tracks:'4',  status:t.s5.done,    sub:'STUDIO OJALA', done:true },
                  null,
                  { city:'SÃO PAULO', tracks:'4',  status:t.s5.status2, sub:t.s5.luedji,    done:false },
                  null,
                  { city:'HABANA',     tracks:'2',  status:t.s5.status3, sub:t.s5.final,     done:false },
                ].map((item,i)=>item===null ? (
                  <motion.div key={i} variants={fadeUp} className="journey-arrow" style={{ textAlign:'center', color:C.terra, fontSize:'1.5rem', opacity:0.6 }}>→</motion.div>
                ) : (
                  <motion.div key={i} variants={stamp} className={`journey-cell`} style={{ padding:'1.2rem 0.5rem', textAlign:'center',
                    border:`1px solid ${item.done?C.green:C.terra}`,
                    background: item.done ? C.green : 'transparent', opacity: item.done?1:0.7 }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.85rem',
                      color: item.done?C.paper:C.terra, letterSpacing:'0.06em' }}>{item.city}</div>
                    <div style={{ fontSize:'0.75rem', color:'rgba(242,232,212,0.5)', margin:'4px 0' }}>{item.tracks} tracks</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
                      color: item.done?'#a8d080':'rgba(242,232,212,0.4)', letterSpacing:'0.1em' }}>{item.status}</div>
                    <div style={{ fontSize:'0.65rem', color:'rgba(242,232,212,0.35)', marginTop:3 }}>{item.sub}</div>
                  </motion.div>
                ))}
              </motion.div>
            </Scene>
          </div>
        </section>

        <Marquee text="FESTIVAL JAZZ PLAZA 2026  ·  MONTREUX JAZZ ACADEMY 2023  ·  JAZZ JUNIOR 2022  ·  STUDIO OJALA  ·  ORQUESTA ARAGÓN"
          color={C.paper} bg={C.terra} />

        {/* ════════════════════════════════════════════
            S6 — THE CAST
        ════════════════════════════════════════════ */}
        <section style={{ background:C.paper, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <Scene>
              <Tag n={`${t.scene} VI`} label={t.s6.label} />
              <Rule />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.65rem,2vw,0.8rem)', letterSpacing:'0.4em', color:C.terra,
                marginBottom:'3rem', textAlign:'center' }}>{t.s6.presenting}</motion.p>
              <motion.div variants={sg(0.1)}>
                {CAST_KEYS.map(m=>(
                  <motion.div key={m.name} variants={wipe} style={{ padding:'1.1rem 0',
                    borderBottom:`1px solid rgba(196,82,26,0.15)`,
                    display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:'1rem' }}>
                    <div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif",
                        fontSize:'clamp(1.1rem,3vw,1.8rem)', color:C.ink, letterSpacing:'0.04em', lineHeight:1 }}>{m.name}</div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.25em',
                        color:C.terra, marginTop:5, opacity:0.8 }}>{t.s6.credits[m.creditKey]}</div>
                    </div>
                    {m.note && (
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.15em',
                        color:C.green, textAlign:'right', border:`1px solid ${C.green}`, padding:'3px 8px' }}>{m.note}</div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} style={{ marginTop:'2.5rem', padding:'1.5rem',
                borderLeft:`3px solid ${C.terra}`, background:'rgba(196,82,26,0.06)' }}>
                <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.25em',
                  color:C.terra, marginBottom:8 }}>{t.s6.threadTitle}</div>
                <p style={{ fontSize:'1rem', lineHeight:1.75, color:C.ink }}>{t.s6.threadBody}</p>
              </motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S7 — THE SONGS
        ════════════════════════════════════════════ */}
        <section style={{ background:C.dark, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <Scene>
              <Tag n={`${t.scene} VII`} label={t.s7.label} light />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.65rem,2vw,0.8rem)', letterSpacing:'0.4em',
                color:'rgba(242,232,212,0.5)', marginBottom:'2.5rem' }}>{t.s7.intro}</motion.p>
              <motion.div variants={sg(0.1)}>
                {[
                  { n:'I–IV', title:t.s7.havanaTracks,          note:t.s7.havanaNote },
                  { n:'V',    title:'Romance Social' },
                  { n:'VI',   title:'Those Eyes' },
                  { n:'VII',  title:'Memorias de Brascubas II' },
                  { n:'VIII', title:'Vienes Y te Vas' },
                  { n:'IX',   title:'Tres Estrellas y un Lucero', note:t.s7.track9note },
                  { n:'X',    title:'Táconeala',                  note:t.s7.track10note },
                ].map(track=>(
                  <motion.div key={track.n} variants={wipe} style={{ display:'grid',
                    gridTemplateColumns:'3.5rem 1fr', gap:'0 1.5rem',
                    padding:'1rem 0', borderBottom:`1px solid rgba(242,232,212,0.08)` }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1rem', color:C.terra, opacity:0.7 }}>{track.n}</span>
                    <div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif",
                        fontSize:'clamp(1rem,3vw,1.6rem)', color:C.paper, letterSpacing:'0.03em', lineHeight:1 }}>{track.title}</div>
                      {track.note && (
                        <div style={{ fontSize:'0.82rem', color:C.terra, fontStyle:'italic', marginTop:5 }}>{track.note}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            AUDIO PREVIEW — Private
        ════════════════════════════════════════════ */}
        <section id="preview" style={{ background:'#0d0705', padding:'5.5rem 2rem' }}>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <Scene>
              <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'flex-start',
                justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2.5rem' }}>
                <div>
                  <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                    letterSpacing:'0.4em', color:C.terra, marginBottom:8 }}>PRIVATE PREVIEW</div>
                  <div style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(2rem,5vw,3.5rem)', color:C.paper, letterSpacing:'0.04em', lineHeight:1 }}>LISTEN.</div>
                </div>
                <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                  letterSpacing:'0.2em', color:'rgba(242,232,212,0.2)', textAlign:'right', lineHeight:2 }}>
                  RAW MIX<br/>STUDIO OJALA<br/>HABANA · 2026
                </div>
              </motion.div>
              <Rule color={C.terra} my="0" />
              <motion.div variants={fadeUp} style={{ marginTop:'2.5rem' }}>
                <AudioPreview />
              </motion.div>
              <motion.div variants={fadeUp} style={{ marginTop:'2rem',
                fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem', letterSpacing:'0.25em',
                color:'rgba(242,232,212,0.18)', textAlign:'center', lineHeight:2 }}>
                CONFIDENTIAL — PRIVATE INVESTOR PREVIEW — NOT FOR PUBLIC DISTRIBUTION
              </motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S8 — YOUR OPPORTUNITY
        ════════════════════════════════════════════ */}
        <section id="s8" style={{ background:C.paper, padding:'7rem 2rem' }}>
          <div style={{ maxWidth:860, margin:'0 auto' }}>
            <Scene>
              <Tag n={`${t.scene} VIII`} label={t.s8.label} />
              <Rule />
              <motion.div variants={sg(0.1)} style={{ display:'flex', gap:'3rem',
                alignItems:'flex-start', flexWrap:'wrap', marginBottom:'3rem' }}>
                <div style={{ flex:1, minWidth:240 }}>
                  <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(2rem,5vw,3.5rem)', color:C.ink, lineHeight:1.05, marginBottom:'1rem',
                    whiteSpace:'pre-line' }}>{t.s8.title}</motion.div>
                  <motion.p variants={fadeUp} style={{ fontSize:'1.1rem', lineHeight:1.8, color:'rgba(26,14,5,0.7)' }}>{t.s8.body}</motion.p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
                  <Starburst size={150} bg={C.terra} color={C.paper}>
                    <div style={{ padding:8 }}>
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.2em' }}>{t.s8.from}</div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1.6rem', lineHeight:1 }}>€10</div>
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.15em' }}>SUPPORTER</div>
                    </div>
                  </Starburst>
                  <Starburst size={130} bg={C.green} color={C.paper}>
                    <div style={{ padding:8 }}>
                      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.12em',
                        lineHeight:1.5, whiteSpace:'pre-line' }}>{t.s8.licensing}</div>
                    </div>
                  </Starburst>
                </div>
              </motion.div>
              <motion.div variants={sg(0.08)}>
                {t.s8.tiers.map((tier,i)=>(
                  <motion.div key={tier.tier} variants={fadeUp} className="tiers-grid" style={{ display:'grid',
                    gridTemplateColumns:'170px 130px 1fr', gap:'0 1.5rem',
                    padding:'0.85rem 0.75rem', alignItems:'baseline',
                    background: i%2===0 ? 'transparent' : 'rgba(196,82,26,0.06)',
                    borderBottom:`1px solid rgba(196,82,26,0.12)` }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.7rem', color:C.terra, letterSpacing:'0.1em' }}>{tier.tier}</span>
                    <span style={{ fontWeight:600, fontSize:'1rem', color:C.ink }}>{tier.amount}</span>
                    <span className="tier-reward" style={{ fontSize:'0.92rem', color:'rgba(26,14,5,0.65)' }}>{tier.reward}</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} style={{ marginTop:'2rem', padding:'1.25rem 1.5rem',
                borderLeft:`3px solid ${C.green}`, background:'rgba(45,80,22,0.06)',
                fontSize:'0.9rem', color:C.inkLight, lineHeight:1.7 }}>{t.s8.note}</motion.div>
            </Scene>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            S9 — CLOSING
        ════════════════════════════════════════════ */}
        <section className="grain" style={{ position:'relative', background:C.dark,
          padding:'7rem 2rem 6rem', overflow:'hidden' }}>
          <Image src="/images/press/press-live-color.jpg" alt="Aniel Someillan live" fill
            style={{ objectFit:'cover', filter:'sepia(70%) brightness(12%) contrast(1.2)', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1, background:'rgba(17,10,4,0.75)' }} />
          <div style={{ position:'relative', zIndex:2, maxWidth:700, margin:'0 auto', textAlign:'center' }}>
            <Scene>
              <Tag n={`${t.scene} IX`} label={t.s9.label} light />
              <motion.div variants={wipe} style={{ height:1.5, background:C.terra, margin:'0 auto 2.5rem', originX:0.5, maxWidth:300 }} />
              <motion.p variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(0.65rem,1.8vw,0.85rem)', letterSpacing:'0.4em',
                color:'rgba(242,232,212,0.5)', marginBottom:'1rem' }}>{t.s9.presentedBy}</motion.p>
              <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                fontSize:'clamp(2rem,6vw,4rem)', color:C.paper, letterSpacing:'0.06em', marginBottom:'3rem' }}>
                ANIEL SOMEILLAN
              </motion.div>
              <motion.div variants={sg(0.1)} style={{ marginBottom:'3rem' }}>
                {[
                  { label:'EMAIL',     value:'anielsomeillan@icloud.com' },
                  { label:'WHATSAPP', value:'+48 784 161 684' },
                  { label:'WEB',      value:'www.anielsomeillan.com' },
                  { label:'INSTAGRAM',value:'@anielsomeillan' },
                ].map(({label,value})=>(
                  <motion.div key={label} variants={fadeUp} style={{ display:'grid',
                    gridTemplateColumns:'100px 1fr', gap:'0 1rem', padding:'0.6rem 0',
                    borderBottom:'1px solid rgba(242,232,212,0.08)', textAlign:'left' }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                      color:C.terra, letterSpacing:'0.2em', paddingTop:3 }}>{label}</span>
                    <span style={{ fontSize:'1rem', color:'rgba(242,232,212,0.8)' }}>{value}</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={wipe} style={{ height:1.5, background:C.terra, margin:'0 auto 2rem', originX:0.5, maxWidth:300 }} />
              <motion.div variants={burst} style={{ display:'inline-flex', alignItems:'center', gap:10,
                border:`1px solid ${C.terra}`, padding:'8px 20px', marginBottom:'2rem' }}>
                <span className="rec" style={{ display:'block', width:8, height:8, borderRadius:'50%', background:C.terra }} />
                <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.35em', color:C.terra }}>
                  {t.onAir} · 2026
                </span>
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize:'0.75rem', letterSpacing:'0.1em',
                color:'rgba(242,232,212,0.25)', fontFamily:"'Alfa Slab One',serif" }}>{t.s9.copyright}</motion.div>
            </Scene>
          </div>
        </section>

      </div>
    </>
  )
}
