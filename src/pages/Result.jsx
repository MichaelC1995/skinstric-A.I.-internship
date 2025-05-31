import React, {useState} from 'react';

const Result = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreviewImage(base64String);
                uploadImage(base64String);
            };
            reader.onerror = () => {
                setError('Failed to read the file.');
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (base64String) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64String,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            const result = await response.json();
            console.log('API Response:', result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[92vh] flex flex-col bg-white relative md:pt-[64px] justify-center">
            <div className="absolute top-2 left-9 md:left-8 text-left">
                <p className="font-semibold text-xs md:text-sm">TO START ANALYSIS</p>
            </div>
            <div
                className="flex-[0.4] justify-center md:flex-1 flex flex-col md:flex-row items-center xl:justify-center relative mb-0 md:mb-30 space-y-[100px] md:gap-x-[150px] md:space-y-0">
                <div className="flex flex-col items-center justify-center relative">
                    <div className="w-[270px] h-[270px] md:w-[290px] md:h-[290px]"></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[175px] h-[175px] md:w-[290px] md:h-[290px] animate-spin-slow rotate-45 rotate-200 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[147px] h-[147px] md:w-[267px] md:h-[267px] animate-spin-slower rotate-45 rotate-190 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[118px] h-[118px] md:w-[243px] md:h-[243px] animate-spin-slowest rotate-45 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                            alt="Camera Icon"
                            loading="lazy"
                            width="136"
                            height="136"
                            decoding="async"
                            data-nimg="1"
                            className="absolute w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                            src="/camera.jpg"
                            style={{color: 'transparent'}}
                        />
                        <img
                            alt="Camera Scan"
                            loading="lazy"
                            src="/Vector%201.jpg"
                            className="z-0 hidden md:block absolute w-[60px] md:w-[80px] top-1/2 left-1/2 translate-x-[55px] -translate-y-[93px] rotate-[15deg]"
                        />
                        <div
                            className="absolute top-1/2 left-1/2 translate-x-0 translate-y-[70px] md:translate-x-[150px] md:-translate-y-[110px]">
                            <p className="text-[12px] text-center md:text-left md:text-[14px] font-normal mt-2 leading-[24px]">
                                ALLOW A.I.<br/>TO SCAN YOUR FACE
                            </p>
                        </div>
                    </div>
                </div>
                {/* Gallery Section */}
                <div className="flex flex-col items-center justify-center relative mt-12 md:mt-0">
                    <div className="w-[270px] h-[270px] md:w-[290px] md:h-[290px]"></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[175px] h-[175px] md:w-[290px] md:h-[290px] animate-spin-slow rotate-45 rotate-205 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[147px] h-[147px] md:w-[267px] md:h-[267px] animate-spin-slower rotate-45 rotate-195 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div
                        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[118px] h-[118px] md:w-[243px] md:h-[243px] animate-spin-slowest rotate-45 border-dotted border-2 border-black opacity-10"
                    ></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                            alt="Photo Upload Icon"
                            loading="lazy"
                            width="136"
                            height="136"
                            decoding="async"
                            data-nimg="1"
                            className="absolute z-20 w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                            src="/gallery.jpg"
                            style={{color: 'transparent'}}
                            onClick={() => {
                                console.log('Gallery image clicked');
                                const fileInput = document.getElementById('fileInput');
                                if (fileInput) {
                                    fileInput.click();
                                } else {
                                    console.error('File input not found');
                                }
                            }}
                        />
                        <div className="absolute top-[75%] md:top-[70%] md:left-[17px] translate-y-[-10px]">
                            <p className="text-[12px] md:text-[14px] font-normal mt-2 leading-[24px] text-right">
                                ALLOW A.I.<br/>ACCESS GALLERY
                            </p>
                        </div>
                    </div>
                </div>
                <input
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            <div className="pt-4 md:pt-0 pb-8 bg-white sticky md:static bottom-30.5 mb-0 md:mb-0">
                <div className="absolute bottom-8 w-full flex justify-between md:px-9 px-13">
                    <a className="relative" aria-label="Back" href="/testing">
                        <div>
                            <div
                                className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                            </div>
                            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                <div
                                    className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                <span
                                    className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block group-hover:scale-[0.92] ease duration-300">▶</span>
                                <span className="text-sm font-semibold hidden sm:block ml-6">BACK</span>
                            </div>
                        </div>
                    </a>
                    <a href="/select">
                        <div className="hidden">
                            <div>
                                <div
                                    className="w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">PROCEED</span>
                                </div>
                                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                    <span className="text-sm font-semibold hidden sm:block mr-5">PROCEED</span>
                                    <div
                                        className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                    <span
                                        className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">▶</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default Result;