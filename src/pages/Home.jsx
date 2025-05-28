import React, {useState} from 'react';

const Home = () => {
    const [isHovered, setIsHovered] = useState()
    return (
        <div className="max-sm:scale-[0.75] max-sm:origin-center max-sm:p-6">
            <div
                className="flex flex-col items-center justify-center h-[71dvh] md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                    <div
                        className="w-[350px] h-[350px] border border-dotted border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-1/2"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                    <div
                        className="w-[420px] h-[420px] border border-dotted border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-1/2"></div>
                </div>
                <div
                    id="main-heading"
                    className="relative z-10 text-center"
                >
                    <h1
                        className={`text-[60px] text-[#1A1B1C] lg:text-[100px] font-inter font-normal tracking-tighter leading-none transition-transform duration-500 ease-in-out ${
                            isHovered ? '-translate-x-[20vw]' : 'translate-x-0'
                        }`}
                        style={{ opacity: 1 }}
                    >
                        Sophisticated<br />
                        <span
                            className={`block text-[#1A1B1C] transition-transform duration-500 ease-in-out ${isHovered ? 'text-left' : 'translate-x-0'}`}
                        >
                            skincare
                        </span>
                    </h1>
                </div>
                <p className="z-10 block lg:hidden w-[30ch] mt-4 text-[16px] font-semibold text-center text-muted-foreground text-[#1a1b1c83]">Skinstric
                    developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.</p>
                <div className="z-10 mt-4 lg:hidden"><a href="/testing">
                    <button className="relative flex items-center gap-4 hover:scale-105 duration-300"><span
                        className="text-[12px] font-bold cursor-pointer">ENTER EXPERIENCE</span>
                        <div
                            className="w-[24px] h-[24px] border border-solid border-black rotate-45 cursor-pointer"></div>
                        <span className="absolute left-[129px] scale-[0.5] hover:scale-60 duration-300"><svg
                            viewBox="0 0 24 24" width="24" height="24" className="fill-current text-black"><path
                            d="M8 5v14l11-7z"></path></svg></span></button>
                </a></div>
                <div
                    className="hidden lg:block fixed bottom-[calc(-7vh)] left-[calc(-20vw)] xl:left-[calc(-27vw)] 2xl:left-[calc(-31vw)] [@media(width>=1920px)]:left-[calc(-33vw)] font-normal text-sm text-[#1A1B1C] space-y-3 uppercase">
                    <p>Skinstric developed an A.I. that creates a<br/>highly-personalized routine tailored to<br/>what
                        your skin needs.</p></div>
                <div id="left-section"
                     className={`hidden lg:block fixed left-[calc(-53vw)] xl:left-[calc(-50vw)] top-1/2 -translate-y-1/2 w-[550px] h-[650px] transition-opacity duration-500 ease-in-out opacity-100`}>
                    <div className={`relative w-full h-full ${isHovered ? 'opacity-0 pointer-events-none duration-700' : 'opacity-100'}`}>
                        <img
                            src="/Rectangle-2779.png"
                            className="w-full h-full object-cover"
                            alt="Descriptive Text"
                        />
                        <div className={`absolute top-1/2 left-1/2 translate-x-1/3 -translate-y-1/2`}>
                            <button id="discover-button"
                                    className="group inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1">
                                <img src={"/button-icon-text-shrunk.jpg"} alt="Discover A.I."/>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="right-section"
                     className="hidden lg:block fixed right-[calc(-53vw)] xl:right-[calc(-50vw)] top-1/2 -translate-y-1/2 w-[550px] h-[650px]">
                    <div className="relative w-full h-full">
                        <img
                            src="/Rectangle-2779.png"
                            className="w-full h-full object-cover rotate-180"
                            alt="Descriptive Text"
                        />
                        <div className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2">
                            <a href="/testing">
                                <button id="take-test-button"
                                        className="group inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}>
                                    <img src={"/button-icon-text-shrunk-test.jpg"} alt="Discover A.I."/>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;