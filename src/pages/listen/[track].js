import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

// ─── PALETTE (shared with /memorias) ──────────────────
const C = { paper:'#f2e8d4', paperDark:'#e6d8bd', dark:'#110a04', terra:'#c4521a', green:'#2d5016', ink:'#1a0e05' }

// ─── TRACK REGISTRY ───────────────────────────────────
// One entry per private listening link.
//   URL  →  https://anielsomeillan.com/listen/<slug>
//   Personalise per guest with  ?for=Nombre   (e.g. /listen/romance-social?for=Dagoberto)
//
// `meta` rows and `notes` are optional — leave them empty and they simply
// don't render. Add a new track by dropping the mp3 in /public/audio and
// adding a slug here.
const TRACKS = {
  'romance-social': {
    title: 'Romance Social',
    trackNum: 'V',
    src: '/audio/romance-social.mp3',
    album: 'Memorias de Bras Cubas',
    meta: [
      // { label:'KEY',    value:'F minor' },
      // { label:'TEMPO',  value:'92 BPM' },
      // { label:'FORM',   value:'AABA · solos on A' },
    ],
    notes: [
      // 'Free feel on the intro — come in at bar 17.',
    ],
  },
  'vienes-y-te-vas': {
    title: 'Vienes y te Vas',
    trackNum: 'VIII',
    src: '/audio/vienes-y-te-vas.mp3',
    album: 'Memorias de Bras Cubas',
    meta: [],
    notes: [],
  },
  'black-narcissus': {
    title: 'Black Narcissus',
    trackNum: null,
    src: '/audio/Black_Narcissus.mp3',
    album: 'Memorias de Bras Cubas',
    meta: [],
    notes: [],
  },
}

export async function getStaticPaths({ locales }) {
  const paths = []
  for (const locale of locales || ['en']) {
    for (const track of Object.keys(TRACKS)) paths.push({ params:{ track }, locale })
  }
  return { paths, fallback:false }
}

export async function getStaticProps({ params }) {
  return { props: { track: TRACKS[params.track] } }
}

// ─── VARIANTS ─────────────────────────────────────────
const fadeUp = { hidden:{ opacity:0, y:30 }, visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:'easeOut' } } }
const wipe   = { hidden:{ clipPath:'inset(0 100% 0 0)' }, visible:{ clipPath:'inset(0 0% 0 0)', transition:{ duration:0.7, ease:[0.77,0,0.18,1] } } }
const sg     = (d=0.1) => ({ hidden:{}, visible:{ transition:{ staggerChildren:d } } })

function Scene({ children, style={} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'} variants={sg(0.1)} style={style}>
      {children}
    </motion.div>
  )
}

// ─── PLAYER ───────────────────────────────────────────
function Player({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying]         = useState(false)
  const [loop, setLoop]               = useState(false)
  const [progress, setProgress]       = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    playing ? el.pause() : el.play().catch(() => {})
  }

  const nudge = (secs) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + secs))
  }

  const seek = (e) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    const r = e.currentTarget.getBoundingClientRect()
    el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration
  }

  const fmt = s => (!s || isNaN(s)) ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  const skipBtn = {
    width:38, height:38, borderRadius:'50%', flexShrink:0, background:'transparent',
    border:'1px solid rgba(242,232,212,0.2)', color:'rgba(242,232,212,0.6)', cursor:'pointer',
    fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem', letterSpacing:'0.05em',
    display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
  }

  return (
    <div style={{ border:'1px solid rgba(242,232,212,0.12)', background:'rgba(242,232,212,0.03)', padding:'2rem 1.75rem' }}>
      <audio ref={audioRef} src={src} preload="metadata" loop={loop}
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

      <div style={{ display:'flex', alignItems:'center', gap:'0.9rem' }}>
        <button onClick={() => nudge(-10)} aria-label="Back 10 seconds" style={skipBtn}>−10</button>

        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} style={{
          width:64, height:64, borderRadius:'50%', flexShrink:0,
          background: playing ? 'transparent' : C.terra,
          border:`2px solid ${C.terra}`, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
        }}>
          {playing
            ? <svg width="16" height="18" viewBox="0 0 14 16" fill={C.terra}><rect x="0" y="0" width="4" height="16" rx="1"/><rect x="10" y="0" width="4" height="16" rx="1"/></svg>
            : <svg width="16" height="18" viewBox="0 0 14 16" fill={C.paper}><polygon points="2,0 14,8 2,16"/></svg>}
        </button>

        <button onClick={() => nudge(10)} aria-label="Forward 10 seconds" style={skipBtn}>+10</button>

        <div style={{ flex:1, minWidth:0, marginLeft:'0.5rem' }}>
          <div onClick={seek} style={{ height:4, background:'rgba(242,232,212,0.12)', cursor:'pointer',
            position:'relative', marginBottom:9 }}>
            <div style={{ position:'absolute', left:0, top:0, height:'100%',
              width:`${progress*100}%`, background:C.terra, transition:'width 0.1s linear' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.15em',
              color:'rgba(242,232,212,0.4)' }}>{fmt(currentTime)}</span>
            <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.15em',
              color:'rgba(242,232,212,0.25)' }}>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <button onClick={() => setLoop(l => !l)} style={{
        marginTop:'1.5rem', background:'none', border:'none', cursor:'pointer', padding:0,
        fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.25em',
        color: loop ? C.terra : 'rgba(242,232,212,0.3)',
      }}>
        {loop ? '↻ LOOP ON' : '↻ LOOP OFF'}
      </button>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────
