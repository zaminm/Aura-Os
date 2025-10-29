
import React, { useState, useCallback, useEffect } from 'react';
import { Habit } from './types';
import { LogoIcon, SendIcon, PlusCircleIcon } from './components/Icons';
import { processUserCommand } from './services/geminiService';

const ApiKeyModal: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
    const [key, setKey] = useState('');

    const handleSave = () => {
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-black/60 flex items-center justify-center z-50">
            <div className="bg-brand-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-xl font-bold text-brand-navy mb-4">Enter your Gemini API Key</h2>
                <p className="text-sm text-brand-grey mb-4">
                    To use Aura's AI features, you need a Google Gemini API key. You can get one for free from{' '}
                    <a href="https://aistudio.google.com/keys" target="_blank" rel="noopener noreferrer" className="text-brand-burgundy underline">
                        Google AI Studio
                    </a>.
                </p>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your API key here"
                    className="w-full px-3 py-2 border border-brand-black rounded-md focus:ring-2 focus:ring-brand-burgundy focus:outline-none"
                />
                <button
                    onClick={handleSave}
                    className="w-full mt-4 px-4 py-2 bg-brand-navy text-white font-bold rounded-md hover:bg-brand-navy/90 transition-colors"
                >
                    Save and Start
                </button>
            </div>
        </div>
    );
};


