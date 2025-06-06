import React from 'react';

const NameForm = ({ onSubmit, error, register }) => (
    <form
        onSubmit={onSubmit}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 opacity-100 animate-fade-in"
        aria-label="Enter your name to start analysis"
    >
        <div className="flex flex-col items-center opacity-100 max-w-[420px]">
            <p
                id="name-instruction"
                className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none"
            >
                CLICK TO TYPE
            </p>
            <input
                className="md:text-5xl text-3xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[98vw] max-w-[448px] min-w-[280px] pt-1 px-2 tracking-[-0.05em] leading-[50px] sm:leading-[64px] text-[#1A1B1C] placeholder:text-black placeholder:opacity-100 sm:placeholder:text-[48px]"
                placeholder="Introduce Yourself"
                autoComplete="off"
                type="text"
                {...register('name', {
                    required: 'Name cannot be empty.',
                    pattern: {
                        value: /^[a-zA-Z\s'-]+$/,
                        message: 'Name can only contain letters, spaces, hyphens, or apostrophes.',
                    },
                })}
                aria-describedby="name-instruction"
            />
            {error && <p className="text-red-500 text-[10px] sm:text-xs mt-2" role="alert">{error}</p>}
        </div>
    </form>
);

export default NameForm;