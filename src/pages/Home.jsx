import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
    GraduationCap, 
    ArrowRight, 
    CheckCircle, 
    Shield, 
    Zap, 
    Smartphone, 
    Globe, 
    BookOpen,
    Users,
    Star,
    ChevronDown,
    Menu,
    X,
    Sun,
    Moon,
    Bell,
    Layout,
    Clock,
    Target,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import Footer from '../components/Footer';

// --- Components ---

const BentoCard = ({ icon: Icon, title, description, className, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
        className={`bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 ${className}`}
    >
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
            <Icon className="w-32 h-32 text-primary-600" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:rotate-12 transition-transform duration-500">
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <h3 className="text-2xl font-bold dark:text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {description}
                </p>
            </div>
            <div className="mt-auto pt-6 flex items-center gap-2 text-primary-600 font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                <span>Explore Feature</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    </motion.div>
);

const StepIndicator = ({ number, title, description, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex gap-8 group"
    >
        <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center text-2xl font-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                {number}
            </div>
        </div>
        <div className="space-y-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{description}</p>
        </div>
    </motion.div>
);

// --- Main Page ---

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useAttendance();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 font-sans selection:bg-primary-500/20 selection:text-primary-800 transition-colors duration-500">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary-500 z-[60] origin-left"
                style={{ scaleX }}
            />

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            {/* Premium Sticky Nav */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
                <div className="glass-morphic px-6 py-4 rounded-[2rem] border border-white/40 dark:border-slate-800/40 flex items-center justify-between shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <div className="bg-slate-900 dark:bg-white p-2.5 rounded-2xl text-white dark:text-slate-900 group-hover:rotate-[15deg] transition-transform duration-500">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter dark:text-white">
                            Attendly<span className="text-primary-600">.</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        <a href="#features" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
                        <a href="#how" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">How it works</a>
                        <a href="#faq" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <button 
                            onClick={toggleDarkMode} 
                            className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/auth')}
                            className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl"
                        >
                            Get Started
                        </motion.button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button onClick={toggleDarkMode} className="p-3 text-slate-500 dark:text-slate-400">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Slide-down Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden p-4 shadow-2xl flex flex-col gap-2"
                        >
                            {['Features', 'How it works', 'FAQ'].map(item => (
                                <a 
                                    key={item}
                                    href={`#${item.toLowerCase().split(' ')[0]}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-4 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                            <button 
                                onClick={() => navigate('/auth')}
                                className="mt-2 w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-5 rounded-2xl font-black text-center"
                            >
                                GET STARTED
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero - Advanced Centered Layout */}
            <section className="relative pt-44 pb-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 dark:text-slate-400 font-bold text-sm"
                    >
                         <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                         Join 1,240+ students managing their future
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl sm:text-8xl font-black text-slate-950 dark:text-white leading-[0.9] tracking-tighter"
                    >
                        TRACK <span className="text-outline-primary dark:text-outline-white">LESS</span><br/>
                        ACCOMPLISH <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">MORE</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Ditch the notebooks. Master your academic life with the most intuitive attendance tracker ever built.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button 
                            onClick={() => navigate('/auth')}
                            className="group relative px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500"
                        >
                            START YOUR JOURNEY
                            <ArrowUpRight className="inline-block ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Hero Visual - Floating Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className="mt-32 max-w-6xl mx-auto px-6"
                >
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-4 bg-primary-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border-8 border-white/50 dark:border-slate-800/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                            <img 
                                src="/mockup.png" 
                                alt="Dashboard Preview" 
                                className="w-full h-auto transform hover:scale-105 transition-transform duration-1000"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000" }}
                            />
                        </div>
                        
                        {/* Floating Micro-data Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [2, 0, 2] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute -right-12 top-1/4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold">
                                    85%
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Physics 101</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Safe Status</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0], rotate: [-2, 0, -2] }}
                            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                            className="absolute -left-12 bottom-1/4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">System Alerts</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Smart Tracking On</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Features - Bento Grid Style */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="max-w-2xl">
                        <h2 className="text-primary-600 font-black tracking-widest uppercase text-sm mb-4">The Engine</h2>
                        <h3 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white leading-[0.9]">
                            BUILT FOR THE <br/> MODERN GENIUS.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                        <BentoCard
                            icon={Shield}
                            title="Zero Trust Data"
                            description="Your logs are yours. Military-grade local encryption keeps your attendance records private."
                            className="md:col-span-3 h-[400px]"
                        />
                        <BentoCard
                            icon={Zap}
                            title="Instant Insight"
                            description="Real-time calculations. See exactly how many classes you can skip without falling below target."
                            className="md:col-span-3 h-[400px]"
                            delay={0.1}
                        />
                        <BentoCard
                            icon={Smartphone}
                            title="Progressive Power"
                            description="PWA tech ensures it works flawlessly on any device, offline or online."
                            className="md:col-span-2 h-[350px]"
                            delay={0.2}
                        />
                        <BentoCard
                            icon={Target}
                            title="Goal Precision"
                            description="Set distinct targets for every subject and hit them every single time."
                            className="md:col-span-2 h-[350px]"
                            delay={0.3}
                        />
                        <BentoCard
                            icon={BarChart3}
                            title="Visual Logic"
                            description="High-fidelity charts that make complex data clear at a glance."
                            className="md:col-span-2 h-[350px]"
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Steps - Human Centric Layout */}
            <section id="how" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-6">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <h2 className="text-6xl font-black tracking-tighter">THREE TAPS <br/> TO FREEDOM.</h2>
                            <div className="space-y-12">
                                <StepIndicator 
                                    number="01" 
                                    title="Define the Grid" 
                                    description="Input your subjects and target percentages. It takes 60 seconds." 
                                />
                                <StepIndicator 
                                    number="02" 
                                    title="Taps only" 
                                    description="Mark your status with a single tap after every class. Native-feel UI." 
                                    delay={0.1}
                                />
                                <StepIndicator 
                                    number="03" 
                                    title="Execute Goals" 
                                    description="Let Attendly calculate the margin. Know exactly when to study or skip." 
                                    delay={0.2}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-20 bg-primary-500/20 rounded-full blur-[100px]"></div>
                            <img 
                                src="/students.png" 
                                alt="Focus" 
                                className="relative z-10 rounded-[4rem] shadow-2xl transform lg:rotate-3 hover:rotate-0 transition-transform duration-700" 
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - No-AI Minimalist Style */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <h2 className="text-6xl font-black tracking-tighter leading-none dark:text-white">CO-SIGNED BY <br/> TOP STUDENTS.</h2>
                        <div className="text-right">
                             <p className="text-primary-600 font-bold text-5xl">4.9/5</p>
                             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AVERAGE RATING</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800 rounded-[3rem] overflow-hidden">
                        {[
                            { name: "Rahul S.", role: "B.Tech @ IIT", text: "Finally an app that doesn't feel like a chore. The analytics are spot on." },
                            { name: "Anjali K.", role: "MBBS Intern", text: "Essential for medical students with crazy ward schedules. UI is pure silk." },
                            { name: "Sankalp P.", role: "CS Major", text: "The PWA integration is 10/10. Feels native on my iPhone home screen." }
                        ].map((t, idx) => (
                            <div key={idx} className="p-12 bg-white dark:bg-slate-900 border-r last:border-r-0 border-slate-200 dark:border-slate-800 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex gap-1 text-yellow-500 mb-8">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="text-2xl font-medium text-slate-900 dark:text-white mb-10 leading-relaxed italic">"{t.text}"</p>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">{t.name}</p>
                                    <p className="text-xs text-primary-600 font-bold tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ - Minimalist Accordion Style */}
            <section id="faq" className="py-32 px-6 bg-white dark:bg-slate-900 rounded-[4rem] mx-6 mb-12 shadow-sm">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black dark:text-white">YOUR QUESTIONS, ANSWERED.</h2>
                        <p className="text-slate-500 font-medium">Simple answers to common queries about Attendly.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Is it really free?", a: "Yes. Forever. We're building this for students, by students." },
                            { q: "What about data backup?", a: "Login with Google to sync your records across all your devices instantly." },
                            { q: "Is it an official app?", a: "No. Attendly is an independent student utility designed for personal tracking only." }
                        ].map((faq, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <h4 className="text-xl font-bold dark:text-white mb-3">{faq.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - Aggressive Modernism */}
            <section className="py-24 px-6 mb-20 text-center">
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto space-y-12"
                 >
                    <h2 className="text-6xl sm:text-9xl font-black tracking-[ -0.05em] dark:text-white leading-none">
                        OWN YOUR <br/> <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">TIME.</span>
                    </h2>
                    <p className="text-2xl text-slate-500 font-medium max-w-xl mx-auto">
                        Stop guessing your attendance. Start knowing your margin.
                    </p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/auth')}
                        className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-16 py-8 rounded-[3rem] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                    >
                        LAUNCH ATTENDLY NOW
                    </motion.button>
                 </motion.div>
            </section>

            <Footer />

            <style jsx>{`
                .glass-morphic {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                }
                .dark .glass-morphic {
                    background: rgba(15, 23, 42, 0.7);
                }
                .text-outline-primary {
                    -webkit-text-stroke: 2px #0ea5e9;
                    color: transparent;
                }
                .text-outline-white {
                    -webkit-text-stroke: 2px #ffffff;
                    color: transparent;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
};

export default Home;
