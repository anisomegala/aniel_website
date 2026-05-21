import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── PALETTE ────────────────────────────────────────────
const C = {
  dark: '#110a04', paper: '#f2e8d4', paperDark: '#e6d8bd',
  terra: '#c4521a', green: '#2d5016', ink: '#1a0e05', inkLight: '#4a2e10',
}

const ACCESS_KEY = 'xpop2026'

// ─── TRANSLATIONS ────────────────────────────────────────
const LOCALES = {
  en: {
    gate:      { label:'PRIVATE · CONCERT OFFER', placeholder:'Access code', enter:'ENTER', error:'Incorrect access code' },
    nav:       { back:'← ANIELSOMEILLAN.COM', badge:'PRIVATE · CONFIDENTIAL' },
    hero:      { top:'CONCERT OFFER · PRIVATE', date:'JULY 11, 2026  ·  WARSAW' },
    marquee:   'SON CUBANO  ·  BOLERO  ·  MAMBO  ·  CHA-CHÁ-CHÁ  ·  GUARACHA  ·  3 SETS  ·  40 MIN EACH',
    glance:    {
      title: 'The Event at a Glance',
      items: [
        { n:'3',  label:'SETS OF LIVE MUSIC', body:'Son · Bolero · Mambo\nCha-Chá-Chá · Guaracha' },
        { n:'40', label:'MINUTES PER SET',    body:'2 hours live music\n20-min breaks between sets' },
        { n:'5',  label:'MUSICIANS',          body:'Full formation\nSpecial guest included' },
      ],
    },
    ensemble:  {
      label: 'The Ensemble', title: 'THE BAND', guestLabel: 'SPECIAL GUEST',
      members: [
        { name:'ANIEL SOMEILLAN',  role:'Double Bass · Voice · Director', note:'MJAF Laureate · Montreux Jazz Academy · Jazz Junior Champion' },
        { name:'CRISTIAN MORA',    role:'Piano · Voice',                  note:null },
        { name:'ADRIANO BRIZUELA', role:'Congas · Bongos · Percussion',   note:null },
        { name:'MICHELLE WELCHONS',role:'Congas · Voice',                 note:null },
      ],
      guest: { name:'YAREMI KORDOS', role:'Voice · Classical Guitar', note:"Amadeo Roldán alumna · 'Music of Buena Vista' · Club Tropical" },
    },
    yaremi: {
      label: 'Special Guest', title: 'YAREMI KORDOS', role: 'Voice · Classical Guitar',
      body: 'Cuban singer and classical guitarist, born in Havana. Alumna of the Amadeo Roldán Conservatory. Based in Warsaw, she is known for her <em>Music of Buena Vista</em> project and her collaboration with Aniel Someillan in Club Tropical. A voice at the crossroads of Cuban son, bolero, and classical guitar — intimate and commanding in equal measure.',
    },
    experience:{
      label: 'The Experience',
      headline: 'Three sets.\nOne night.\nThe entire golden age of Cuban music — live.',
      body: 'X Pop Latino opens with the romantic intimacy of <em>son cubano</em> and <em>bolero</em> — music for the table, for the candlelit room. The second set turns up the heat with <em>mambo</em> and <em>cha-chá-chá</em>. By the finale, the room has been transformed. This is the music that built Latin nightlife — alive, urgent, impossible to resist.',
    },
    programme: {
      label:'The Programme', title:'JULY 11, 2026 · WARSAW', subtitle:'CUBAN CLASSICS',
      alsoLabel:'ALSO AVAILABLE',
      alsoText:'Buena Vista Social Club tribute night · Celia Cruz dedicated programme · Cuban Bolero Night (intimate format) · Custom themed selections on request',
    },
    technical: {
      label:'Technical Requirements', channelLabel:'CHANNEL LIST',
      stage:[
        ['Stage',         'Minimum 4 × 4 m · preferred 5 × 5 m'],
        ['Piano',         'Grand preferred · Nord Stage acceptable · Nord provided if no house piano'],
        ['PA',            'Stereo PA for venue · min 800W · subwoofer recommended'],
        ['Power',         '2 × 16A independent circuits'],
        ['Monitors',      '4 wedge monitors (or IEM) · one per musician'],
        ['Sound engineer','Provided by venue · 90-min soundcheck required'],
        ['Lighting',      'Stage wash minimum · warm tones preferred · no strobes'],
      ],
      channels:[
        ['1','Vocal — Aniel Someillan'],['2','Vocal — Cristian Mora'],
        ['3','Vocal — Michelle Welchons'],['4','Vocal — Yaremi Kordos'],
        ['5','Double Bass DI + DPA 4099 mic'],['6','Electric Bass DI'],
        ['7–8','Piano / Keyboard stereo L+R'],['9','Computer Playback (stereo)'],
        ['10–11','Congas — Michelle'],['12','Bongos — Adriano'],
      ],
    },
    booking: {
      title:'READY TO CONFIRM',
      body:'July 11, 2026 · Warsaw.\nContact Aniel directly to confirm availability and secure the date.',
      labels:['Artist & Director','Email','Phone / WhatsApp','Website','Instagram'],
      email:'SEND EMAIL', call:'CALL / WHATSAPP',
    },
    footer:'X POP LATINO  ·  CONCERT PROPOSAL  ·  JULY 11 2026  ·  WARSAW  ·  CONFIDENTIAL',
  },

  es: {
    gate:      { label:'PRIVADO · OFERTA DE CONCIERTO', placeholder:'Código de acceso', enter:'ENTRAR', error:'Código de acceso incorrecto' },
    nav:       { back:'← ANIELSOMEILLAN.COM', badge:'PRIVADO · CONFIDENCIAL' },
    hero:      { top:'OFERTA DE CONCIERTO · PRIVADA', date:'11 DE JULIO, 2026  ·  VARSOVIA' },
    marquee:   'SON CUBANO  ·  BOLERO  ·  MAMBO  ·  CHA-CHÁ-CHÁ  ·  GUARACHA  ·  3 SETS  ·  40 MIN POR SET',
    glance:    {
      title: 'El Evento en Resumen',
      items: [
        { n:'3',  label:'SETS EN VIVO',      body:'Son · Bolero · Mambo\nCha-Chá-Chá · Guaracha' },
        { n:'40', label:'MINUTOS POR SET',   body:'2 horas de música en vivo\nDescansos de 20 min entre sets' },
        { n:'5',  label:'MÚSICOS',           body:'Formación completa\nArtista invitada especial incluida' },
      ],
    },
    ensemble:  {
      label: 'El Conjunto', title: 'LA BANDA', guestLabel: 'ARTISTA INVITADA',
      members: [
        { name:'ANIEL SOMEILLAN',  role:'Contrabajo · Voz · Director', note:'Laureado MJAF · Montreux Jazz Academy · Jazz Junior Champion' },
        { name:'CRISTIAN MORA',    role:'Piano · Voz',                  note:null },
        { name:'ADRIANO BRIZUELA', role:'Congas · Bongos · Percusión',  note:null },
        { name:'MICHELLE WELCHONS',role:'Congas · Voz',                 note:null },
      ],
      guest: { name:'YAREMI KORDOS', role:'Voz · Guitarra Clásica', note:"Alumna del Amadeo Roldán · 'Music of Buena Vista' · Club Tropical" },
    },
    yaremi: {
      label: 'Artista Invitada', title: 'YAREMI KORDOS', role: 'Voz · Guitarra Clásica',
      body: 'Cantante cubana y guitarrista clásica, nacida en La Habana. Alumna del Conservatorio Amadeo Roldán. Radicada en Varsovia, es conocida por su proyecto <em>Music of Buena Vista</em> y su colaboración con Aniel Someillan en Club Tropical. Una voz en la intersección del son cubano, el bolero y la guitarra clásica — íntima y poderosa a partes iguales.',
    },
    experience:{
      label: 'La Experiencia',
      headline: 'Tres sets.\nUna noche.\nToda la época dorada de la música cubana — en vivo.',
      body: 'X Pop Latino abre con la intimidad romántica del <em>son cubano</em> y el <em>bolero</em> — música para la mesa, para la sala iluminada por velas. El segundo set sube la temperatura con <em>mambo</em> y <em>cha-chá-chá</em>. Al llegar al final, el ambiente se ha transformado. Esta es la música que construyó la vida nocturna latina — viva, urgente, imposible de resistir.',
    },
    programme: {
      label:'El Programa', title:'11 DE JULIO, 2026 · VARSOVIA', subtitle:'CLÁSICOS CUBANOS',
      alsoLabel:'TAMBIÉN DISPONIBLE',
      alsoText:'Noche homenaje al Buena Vista Social Club · Programa dedicado a Celia Cruz · Noche del Bolero Cubano (formato íntimo) · Selecciones temáticas personalizadas a pedido',
    },
    technical: {
      label:'Requisitos Técnicos', channelLabel:'LISTA DE CANALES',
      stage:[
        ['Escenario',       'Mínimo 4 × 4 m · preferido 5 × 5 m'],
        ['Piano',           'Cola preferido · Nord Stage aceptable · Nord provisto si no hay piano de casa'],
        ['PA',              'PA estéreo para el local · mín. 800W · subwoofer recomendado'],
        ['Corriente',       '2 circuitos independientes de 16A'],
        ['Monitores',       '4 monitores de cuña (o IEM) · uno por músico'],
        ['Sonidista',       'Provisto por el local · 90 min de prueba de sonido requerida'],
        ['Iluminación',     'Iluminación de escenario mínima · tonos cálidos preferidos · sin estroboscopios'],
      ],
      channels:[
        ['1','Vocal — Aniel Someillan'],['2','Vocal — Cristian Mora'],
        ['3','Vocal — Michelle Welchons'],['4','Vocal — Yaremi Kordos'],
        ['5','Contrabajo DI + micrófono DPA 4099'],['6','Bajo eléctrico DI'],
        ['7–8','Piano / Teclado estéreo I+D'],['9','Playback / computadora (estéreo)'],
        ['10–11','Congas — Michelle'],['12','Bongos — Adriano'],
      ],
    },
    booking: {
      title:'LISTOS PARA CONFIRMAR',
      body:'11 de julio, 2026 · Varsovia.\nContacta a Aniel directamente para confirmar disponibilidad y asegurar la fecha.',
      labels:['Artista y Director','Email','Teléfono / WhatsApp','Sitio web','Instagram'],
      email:'ENVIAR EMAIL', call:'LLAMAR / WHATSAPP',
    },
    footer:'X POP LATINO  ·  OFERTA DE CONCIERTO  ·  11 JULIO 2026  ·  VARSOVIA  ·  CONFIDENCIAL',
  },

  pt: {
    gate:      { label:'PRIVADO · OFERTA DE CONCERTO', placeholder:'Código de acesso', enter:'ENTRAR', error:'Código de acesso incorreto' },
    nav:       { back:'← ANIELSOMEILLAN.COM', badge:'PRIVADO · CONFIDENCIAL' },
    hero:      { top:'OFERTA DE CONCERTO · PRIVADA', date:'11 DE JULHO, 2026  ·  VARSÓVIA' },
    marquee:   'SON CUBANO  ·  BOLERO  ·  MAMBO  ·  CHA-CHÁ-CHÁ  ·  GUARACHA  ·  3 SETS  ·  40 MIN POR SET',
    glance:    {
      title: 'O Evento em Resumo',
      items: [
        { n:'3',  label:'SETS AO VIVO',      body:'Son · Bolero · Mambo\nCha-Chá-Chá · Guaracha' },
        { n:'40', label:'MINUTOS POR SET',   body:'2 horas de música ao vivo\nIntervalos de 20 min entre sets' },
        { n:'5',  label:'MÚSICOS',           body:'Formação completa\nArtista convidada especial incluída' },
      ],
    },
    ensemble:  {
      label: 'O Conjunto', title: 'A BANDA', guestLabel: 'ARTISTA CONVIDADA',
      members: [
        { name:'ANIEL SOMEILLAN',  role:'Contrabaixo · Voz · Diretor', note:'Laureado MJAF · Montreux Jazz Academy · Jazz Junior Champion' },
        { name:'CRISTIAN MORA',    role:'Piano · Voz',                  note:null },
        { name:'ADRIANO BRIZUELA', role:'Congas · Bongos · Percussão',  note:null },
        { name:'MICHELLE WELCHONS',role:'Congas · Voz',                 note:null },
      ],
      guest: { name:'YAREMI KORDOS', role:'Voz · Guitarra Clássica', note:"Alumna do Amadeo Roldán · 'Music of Buena Vista' · Club Tropical" },
    },
    yaremi: {
      label: 'Artista Convidada', title: 'YAREMI KORDOS', role: 'Voz · Guitarra Clássica',
      body: 'Cantora cubana e guitarrista clássica, nascida em Havana. Alumna do Conservatório Amadeo Roldán. Baseada em Varsóvia, é conhecida pelo seu projeto <em>Music of Buena Vista</em> e pela colaboração com Aniel Someillan no Club Tropical. Uma voz na intersecção do son cubano, o bolero e a guitarra clássica — íntima e poderosa em igual medida.',
    },
    experience:{
      label: 'A Experiência',
      headline: 'Três sets.\nUma noite.\nToda a era dourada da música cubana — ao vivo.',
      body: 'X Pop Latino abre com a intimidade romântica do <em>son cubano</em> e do <em>bolero</em> — música para a mesa, para a sala iluminada por velas. O segundo set aumenta o calor com <em>mambo</em> e <em>cha-chá-chá</em>. No final, o ambiente foi transformado. Esta é a música que construiu a vida noturna latina — viva, urgente, impossível de resistir.',
    },
    programme: {
      label:'O Programa', title:'11 DE JULHO, 2026 · VARSÓVIA', subtitle:'CLÁSSICOS CUBANOS',
      alsoLabel:'TAMBÉM DISPONÍVEL',
      alsoText:'Noite tributo ao Buena Vista Social Club · Programa dedicado a Celia Cruz · Noite do Bolero Cubano (formato íntimo) · Seleções temáticas personalizadas mediante pedido',
    },
    technical: {
      label:'Requisitos Técnicos', channelLabel:'LISTA DE CANAIS',
      stage:[
        ['Palco',          'Mínimo 4 × 4 m · preferido 5 × 5 m'],
        ['Piano',          'Grand preferido · Nord Stage aceitável · Nord fornecido se não houver piano no local'],
        ['PA',             'PA estéreo para o local · mín. 800W · subwoofer recomendado'],
        ['Alimentação',    '2 circuitos independentes de 16A'],
        ['Monitores',      '4 monitores de chão (ou IEM) · um por músico'],
        ['Sonoplasta',     'Fornecido pelo local · 90 min de soundcheck necessário'],
        ['Iluminação',     'Iluminação de palco mínima · tons quentes preferidos · sem strobo'],
      ],
      channels:[
        ['1','Vocal — Aniel Someillan'],['2','Vocal — Cristian Mora'],
        ['3','Vocal — Michelle Welchons'],['4','Vocal — Yaremi Kordos'],
        ['5','Contrabaixo DI + microfone DPA 4099'],['6','Baixo elétrico DI'],
        ['7–8','Piano / Teclado estéreo E+D'],['9','Playback / computador (estéreo)'],
        ['10–11','Congas — Michelle'],['12','Bongos — Adriano'],
      ],
    },
    booking: {
      title:'PRONTO PARA CONFIRMAR',
      body:'11 de julho, 2026 · Varsóvia.\nContacte Aniel diretamente para confirmar disponibilidade e garantir a data.',
      labels:['Artista e Diretor','E-mail','Telefone / WhatsApp','Site','Instagram'],
      email:'ENVIAR EMAIL', call:'LIGAR / WHATSAPP',
    },
    footer:'X POP LATINO  ·  OFERTA DE CONCERTO  ·  11 JULHO 2026  ·  VARSÓVIA  ·  CONFIDENCIAL',
  },

  pl: {
    gate:      { label:'PRYWATNE · OFERTA KONCERTOWA', placeholder:'Kod dostępu', enter:'WEJDŹ', error:'Nieprawidłowy kod dostępu' },
    nav:       { back:'← ANIELSOMEILLAN.COM', badge:'PRYWATNE · POUFNE' },
    hero:      { top:'OFERTA KONCERTOWA · PRYWATNA', date:'11 LIPCA 2026  ·  WARSZAWA' },
    marquee:   'SON CUBANO  ·  BOLERO  ·  MAMBO  ·  CHA-CHÁ-CHÁ  ·  GUARACHA  ·  3 SETY  ·  40 MIN KAŻDY',
    glance:    {
      title: 'Wydarzenie w Skrócie',
      items: [
        { n:'3',  label:'SETY NA ŻYWO',      body:'Son · Bolero · Mambo\nCha-Chá-Chá · Guaracha' },
        { n:'40', label:'MINUT NA SET',      body:'2 godziny muzyki na żywo\n20-minutowe przerwy między setami' },
        { n:'5',  label:'MUZYKÓW',           body:'Pełny skład\nGościna wokalistka w cenie' },
      ],
    },
    ensemble:  {
      label: 'Skład', title: 'ZESPÓŁ', guestLabel: 'GOŚĆ SPECJALNY',
      members: [
        { name:'ANIEL SOMEILLAN',  role:'Kontrabas · Głos · Dyrektor', note:'Laureat MJAF · Montreux Jazz Academy · Jazz Junior Champion' },
        { name:'CRISTIAN MORA',    role:'Fortepian · Głos',             note:null },
        { name:'ADRIANO BRIZUELA', role:'Congas · Bongosy · Perkusja',  note:null },
        { name:'MICHELLE WELCHONS',role:'Congas · Głos',                note:null },
      ],
      guest: { name:'YAREMI KORDOS', role:'Głos · Gitara Klasyczna', note:"Absolwentka Amadeo Roldán · 'Music of Buena Vista' · Club Tropical" },
    },
    yaremi: {
      label: 'Gość Specjalny', title: 'YAREMI KORDOS', role: 'Głos · Gitara Klasyczna',
      body: 'Kubańska śpiewaczka i gitarzystka klasyczna, urodzona w Hawanie. Absolwentka Konserwatorium Amadeo Roldán. Mieszka w Warszawie — znana z projektu <em>Music of Buena Vista</em> i ze współpracy z Anielem Someillanem w Club Tropical. Głos na przecięciu kubańskiego son, bolero i gitary klasycznej — intymny i porywający.',
    },
    experience:{
      label: 'Doświadczenie',
      headline: 'Trzy sety.\nJedna noc.\nCała złota era kubańskiej muzyki — na żywo.',
      body: 'X Pop Latino otwiera romantyczną intymnością <em>son cubano</em> i <em>bolero</em> — muzyka do stołu, do sali przy świecach. Drugi set podkręca temperaturę z <em>mambo</em> i <em>cha-chá-chá</em>. Na finale sala jest odmieniona. To muzyka, która zbudowała latynoskie życie nocne — żywa, nagląca, niemożliwa do odparcia.',
    },
    programme: {
      label:'Program', title:'11 LIPCA 2026 · WARSZAWA', subtitle:'KUBAŃSKIE KLASYKI',
      alsoLabel:'DOSTĘPNE RÓWNIEŻ',
      alsoText:'Wieczór hołdu dla Buena Vista Social Club · Program poświęcony Celii Cruz · Kubańska Noc Bolero (format kameralny) · Niestandardowe wybory tematyczne na zamówienie',
    },
    technical: {
      label:'Wymagania Techniczne', channelLabel:'LISTA KANAŁÓW',
      stage:[
        ['Scena',          'Minimum 4 × 4 m · preferowane 5 × 5 m'],
        ['Fortepian',      'Grand preferowany · Nord Stage akceptowalny · Nord zapewniany jeśli brak fortepianu'],
        ['PA',             'Stereo PA dla pojemności sali · min. 800W · subwoofer zalecany'],
        ['Zasilanie',      '2 niezależne obwody 16A'],
        ['Monitory',       '4 monitory sceniczne (lub IEM) · jeden na muzyka'],
        ['Realizator',     'Zapewniany przez venue · 90 min próby dźwięku wymagane'],
        ['Oświetlenie',    'Minimalne oświetlenie sceny · ciepłe tony preferowane · bez stroboskopu'],
      ],
      channels:[
        ['1','Wokal — Aniel Someillan'],['2','Wokal — Cristian Mora'],
        ['3','Wokal — Michelle Welchons'],['4','Wokal — Yaremi Kordos'],
        ['5','Kontrabas DI + mikrofon DPA 4099'],['6','Bas elektryczny DI'],
        ['7–8','Fortepian / Keyboard stereo L+P'],['9','Playback / komputer (stereo)'],
        ['10–11','Congas — Michelle'],['12','Bongosy — Adriano'],
      ],
    },
    booking: {
      title:'GOTOWI DO POTWIERDZENIA',
      body:'11 lipca 2026 · Warszawa.\nSkontaktuj się bezpośrednio z Anielem, aby potwierdzić dostępność i zarezerwować termin.',
      labels:['Artysta i Dyrektor','Email','Telefon / WhatsApp','Strona www','Instagram'],
      email:'WYŚLIJ EMAIL', call:'ZADZWOŃ / WHATSAPP',
    },
    footer:'X POP LATINO  ·  OFERTA KONCERTOWA  ·  11 LIPCA 2026  ·  WARSZAWA  ·  POUFNE',
  },
}

