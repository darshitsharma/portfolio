import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
    AnimatePresence,
    animate,
    motion,
    useInView,
    useReducedMotion,
} from 'motion/react'
import {
    ArrowDown,
    ArrowDownToLine,
    ArrowRight,
    ArrowUpRight,
    AudioLines,
    Award,
    BadgeCheck,
    Braces,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    Cpu,
    Database,
    ExternalLink,
    GraduationCap,
    Layers3,
    Mail,
    Menu,
    MessageCircle,
    Pause,
    Play,
    Workflow,
    X,
    Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { education, experience, personalProjects, profile, projects, skillGroups } from './data'
import type { ExperienceDocument, Project } from './data'
import brandAssets from './brand-assets.json'
import './App.css'

const Avatar = lazy(() => import('./Avatar'))
const skillLogos: Record<string, { file: string }> = brandAssets.skills
const assetPath = (file: string) => `${import.meta.env.BASE_URL}${file}`
const currentYear = new Date().getFullYear()
const projectTabs = [
    { id: 'company', label: 'Company projects', icon: BriefcaseBusiness },
    { id: 'personal', label: 'Personal projects', icon: Braces },
] as const
const navigation = [
    ['About', 'about'],
    ['Impact', 'impact'],
    ['Experience', 'experience'],
    ['Projects', 'projects'],
    ['Skills', 'skills'],
    ['Contact', 'contact'],
]

function Reveal({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
}) {
    const reduce = useReducedMotion()
    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.55, delay }}
        >
            {children}
        </motion.div>
    )
}

function Counter({
    value,
    suffix = '',
    prefix = '',
}: {
    value: number
    suffix?: string
    prefix?: string
}) {
    const element = useRef<HTMLSpanElement>(null)
    const visible = useInView(element, { once: true })
    const reduce = useReducedMotion()
    useEffect(() => {
        if (!visible || !element.current) return
        const control = animate(0, value, {
            duration: reduce ? 0 : 1.5,
            ease: 'easeOut',
            onUpdate: (latest) => {
                if (element.current)
                    element.current.textContent = `${prefix}${Math.round(latest).toLocaleString('en-IN')}${suffix}`
            },
        })
        return () => control.stop()
    }, [visible, value, suffix, prefix, reduce])
    return (
        <span ref={element}>
            {prefix}
            {value.toLocaleString('en-IN')}
            {suffix}
        </span>
    )
}

export function AvatarFallback() {
    return (
        <div className="fallback-bot" role="img" aria-label="Digital companion">
            <div className="fallback-head">
                <div className="fallback-face">
                    <i />
                    <i />
                </div>
            </div>
            <div className="fallback-body">
                <Cpu size={28} />
            </div>
        </div>
    )
}

