import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── PALETTE (from Karma Trio EPK) ───────────────────
const K = { dark: '#080504', gold: '#c8a05a', cream: '#f2ebd9', off: '#fdfaf4', tan: '#a89880' }

const ACCESS_CODE = 'karma2026'
const PHOTO_COUNT = 21

const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { src: `/images/karma/gallery/karma-live-${n}.jpg`, name: `karma-live-${n}.jpg` }
})

const fadeUp = { hidden: { opacity:0, y:30 }, visible: { opacity:1, y:0, transition:{ duration:0.5, ease:'easeOut' } } }
const sg = (d=0.05) => ({ hidden:{}, visible:{ transition:{ staggerChildren:d } } })

function Scene({ children, style={} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView?'visible':'hidden'} variants={sg(0.04)} style={style}>
      {children}
    </motion.div>
  )
}

// ─── ACCESS GATE (shared with /karma) ────────────────
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
          PRESS PHOTO GALLERY
        </div>
        <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2rem,8vw,3rem)', color:K.off, letterSpacing:'0.06em', marginBottom:'2rem' }}>
          KARMA TRIO
        </div>
        <div style={{ height:1, background:K.gold, opacity:0.4, marginBottom:'2rem' }} />
        <p style={{ color:K.tan, fontSize:'0.95rem', lineHeight:1.7, marginBottom:'2rem' }}>
          This is a private gallery for promoters and venues. Enter the access code provided by Aniel Someillan to continue.
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
        <Link href="/karma" style={{ display:'inline-block', marginTop:'2rem', fontFamily:"'Alfa Slab One',serif",
          fontSize:'0.55rem', letterSpacing:'0.25em', color:K.tan, textDecoration:'none', opacity:0.6 }}>
          ← BACK TO EPK
        </Link>
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
export default function KarmaGallery() {
  const [unlocked, setUnlocked] = useState(false)
  const [checked, setChecked]   = useState(false)
  const [active, setActive]     = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('karma_access') === '1') setUnlocked(true)
    setChecked(true)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (active === null) return
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive(a => (a + 1) % PHOTOS.length)
      if (e.key === 'ArrowLeft') setActive(a => (a - 1 + PHOTOS.length) % PHOTOS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  if (!checked) return <div style={{ position:'fixed', inset:0, background:K.dark }} />
  if (!unlocked) return <AccessGate onUnlock={()=>setUnlocked(true)} />

  return (
    <>
      <Head>
        <title>Karma Trio — Press Photo Gallery | Aniel Someillan</title>
        <meta name="description" content="Karma Trio — downloadable live press photos for venues and promoters." />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:${K.dark};overflow-x:hidden}
          .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem}
          @media(max-width:800px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}
          @media(max-width:480px){.gallery-grid{grid-template-columns:1fr}}
          .photo-tile{position:relative;aspect-ratio:4/3;overflow:hidden;cursor:pointer;background:#1a1410}
          .photo-tile img{transition:transform 0.4s ease}
          .photo-tile:hover img{transform:scale(1.06)}
          .photo-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:flex-end;
            padding:0.6rem;opacity:0;transition:opacity 0.25s ease;background:linear-gradient(to top,rgba(8,5,4,0.6),transparent 50%)}
          .photo-tile:hover .photo-overlay{opacity:1}
          .dl-btn{font-family:'Alfa Slab One',serif;font-size:0.5rem;letter-spacing:0.15em;color:${K.dark};
            background:${K.gold};padding:6px 10px;text-decoration:none}
        `}</style>
      </Head>

      <div className="flicker" style={{ fontFamily:"'EB Garamond',serif", color:K.cream, background:K.dark, minHeight:'100vh' }}>

        {/* ── NAV BAR ─────────────────────────────── */}
        <div style={{ position:'sticky', top:0, zIndex:800, background:K.dark,
          borderBottom:`1px solid rgba(200,160,90,0.2)`,
          padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <Link href="/karma" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
            letterSpacing:'0.25em', color:K.gold, textDecoration:'none', opacity:0.8 }}>
            ← BACK TO EPK
          </Link>
          <a href="/images/karma/Karma_Trio_Press_Photos.zip" download
            style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
            letterSpacing:'0.2em', color:K.dark, textDecoration:'none',
            background:K.gold, padding:'8px 16px' }}>
            DOWNLOAD ALL ({PHOTO_COUNT} PHOTOS · ZIP)
          </a>
        </div>

        {/* ── HEADER ──────────────────────────────── */}
        <section style={{ padding:'4rem 1.5rem 2.5rem', maxWidth:1200, margin:'0 auto' }}>
          <Scene>
            <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem',
              letterSpacing:'0.4em', color:K.gold, marginBottom:'1rem' }}>
              FOR PROMOTERS &amp; VENUES
            </motion.div>
            <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
              fontSize:'clamp(2rem,6vw,3.5rem)', color:K.off, letterSpacing:'0.04em', marginBottom:'1rem' }}>
              PRESS PHOTO GALLERY
            </motion.div>
            <motion.p variants={fadeUp} style={{ fontSize:'1rem', lineHeight:1.7, color:'rgba(242,235,217,0.7)', maxWidth:640 }}>
              Live photos from Karma Trio performances — free to use for promotional and editorial purposes.
              Click any photo to preview, or use the download button to save it individually. Please credit
              the photographer where indicated.
            </motion.p>
          </Scene>
        </section>

        {/* ── GRID ────────────────────────────────── */}
        <section style={{ padding:'0 1.5rem 5rem', maxWidth:1200, margin:'0 auto' }}>
          <Scene>
            <motion.div variants={sg(0.03)} className="gallery-grid">
              {PHOTOS.map((p, i) => (
                <motion.div key={p.name} variants={fadeUp} className="photo-tile" onClick={()=>setActive(i)}>
                  <Image src={p.src} alt={`Karma Trio live photo ${i+1}`} fill sizes="(max-width:800px) 50vw, 33vw"
                    style={{ objectFit:'cover' }} />
                  <div className="photo-overlay">
                    <a className="dl-btn" href={p.src} download={p.name} onClick={e=>e.stopPropagation()}>DOWNLOAD</a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Scene>
        </section>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────── */}
      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={()=>setActive(null)}
            style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(8,5,4,0.95)',
              display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }}
              onClick={e=>e.stopPropagation()}
              style={{ position:'relative', width:'100%', maxWidth:1000, aspectRatio:'4/3' }}>
              <Image src={PHOTOS[active].src} alt={`Karma Trio live photo ${active+1}`} fill
                style={{ objectFit:'contain' }} />
            </motion.div>
            <button onClick={()=>setActive(null)} style={{ position:'fixed', top:'1.5rem', right:'1.5rem',
              fontFamily:"'Alfa Slab One',serif", fontSize:'0.7rem', letterSpacing:'0.2em', color:K.gold,
              background:'none', border:`1px solid ${K.gold}`, padding:'8px 14px', cursor:'pointer' }}>
              CLOSE ✕
            </button>
            <a href={PHOTOS[active].src} download={PHOTOS[active].name} onClick={e=>e.stopPropagation()}
              style={{ position:'fixed', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)',
              fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
              color:K.dark, background:K.gold, padding:'10px 22px', textDecoration:'none' }}>
              DOWNLOAD THIS PHOTO
            </a>
            <button onClick={()=>setActive(a=>(a-1+PHOTOS.length)%PHOTOS.length)}
              style={{ position:'fixed', left:'1rem', top:'50%', transform:'translateY(-50%)',
              fontSize:'2rem', color:K.gold, background:'none', border:'none', cursor:'pointer' }}>‹</button>
            <button onClick={()=>setActive(a=>(a+1)%PHOTOS.length)}
              style={{ position:'fixed', right:'1rem', top:'50%', transform:'translateY(-50%)',
              fontSize:'2rem', color:K.gold, background:'none', border:'none', cursor:'pointer' }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