export async function getStaticProps({ locale }) {
  return { props: { locale: locale || 'en' } }
}

// ─── ANIMATION VARIANTS ─────────────────────────────────
const stamp  = { hidden:{ opacity:0, scale:1.6, rotate:-4 }, visible:{ opacity:1, scale:1, rotate:0, transition:{ type:'spring', stiffness:280, damping:18 } } }
const wipe   = { hidden:{ clipPath:'inset(0 100% 0 0)' }, visible:{ clipPath:'inset(0 0% 0 0)', transition:{ duration:0.7, ease:[0.77,0,0.18,1] } } }
const fadeUp = { hidden:{ opacity:0, y:40 }, visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:'easeOut' } } }
const slideL = { hidden:{ opacity:0, x:-40 }, visible:{ opacity:1, x:0, transition:{ duration:0.55, ease:'easeOut' } } }
const sg     = (d=0.1) => ({ hidden:{}, visible:{ transition:{ staggerChildren:d } } })

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
      textAlign: center ? 'center' : 'left', marginBottom:'0.75rem', textTransform:'uppercase',
    }}>{children}</motion.div>
  )
}

function Marquee({ text }) {
  const rep = Array(6).fill(text).join('  ◆  ')
  return (
    <div style={{ overflow:'hidden', background:C.terra, padding:'10px 0' }}>
      <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:22, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap' }}>
        {[0,1].map(k=>(
          <span key={k} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.3em', color:C.paper, paddingRight:'3rem' }}>{rep}</span>
        ))}
      </motion.div>
    </div>
  )
}