function ProjectVisual({ type }: { type: Project['visual'] }) {
    if (type === 'twin')
        return (
            <div className="project-art twin-art" aria-hidden="true">
                <div className="art-topline">
                    <span>
                        <span className="status-dot" /> MODEL INFERENCE
                    </span>
                    <span>BATCH + ASYNC</span>
                </div>
                <div className="twin-pipeline">
                    <div className="signal-input">
                        <AudioLines size={34} />
                        <small>sensor data</small>
                    </div>
                    <div className="connector" />
                    <div className="model-core">
                        <Cpu size={31} />
                        <small>TCN + XGBoost</small>
                    </div>
                    <div className="connector" />
                    <div className="twin-output">
                        <span>&lt;0.05</span>
                        <small>NRMSE / wheel</small>
                        <div className="mini-bars">
                            {[38, 62, 43, 80, 57, 92, 68, 84, 48, 73, 60, 86].map(
                                (height, index) => (
                                    <i key={index} style={{ height: `${height}%` }} />
                                ),
                            )}
                        </div>
                    </div>
                </div>
                <div className="art-bottomline">
                    <span>VEHICLE SENSOR DATA</span>
                    <span>
                        FORCES & MOMENTS <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        )
    if (type === 'voice')
        return (
            <div className="project-art voice-art" aria-hidden="true">
                <div className="art-topline">
                    <span>
                        <span className="status-dot" /> KNOWLEDGE RETRIEVAL
                    </span>
                    <span>VOICE + RAG</span>
                </div>
                <div className="voice-query">
                    <div className="audio-icon">
                        <AudioLines size={22} />
                    </div>
                    <span>Find the last engine endurance test</span>
                    <div className="waveform">
                        {[9, 20, 14, 28, 18, 30, 12, 23, 8].map((height, index) => (
                            <i key={index} style={{ height }} />
                        ))}
                    </div>
                </div>
                <div className="retrieval-flow">
                    <span>Whisper</span>
                    <ArrowRight size={14} />
                    <span>RAG Fusion</span>
                    <ArrowRight size={14} />
                    <span className="retrieval-result">
                        <Check size={13} /> Context found
                    </span>
                </div>
                <div className="art-bottomline">
                    <span>NATURAL LANGUAGE IN</span>
                    <span>
                        RELEVANT ANSWERS OUT <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        )
    if (type === 'data')
        return (
            <div className="project-art data-art" aria-hidden="true">
                <div className="art-topline">
                    <span>
                        <span className="status-dot" /> DISTRIBUTED ANALYTICS
                    </span>
                    <span>BUILT TO SCALE</span>
                </div>
                <div className="data-pipeline">
                    <div className="data-node">
                        <Database size={25} />
                        <small>Test data</small>
                    </div>
                    <div className="connector" />
                    <div className="spark-cluster">
                        <Zap size={24} />
                        <span>PySpark</span>
                        <div>
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>
                    <div className="connector" />
                    <div className="data-node result-node">
                        <Layers3 size={25} />
                        <small>Intelligence</small>
                    </div>
                </div>
                <div className="art-bottomline">
                    <span>DATAPROC + STRUCTURED RAG</span>
                    <span>
                        ASYNC BY DESIGN <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        )
    return (
        <div className="project-art agents-art" aria-hidden="true">
            <div className="art-topline">
                <span>
                    <Award size={12} /> HACKATHON WINNER
                </span>
                <span>MAHINDRA / 2024</span>
            </div>
            <div className="agent-flow">
                {[
                    { icon: Braces, label: 'Screen' },
                    { icon: MessageCircle, label: 'Interview' },
                    { icon: Cpu, label: 'Analyze' },
                    { icon: Check, label: 'Rate' },
                ].map(({ icon: Icon, label }, index) => (
                    <div className="agent-step" key={label}>
                        <div>
                            <Icon size={23} />
                        </div>
                        <small>{label}</small>
                        {index < 3 && <ArrowRight className="agent-arrow" size={15} />}
                    </div>
                ))}
            </div>
            <div className="art-bottomline">
                <span>MULTI-AGENT ORCHESTRATION</span>
                <span>
                    CONNECTED WORKFLOWS <ArrowRight size={12} />
                </span>
            </div>
        </div>
    )
}