const AIAssistant: React.FC<{ onCommand: (cmd: string) => Promise<void>, loading: boolean, aiResponse: string }> = ({ onCommand, loading, aiResponse }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            onCommand(input.trim());
            setInput('');
        }
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-brand-beige/80 backdrop-blur-sm border-t border-brand-grey/20">
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-sm text-brand-navy mb-2 px-4 h-5 truncate">{aiResponse}</p>
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tell Aura what to do... e.g., 'add a new habit to meditate daily'"
                            className="w-full pl-4 pr-12 py-3 rounded-full bg-brand-white text-brand-navy border border-brand-grey/50 focus:ring-2 focus:ring-brand-burgundy focus:outline-none shadow-md transition-shadow"
                            disabled={loading}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-burgundy text-white hover:bg-brand-burgundy/80 disabled:bg-brand-grey transition-colors" disabled={loading}>
                            {loading ? 
                              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> :
                              <SendIcon className="w-5 h-5" />
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TextAreaSection: React.FC<{title: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void}> = ({ title, value, onChange }) => (
    <div className="mt-6">
        <h4 className="font-bold text-brand-navy tracking-wider">{title}</h4>
        <textarea
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full mt-1 p-2 border border-brand-black rounded-md focus:ring-2 focus:ring-brand-burgundy focus:outline-none bg-brand-white text-brand-black"
        />
    </div>
);


const HabitTracker: React.FC<{ 
  habits: Habit[]; 
  onToggleHabit: (habitId: number, date: string) => void;
  onUpdateHabitName: (habitId: number, newName: string) => void;
  currentMonthDate: Date;
  onMonthChange: (date: Date) => void;
  habitNotes: string;
  setHabitNotes: (notes: string) => void;
  monthlyReflection: string;
  setMonthlyReflection: (reflection: string) => void;
}> = (props) => {
    const { 
        habits, onToggleHabit, onUpdateHabitName,
        currentMonthDate, onMonthChange,
        habitNotes, setHabitNotes,
        monthlyReflection, setMonthlyReflection
    } = props;
    
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];

    const handleMonthNav = (monthIndex: number) => {
        onMonthChange(new Date(year, monthIndex, 1));
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
                <button className="pl-2 pr-2 text-brand-burgundy hover:opacity-80 transition-opacity">
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mt-6">
                <h4 className="font-bold text-brand-navy tracking-wider">MONTHLY GOAL</h4>
                <div className="mt-2 p-4 border border-brand-black rounded-md space-y-3 bg-brand-white">
                    {habits.slice(0, 3).map((habit, index) => (
                        <div key={habit.id || `habit-${index}`} className="flex items-center">
                            <span className="mr-3 text-brand-navy font-bold text-xl">∙</span>
                            <input
                                type="text"
                                value={habit.name}
                                onChange={(e) => onUpdateHabitName(habit.id, e.target.value)}
                                placeholder="Enter a goal to track as a habit..."
                                className="w-full text-brand-navy bg-transparent border-0 border-b border-dashed border-brand-grey focus:ring-0 focus:border-brand-navy transition-colors placeholder-brand-grey"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <TextAreaSection title="NOTES" value={habitNotes} onChange={(e) => setHabitNotes(e.target.value)} />

            <div className="border border-brand-black mt-6">
                <div className="flex bg-brand-grey/10">
                    <div className="w-2/5 sm:w-1/4 p-2 border-r border-brand-black font-bold text-center text-sm">HABIT</div>
                    <div className="w-3/5 sm:w-3/4 p-2">
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays.map((day, index) => (
                                <div key={index} className="text-center font-bold text-xs text-brand-navy">{day}</div>
                            ))}
                        </div>
                    </div>
                </div>
                {habits.map(habit => (
                    <div key={habit.id} className="flex border-t border-brand-black">
                        <div className="w-2/5 sm:w-1/4 p-1 sm:p-2 border-r border-brand-black flex items-center justify-center">
                           <span className="w-full text-sm font-semibold text-brand-navy text-center px-1">
                             {habit.name}
                           </span>
                        </div>
                        <div className="w-3/5 sm:w-3/4 p-2">
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} />)}
                                {daysArray.map(day => {
                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const isCompleted = habit.completions[dateStr];
                                    return <button key={day} onClick={() => onToggleHabit(habit.id, dateStr)} className={`w-6 h-6 rounded-full border border-brand-grey text-xs flex items-center justify-center transition-colors ${isCompleted ? 'bg-brand-navy text-white' : 'hover:bg-brand-grey/20'}`}>{day}</button>
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <TextAreaSection title="END OF THE MONTH REFLECTION" value={monthlyReflection} onChange={(e) => setMonthlyReflection(e.target.value)} />
        </div>
    );
};


const getDefaultHabits = (): Habit[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const daysInCurrentMonth = new Date(year, today.getMonth() + 1, 0).getDate();

    const createCompletions = (days: number[]): Record<string, boolean> => {
        const completions: Record<string, boolean> = {};
        days.forEach(day => {
            if (day <= daysInCurrentMonth) {
                completions[`${year}-${month}-${String(day).padStart(2, '0')}`] = true;
            }
        });
        return completions;
    };
    return [
        { id: 1, name: "Read for 15 minutes", completions: createCompletions([8, 9, 10, 11, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25, 27]) },
        { id: 2, name: "Morning walk", completions: createCompletions([1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26]) },
        { id: 3, name: "Drink 8 glasses of water", completions: {} },
    ];
};

export default function App() {
    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [habits, setHabits] = useState<Habit[]>([]);
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
    const [habitNotes, setHabitNotes] = useState('');
    const [monthlyReflection, setMonthlyReflection] = useState('');

    const [aiResponse, setAiResponse] = useState<string>("Welcome to Aura! How can I help you with your habits?");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!apiKey) {
            setIsModalOpen(true);
        } else {
             try {
                const storedHabits = localStorage.getItem('aura-habits');
                if (storedHabits) {
                    setHabits(JSON.parse(storedHabits));
                } else {
                    setHabits(getDefaultHabits());
                }
                setHabitNotes(localStorage.getItem('aura-habit-notes') || '');
                setMonthlyReflection(localStorage.getItem('aura-monthly-reflection') || '');
            } catch (error) {
                console.error("Failed to parse from localStorage", error);
                setHabits(getDefaultHabits());
            }
        }
    }, [apiKey]);
    
    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('aura-habits', JSON.stringify(habits));
        }
    }, [habits, apiKey]);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('aura-habit-notes', habitNotes);
        }
    }, [habitNotes, apiKey]);
    
    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('aura-monthly-reflection', monthlyReflection);
        }
    }, [monthlyReflection, apiKey]);
    

    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('gemini-api-key', key);
        setApiKey(key);
        setIsModalOpen(false);
    };

    const handleToggleHabit = (habitId: number, date: string) => {
        setHabits(prevHabits => 
            prevHabits.map(habit => {
                if (habit.id === habitId) {
                    const newCompletions = { ...habit.completions };
                    if (newCompletions[date]) {
                        delete newCompletions[date];
                    } else {
                        newCompletions[date] = true;
                    }
                    return { ...habit, completions: newCompletions };
                }
                return habit;
            })
        );
    };

    const handleUpdateHabitName = (habitId: number, newName: string) => {
        setHabits(prevHabits => 
            prevHabits.map(habit => habit.id === habitId ? { ...habit, name: newName } : habit)
        );
    };

    const handleAICommand = useCallback(async (command: string) => {
        if (!apiKey) {
            setAiResponse("Please set your API key first.");
            setIsModalOpen(true);
            return;
        }
        setLoading(true);
        setAiResponse(`Aura is thinking...`);
        
        const result = await processUserCommand(command, habits, habitNotes, monthlyReflection, apiKey);

        if (result.functionCall) {
            const { name, args } = result.functionCall;
            switch(name) {
                case 'add_habit':
                     setHabits(prev => {
                        if (prev.length >= 3) {
                            setAiResponse("You can only track 3 habits at a time.");
                            return prev;
                        }
                        const newHabit = { id: Date.now(), name: args.name, completions: {} };
                        return [...prev, newHabit];
                    });
                    setAiResponse(`New habit added: "${args.name}"`);
                    break;
                case 'log_habit_completion':
                    const dateToLog = args.date || new Date().toISOString().split('T')[0];
                    let habitLogged = false;
                    setHabits(prev => prev.map(h => {
                        if (h.name.toLowerCase() === args.name.toLowerCase()) {
                            habitLogged = true;
                            return { ...h, completions: { ...h.completions, [dateToLog]: true } };
                        }
                        return h;
                    }));
                    setAiResponse(habitLogged ? `Logged "${args.name}" for ${dateToLog}` : `Couldn't find the habit "${args.name}"`);
                    break;
                case 'add_habit_note':
                    setHabitNotes(prev => prev ? `${prev}\n- ${args.note}` : `- ${args.note}`);
                    setAiResponse(`Note added to habits section.`);
                    break;
                case 'set_monthly_reflection':
                    setMonthlyReflection(args.reflection);
                    setAiResponse(`Monthly reflection has been set.`);
                    break;
                default:
                    setAiResponse(`Sorry, I don't know how to do that.`);
            }
        } else {
            setAiResponse(result.responseText);
        }

        setLoading(false);
    }, [apiKey, habits, habitNotes, monthlyReflection]);
    
    if (isModalOpen) {
        return <ApiKeyModal onSave={handleSaveApiKey} />;
    }

    return (
        <div className="flex flex-col h-screen font-sans bg-brand-beige">
             <header className="p-4 bg-brand-navy text-brand-beige flex items-center shadow-lg z-10">
                <LogoIcon className="w-8 h-8" />
                <h1 className="ml-3 text-2xl font-bold tracking-wide">Aura</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
                 <HabitTracker 
                      habits={habits} 
                      onToggleHabit={handleToggleHabit} 
                      onUpdateHabitName={handleUpdateHabitName}
                      currentMonthDate={currentMonthDate}
                      onMonthChange={setCurrentMonthDate}
                      habitNotes={habitNotes}
                      setHabitNotes={setHabitNotes}
                      monthlyReflection={monthlyReflection}
                      setMonthlyReflection={setMonthlyReflection}
                    />
            </main>
            <AIAssistant onCommand={handleAICommand} loading={loading} aiResponse={aiResponse} />
        </div>
    );
}