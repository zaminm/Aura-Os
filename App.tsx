// Fix: Corrected React import syntax to properly import hooks.
import React, { useState, useEffect } from 'react';
import { Habit } from './types';
import { LogoIcon, PlusCircleIcon, MinusCircleIcon } from './components/Icons';

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
  onAddHabit: () => void;
  onDeleteHabit: () => void;
  selectedHabitId: number | null;
  onSetSelectedHabitId: (id: number | null) => void;
  currentMonthDate: Date;
  onMonthChange: (date: Date) => void;
  habitNotes: string;
  setHabitNotes: (notes: string) => void;
  monthlyReflection: string;
  setMonthlyReflection: (reflection: string) => void;
}> = (props) => {
    const { 
        habits, onToggleHabit, onUpdateHabitName, onAddHabit,
        onDeleteHabit, selectedHabitId, onSetSelectedHabitId,
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
                 <div className="flex justify-between items-center">
                    <h4 className="font-bold text-brand-navy tracking-wider">MONTHLY GOAL</h4>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={onDeleteHabit} 
                            className="text-brand-burgundy hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Delete selected habit"
                            disabled={selectedHabitId === null}
                        >
                            <MinusCircleIcon className="w-6 h-6" />
                        </button>
                        <button onClick={onAddHabit} className="text-brand-burgundy hover:opacity-80 transition-opacity" aria-label="Add new habit">
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
                                onFocus={() => onSetSelectedHabitId(habit.id)}
                                onChange={(e) => onUpdateHabitName(habit.id, e.target.value)}
                                placeholder="Enter a goal to track as a habit..."
                                className="w-full text-brand-navy bg-transparent border-0 border-b border-dashed border-brand-grey focus:ring-0 focus:border-brand-navy transition-colors placeholder-brand-grey"
                            />
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <p className="text-brand-grey text-center">No goals yet. Add one to get started!</p>
                    )}
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

const getMonthKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
    const [monthlyHabits, setMonthlyHabits] = useState<Record<string, Habit[]>>({});
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
    const [habitNotes, setHabitNotes] = useState('');
    const [monthlyReflection, setMonthlyReflection] = useState('');
    const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

    useEffect(() => {
        try {
            const storedHabits = localStorage.getItem('aura-monthly-habits');
            const allHabits = storedHabits ? JSON.parse(storedHabits) : {};
            
            const currentMonthKey = getMonthKey(new Date());
            if (!allHabits[currentMonthKey]) {
                allHabits[currentMonthKey] = getDefaultHabits();
            }

            setMonthlyHabits(allHabits);
            setHabitNotes(localStorage.getItem('aura-habit-notes') || '');
            setMonthlyReflection(localStorage.getItem('aura-monthly-reflection') || '');
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
            const currentMonthKey = getMonthKey(new Date());
            setMonthlyHabits({ [currentMonthKey]: getDefaultHabits() });
        }
    }, []);
    
    useEffect(() => {
        if (Object.keys(monthlyHabits).length > 0) {
            localStorage.setItem('aura-monthly-habits', JSON.stringify(monthlyHabits));
        }
    }, [monthlyHabits]);

    useEffect(() => {
        localStorage.setItem('aura-habit-notes', habitNotes);
    }, [habitNotes]);
    
    useEffect(() => {
        localStorage.setItem('aura-monthly-reflection', monthlyReflection);
    }, [monthlyReflection]);

    const handleMonthChange = (date: Date) => {
        const monthKey = getMonthKey(date);
        if (!monthlyHabits[monthKey]) {
            setMonthlyHabits(prev => ({ ...prev, [monthKey]: [] }));
        }
        setCurrentMonthDate(date);
    };

    const handleToggleHabit = (habitId: number, date: string) => {
        const monthKey = getMonthKey(currentMonthDate);
        setMonthlyHabits(prevMonthlyHabits => {
            const habitsForMonth = prevMonthlyHabits[monthKey] || [];
            const updatedHabits = habitsForMonth.map(habit => {
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
            });
            return { ...prevMonthlyHabits, [monthKey]: updatedHabits };
        });
    };

    const handleUpdateHabitName = (habitId: number, newName: string) => {
        const monthKey = getMonthKey(currentMonthDate);
        setMonthlyHabits(prevMonthlyHabits => {
            const habitsForMonth = prevMonthlyHabits[monthKey] || [];
            const updatedHabits = habitsForMonth.map(habit => 
                habit.id === habitId ? { ...habit, name: newName } : habit
            );
            return { ...prevMonthlyHabits, [monthKey]: updatedHabits };
        });
    };

    const handleAddHabit = () => {
        const monthKey = getMonthKey(currentMonthDate);
        const newHabit: Habit = {
            id: Date.now(),
            name: "",
            completions: {}
        };
        setMonthlyHabits(prev => {
            const habitsForMonth = prev[monthKey] || [];
            return {
                ...prev,
                [monthKey]: [...habitsForMonth, newHabit]
            };
        });
    };
    
    const handleDeleteHabit = () => {
        if (selectedHabitId === null) return;
    
        const monthKey = getMonthKey(currentMonthDate);
        setMonthlyHabits(prevMonthlyHabits => {
            const habitsForMonth = prevMonthlyHabits[monthKey] || [];
            const updatedHabits = habitsForMonth.filter(h => h.id !== selectedHabitId);
            return { ...prevMonthlyHabits, [monthKey]: updatedHabits };
        });
        setSelectedHabitId(null);
    };

    const currentMonthKey = getMonthKey(currentMonthDate);
    const habitsForCurrentMonth = monthlyHabits[currentMonthKey] || [];

    return (
        <div className="flex flex-col h-screen font-sans bg-brand-beige">
             <header className="p-4 bg-brand-navy text-brand-beige flex items-center shadow-lg z-10">
                <LogoIcon className="w-8 h-8" />
                <h1 className="ml-3 text-2xl font-bold tracking-wide">Aura</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                 <HabitTracker 
                      habits={habitsForCurrentMonth} 
                      onToggleHabit={handleToggleHabit} 
                      onUpdateHabitName={handleUpdateHabitName}
                      onAddHabit={handleAddHabit}
                      onDeleteHabit={handleDeleteHabit}
                      selectedHabitId={selectedHabitId}
                      onSetSelectedHabitId={setSelectedHabitId}
                      currentMonthDate={currentMonthDate}
                      onMonthChange={handleMonthChange}
                      habitNotes={habitNotes}
                      setHabitNotes={setHabitNotes}
                      monthlyReflection={monthlyReflection}
                      setMonthlyReflection={setMonthlyReflection}
                    />
            </main>
        </div>
    );
}