export default function Listen({ track }) {
  const router = useRouter()
  const guest = typeof router.query.for === 'string' ? router.query.for.slice(0, 60) : null

  const title = `${track.title} — private listening link`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={`Private listening link — ${track.title}, from ${track.album} by Aniel Someillan.`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:${C.dark};overflow-x:hidden}
          .lst::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:900;
            background:repeating-linear-gradient(transparent 0,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)}
          .lst::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:901;
            background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.45) 100%)}
          .lst-link{color:${C.terra};text-decoration:none;border-bottom:1px solid rgba(196,82,26,0.4)}
          .lst-link:hover{border-bottom-color:${C.terra}}
        `}</style>
      </Head>

      <div className="lst" style={{ fontFamily:"'EB Garamond',serif", color:C.paper,
        minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* ── HEADER ─────────────────────────────── */}
        <div style={{ padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
            letterSpacing:'0.25em', color:C.terra, textDecoration:'none', opacity:0.6 }}>
            ANIEL SOMEILLAN
          </Link>
          <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
            letterSpacing:'0.3em', color:'rgba(242,232,212,0.25)' }}>PRIVATE LINK</span>
        </div>

        {/* ── BODY ───────────────────────────────── */}
        <Scene style={{ flex:1, width:'100%', maxWidth:720, margin:'0 auto',
          padding:'2rem 1.5rem 4rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>

          {guest && (
            <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
              letterSpacing:'0.3em', color:C.terra, marginBottom:'1.25rem' }}>
              PARA {guest.toUpperCase()}
            </motion.div>
          )}

          <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
            letterSpacing:'0.3em', color:'rgba(242,232,212,0.4)', marginBottom:'0.9rem' }}>
            {track.album.toUpperCase()}{track.trackNum ? ` · TRACK ${track.trackNum}` : ''}
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
            fontSize:'clamp(2.2rem,8vw,4rem)', lineHeight:1.05, letterSpacing:'0.01em',
            color:C.paper, marginBottom:'1.5rem' }}>
            {track.title}
          </motion.h1>

          <motion.div variants={wipe} style={{ height:1.5, background:C.terra,
            margin:'0 0 2.25rem', originX:0 }} />

          <motion.div variants={fadeUp}>
            <Player src={track.src} />
          </motion.div>

          {track.meta.length > 0 && (
            <motion.div variants={fadeUp} style={{ display:'flex', flexWrap:'wrap', gap:'2.5rem',
              marginTop:'2.25rem' }}>
              {track.meta.map(m => (
                <div key={m.label}>
                  <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem',
                    letterSpacing:'0.3em', color:'rgba(242,232,212,0.3)', marginBottom:6 }}>{m.label}</div>
                  <div style={{ fontSize:'1.05rem', color:C.paperDark }}>{m.value}</div>
                </div>
              ))}
            </motion.div>
          )}

          {track.notes.length > 0 && (
            <motion.div variants={fadeUp} style={{ marginTop:'2.5rem',
              borderLeft:`1px solid ${C.terra}`, paddingLeft:'1.25rem' }}>
              <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem',
                letterSpacing:'0.3em', color:C.terra, marginBottom:'0.9rem' }}>NOTES</div>
              {track.notes.map((n, i) => (
                <p key={i} style={{ fontSize:'1.05rem', lineHeight:1.65,
                  color:'rgba(242,232,212,0.75)', marginBottom:'0.6rem' }}>{n}</p>
              ))}
            </motion.div>
          )}

          <motion.div variants={fadeUp} style={{ marginTop:'3rem', paddingTop:'1.5rem',
            borderTop:'1px solid rgba(242,232,212,0.1)' }}>
            <p style={{ fontSize:'0.95rem', lineHeight:1.7, color:'rgba(242,232,212,0.55)' }}>
              Unreleased rough mix — shared privately, please don&apos;t forward or repost.
              Thoughts, questions, ideas:{' '}
              <a className="lst-link" href={`mailto:anielsomeillan@icloud.com?subject=${encodeURIComponent(track.title + ' — ' + track.album)}`}>
                anielsomeillan@icloud.com
              </a>
            </p>
          </motion.div>
        </Scene>
      </div>
    </>
  )
}