function LangSwitcher({ currentLocale }) {
  const router = useRouter()
  return (
    <div style={{ display:'flex', gap:6 }}>
      {['en','es','pt','pl'].map(loc => (
        <button key={loc}
          onClick={() => router.push('/xpop', '/xpop', { locale: loc })}
          style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.2em',
            color: loc===currentLocale ? C.terra : 'rgba(242,232,212,0.3)',
            background:'none', border:'none', cursor:'pointer', padding:'2px 4px',
            borderBottom: loc===currentLocale ? `1px solid ${C.terra}` : '1px solid transparent',
          }}>
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function MemberCard({ name, role, note=null, light=false }) {
  return (
    <motion.div variants={slideL} style={{
      borderTop:`1px solid ${light ? 'rgba(242,232,212,0.2)' : 'rgba(196,82,26,0.25)'}`,
      padding:'1rem 0',
    }}>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(0.85rem,2vw,1rem)',
        color: light ? C.paper : C.ink, letterSpacing:'0.05em', marginBottom:'0.2rem' }}>{name}</div>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.25em',
        color:C.terra, textTransform:'uppercase' }}>{role}</div>
      {note && <div style={{ fontSize:'0.82rem', color: light ? 'rgba(242,232,212,0.5)' : C.inkLight,
        marginTop:'0.25rem', fontStyle:'italic' }}>{note}</div>}
    </motion.div>
  )
}

