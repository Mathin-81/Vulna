import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, useInView, AnimatePresence,
  useScroll, useTransform, useSpring, useMotionValue
} from 'framer-motion';
import {
  ShieldCheck, Code2, Cpu, Activity, AlertTriangle,
  Bug, CheckCircle, UploadCloud, Eye, Zap, Lock, Network
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import './Home.css';

/* ─────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────── */
const AnimatedCounter = ({ end, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 2200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center px-6 py-8 w-full md:w-1/3"
    >
      <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter"
        style={{ background: 'linear-gradient(135deg, #00F3FF 0%, #BC13FE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(0,243,255,0.5))' }}>
        {count}{suffix}
      </span>
      <span className="mt-3 text-xs uppercase tracking-[0.25em] font-bold text-[#64748B]">{label}</span>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────
   NEURAL NETWORK CANVAS (Scene 1 background)
───────────────────────────────────────────────── */
const NeuralCanvas = ({ mouseX, mouseY }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate nodes
    const NODE_COUNT = 60;
    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const mx = (mouseX.get() / window.innerWidth) * canvas.width;
      const my = (mouseY.get() / window.innerHeight) * canvas.height;

      // Update positions with gentle mouse attraction
      nodes.forEach(n => {
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          n.vx += (dx / dist) * 0.015;
          n.vy += (dy / dist) * 0.015;
        }
        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw connections
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = (1 - d / 130) * 0.35;
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00F3FF';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

/* ─────────────────────────────────────────────────
   CINEMATIC BACKGROUND (Particles + Grid + Streaks)
───────────────────────────────────────────────── */
const CinematicBackground = ({ mouseX, mouseY }) => {
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const moveX = useTransform(glowX, v => v - 400);
  const moveY = useTransform(glowY, v => v - 400);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="home-bg-grid" />
      <div className="home-floor-grid" />

      {/* Cursor Glow */}
      <motion.div
        className="absolute rounded-full mix-blend-screen pointer-events-none"
        style={{
          width: 800, height: 800,
          x: moveX, y: moveY,
          background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(188,19,254,0.1) 40%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Ambient Orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] rounded-full bg-[#BC13FE] blur-[200px] opacity-[0.04]" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[#00F3FF] blur-[200px] opacity-[0.04]" />

      {/* Rain streaks */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="home-light-streak"
          style={{ left: `${10 + i * 12}%`, animationDuration: `${3 + Math.random() * 4}s`, animationDelay: `${Math.random() * 5}s` }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 35 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#00F3FF' : i % 2 === 0 ? '#BC13FE' : '#1e293b',
            boxShadow: i % 3 === 0 ? '0 0 10px #00F3FF' : i % 2 === 0 ? '0 0 10px #BC13FE' : 'none',
          }}
          animate={{
            y: [0, -(Math.random() * 200 + 80)],
            opacity: [0, 0.7, 0],
          }}
          transition={{ duration: Math.random() * 12 + 8, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
        />
      ))}

      {/* SVG Dot Network */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <pattern id="hp-dots" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="#00F3FF" />
          <circle cx="60" cy="60" r="1" fill="#BC13FE" />
          <line x1="20" y1="20" x2="60" y2="60" stroke="#00F3FF" strokeWidth="0.3" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#hp-dots)" />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   STATS BAR COMPONENT
───────────────────────────────────────────────── */
const StatsBar = () => {
  const [stats, setStats] = useState({ programs_assessed: 1248, zero_days_isolated: 89, patch_rate: 99.4 });
  useEffect(() => {
    fetch(`${API_BASE_URL}/global-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.error("Stats fetch error:", e));
  }, []);

  return (
    <div className="relative z-30 border-y border-[#0F172A]"
      style={{ background: 'rgba(3,3,5,0.92)', backdropFilter: 'blur(30px)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-around divide-y md:divide-y-0 md:divide-x divide-[#0F172A]">
        <AnimatedCounter end={stats.programs_assessed} suffix="+" label="Programs Assessed" />
        <AnimatedCounter end={stats.zero_days_isolated} label="Zero-Days Isolated" />
        <AnimatedCounter end={Math.round(stats.patch_rate)} suffix="%" label="Autonomous Patch Rate" />
      </div>
    </div>
  );
};
const HeroTypewriter = () => {
  const prefix = 'Autonomous AI System for Discovering ';
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplay(prefix.slice(0, i + 1));
      i++;
      if (i >= prefix.length) { clearInterval(id); setTimeout(() => setDone(true), 300); }
    }, 38);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.05] text-center max-w-6xl">
      <span className="text-[#F3F4F6]">{display}</span>
      {done && (
        <motion.span className="home-glow-text"
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, type: 'spring', bounce: 0.4 }}>
          Unknown
        </motion.span>
      )}
      <br />
      {done && (
        <motion.span className="text-[#CBD5E1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          Software Vulnerabilities
        </motion.span>
      )}
      {!done && <span className="home-typewriter-cursor" />}
    </h1>
  );
};

/* ─────────────────────────────────────────────────
   RIPPLE BUTTON
───────────────────────────────────────────────── */
const RippleButton = ({ to, className, icon: Icon, text, uploadArrow }) => {
  const [ripples, setRipples] = useState([]);
  const onDown = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipples(prev => [...prev, { x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() }]);
  }, []);
  return (
    <Link to={to} className={className} onMouseDown={onDown}>
      {Icon && <Icon className={`w-5 h-5 z-10 relative ${uploadArrow ? 'home-btn-upload-arrow' : ''}`} />}
      <span className="z-10 relative">{text}</span>
      <AnimatePresence>
        {ripples.map(rp => (
          <motion.span key={rp.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 18, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onAnimationComplete={() => setRipples(p => p.filter(x => x.id !== rp.id))}
            className="absolute rounded-full pointer-events-none z-0"
            style={{ width: 20, height: 20, top: rp.y - 10, left: rp.x - 10, background: 'rgba(0,243,255,0.4)' }}
          />
        ))}
      </AnimatePresence>
    </Link>
  );
};

/* ─────────────────────────────────────────────────
   SECTION WRAPPER (fade-up on enter)
───────────────────────────────────────────────── */
const Scene = ({ children, id, className = '' }) => (
  <motion.section id={id}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.9, ease: 'easeOut' }}
    className={`home-section max-w-7xl mx-auto w-full z-20 ${className}`}
  >
    {children}
  </motion.section>
);

/* ─────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────── */
const Home = () => {
  // Mouse tracker
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  useEffect(() => {
    const mv = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, [mouseX, mouseY]);

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 0.88]);

  // Code story
  const [stage, setStage] = useState(0);
  const codeRef = useRef(null);
  const codeInView = useInView(codeRef, { margin: '-25%', once: false });
  useEffect(() => {
    if (codeInView) {
      const t = [
        setTimeout(() => setStage(1), 800),
        setTimeout(() => setStage(2), 2200),
        setTimeout(() => setStage(3), 3800),
        setTimeout(() => setStage(4), 5200),
        setTimeout(() => setStage(5), 6800),
      ];
      return () => t.forEach(clearTimeout);
    } else { setStage(0); }
  }, [codeInView]);

  // Pipeline
  const [pipe, setPipe] = useState(0);
  const pipeRef = useRef(null);
  const pipeInView = useInView(pipeRef, { margin: '-20%', once: false });
  useEffect(() => {
    if (pipeInView) {
      let s = 0;
      const id = setInterval(() => { setPipe(s % 6); s++; }, 1100);
      return () => clearInterval(id);
    } else setPipe(0);
  }, [pipeInView]);

  return (
    <div className="homepage-container">
      <CinematicBackground mouseX={mouseX} mouseY={mouseY} />

      {/* ── SCENE 1: CINEMATIC HERO ── */}
      <motion.div
        ref={heroRef}
        className="home-hero px-6"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 mb-14 z-20 rounded-sm border border-[#00F3FF]/30 bg-[#030305]/70 backdrop-blur-2xl"
          style={{ boxShadow: '0 0 30px rgba(0,243,255,0.08)' }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-80" />
            <span className="relative flex h-3 w-3 rounded-full bg-[#00FF66]" style={{ boxShadow: '0 0 12px #00FF66' }} />
          </span>
          <span className="text-[10px] font-black text-[#00F3FF] tracking-[0.3em] uppercase">Neural Engine · Online</span>
        </motion.div>

        {/* Neural canvas layer under headline */}
        <div className="absolute inset-0 z-0">
          <NeuralCanvas mouseX={mouseX} mouseY={mouseY} />
        </div>

        <div className="relative z-10">
          <HeroTypewriter />
        </div>

        <motion.p
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.5, duration: 1.2 }}
          className="mt-10 text-xl md:text-2xl text-[#94A3B8] max-w-3xl text-center font-light leading-relaxed z-10 relative"
        >
          A fully autonomous pipeline that parses, sandboxes, and surgically patches zero-day exploits—before adversaries discover them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.9, type: 'spring', bounce: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-16 z-10 relative"
        >
          <RippleButton to="/upload" className="home-btn-scan" icon={Activity} text="Initialize Scan" />
          <RippleButton to="/dashboard" className="home-btn-upload" icon={UploadCloud} text="Upload Target" uploadArrow />
        </motion.div>
      </motion.div>

      {/* ── SCENE 2: STATS BAR ── */}
      <StatsBar />

      {/* ── SCENE 3: AI NETWORK VISUAL ── */}
      <Scene id="network" className="items-center text-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <NeuralCanvas mouseX={mouseX} mouseY={mouseY} />
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-sm text-xs font-black uppercase tracking-[0.2em] border border-[#BC13FE]/40 text-[#BC13FE]"
            style={{ background: 'rgba(188,19,254,0.08)' }}>
            <Network size={12} /> AI Neural System
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#F3F4F6] mb-6 leading-tight">
            Real-Time Threat<br /><span style={{ background: 'linear-gradient(135deg,#00F3FF,#BC13FE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intelligence Engine</span>
          </h2>
          <p className="text-[#94A3B8] text-lg md:text-xl font-light leading-relaxed">
            Our deep neural architecture ingests live code streams, correlates behavioural patterns, and flags anomalies across thousands of execution paths—simultaneously.
          </p>
        </motion.div>

        {/* Feature grid cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 px-4">
          {[
            { icon: Code2, color: '#00F3FF', title: 'Semantic Parsing', desc: 'AST-level analysis of every code path.' },
            { icon: Cpu, color: '#BC13FE', title: 'Neural Inference', desc: 'Deep learning model detects hidden patterns.' },
            { icon: ShieldCheck, color: '#00FF66', title: 'Auto-Remediation', desc: 'Patches compiled & applied in milliseconds.' },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="home-panel-glass p-8 flex flex-col items-start gap-4 cursor-default"
              style={{ borderLeft: `3px solid ${c.color}` }}
            >
              <div className="p-3 rounded-sm" style={{ background: `${c.color}18`, color: c.color }}>
                <c.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-[#F3F4F6]">{c.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </Scene>

      {/* ── SCENE 4 & 5: CODE FIX ── */}
      <section id="fix" className="home-section relative z-20 w-full"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(3,3,5,0.8) 30%, rgba(3,3,5,0.8) 70%, transparent)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6 w-full">

          {/* Left: narrative steps */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-[#FF003C]/40 text-[#FF003C] text-xs font-black uppercase tracking-[0.2em] rounded-sm"
              style={{ background: 'rgba(255,0,60,0.08)' }}>
              <AlertTriangle size={12} /> Live Threat Resolution
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#F3F4F6] leading-tight mb-10">
              Detect.<br />Isolate.<br /><span className="text-[#00FF66]" style={{ textShadow: '0 0 30px #00FF66' }}>Neutralize.</span>
            </h2>
            <div className="space-y-5">
              {[
                { label: 'Syntax tree constructed', active: stage >= 1 },
                { label: 'Heuristic scan running', active: stage >= 2 },
                { label: 'SQL Injection detected', active: stage >= 3, alert: true },
                { label: 'Patch compiled & applied', active: stage >= 5, success: true },
              ].map((s, i) => {
                const col = s.success && s.active ? '#00FF66' : s.alert && s.active ? '#FF003C' : s.active ? '#00F3FF' : '#334155';
                return (
                  <div key={i} className="flex items-center gap-4">
                    <motion.div animate={{ borderColor: col, backgroundColor: `${col}22` }}
                      transition={{ duration: 0.4 }}
                      className="w-9 h-9 rounded-sm border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: col }}>
                      {s.success && s.active ? <CheckCircle size={16} color={col} /> :
                        s.alert && s.active ? <Lock size={16} color={col} /> :
                          s.active ? <Zap size={16} color={col} /> :
                            <div className="w-2 h-2 rounded-full bg-[#334155]" />}
                    </motion.div>
                    <motion.span animate={{ color: col }} transition={{ duration: 0.4 }}
                      className="text-base font-bold tracking-wide" style={{ color: col }}>
                      {s.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: animated code block */}
          <div className="home-story-code-container" ref={codeRef}>
            <motion.div
              className="home-story-code-block text-sm md:text-base"
              initial={{ rotateX: 25, rotateY: -12, scale: 0.88, opacity: 0 }}
              whileInView={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, type: 'spring', bounce: 0.35 }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#1E293B]">
                {[stage >= 3 && stage < 5 ? '#FF003C' : '#1e293b', '#1e293b', stage >= 5 ? '#00FF66' : '#1e293b'].map((c, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full transition-all duration-500"
                    style={{ background: c, boxShadow: c !== '#1e293b' ? `0 0 10px ${c}` : 'none' }} />
                ))}
                <span className="ml-3 font-mono text-xs text-[#334155]">wallet_controller.js</span>
              </div>

              {/* Scan overlay */}
              {stage >= 2 && stage < 5 && <div className="home-scan-overlay" />}

              <pre className="relative z-10 whitespace-pre-wrap break-words overflow-x-auto">
                <code>
                  <span className="text-[#BC13FE] font-bold">async function</span>{' '}
                  <span className="text-[#00F3FF]">processTransaction</span>(user, amount) {'{\n'}
                  {'  '}if (!user.isAuthenticated) return <span className="text-[#FF003C]">false</span>;{'\n\n'}
                  {'  '}
                  <motion.span
                    className="inline-block w-full rounded py-1 px-2 -mx-2 transition-all duration-300"
                    animate={{
                      backgroundColor: stage === 3 ? 'rgba(255,0,60,0.15)' : stage >= 5 ? 'rgba(0,255,102,0.08)' : 'transparent',
                      borderLeftColor: stage === 3 ? '#FF003C' : stage >= 5 ? '#00FF66' : 'transparent',
                    }}
                    style={{ borderLeftWidth: stage >= 3 ? 3 : 0 }}
                  >
                    <span className={stage === 3 ? 'text-[#FF003C]' : stage >= 5 ? 'text-[#00FF66]' : 'text-[#E5E7EB]'}>
                      {stage < 5
                        ? 'db.query(`UPDATE wallets SET bal=bal-${amount} WHERE id=${user.id}`); // SQLi'
                        : "db.query('UPDATE wallets SET bal=bal-$1 WHERE id=$2',[amount,user.id]); // Secured"}
                    </span>
                  </motion.span>
                  {'\n\n'}
                  {'  '}return <span className="text-[#00FF66]">true</span>;{'\n'}
                  {'}'}
                </code>
              </pre>

              {/* Floating icons */}
              <AnimatePresence>
                {[1, 2, 3].includes(stage) && (
                  <motion.div key="bug"
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, y: -80, rotate: 90, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="home-story-bug right-[8%] top-[40%]">
                    <Bug size={36} />
                  </motion.div>
                )}
                {stage >= 5 && (
                  <motion.div key="check"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute right-[8%] top-[40%] z-30 text-[#00FF66]"
                    style={{ filter: 'drop-shadow(0 0 20px #00FF66)' }}>
                    <CheckCircle size={40} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SCENE 6: PIPELINE ── */}
      <Scene id="pipeline" className="items-center text-center gap-16">
        <div className="px-4">
          <h2 className="text-4xl md:text-6xl font-black text-[#F3F4F6] mb-5 tracking-tight">
            Neural Execution Pipeline
          </h2>
          <p className="text-[#64748B] text-xl max-w-2xl mx-auto font-light">Data streams through five precision stages—every millisecond tracked.</p>
        </div>
        <div className="w-full px-4 md:px-8" ref={pipeRef}>
          <div className="flex flex-col lg:flex-row items-center justify-between home-pipeline-container gap-6 lg:gap-0 w-full">
            {[
              { label: 'Code Parsing', icon: Code2, sub: 'AST Gen' },
              { label: 'AI Fuzzing', icon: Cpu, sub: 'Input Synth' },
              { label: 'Sandbox Exec', icon: Activity, sub: 'Runtime Mon' },
              { label: 'Heuristics', icon: Eye, sub: 'Anomaly Detect' },
              { label: 'Remediation', icon: ShieldCheck, sub: 'Patch Deploy' },
            ].map((node, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="flex flex-col items-center justify-center p-8 rounded-sm border transition-all duration-700 w-full lg:w-52 z-10"
                  style={{
                    borderColor: pipe >= i ? '#00F3FF' : '#1E293B',
                    background: pipe >= i ? 'rgba(0,243,255,0.07)' : 'rgba(8,8,11,0.7)',
                    boxShadow: pipe >= i ? '0 0 30px rgba(0,243,255,0.2), inset 0 0 20px rgba(0,243,255,0.03)' : '0 0 40px rgba(0,0,0,0.5)',
                    transform: pipe >= i ? 'translateY(-6px)' : 'none',
                  }}
                >
                  <node.icon size={32} className="mb-4 transition-all duration-500"
                    style={{ color: pipe >= i ? '#00F3FF' : '#475569', filter: pipe >= i ? 'drop-shadow(0 0 10px #00F3FF)' : 'none' }} />
                  <span className="text-sm font-black text-center transition-colors duration-500"
                    style={{ color: pipe >= i ? '#F3F4F6' : '#94A3B8' }}>
                    {node.label}
                  </span>
                  <span className="text-[10px] mt-2 uppercase tracking-widest font-bold transition-colors duration-500"
                    style={{ color: pipe >= i ? '#00F3FF' : '#334155' }}>
                    {node.sub}
                  </span>
                </motion.div>
                {i < 4 && (
                  <div className="home-pipeline-connection">
                    <div className="home-pipeline-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Scene>

      {/* ── SCENE 7: STATS ── */}
      <div id="stats" className="home-stats relative z-20 border-t border-[#0F172A] pb-32"
        style={{ background: 'rgba(3,3,5,0.9)', backdropFilter: 'blur(30px)' }}>
        <div className="text-center pt-24 pb-12 px-4">
          <h2 className="text-4xl md:text-5xl font-black text-[#F3F4F6] mb-4 tracking-tight">Impact at Scale</h2>
          <p className="text-[#64748B] text-lg">Numbers that define a new security standard.</p>
        </div>
        <StatsBar />
      </div>
    </div>
  );
};

export default Home;
