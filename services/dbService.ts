import { supabase } from './supabase';
import { Habit, Profile } from '../types';

// Profile Functions
export const getProfile = async (): Promise<Profile | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, age')
        .eq('id', session.user.id)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows found"
    return data;
};

export const updateProfile = async (profileData: { name: string; age: number }): Promise<Profile> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: session.user.id, ...profileData }, { onConflict: 'id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};


// Habit Tracker Functions

// Fetch all data for a specific month for the current user
export const getDataForMonth = async (monthKey: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    const userId = session.user.id;

    const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('month_key', monthKey);

    const { data: note, error: noteError } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', userId)
        .eq('month_key', monthKey)
        .single();
    
    const { data: reflection, error: reflectionError } = await supabase
        .from('reflections')
        .select('content')
        .eq('user_id', userId)
        .eq('month_key', monthKey)
        .single();

    if (habitsError) throw habitsError;
    if (noteError && noteError.code !== 'PGRST116') throw noteError; // Ignore "no rows found"
    if (reflectionError && reflectionError.code !== 'PGRST116') throw reflectionError;

    return {
        habits: habits.map(h => ({ ...h, id: h.habit_id })) || [], // map habit_id to id
        note: note?.content || '',
        reflection: reflection?.content || ''
    };
};


// Add a new habit
export const addHabit = async (monthKey: string, habit: Habit) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from('habits')
        .insert({
            user_id: session.user.id,
            month_key: monthKey,
            habit_id: habit.id,
            name: habit.name,
            completions: habit.completions
        })
        .select()
        .single();
    
    if (error) throw error;
    return { ...data, id: data.habit_id };
};

// Update an existing habit
export const updateHabit = async (habitId: number, updates: Partial<Habit>) => {
    const { data, error } = await supabase
        .from('habits')
        .update({ name: updates.name, completions: updates.completions })
        .eq('habit_id', habitId)
        .select()
        .single();
    
    if (error) throw error;
    return { ...data, id: data.habit_id };
};


// Delete a habit
export const deleteHabit = async (habitId: number) => {
    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('habit_id', habitId);

    if (error) throw error;
};


// Save (upsert) notes for the month
export const saveNote = async (monthKey: string, content: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    
    const { error } = await supabase
        .from('notes')
        .upsert({
            user_id: session.user.id,
            month_key: monthKey,
            content: content
        }, { onConflict: 'user_id, month_key' });

    if (error) throw error;
};

// Save (upsert) reflection for the month
export const saveReflection = async (monthKey: string, content: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const { error } = await supabase
        .from('reflections')
        .upsert({
            user_id: session.user.id,
            month_key: monthKey,
            content: content
        }, { onConflict: 'user_id, month_key' });
    
    if (error) throw error;
};
