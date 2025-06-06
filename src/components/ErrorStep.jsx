import React from 'react';

const ErrorStep = ({ onRetry, onRestart, error }) => (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-opacity duration-300 opacity-100 animate-fade-in">
        <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
            {error || 'Something went wrong. Please try again.'}
        </p>
        <div className="flex space-x-4">
            <button onClick={onRetry} className="text-sm sm:text-base text-black border-b border-black">
                Retry
            </button>
            <button onClick={onRestart} className="text-sm sm:text-base text-black border-b border-black">
                Restart
            </button>
        </div>
    </div>
);

export default ErrorStep;