function SetBlock({ header, title, songs }) {
  return (
    <Scene style={{ marginBottom:'2rem' }}>
      <SectionLabel>{header}</SectionLabel>
      <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'1.1rem',
        color:C.ink, marginBottom:'0.75rem', letterSpacing:'0.04em' }}>{title}</motion.div>
      {songs.map(([song, composer]) => (
        <motion.div key={song} variants={fadeUp} style={{ display:'flex', justifyContent:'space-between',
          padding:'0.45rem 0', borderBottom:`1px solid rgba(196,82,26,0.15)`, gap:'1rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'1rem', color:C.ink }}>{song}</span>
          <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem', letterSpacing:'0.15em',
            color:C.terra, opacity:0.8, alignSelf:'center', whiteSpace:'nowrap' }}>{composer}</span>
        </motion.div>
      ))}
    </Scene>
  )
}

// ─── PASSWORD GATE ───────────────────────────────────────
function Gate({ onUnlock, locale }) {
  const t = (LOCALES[locale] || LOCALES.en).gate
  const [val, setVal]     = useState('')
  const [err, setErr]     = useState(false)
  const [shake, setShake] = useState(false)
  const router            = useRouter()

  function attempt() {
    if (val.trim() === ACCESS_KEY) { onUnlock() }
    else { setErr(true); setShake(true); setTimeout(()=>setShake(false), 400) }
  }

  return (
    <div style={{ minHeight:'100vh', background:C.dark, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'EB Garamond',serif" }}>
      <div style={{ position:'fixed', top:'1.25rem', right:'1.5rem' }}>
        <div style={{ display:'flex', gap:6 }}>
          {['en','es','pt','pl'].map(loc => (
            <button key={loc}
              onClick={() => router.push('/xpop', '/xpop', { locale: loc })}
              style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem', letterSpacing:'0.2em',
                color: loc===locale ? C.terra : 'rgba(242,232,212,0.3)',
                background:'none', border:'none', cursor:'pointer', padding:'2px 4px',
                borderBottom: loc===locale ? `1px solid ${C.terra}` : '1px solid transparent' }}>
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2rem,8vw,3.5rem)',
        color:C.terra, letterSpacing:'0.05em', marginBottom:'0.5rem', textAlign:'center' }}>
        X POP LATINO
      </div>
      <div style={{ height:1.5, width:200, background:C.terra, margin:'0.75rem auto' }} />
      <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.6rem', letterSpacing:'0.35em',
        color:'rgba(242,232,212,0.4)', marginBottom:'3rem', textAlign:'center' }}>
        {t.label}
      </div>
      <motion.div animate={shake ? { x:[-8,8,-6,6,-3,3,0] } : {}} transition={{ duration:0.35 }}
        style={{ width:'100%', maxWidth:320 }}>
        <input type="password" placeholder={t.placeholder} value={val}
          onChange={e => { setVal(e.target.value); setErr(false) }}
          onKeyDown={e => e.key==='Enter' && attempt()}
          style={{ width:'100%', padding:'0.85rem 1rem', background:'transparent',
            border:`1px solid ${err ? C.terra : 'rgba(242,232,212,0.25)'}`,
            color:C.paper, fontFamily:"'Alfa Slab One',serif", fontSize:'0.7rem', letterSpacing:'0.2em',
            outline:'none', marginBottom:'0.75rem', textAlign:'center' }} />
        <button onClick={attempt} style={{ width:'100%', padding:'0.85rem',
          background:C.terra, color:C.paper, border:'none', cursor:'pointer',
          fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.3em' }}>
          {t.enter}
        </button>
        {err && <div style={{ textAlign:'center', marginTop:'0.75rem', fontSize:'0.85rem',
          color:C.terra, fontStyle:'italic' }}>{t.error}</div>}
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
export default function XPopOffer({ locale: localeProp }) {
  const router   = useRouter()
  const locale   = router.locale || localeProp || 'en'
  const t        = LOCALES[locale] || LOCALES.en

  const [unlocked, setUnlocked] = useState(false)
  const [checked,  setChecked]  = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUnlocked(sessionStorage.getItem('xpop_ok') === '1')
      setChecked(true)
    }
  }, [])

  function unlock() { sessionStorage.setItem('xpop_ok','1'); setUnlocked(true) }

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
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:${C.dark};overflow-x:hidden}
          .xpop::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:900;
            background:repeating-linear-gradient(transparent 0,transparent 3px,rgba(0,0,0,.025) 3px,rgba(0,0,0,.025) 4px)}
          .grain::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.05;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")}
          @media(max-width:600px){
            .members-grid{grid-template-columns:1fr!important}
            .sets-grid{grid-template-columns:1fr!important}
          }
        `}</style>
      </Head>

      {!unlocked ? <Gate onUnlock={unlock} locale={locale} /> : (
        <div className="xpop" style={{ fontFamily:"'EB Garamond',serif", color:C.paper }}>

          {/* NAV */}
          <div style={{ position:'fixed', top:'1.25rem', left:'1.5rem', right:'1.5rem', zIndex:800,
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <a href="/" style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
              letterSpacing:'0.25em', color:C.terra, textDecoration:'none', opacity:0.6 }}>
              {t.nav.back}
            </a>
            <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
              <LangSwitcher currentLocale={locale} />
              <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                letterSpacing:'0.2em', color:'rgba(242,232,212,0.2)' }}>{t.nav.badge}</span>
            </div>
          </div>

          {/* ── HERO ─────────────────────────────────── */}
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
                  {t.hero.top}
                </motion.div>
                <motion.div variants={wipe} style={{ height:1.5, background:C.terra, marginBottom:'2.5rem', originX:0.5 }} />
                {['X POP','LATINO'].map((line,i) => (
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
                    letterSpacing:'0.25em', color:C.terra }}>{t.hero.date}</span>
                </motion.div>
              </Scene>
            </div>
          </section>

          <Marquee text={t.marquee} />

          {/* ── AT A GLANCE ──────────────────────────── */}
          <section style={{ background:C.paper, padding:'4rem 2rem', borderTop:`3px solid ${C.terra}` }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene><SectionLabel center>{t.glance.title}</SectionLabel></Scene>
              <Rule />
              <Scene style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
                {t.glance.items.map(({ n, label, body }) => (
                  <motion.div key={n} variants={fadeUp} style={{ textAlign:'center', padding:'2rem 1rem',
                    borderRight:`1px solid rgba(196,82,26,0.2)` }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'clamp(2.5rem,6vw,4rem)',
                      color:C.terra, lineHeight:1, marginBottom:'0.4rem' }}>{n}</div>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                      letterSpacing:'0.25em', color:C.green, marginBottom:'0.75rem' }}>{label}</div>
                    <div style={{ fontSize:'0.9rem', color:C.inkLight, lineHeight:1.7, whiteSpace:'pre-line' }}>{body}</div>
                  </motion.div>
                ))}
              </Scene>
            </div>
          </section>

          {/* ── ENSEMBLE ─────────────────────────────── */}
          <section style={{ background:C.dark, padding:'5rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel light>{t.ensemble.label}</SectionLabel>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(2rem,6vw,3.5rem)', color:C.paper, marginBottom:'0.5rem' }}>
                  {t.ensemble.title}
                </motion.div>
              </Scene>
              <Rule color={C.terra} my="2rem" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 2rem' }} className="members-grid">
                <Scene delay={0.08}>
                  {t.ensemble.members.map(m => (
                    <MemberCard key={m.name} light name={m.name} role={m.role} note={m.note} />
                  ))}
                </Scene>
                <Scene delay={0.05}>
                  <motion.div variants={fadeUp} style={{ position:'relative', height:400, marginBottom:'1rem' }}>
                    <Image src="/images/xpop/band-stage.jpg" alt="X Pop Latino on stage" fill
                      style={{ objectFit:'cover', objectPosition:'center center',
                        filter:'sepia(20%) brightness(0.85)' }} />
                    <div style={{ position:'absolute', inset:0,
                      background:`linear-gradient(to top, ${C.dark}99 0%, transparent 50%)` }} />
                  </motion.div>
                  <div style={{ borderTop:`1px solid rgba(196,82,26,0.35)`, paddingTop:'1rem' }}>
                    <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                      letterSpacing:'0.3em', color:'rgba(196,82,26,0.6)', marginBottom:'0.4rem' }}>
                      {t.ensemble.guestLabel}
                    </div>
                    <MemberCard light name={t.ensemble.guest.name} role={t.ensemble.guest.role} note={t.ensemble.guest.note} />
                  </div>
                </Scene>
              </div>
            </div>
          </section>

          {/* ── YAREMI SPECIAL GUEST ─────────────────── */}
          <section style={{ background:C.paperDark, padding:'4rem 2rem', borderTop:`2px solid rgba(196,82,26,0.3)` }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel center>{t.yaremi.label}</SectionLabel>
              </Scene>
              <Rule />
              <Scene style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'3rem', alignItems:'center' }}
                className="members-grid">
                <motion.div variants={fadeUp} style={{ position:'relative', height:380 }}>
                  <Image src="/images/xpop/yaremi.jpg" alt="Yaremi Kordos" fill
                    style={{ objectFit:'cover', objectPosition:'center 35%',
                      filter:'sepia(15%) brightness(0.9)' }} />
                  <div style={{ position:'absolute', inset:0,
                    background:`linear-gradient(to top, ${C.ink}55 0%, transparent 60%)` }} />
                </motion.div>
                <div>
                  <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'clamp(1.8rem,4vw,2.8rem)', color:C.ink, letterSpacing:'0.04em',
                    lineHeight:1.1, marginBottom:'0.4rem' }}>
                    {t.yaremi.title}
                  </motion.div>
                  <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'0.6rem', letterSpacing:'0.3em', color:C.terra,
                    marginBottom:'1.5rem' }}>
                    {t.yaremi.role}
                  </motion.div>
                  <Rule color={C.terra} my="1rem" />
                  <motion.div variants={fadeUp}
                    dangerouslySetInnerHTML={{ __html: t.yaremi.body }}
                    style={{ fontSize:'1.05rem', lineHeight:1.85, color:C.inkLight }} />
                </div>
              </Scene>
            </div>
          </section>

          {/* ── EXPERIENCE ───────────────────────────── */}
          <section className="grain" style={{ position:'relative', minHeight:'60vh',
            display:'flex', alignItems:'center', overflow:'hidden', padding:'5rem 2rem' }}>
            <Image src="/images/xpop/havana.jpg" alt="Havana" fill
              style={{ objectFit:'cover', objectPosition:'center 30%',
                filter:'sepia(45%) brightness(25%) contrast(1.1)', zIndex:0 }} />
            <div style={{ position:'absolute', inset:0, zIndex:1,
              background:`linear-gradient(to right, ${C.dark}ee 0%, ${C.dark}88 60%, transparent 100%)` }} />
            <div style={{ position:'relative', zIndex:2, maxWidth:560 }}>
              <Scene>
                <SectionLabel light>{t.experience.label}</SectionLabel>
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.8rem,4vw,2.8rem)', color:C.paper, lineHeight:1.15, marginBottom:'1.5rem',
                  whiteSpace:'pre-line' }}>
                  {t.experience.headline}
                </motion.div>
                <Rule color={C.terra} my="1.5rem" />
                <motion.div variants={fadeUp}
                  dangerouslySetInnerHTML={{ __html: t.experience.body }}
                  style={{ fontSize:'1.05rem', lineHeight:1.8, color:'rgba(242,232,212,0.8)', maxWidth:480 }} />
              </Scene>
            </div>
          </section>

          {/* ── PROGRAMME ────────────────────────────── */}
          <section style={{ background:C.paper, padding:'5rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene>
                <SectionLabel center>{t.programme.label}</SectionLabel>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.5rem,4vw,2.5rem)', color:C.ink, textAlign:'center', marginBottom:'0.4rem' }}>
                  {t.programme.title}
                </motion.div>
                <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'0.55rem', letterSpacing:'0.3em', color:C.terra, textAlign:'center', marginBottom:'1rem' }}>
                  {t.programme.subtitle}
                </motion.div>
              </Scene>
              <Rule />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'2rem 3rem' }} className="sets-grid">
                <SetBlock header="SET I · 20:00 – 20:40"   title="El Son y el Bolero"
                  songs={[['Chan Chan','Compay Segundo'],['Guantanamera','Joseíto Fernández'],['Dos Gardenias','Isolina Carrillo'],['Bésame Mucho','Consuelo Velázquez'],['Lágrimas Negras','Miguel Matamoros'],['Quizás, Quizás, Quizás','Osvaldo Farrés'],['Bilongo','G. Rodríguez Fiffe'],['El Cuarto de Tula','Traditional']]} />
                <SetBlock header="SET II · 21:00 – 21:40"  title="Mambo & Cha-Chá-Chá"
                  songs={[['Mambo Nº5','Pérez Prado'],['La Engañadora','Enrique Jorrín'],['El Bodeguero','Richard Egüés'],['Oye Como Va','Tito Puente'],['Cachita','Rafael Hernández'],['El Manisero','Moisés Simons'],['La Negra Tiene Tumbao','Celia Cruz'],['Quimbara','Jr. Cepeda / Celia Cruz']]} />
                <SetBlock header="SET III · 22:00 – 22:40" title="Guaracha & Fuego Final"
                  songs={[['La Conga','Gloria Estefan'],['Rhythm Is Gonna Get You','Gloria Estefan'],['La Isla Bonita','Madonna'],['Cara Luna','Finale']]} />
              </div>
              <Scene>
                <motion.div variants={fadeUp} style={{ marginTop:'2rem', padding:'1.25rem 1.5rem',
                  border:`1px solid rgba(196,82,26,0.3)`, background:'rgba(196,82,26,0.04)' }}>
                  <div style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.55rem',
                    letterSpacing:'0.2em', color:C.terra, marginBottom:'0.4rem' }}>{t.programme.alsoLabel}</div>
                  <div style={{ fontSize:'0.95rem', color:C.inkLight, lineHeight:1.75 }}>{t.programme.alsoText}</div>
                </motion.div>
              </Scene>
            </div>
          </section>

          {/* ── TECHNICAL ────────────────────────────── */}
          <section style={{ background:C.paperDark, padding:'4rem 2rem' }}>
            <div style={{ maxWidth:860, margin:'0 auto' }}>
              <Scene><SectionLabel>{t.technical.label}</SectionLabel></Scene>
              <Rule />
              <Scene style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }} className="members-grid">
                <div>
                  {t.technical.stage.map(([k,v]) => (
                    <motion.div key={k} variants={fadeUp} style={{ display:'grid',
                      gridTemplateColumns:'130px 1fr', gap:'0.5rem',
                      padding:'0.6rem 0', borderBottom:`1px solid rgba(196,82,26,0.15)`, fontSize:'0.9rem' }}>
                      <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.5rem',
                        letterSpacing:'0.15em', color:C.terra, alignSelf:'center' }}>{k}</span>
                      <span style={{ color:C.inkLight, lineHeight:1.55 }}>{v}</span>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <motion.div variants={fadeUp} style={{ fontFamily:"'Alfa Slab One',serif",
                    fontSize:'0.55rem', letterSpacing:'0.25em', color:C.green, marginBottom:'0.75rem' }}>
                    {t.technical.channelLabel}
                  </motion.div>
                  {t.technical.channels.map(([ch, src]) => (
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

          {/* ── BOOKING ──────────────────────────────── */}
          <section style={{ background:C.dark, padding:'5rem 2rem 6rem', borderTop:`3px solid ${C.terra}` }}>
            <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
              <Scene>
                <motion.div variants={stamp} style={{ fontFamily:"'Alfa Slab One',serif",
                  fontSize:'clamp(1.5rem,5vw,2.8rem)', color:C.terra, marginBottom:'0.5rem' }}>
                  {t.booking.title}
                </motion.div>
                <motion.div variants={fadeUp} style={{ fontSize:'1.05rem',
                  color:'rgba(242,232,212,0.65)', lineHeight:1.8, maxWidth:540, margin:'0 auto 2.5rem',
                  whiteSpace:'pre-line' }}>
                  {t.booking.body}
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
                ].map(([_label, val], i) => (
                  <motion.div key={val} variants={fadeUp} style={{ display:'grid',
                    gridTemplateColumns:'160px 1fr', gap:'1rem', padding:'0.75rem 0',
                    borderBottom:`1px solid rgba(242,232,212,0.08)`, textAlign:'left',
                    maxWidth:520, margin:'0 auto' }}>
                    <span style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.52rem',
                      letterSpacing:'0.2em', color:C.terra, alignSelf:'center' }}>
                      {t.booking.labels[i]}
                    </span>
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
                    {t.booking.email}
                  </a>
                  <a href="tel:+48784161684"
                    style={{ fontFamily:"'Alfa Slab One',serif", fontSize:'0.65rem', letterSpacing:'0.2em',
                      padding:'1rem 2.5rem', border:`1.5px solid ${C.terra}`, color:C.terra,
                      textDecoration:'none', display:'inline-block' }}>
                    {t.booking.call}
                  </a>
                </motion.div>
              </Scene>
              <div style={{ marginTop:'5rem', height:1, background:C.terra, opacity:0.3 }} />
              <div style={{ marginTop:'1.5rem', fontFamily:"'Alfa Slab One',serif", fontSize:'0.45rem',
                letterSpacing:'0.3em', color:'rgba(242,232,212,0.2)' }}>
                {t.footer}
              </div>
            </div>
          </section>

        </div>
      )}
    </>
  )
}
