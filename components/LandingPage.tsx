
import React from 'react';
import { LogoIcon } from './Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 text-center bg-brand-white rounded-lg shadow-md border border-brand-grey/20">
        <div className="mb-4 text-brand-burgundy">{icon}</div>
        <h3 className="mb-2 text-xl font-bold text-brand-navy">{title}</h3>
        <p className="text-brand-grey">{description}</p>
    </div>
);

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-brand-beige text-brand-black font-sans">
            {/* Header */}
            <header className="p-4 sm:p-6">
                <nav className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="w-8 h-8 text-brand-navy" />
                        <span className="text-2xl font-bold tracking-wide text-brand-navy">Aura</span>
                    </div>
                    <button
                        onClick={onGetStarted}
                        className="px-6 py-2 font-bold text-white bg-brand-navy rounded-md hover:bg-brand-burgundy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy transition-colors"
                    >
                        Sign In
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="container mx-auto text-center py-20 sm:py-32 px-4">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-brand-navy tracking-tight">
                        Finally, a beautiful OS for your life.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-brand-navy/80">
                        Aura is your intelligent personal operating system. Seamlessly manage habits, notes, and goals with an AI-powered assistant designed to bring clarity and focus to your day.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="mt-10 px-8 py-4 font-bold text-lg text-white bg-brand-burgundy rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy transition-all transform hover:scale-105"
                    >
                        Get Started for Free
                    </button>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-brand-white/50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-navy mb-12">Everything you need. All in one place.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                                title="Habit Tracking"
                                description="Build life-changing habits with a flexible and beautiful tracker that keeps you motivated."
                            />
                            <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.001 12A3 3 0 009.879 16.121z" /></svg>}
                                title="AI Assistant"
                                description="Leverage the power of Gemini to add habits, take notes, and get insights with simple commands."
                            />
                             <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                                title="Notes & Reflections"
                                description="Capture your thoughts, ideas, and end-of-month reflections to track your progress and growth."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-brand-white/50">
                <div className="container mx-auto text-center text-brand-grey">
                    <p>&copy; 2024 Aura OS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
