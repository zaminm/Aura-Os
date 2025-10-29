
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { Habit, Profile } from './types';
import { LogoIcon, PlusCircleIcon, MinusCircleIcon, LogoutIcon, UserCircleIcon, SpinnerIcon } from './components/Icons';
import { Auth } from './components/Auth';
import * as dbService from './services/dbService';
import { supabase } from './services/supabase';
import { LandingPage } from './components/LandingPage';
import { ProfileSetup } from './components/ProfileSetup';

const ProfileModal: React.FC<{
    profile: Profile;
    session: Session;
    onClose: () => void;
    onProfileUpdate: (updatedProfile: Profile) => void;
}> = ({ profile, session, onClose, onProfileUpdate }) => {
    const [name, setName] = useState(profile.name);
    const [age, setAge] = useState(String(profile.age));
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const ageNumber = parseInt(age, 10);
        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }
        if (isNaN(ageNumber) || ageNumber <= 0) {
            setError("Please enter a valid age.");
            return;
        }
        
        if (name === profile.name && ageNumber === profile.age) {
            onClose();
            return;
        }

        setIsSaving(true);
        try {
            const updatedProfile = await dbService.updateProfile({ name, age: ageNumber });
            onProfileUpdate(updatedProfile);
            onClose();
        } catch (e: any) {
            setError(e.message || "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-brand-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">Edit Profile</h3>
                <form onSubmit={handleSave}>
                    <div className="space-y-4 text-brand-navy">
                        <div>
                            <label htmlFor="profile-name" className="block text-sm font-medium text-brand-navy">Name</label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="profile-age" className="block text-sm font-medium text-brand-navy">Age</label>
                            <input
                                id="profile-age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
                                required
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-brand-navy">Email</label>
                             <p className="mt-1 text-brand-grey">{session.user.email}</p>
                        </div>
                    </div>
                     {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                    <div className="mt-6 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 font-bold text-brand-navy bg-transparent rounded-md hover:bg-brand-grey/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 h-10 w-32 font-bold text-white bg-brand-navy rounded-md hover:bg-brand-burgundy transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                             {isSaving ? <SpinnerIcon className="w-6 h-6" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const TextAreaSection: React.FC<{title: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, onBlur: () => void}> = ({ title, value, onChange, onBlur }) => (
    <div className="mt-6">
        <h4 className="font-bold text-brand-navy tracking-wider">{title}</h4>
        <textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            rows={3}
            className="w-full mt-1 p-2 border border-brand-black rounded-md focus:ring-2 focus:ring-brand-burgundy focus:outline-none bg-brand-white text-brand-black"
        />
    </div>
);


const HabitTracker: React.FC<{ 
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  currentMonthDate: Date;
  onMonthChange: (date: Date) => void;
  habitNotes: string;
  setHabitNotes: (notes: string) => void;
  monthlyReflection: string;
  setMonthlyReflection: (reflection: string) => void;
  handleUpdateHabit: (habitId: number, updates: Partial<Habit>) => Promise<void>;
}> = (props) => {
    const { 
        habits, setHabits,
        currentMonthDate, onMonthChange,
        habitNotes, setHabitNotes,
        monthlyReflection, setMonthlyReflection,
        handleUpdateHabit
    } = props;
    
    const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
    
    const monthKey = getMonthKey(currentMonthDate);
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

    const monthList = useMemo(() => {
        const list: Date[] = [];
        const today = new Date();
        const startYear = today.getFullYear() - 5;
        const endYear = today.getFullYear() + 5;
        for (let y = startYear; y <= endYear; y++) {
            for (let m = 0; m < 12; m++) {
                list.push(new Date(y, m, 1));
            }
        }
        return list;
    }, []);
    const monthContainerRef = useRef<HTMLDivElement>(null);
    const activeMonthRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (activeMonthRef.current && monthContainerRef.current) {
            const container = monthContainerRef.current;
            const activeEl = activeMonthRef.current;
            const scrollLeft = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2);
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, [currentMonthDate]);
    
    const handleAddHabit = async () => {
        const newHabit: Habit = { id: Date.now(), name: "", completions: {} };
        const originalHabits = habits;
        setHabits(prev => [...prev, newHabit]);
        try {
            await dbService.addHabit(monthKey, newHabit);
        } catch (error) {
            console.error("Failed to add habit:", error);
            // Revert state on failure
            setHabits(originalHabits);
        }
    };
    
    const handleDeleteHabit = async () => {
        if (selectedHabitId === null) return;
        const habitToDelete = habits.find(h => h.id === selectedHabitId);
        if (!habitToDelete) return;
        
        const originalHabits = habits;
        setHabits(prev => prev.filter(h => h.id !== selectedHabitId));
        setSelectedHabitId(null);
        try {
            await dbService.deleteHabit(selectedHabitId);
        } catch (error) {
            console.error("Failed to delete habit:", error);
            // Revert state
            setHabits(originalHabits);
        }
    };

    const handleToggleHabit = (habitId: number, date: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;
        const newCompletions = { ...habit.completions };
        if (newCompletions[date]) delete newCompletions[date];
        else newCompletions[date] = true;
        handleUpdateHabit(habitId, { completions: newCompletions });
    };

    return (
        <div className="bg-brand-white p-4 sm:p-6 rounded-lg shadow-lg border border-brand-grey/30">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-navy text-center tracking-widest mb-4">HABIT TRACKER</h3>
            
            <div className="border-y-2 border-brand-black py-2 mb-4 flex items-center">
                <div ref={monthContainerRef} className="flex-1 flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide px-4">
                    {monthList.map((dateItem, idx) => {
                        const itemMonth = dateItem.getMonth();
                        const itemYear = dateItem.getFullYear();
                        const isSelected = itemMonth === month && itemYear === year;
                        
                        const prevDate = idx > 0 ? monthList[idx - 1] : null;
                        const showYearSeparator = prevDate && prevDate.getFullYear() !== itemYear;

                        let label = monthNames[itemMonth];
                        if (itemMonth === 0) {
                            label = `${label} '${itemYear.toString().slice(-2)}`;
                        }

                        return (
                            <React.Fragment key={`${itemYear}-${itemMonth}`}>
                                {showYearSeparator && (
                                    <div className="border-l-2 border-brand-grey/30 h-4 self-center mx-1 sm:mx-2"></div>
                                )}
                                <button
                                    ref={isSelected ? activeMonthRef : null}
                                    onClick={() => onMonthChange(dateItem)}
                                    className={`py-1 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${isSelected ? 'text-brand-navy border-b-2 border-brand-navy px-3' : 'text-brand-navy/60 hover:text-brand-navy px-3'}`}
                                >
                                    {label}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6">
                 <div className="flex justify-between items-center">
                    <h4 className="font-bold text-brand-navy tracking-wider">MONTHLY GOAL</h4>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleDeleteHabit} disabled={selectedHabitId === null} className="text-brand-burgundy hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete selected habit">
                            <MinusCircleIcon className="w-6 h-6" />
                        </button>
                        <button onClick={handleAddHabit} className="text-brand-burgundy hover:opacity-80 transition-opacity" aria-label="Add new habit">
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="mt-2 p-4 border border-brand-black rounded-md space-y-3 bg-brand-white">
                    {habits.map((habit) => (
                        <div key={habit.id} className={`flex items-center p-1 rounded-md transition-colors ${selectedHabitId === habit.id ? 'bg-habit-pink' : 'bg-transparent'}`}>
                            <span className="mr-3 text-brand-navy font-bold text-xl">∙</span>
                            <input
                                type="text"
                                value={habit.name}
                                onFocus={() => setSelectedHabitId(habit.id)}
                                onChange={(e) => setHabits(prev => prev.map(h => h.id === habit.id ? {...h, name: e.target.value} : h))}
                                onBlur={() => handleUpdateHabit(habit.id, { name: habit.name })}
                                placeholder="Enter a goal to track as a habit..."
                                className="w-full text-brand-navy bg-transparent border-0 border-b border-dashed border-brand-grey focus:ring-0 focus:border-brand-navy transition-colors placeholder-brand-grey"
                            />
                        </div>
                    ))}
                    {habits.length === 0 && <p className="text-brand-grey text-center">No goals yet. Add one to get started!</p>}
                </div>
            </div>

            <TextAreaSection title="NOTES" value={habitNotes} onChange={(e) => setHabitNotes(e.target.value)} onBlur={() => dbService.saveNote(monthKey, habitNotes)} />

            <div className="border border-brand-black mt-6">
                <div className="flex bg-brand-grey/10">
                    <div className="w-2/5 sm:w-1/4 p-2 border-r border-brand-black font-bold text-center text-sm">HABIT</div>
                    <div className="w-3/5 sm:w-3/4 p-2">
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays.map((day, index) => <div key={index} className="text-center font-bold text-xs text-brand-navy">{day}</div>)}
                        </div>
                    </div>
                </div>
                {habits.map(habit => (
                    <div key={habit.id} className="flex border-t border-brand-black">
                        <div className="w-2/5 sm:w-1/4 p-1 sm:p-2 border-r border-brand-black flex items-center justify-center">
                           <span className="w-full text-sm font-semibold text-brand-navy text-center px-1">{habit.name}</span>
                        </div>
                        <div className="w-3/5 sm:w-3/4 p-2">
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} />)}
                                {daysArray.map(day => {
                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const isCompleted = habit.completions[dateStr];
                                    return <button key={day} onClick={() => handleToggleHabit(habit.id, dateStr)} className={`w-6 h-6 rounded-full border border-brand-grey text-xs flex items-center justify-center transition-colors ${isCompleted ? 'bg-brand-navy text-white' : 'hover:bg-brand-grey/20'}`}>{day}</button>
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <TextAreaSection title="END OF THE MONTH REFLECTION" value={monthlyReflection} onChange={(e) => setMonthlyReflection(e.target.value)} onBlur={() => dbService.saveReflection(monthKey, monthlyReflection)} />
        </div>
    );
};

const getMonthKey = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
    
    // State for the current month's data
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitNotes, setHabitNotes] = useState('');
    const [monthlyReflection, setMonthlyReflection] = useState('');

    const loadProfile = async () => {
        try {
            const userProfile = await dbService.getProfile();
            setProfile(userProfile);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            // Re-throw to be caught by callers
            throw error;
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                if (session) {
                    await loadProfile();
                }
            } catch (error) {
                console.error("Error during app initialization:", error);
            } finally {
                setLoading(false);
            }
        };
        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                try {
                    await loadProfile();
                } catch (error) {
                     console.error("Error loading profile on auth state change:", error);
                     setProfile(null);
                }
            } else {
                setProfile(null);
            }
            if (!session) {
                setShowAuth(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchDataForMonth = useCallback(async (date: Date) => {
        if (!session || !profile) return;
        setLoading(true);
        try {
            const monthKey = getMonthKey(date);
            const data = await dbService.getDataForMonth(monthKey);
            setHabits(data.habits);
            setHabitNotes(data.note);
            setMonthlyReflection(data.reflection);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, [session, profile]);
    
    useEffect(() => {
        fetchDataForMonth(currentMonthDate);
    }, [currentMonthDate, fetchDataForMonth]);

    const handleUpdateHabit = async (habitId: number, updates: Partial<Habit>) => {
        const originalHabits = [...habits];
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, ...updates } : h));
        try {
            await dbService.updateHabit(habitId, updates);
        } catch (error) {
            console.error("Failed to update habit:", error);
            setHabits(originalHabits);
        }
    };
    
    const handleProfileSetupComplete = async () => {
        setLoading(true);
        await loadProfile();
        setLoading(false);
    }

    const handleProfileUpdate = (updatedProfile: Profile) => {
        setProfile(updatedProfile);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-brand-beige text-brand-navy">Loading...</div>;
    }

    if (!session) {
        return showAuth ? <Auth onBack={() => setShowAuth(false)} /> : <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }

    if (!profile) {
        return <ProfileSetup onProfileSetupComplete={handleProfileSetupComplete} />;
    }

    return (
        <div className="flex flex-col h-screen font-sans bg-brand-beige">
             {showProfile && profile && <ProfileModal profile={profile} session={session} onClose={() => setShowProfile(false)} onProfileUpdate={handleProfileUpdate} />}
             <header className="p-4 bg-brand-navy text-brand-beige flex items-center justify-between shadow-lg z-10">
                <div className="flex items-center">
                    <LogoIcon className="w-8 h-8" />
                    <h1 className="ml-3 text-2xl font-bold tracking-wide">Aura</h1>
                </div>
                 <div className="flex items-center space-x-2">
                    <button onClick={() => setShowProfile(true)} className="p-2 hover:bg-brand-burgundy rounded-full transition-colors" aria-label="View profile">
                        <UserCircleIcon className="w-6 h-6" />
                    </button>
                    <button onClick={handleSignOut} className="p-2 hover:bg-brand-burgundy rounded-full transition-colors" aria-label="Sign out">
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-8">
                 <HabitTracker 
                      habits={habits}
                      setHabits={setHabits}
                      currentMonthDate={currentMonthDate}
                      onMonthChange={setCurrentMonthDate}
                      habitNotes={habitNotes}
                      setHabitNotes={setHabitNotes}
                      monthlyReflection={monthlyReflection}
                      setMonthlyReflection={setMonthlyReflection}
                      handleUpdateHabit={handleUpdateHabit}
                    />
            </main>
        </div>
    );
}
