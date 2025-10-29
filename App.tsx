
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { Habit } from './types';
import { LogoIcon, PlusCircleIcon, MinusCircleIcon, LogoutIcon, PaperAirplaneIcon } from './components/Icons';
import { Auth } from './components/Auth';
import * as dbService from './services/dbService';
import { processUserCommand } from './services/geminiService';
import { supabase } from './services/supabase';

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

    const handleMonthNav = (monthIndex: number) => {
        onMonthChange(new Date(year, monthIndex, 1));
    };
    
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
                <div className="flex-1 flex justify-center items-center space-x-2 sm:space-x-4 overflow-x-auto pr-4">
                    {monthNames.map((name, index) => (
                        <button 
                            key={name}
                            onClick={() => handleMonthNav(index)}
                             className={`px-3 py-1 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${index === month ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-brand-navy/60 hover:text-brand-navy'}`}
                        >
                            {name}
                        </button>
                    ))}
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
const getYYYYMMDD = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CommandBar: React.FC<{
    onCommandSubmit: (command: string) => void;
    isProcessing: boolean;
}> = ({ onCommandSubmit, isProcessing }) => {
    const [command, setCommand] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isProcessing) return;
        onCommandSubmit(command);
        setCommand('');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-brand-white/80 backdrop-blur-sm border-t border-brand-grey/30 p-2 sm:p-4 z-20">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Tell Aura what to do..."
                        disabled={isProcessing}
                        className="w-full px-4 py-2 border rounded-full bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy transition-all"
                        aria-label="Command input"
                    />
                    <button
                        type="submit"
                        disabled={isProcessing || !command.trim()}
                        className="p-3 rounded-full bg-brand-navy text-white hover:bg-brand-burgundy disabled:bg-brand-grey transition-colors flex-shrink-0"
                        aria-label="Submit command"
                    >
                        {isProcessing ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessingCommand, setIsProcessingCommand] = useState(false);
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
    
    // State for the current month's data
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitNotes, setHabitNotes] = useState('');
    const [monthlyReflection, setMonthlyReflection] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchDataForMonth = useCallback(async (date: Date) => {
        if (!session) return;
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
    }, [session]);
    
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

    const handleCommandSubmit = async (command: string) => {
        setIsProcessingCommand(true);
        const { responseText, functionCall } = await processUserCommand(
            command,
            habits,
            habitNotes,
            monthlyReflection
        );

        if (functionCall) {
            const monthKey = getMonthKey(currentMonthDate);
            const { name, args } = functionCall;
            switch(name) {
                case 'add_habit': {
                    const newHabit: Habit = { id: Date.now(), name: args.name, completions: {} };
                    setHabits(prev => [...prev, newHabit]);
                    await dbService.addHabit(monthKey, newHabit);
                    break;
                }
                case 'log_habit_completion': {
                    const habitToLog = habits.find(h => h.name.toLowerCase() === args.name.toLowerCase());
                    if (habitToLog) {
                        const dateStr = args.date || getYYYYMMDD(new Date());
                        const newCompletions = { ...habitToLog.completions, [dateStr]: true };
                        await handleUpdateHabit(habitToLog.id, { completions: newCompletions });
                    } else {
                        alert(`Habit "${args.name}" not found.`);
                    }
                    break;
                }
                case 'add_habit_note': {
                    const newNotes = habitNotes ? `${habitNotes}\n- ${args.note}` : `- ${args.note}`;
                    setHabitNotes(newNotes);
                    await dbService.saveNote(monthKey, newNotes);
                    break;
                }
                case 'set_monthly_reflection': {
                    setMonthlyReflection(args.reflection);
                    await dbService.saveReflection(monthKey, args.reflection);
                    break;
                }
                default:
                    console.warn(`Unknown function call: ${name}`);
            }
        } else {
           alert(responseText);
        }

        setIsProcessingCommand(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-brand-beige text-brand-navy">Loading...</div>;
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="flex flex-col h-screen font-sans bg-brand-beige">
             <header className="p-4 bg-brand-navy text-brand-beige flex items-center justify-between shadow-lg z-10">
                <div className="flex items-center">
                    <LogoIcon className="w-8 h-8" />
                    <h1 className="ml-3 text-2xl font-bold tracking-wide">Aura</h1>
                </div>
                <button onClick={handleSignOut} className="p-2 hover:bg-brand-burgundy rounded-full transition-colors" aria-label="Sign out">
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24">
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
            <CommandBar onCommandSubmit={handleCommandSubmit} isProcessing={isProcessingCommand} />
        </div>
    );
}