import React, { useState } from 'react';
import { LogoIcon, SpinnerIcon } from './Icons';
import * as dbService from '../services/dbService';

export const ProfileSetup: React.FC<{ onProfileSetupComplete: () => void }> = ({ onProfileSetupComplete }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
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

        setLoading(true);
        try {
            await dbService.updateProfile({ name, age: ageNumber });
            onProfileSetupComplete();
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-beige">
            <div className="w-full max-w-sm p-8 space-y-6 bg-brand-white rounded-lg shadow-lg border border-brand-grey/30">
                <div className="flex flex-col items-center">
                    <LogoIcon className="w-12 h-12 text-brand-navy" />
                    <h1 className="mt-2 text-3xl font-bold tracking-wide text-brand-navy">Welcome to Aura</h1>
                    <p className="text-brand-grey">Let's set up your profile.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-navy">Name</label>
                        <input
                            id="name"
                            className="mt-1 w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-brand-navy">Age</label>
                        <input
                            id="age"
                            className="mt-1 w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
                            type="number"
                            placeholder="Your Age"
                            value={age}
                            required
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full h-10 px-4 py-2 font-bold text-white bg-brand-navy rounded-md hover:bg-brand-burgundy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy disabled:opacity-50 transition-colors flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? <SpinnerIcon className="w-6 h-6" /> : 'Save & Continue'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};
