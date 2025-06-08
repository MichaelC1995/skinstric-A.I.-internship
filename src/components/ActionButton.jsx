import React from "react";

const DottedBorder = ({ sizes, baseOpacity = 5, animation }) => (
    <>
        {sizes.map((size, i) => (
            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className={`absolute border-dotted border-2 border-black opacity-${baseOpacity + i * 5} transition-opacity duration-300 rotate-45 ${animation ? `animate-spin-${animation[i]}` : ''}`}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                    }}
                />
            </div>
        ))}
    </>
);


const ActionButton = ({ iconSrc, altText, text, onClick, textPosition }) => (
    <div className="relative w-[216px] h-[216px] md:w-[348px] md:h-[348px] flex flex-col items-center justify-center">
        <DottedBorder sizes={[300, 270, 240]} />
        <div className="relative flex flex-col items-center justify-center z-20">
            <img
                alt={altText}
                src={iconSrc}
                className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] lg:w-[132px] lg:h-[132px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                onClick={onClick}
            />
            <div className={`hidden md:block absolute ${textPosition}`}>
                <p className="text-[14px] font-normal leading-[20px] min-w-[120px]">
                    {text.split('<br />').map((line, i) => (
                        <span key={i}>
              {line}
                            <br />
            </span>
                    ))}
                </p>
                <div className={`absolute ${textPosition.includes('top') ? 'top-[20px] right-[140px]' : 'bottom-[20px] left-[140px]'} w-[2px] h-[87px] bg-black rotate-[35deg] ${textPosition.includes('top') ? 'origin-top' : 'origin-bottom'} z-50`} />
            </div>
        </div>
    </div>
);

export {ActionButton, DottedBorder};