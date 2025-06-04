/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
                'spin-slower': 'spin 7s linear infinite',
                'spin-slowest': 'spin 10s linear infinite',
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'fade-out': 'fadeOut 0.3s ease-in-out',
                'dot-bounce-1': 'dotBounce 1.2s ease-in-out infinite',
                'dot-bounce-2': 'dotBounce 1.2s ease-in-out infinite 0.2s',
                'dot-bounce-3': 'dotBounce 1.2s ease-in-out infinite 0.4s',
            },
            keyframes: {
                spin: {
                    '0%': {
                        transform: 'translate(-50%, -50%) rotate(0deg)',
                    },
                    '100%': {
                        transform: 'translate(-50%, -50%) rotate(360deg)',
                    },
                },
                dotBounce: {
                    '0%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-6px)' },
                },
            },
        },
    },
    plugins: [],
};