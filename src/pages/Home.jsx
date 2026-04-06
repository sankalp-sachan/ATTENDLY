import React from 'react';
import { motion } from 'framer-motion';
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
    Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import Footer from '../components/Footer';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group"
    >
        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useAttendance();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Redirect to dashboard if already logged in
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-primary-500/30 selection:text-primary-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-xl text-white">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            Attendly
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How it Works</a>
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        {user ? (
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center gap-2"
                            >
                                Dashboard <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/auth')}
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center gap-2"
                            >
                                Get Started <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4"
                    >
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700 dark:text-slate-200">Features</a>
                        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700 dark:text-slate-200">How it Works</a>
                        {user ? (
                            <button 
                                onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                                className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl font-bold"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <button 
                                onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                                className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl font-bold"
                            >
                                Get Started
                            </button>
                        )}
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Trusted by 1000+ Students
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">
                                Master Your <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Attendance</span> Track Your Success.
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                                Effortlessly manage your academic records, set target goals, and stay on top of your performance with Attendly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button 
                                    onClick={() => navigate(user ? '/dashboard' : '/auth')}
                                    className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/25 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {user ? 'Go to Dashboard' : 'Start Tracking Now'} <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    Learn More <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-6 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800"></div>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="flex text-yellow-500 mb-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="font-bold text-slate-700 dark:text-slate-300">4.9/5 Student Rating</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-[3rem] opacity-20 blur-3xl animate-pulse"></div>
                            <div className="relative bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
                                <img 
                                    src="/hero.png" 
                                    alt="Attendly Dashboard Preview" 
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";
                                    }}
                                />
                            </div>
                            
                            {/* Floating cards for added premium feel */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-8 top-1/4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Attendance</p>
                                        <p className="font-bold text-slate-900 dark:text-white">85% Safe</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-12 bottom-1/4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Smart Alerts</p>
                                        <p className="font-bold text-slate-900 dark:text-white">Enabled</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm">Powerful Features</h2>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white">Everything You Need to Excel</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            We've built all the tools students need to stay on track without the clutter.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Shield}
                            title="Privacy First"
                            description="Your data is your business. We prioritize your privacy with secure storage and strict data protocols."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Smart Alerts"
                            description="Never miss a mark. Get intelligent notifications when your attendance drops below your custom target."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Smartphone}
                            title="PWA Ready"
                            description="Install Attendly on any device. Experience a lightning-fast, app-like interface that works even offline."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Modern UI"
                            description="A beautiful, interactive experience designed for the modern student. Light and dark modes included."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={CheckCircle}
                            title="Detailed Stats"
                            description="Visualize your progress with insightful analytics. Hard data helps you make better decisions."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="Academic Focus"
                            description="Tailored specifically for academic workflows. Manage multiple subjects and targets effortlessly."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Simple Steps to <br/> Better Attendance</h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        step: "01",
                                        title: "Add Your Classes",
                                        desc: "Add your subjects, set your target percentage, and input your start date."
                                    },
                                    {
                                        step: "02",
                                        title: "Mark Daily Status",
                                        desc: "A quick tap to mark Present, Absent, or Holiday. It takes less than 5 seconds."
                                    },
                                    {
                                        step: "03",
                                        title: "Stay Informed",
                                        desc: "Track your real-time percentage and know exactly how many classes you can skip or must attend."
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                                            {step.step}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase transition-colors">{step.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-410 leading-relaxed max-w-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-primary-600/10 rounded-[3rem] absolute -inset-10 animate-pulse"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                                alt="Students using app" 
                                className="relative rounded-[2.5rem] shadow-2xl z-10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-primary-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-white">Loved by Students Everywhere</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Rahul S.",
                                role: "B.Tech Student",
                                text: "Attendly saved my semester. The smart alerts warned me just in time to stop me from falling below 75%."
                            },
                            {
                                name: "Anjali K.",
                                role: "Medical Student",
                                text: "The UI is so clean and fast. I use it every day to manage my tight schedule. Highly recommended!"
                            },
                            {
                                name: "Sankalp P.",
                                role: "Engineering Student",
                                text: "Best attendance app I've ever used. The PWA feature makes it feel like a real native app on my iPhone."
                            }
                        ].map((t, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-[2rem] shadow-xl"
                            >
                                <div className="flex text-yellow-500 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-slate-700 mb-6 italic">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                    <div>
                                        <p className="font-bold text-slate-900">{t.name}</p>
                                        <p className="text-xs text-slate-500 uppercase font-black">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Is Attendly free to use?",
                                a: "Yes! Attendly is completely free for students. We believe tracking your attendance shouldn't come with a price tag."
                            },
                            {
                                q: "Does it work offline?",
                                a: "Absolutely. Attendly is built as a Progressive Web App (PWA), meaning you can install it and use it even without an internet connection."
                            },
                            {
                                q: "Is my data secure?",
                                a: "We take privacy seriously. Your data is securely stored and we never share your personal academic records with anyone."
                            },
                            {
                                q: "How do I install the app?",
                                a: "Click the 'Install' button in the dashboard menu or use your browser's 'Add to Home Screen' option to get the app on your device."
                            }
                        ].map((faq, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-primary-900 rounded-[3rem] p-12 sm:p-20 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl sm:text-6xl font-black leading-tight">Ready to Take Control?</h2>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            Join thousands of students who are already using Attendly to manage their academic success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button 
                                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                                className="px-10 py-5 bg-white text-primary-900 rounded-2xl font-black text-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-2xl"
                            >
                                Get Started For Free
                            </button>
                            <button className="px-10 py-5 bg-primary-600/20 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">
                                View Demo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