function ProjectDialog({
    project,
    onClose,
}: {
    project: Project | null
    onClose: () => void
}) {
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        if (project && !dialog.current?.open) dialog.current?.showModal()
        if (!project && dialog.current?.open) dialog.current?.close()
    }, [project])
    return (
        <dialog
            ref={dialog}
            className="project-dialog"
            onCancel={onClose}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            aria-labelledby="project-dialog-title"
        >
            {project && (
                <div className="project-dialog-content">
                    <div className="dialog-heading">
                        <span className="eyebrow">CASE STUDY / {project.number}</span>
                        <button
                            className="icon-button"
                            onClick={onClose}
                            aria-label="Close case study"
                            title="Close case study"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <h2 id="project-dialog-title">{project.title}</h2>
                    <p className="dialog-description">{project.description}</p>
                    <ProjectVisual type={project.visual} />
                    <div className="project-metrics">
                        {project.metrics.map((metric) => (
                            <div key={metric.label}>
                                <strong>{metric.value}</strong>
                                <small>{metric.label}</small>
                            </div>
                        ))}
                    </div>
                    <h3>The challenge</h3>
                    <p>{project.problem}</p>
                    <h3>Under the hood</h3>
                    <ol className="architecture-list">
                        {project.architecture.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <h3>Engineering decisions</h3>
                    <dl className="project-decisions">
                        {project.engineering.map((decision) => (
                            <div key={decision.title}>
                                <dt>{decision.title}</dt>
                                <dd>{decision.detail}</dd>
                            </div>
                        ))}
                    </dl>
                    <h3>Evaluation & scope</h3>
                    <p>{project.evaluation}</p>
                    <h3>The outcome</h3>
                    <p>{project.outcome}</p>
                    <div className="tags">
                        {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
                    <p className="source-note">
                        Source: supplied resume. Visualizations are illustrative; no
                        proprietary data is shown.
                    </p>
                </div>
            )}
        </dialog>
    )
}

function DocumentDialog({
    document,
    onClose,
}: {
    document: ExperienceDocument | null
    onClose: () => void
}) {
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        if (document && !dialog.current?.open) dialog.current?.showModal()
        if (!document && dialog.current?.open) dialog.current?.close()
    }, [document])
    return (
        <dialog
            ref={dialog}
            className="document-dialog"
            aria-labelledby="document-dialog-title"
            onCancel={onClose}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            {document && (
                <div className="document-dialog-content">
                    <div className="dialog-heading">
                        <div>
                            <span className="eyebrow">{document.kind} / {document.issued}</span>
                            <h2 id="document-dialog-title">{document.title}</h2>
                        </div>
                        <button className="icon-button" onClick={onClose} aria-label="Close document" title="Close document">
                            <X size={20} />
                        </button>
                    </div>
                    <img
                        className="document-image"
                        src={assetPath(document.preview ?? document.file)}
                        alt={`${document.title}, issued ${document.issued} to Darshit Sharma`}
                    />
                    <div className="document-footer">
                        <p>{document.description}</p>
                        <div className="document-actions">
                            <a className="text-link" href={assetPath(document.file)} target="_blank" rel="noopener noreferrer">
                                Open original <ExternalLink size={15} />
                            </a>
                            <a className="icon-button" href={assetPath(document.file)} download aria-label={`Download ${document.title}`} title="Download original">
                                <ArrowDownToLine size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </dialog>
    )
}

function SkillIcon({ index }: { index: number }) {
    const icons: LucideIcon[] = [Braces, Cpu, Database, Layers3]
    const Icon = icons[index]
    return <Icon size={21} />
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [avatarExcited, setAvatarExcited] = useState(false)
    const [avatarPaused, setAvatarPaused] = useState(false)
    const [filter, setFilter] = useState('All work')
    const [projectTab, setProjectTab] = useState<'company' | 'personal'>('company')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [selectedDocument, setSelectedDocument] = useState<ExperienceDocument | null>(null)
    const [expandedExperience, setExpandedExperience] = useState<number[]>([0])
    const [pdfBusy, setPdfBusy] = useState(false)
    const [pdfError, setPdfError] = useState('')
    const [activeSection, setActiveSection] = useState('about')
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries)
                    if (entry.isIntersecting) setActiveSection(entry.target.id)
            },
            { rootMargin: '-18% 0px -50% 0px', threshold: 0 },
        )
        navigation.forEach(([, id]) => {
            const section = document.getElementById(id)
            if (section) observer.observe(section)
        })
        return () => observer.disconnect()
    }, [])

    async function downloadResume() {
        setPdfBusy(true)
        setPdfError('')
        try {
            const { downloadResumePdf } = await import('./resume')
            downloadResumePdf()
        } catch {
            setPdfError('The PDF could not be generated. Please try again.')
        } finally {
            setPdfBusy(false)
        }
    }

    const visibleProjects = projects.filter(
        (project) =>
            filter === 'All work' ||
            (filter === 'GenAI & Agents'
                ? project.category === 'Generative AI'
                : project.category !== 'Generative AI'),
    )

    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <header className="site-header">
                <a className="brand" href="#about" aria-label="Darshit Sharma home">
                    <span className="brand-mark">
                        ds<span>.</span>
                    </span>
                    <span className="brand-name">
                        DARSHIT SHARMA<span>AI & ML ENGINEER</span>
                    </span>
                </a>
                <nav className="desktop-nav" aria-label="Main navigation">
                    {navigation.map(([label, id]) => (
                        <a
                            key={id}
                            className={activeSection === id ? 'active' : ''}
                            href={`#${id}`}
                            aria-current={activeSection === id ? 'location' : undefined}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
                <div className="nav-actions">
                    <button
                        className="resume-button"
                        onClick={downloadResume}
                        disabled={pdfBusy}
                    >
                        <ArrowDownToLine size={15} />
                        <span>{pdfBusy ? 'Preparing...' : 'Resume PDF'}</span>
                    </button>
                    <button
                        className="icon-button mobile-menu-button"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.nav
                            id="mobile-menu"
                            className="mobile-menu"
                            aria-label="Mobile navigation"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                        >
                            {navigation.map(([label, id]) => (
                                <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                                    {label}
                                    <ArrowUpRight size={16} />
                                </a>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>
            {pdfError && (
                <div className="error-toast" role="alert">
                    {pdfError}
                    <button
                        className="icon-button"
                        onClick={() => setPdfError('')}
                        aria-label="Dismiss error"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <main id="main">
                <section id="about" className="hero section-width">
                    <Reveal className="hero-copy">
                        <div className="availability">
                            <span className="status-dot" /> BUILDING INTELLIGENT SYSTEMS
                        </div>
                        <h1>
                            Darshit
                            <br />
                            Sharma<span className="blue-period">.</span>
                        </h1>
                        <p className="hero-roles">
                            Data Scientist <span>/</span> ML Engineer <span>/</span> AI
                            Engineer
                        </p>
                        <a
                            className="network-link"
                            href={profile.toptal}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Verified Expert in Engineering. Member since ${profile.toptalMemberSince}.`}
                        >
                            <BadgeCheck size={18} aria-hidden="true" />
                            Toptal network member
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                        <p className="hero-description">
                            From complex data to real-world impact.
                            <br className="desktop-break" /> I build production-grade AI,
                            agentic workflows, and ML systems that move businesses forward.
                        </p>
                        <div
                            className="hero-buttons"
                            onMouseEnter={() => setAvatarExcited(true)}
                            onMouseLeave={() => setAvatarExcited(false)}
                            onFocus={() => setAvatarExcited(true)}
                            onBlur={() => setAvatarExcited(false)}
                        >
                            <a className="button button-primary" href="#projects">
                                Explore my work
                                <ArrowUpRight size={18} />
                            </a>
                        </div>
                        <div className="hero-footnote">
                            <span className="tiny-line" />
                            <span>PRODUCTION-FIRST. IMPACT-DRIVEN.</span>
                        </div>
                    </Reveal>
                    <Reveal className="avatar-stage" delay={0.12}>
                        <div className="avatar-orbit orbit-outer" />
                        <div className="avatar-orbit orbit-inner" />
                        <div className="avatar-cross cross-one">+</div>
                        <div className="avatar-cross cross-two">+</div>
                        <span className="avatar-coordinate">PERSONAL AI / V.01</span>
                        <div className="avatar-canvas">
                            <Suspense fallback={<AvatarFallback />}>
                                <Avatar
                                    excited={avatarExcited}
                                    paused={avatarPaused || !!reduceMotion}
                                />
                            </Suspense>
                        </div>
                        <div className="floating-tag tag-vertex">
                            <span className="tag-logo cloud-logo">
                                <Layers3 size={17} />
                            </span>
                            Vertex AI
                            <span className="tag-online" />
                        </div>
                        <div className="floating-tag tag-langgraph">
                            <Workflow size={17} />
                            LangGraph
                        </div>
                        <div className="floating-tag tag-pyspark">
                            <Zap size={17} className="spark-icon" />
                            PySpark
                        </div>
                        <div className="floating-tag tag-fastapi">
                            <span className="fastapi-logo">
                                <Zap size={12} fill="currentColor" />
                            </span>
                            FastAPI
                        </div>
                        <div className="avatar-ground" />
                        <div className="avatar-status">
                            <span className="status-dot" />
                            <span>
                                Building GenAI & ML systems
                                <br />
                                <strong>@ Mahindra Group</strong>
                            </span>
                        </div>
                        <button
                            className="avatar-pause icon-button"
                            onClick={() => setAvatarPaused(!avatarPaused)}
                            disabled={!!reduceMotion}
                            title={
                                reduceMotion
                                    ? 'Animation disabled by reduced-motion preference'
                                    : avatarPaused
                                        ? 'Play avatar animation'
                                        : 'Pause avatar animation'
                            }
                            aria-label={
                                avatarPaused
                                    ? 'Play avatar animation'
                                    : 'Pause avatar animation'
                            }
                        >
                            {avatarPaused || reduceMotion ? (
                                <Play size={14} />
                            ) : (
                                <Pause size={14} />
                            )}
                        </button>
                    </Reveal>
                    <div className="hero-bottom">
                        <a href="#impact">
                            <ArrowDown size={14} />A little code. A lot of impact.
                        </a>
                        <span>
                            <span className="status-dot" /> CURRENTLY AT MAHINDRA GROUP
                        </span>
                    </div>
                </section>

                <section id="impact" className="impact-section section-width">
                    <Reveal>
                        <div className="section-kicker">
                            <span>01 / THE IMPACT</span>
                            <span>REAL SYSTEMS. MEASURABLE OUTCOMES.</span>
                        </div>
                    </Reveal>
                    <div className="impact-grid">
                        <Reveal className="impact-card" delay={0.04}>
                            <div className="metric-icon">
                                <ArrowUpRight size={19} />
                            </div>
                            <div className="impact-value">
                                <span className="metric-currency">INR</span>{' '}
                                <Counter value={172} suffix="+" />
                                <span className="metric-unit">Cr</span>
                            </div>
                            <h3>Business impact delivered</h3>
                            <p>
                                INR 152 Cr in business impact +<br />
                                INR 20 Cr in one-time savings.
                            </p>
                            <span className="metric-label">BUILT FOR THE BOTTOM LINE</span>
                        </Reveal>
                        <Reveal className="impact-card" delay={0.1}>
                            <div className="metric-icon">
                                <Zap size={19} />
                            </div>
                            <div className="impact-value">
                                <Counter value={95} suffix="%" />
                                <span className="metric-divider">/</span>
                                <Counter value={80} suffix="%" />
                            </div>
                            <h3>Efficiency & productivity gains</h3>
                            <p>
                                Across vehicle analytics and
                                <br />
                                engine testing workflows.
                            </p>
                            <span className="metric-label">
                                LESS FRICTION. MORE PROGRESS.
                            </span>
                        </Reveal>
                        <Reveal className="impact-card" delay={0.16}>
                            <div className="metric-icon">
                                <Cpu size={19} />
                            </div>
                            <div className="impact-value">R&amp;D</div>
                            <h3>Patent-pending digital AI twin</h3>
                            <p>
                                Applied research, predictive modeling, and scalable
                                digital-twin deployment.
                            </p>
                            <span className="metric-label">RESEARCH INTO REAL-WORLD IMPACT</span>
                        </Reveal>
                        <Reveal className="impact-card" delay={0.22}>
                            <div className="metric-icon">
                                <Workflow size={19} />
                            </div>
                            <div className="impact-value">GenAI</div>
                            <h3>Production-grade systems</h3>
                            <p>
                                Low-latency RAG with &gt;96.8% Top-K retrieval
                                accuracy.
                            </p>
                            <span className="metric-label">LOW LATENCY. HIGH ACCURACY.</span>
                        </Reveal>
                    </div>
                </section>

                <section id="projects" className="projects-section section-width">
                    <Reveal>
                        <div className="section-kicker">
                            <span>02 / SELECTED WORK</span>
                            <span>FROM PROOF OF CONCEPT TO PRODUCTION</span>
                        </div>
                        <div className="section-heading">
                            <div>
                                <h2>
                                    Engineered for{' '}
                                    <span className="muted-heading">the real world.</span>
                                </h2>
                                <p>A few things I’ve built. And the difference they made.</p>
                            </div>
                        </div>
                    </Reveal>
                    <div className="project-toolbar">
                        <div
                            className="project-tabs"
                            role="tablist"
                            aria-label="Project ownership"
                            onKeyDown={(event) => {
                                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                                event.preventDefault()
                                const currentIndex = projectTabs.findIndex((tab) => tab.id === projectTab)
                                const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? projectTabs.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + projectTabs.length) % projectTabs.length
                                setProjectTab(projectTabs[nextIndex].id)
                                event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus()
                            }}
                        >
                            {projectTabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    id={`projects-${id}-tab`}
                                    role="tab"
                                    aria-selected={projectTab === id}
                                    aria-controls={`projects-${id}-panel`}
                                    tabIndex={projectTab === id ? 0 : -1}
                                    onClick={() => setProjectTab(id)}
                                >
                                    <Icon size={16} aria-hidden="true" /> {label}
                                </button>
                            ))}
                        </div>
                        {projectTab === 'company' && <div
                            className="project-filters"
                            role="group"
                            aria-label="Filter professional projects"
                        >
                            {['All work', 'GenAI & Agents', 'ML & Data'].map((item) => (
                                <button
                                    key={item}
                                    className={filter === item ? 'selected' : ''}
                                    aria-pressed={filter === item}
                                    onClick={() => setFilter(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>}
                    </div>
                    <div id="projects-company-panel" role="tabpanel" aria-labelledby="projects-company-tab" hidden={projectTab !== 'company'} tabIndex={0}>
                        {projectTab === 'company' && <>
                            <div className="project-grid" aria-live="polite">
                                {visibleProjects.map((project, index) => (
                                    <Reveal key={project.id} delay={(index % 2) * 0.06}>
                                        <article className={`project-card project-${project.visual}`}>
                                            <button
                                                className="project-open"
                                                onClick={() => setSelectedProject(project)}
                                                aria-label={`Read case study: ${project.title}`}
                                            >
                                                <div className="project-tile-header">
                                                    <span><BriefcaseBusiness size={14} aria-hidden="true" /> Company project</span>
                                                    <span>/{project.number}</span>
                                                </div>
                                                <ProjectVisual type={project.visual} />
                                                <div className="project-content">
                                                    <div className="project-category">
                                                        <span>{project.category}</span>
                                                    </div>
                                                    <h3>{project.title}</h3>
                                                    <p>{project.description}</p>
                                                    <div className="tags">
                                                        {project.tags.map((tag) => (
                                                            <span key={tag}>{tag}</span>
                                                        ))}
                                                    </div>
                                                    <div className="project-metrics">
                                                        {project.metrics.map((metric) => (
                                                            <div key={metric.label}>
                                                                <strong>{metric.value}</strong>
                                                                <small>{metric.label}</small>
                                                            </div>
                                                        ))}
                                                        <span className="project-arrow">
                                                            <ArrowUpRight size={21} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        </article>
                                    </Reveal>
                                ))}
                            </div>
                            <p className="projects-note">
                                <span className="status-dot" /> Enterprise work, real outcomes.
                                Architecture summaries shared without proprietary data.
                            </p>
                        </>}
                    </div>
                    <div id="projects-personal-panel" role="tabpanel" aria-labelledby="projects-personal-tab" hidden={projectTab !== 'personal'} tabIndex={0}>
                        {projectTab === 'personal' && <div className="personal-work" aria-labelledby="personal-projects-title">
                            <Reveal>
                                <div className="personal-work-heading">
                                    <div>
                                        <span className="eyebrow">INDEPENDENT BUILDS & EXPERIMENTS</span>
                                        <h3 id="personal-projects-title">Personal projects</h3>
                                    </div>
                                    <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
                                        <img src={assetPath('logos/github.svg')} width={16} height={16} alt="" /> GitHub profile <ArrowUpRight size={16} />
                                    </a>
                                </div>
                            </Reveal>
                            <div className="project-grid">
                                {personalProjects.map((project) => (
                                    <Reveal key={project.id}>
                                        <article className="project-card personal-project" aria-labelledby={`${project.id}-title`}>
                                            <div className="project-tile-header">
                                                <span><Braces size={14} aria-hidden="true" /> Personal project</span>
                                                {project.id === 'agentflow' ? <Workflow size={18} aria-hidden="true" /> : <Cpu size={18} aria-hidden="true" />}
                                            </div>
                                            <div className="project-content personal-project-content">
                                                <span className="personal-project-category">{project.category}</span>
                                                <h3 id={`${project.id}-title`}>{project.title}</h3>
                                                <p>{project.description}</p>
                                                <ul>
                                                    {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                                                </ul>
                                                <div className="tags">
                                                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                                                </div>
                                                <a className="text-link personal-project-source" href={project.repository} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
                                                    Source code <ArrowUpRight size={16} />
                                                </a>
                                            </div>
                                        </article>
                                    </Reveal>
                                ))}
                            </div>
                        </div>}
                    </div>
                </section>

                <section id="experience" className="experience-section">
                    <div className="section-width">
                        <Reveal>
                            <div className="section-kicker">
                                <span>03 / THE JOURNEY</span>
                                <span>LEARNING. BUILDING. LEADING.</span>
                            </div>
                            <div className="section-heading">
                                <div>
                                    <h2>
                                        Experience{' '}
                                        <span className="muted-heading">that compounds.</span>
                                    </h2>
                                    <p>From reliable pipelines to enterprise-wide AI.</p>
                                </div>
                                <span className="section-side-label">2023 — PRESENT</span>
                            </div>
                        </Reveal>
                        <div className="timeline">
                            {experience.map((item, index) => {
                                const expanded = expandedExperience.includes(index)
                                return (
                                    <Reveal
                                        className={`experience-row ${item.current ? 'current-role' : ''}`}
                                        key={item.role}
                                        delay={index * 0.06}
                                    >
                                        <div className="timeline-date">
                                            <span>{item.date}</span>
                                            {item.current && (
                                                <span className="current-label">
                                                    <span className="status-dot" /> CURRENT ROLE
                                                </span>
                                            )}
                                        </div>
                                        <div className="timeline-node">
                                            <i />
                                        </div>
                                        <article className="experience-card">
                                            <button
                                                className="experience-toggle"
                                                aria-expanded={expanded}
                                                aria-controls={`experience-details-${index}`}
                                                onClick={() =>
                                                    setExpandedExperience(
                                                        expanded
                                                            ? expandedExperience.filter(
                                                                (entry) => entry !== index,
                                                            )
                                                            : [...expandedExperience, index],
                                                    )
                                                }
                                            >
                                                <div>
                                                    <div className="experience-company">
                                                        <span
                                                            className={`company-symbol ${item.company === 'MyEra Technologies' ? 'myera-symbol' : ''}`}
                                                        >
                                                            {item.company === 'MyEra Technologies' ? (
                                                                <Braces size={20} />
                                                            ) : (
                                                                <img src={assetPath(brandAssets.company.file)} alt="" width="23" height="23" />
                                                            )}
                                                        </span>
                                                        <span>{item.company}</span>
                                                    </div>
                                                    <h3>{item.role}</h3>
                                                    <p>{item.summary}</p>
                                                </div>
                                                <ChevronDown
                                                    size={19}
                                                    className={expanded ? 'chevron expanded' : 'chevron'}
                                                />
                                            </button>
                                            <div
                                                id={`experience-details-${index}`}
                                                hidden={!expanded}
                                                className="experience-details"
                                            >
                                                <ul>
                                                    {item.points.map((point) => (
                                                        <li key={point}>{point}</li>
                                                    ))}
                                                </ul>
                                                <div className="tags">
                                                    {item.tags.map((tag) => (
                                                        <span key={tag}>{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="experience-documents" aria-label={`${item.role} documents`}>
                                                    <h4>{item.current ? 'Awards & recognition' : 'Internship certificate'}</h4>
                                                    {item.documents.map((document) => (
                                                        <div className="experience-document" key={document.file}>
                                                            <button
                                                                className="document-preview"
                                                                onClick={() => setSelectedDocument(document)}
                                                                aria-label={`Preview ${document.title}`}
                                                                title={`Preview ${document.title}`}
                                                            >
                                                                <span className="document-thumbnail">
                                                                    <img src={assetPath(document.preview ?? document.file)} alt="" loading="lazy" />
                                                                </span>
                                                                <span className="document-label">
                                                                    <strong>{document.title}</strong>
                                                                    <span>{document.issued} <span aria-hidden="true">/</span> {document.format === 'pdf' ? 'PDF' : 'PNG'}</span>
                                                                </span>
                                                                <ArrowUpRight size={16} aria-hidden="true" />
                                                            </button>
                                                            <a
                                                                className="icon-button"
                                                                href={assetPath(document.file)}
                                                                download
                                                                aria-label={`Download ${document.title}`}
                                                                title={`Download ${document.title}`}
                                                            >
                                                                <ArrowDownToLine size={16} />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </article>
                                    </Reveal>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section id="skills" className="skills-section section-width">
                    <Reveal>
                        <div className="section-kicker">
                            <span>04 / THE TOOLKIT</span>
                            <span>THE RIGHT TOOL. THE RIGHT PROBLEM.</span>
                        </div>
                        <div className="section-heading">
                            <div>
                                <h2>
                                    Deep expertise.{' '}
                                    <span className="muted-heading">Full-stack thinking.</span>
                                </h2>
                                <p>From the model notebook to the production endpoint.</p>
                            </div>
                            <div className="toolkit-icon">
                                <Braces size={27} />
                            </div>
                        </div>
                    </Reveal>
                    <div className="skills-grid">
                        {skillGroups.map((group, index) => (
                            <Reveal
                                className="skill-group"
                                key={group.title}
                                delay={index * 0.04}
                            >
                                <div className="skill-heading">
                                    <span className="skill-icon">
                                        <SkillIcon index={index} />
                                    </span>
                                    <h3>{group.title}</h3>
                                    <span className="skill-number">/{group.number}</span>
                                </div>
                                <div className="skill-pills">
                                    {group.skills.map((skill) => (
                                        <span key={skill}>
                                            {skillLogos[skill] && (
                                                <img src={assetPath(skillLogos[skill].file)} alt="" width="17" height="17" loading="lazy" />
                                            )}
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                <section id="education" className="education-section section-width">
                    <Reveal className="education-layout">
                        <div className="education-block">
                            <span className="eyebrow">
                                <GraduationCap size={16} /> THE FOUNDATION
                            </span>
                            <h3>
                                B.Tech, Computer Science
                                <br />& Engineering
                            </h3>
                            <p>JECRC University · Jaipur, India</p>
                            <div className="education-meta">
                                <span>2020 — 2024</span>
                                <span className="cgpa">
                                    9.48<span>/10 CGPA</span>
                                </span>
                            </div>
                        </div>
                        <div className="achievement-block">
                            <div className="award-icon">
                                <Award size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <span className="eyebrow">A LITTLE RECOGNITION</span>
                                <h3>Mahindra AI Hackathon</h3>
                                <p>2024 Winner · Multi-agent HR workflow system</p>
                                <button
                                    className="text-link"
                                    onClick={() => setSelectedProject(projects[3])}
                                >
                                    Meet the winning project <ArrowUpRight size={15} />
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </section>

                <section id="contact" className="contact-section">
                    <div className="section-width">
                        <Reveal>
                            <div className="section-kicker">
                                <span>05 / WHAT’S NEXT?</span>
                                <span>GOOD THINGS START WITH A CONVERSATION.</span>
                            </div>
                            <div className="contact-layout">
                                <div>
                                    <div className="availability">
                                        <span className="status-dot" /> LET’S CONNECT
                                    </div>
                                    <h2>
                                        Have a hard problem?
                                        <br />
                                        <span className="muted-heading">
                                            Let’s build the solution.
                                        </span>
                                    </h2>
                                    <p>
                                        AI systems, interesting collaborations, or the next big
                                        challenge.
                                        <br className="desktop-break" /> I’d love to hear what
                                        you’re working on.
                                    </p>
                                    <a
                                        className="button button-primary"
                                        href={`mailto:${profile.email}`}
                                    >
                                        Start a conversation
                                        <ArrowUpRight size={18} />
                                    </a>
                                </div>
                                <div className="contact-links">
                                    <a href={`mailto:${profile.email}`}>
                                        <span className="contact-link-icon">
                                            <Mail size={19} />
                                        </span>
                                        <span>
                                            <small>DROP ME A LINE</small>
                                            <strong>{profile.email}</strong>
                                        </span>
                                        <ArrowUpRight size={18} />
                                    </a>
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer">
                                        <span className="contact-link-icon">
                                            <ExternalLink size={19} />
                                        </span>
                                        <span>
                                            <small>LET’S CONNECT ON LINKEDIN</small>
                                            <strong>darshit-sharma</strong>
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                    <a href={profile.toptal} target="_blank" rel="noopener noreferrer">
                                        <span className="contact-link-icon"><BadgeCheck size={19} /></span>
                                        <span>
                                            <small>TOPTAL NETWORK</small>
                                            <strong>Verified Expert in Engineering</strong>
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                        <span className="contact-link-icon"><img src={assetPath('logos/github.svg')} width={19} height={19} alt="" /></span>
                                        <span>
                                            <small>CODE & PERSONAL PROJECTS</small>
                                            <strong>github.com/darshitsharma</strong>
                                        </span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>
            <footer className="site-footer section-width">
                <a href="#about" className="footer-brand">
                    ds<span>.</span>
                </a>
                <span>© {currentYear} Darshit Sharma</span>
                <span className="footer-note">
                    THOUGHTFULLY BUILT. ALWAYS EVOLVING.
                </span>
                <a
                    href="#about"
                    className="back-top"
                    aria-label="Back to top"
                    title="Back to top"
                >
                    <ArrowUpRight size={17} />
                </a>
            </footer>
            <ProjectDialog
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
            <DocumentDialog
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
            />
            <span className="sr-only">{education}</span>
        </>
    )
}

export default App
