import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21.75C12 21.75 4.5 16.5 4.5 10.5a7.5 7.5 0 0 1 15 0c0 6-7.5 11.25-7.5 11.25Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 13.5L9 10.5L12 7.5L15 10.5L12 13.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const PlusCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-12a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V6zM17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L10 8.192l-5.357 1.786a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L16.25 10l-13.145-7.71z" />
    </svg>
);