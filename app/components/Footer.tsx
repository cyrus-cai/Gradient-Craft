import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-900 py-8 relative overflow-hidden">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div>
                    <div
                        className="cursor-pointer flex items-center gap-2 group"
                        onClick={() => window.open("https://github.com/cyrus-cai/Gradient-Craft")}
                    >
                        <Image
                            src='/Icons/Github.svg'
                            width={20}
                            height={20}
                            alt='Github icon'
                            className="invert"
                        />
                        <p className='text-sm text-zinc-300 group-hover:text-white transition-colors duration-300'>
                            Gradient Craft is an Opensource Project under MIT license
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div
                        className="cursor-pointer relative group"
                        onClick={() => window.open("https://x.com/gradientcraft")}
                    >
                        <Image
                            src='/Icons/X.png'
                            width={24}
                            height={24}
                            alt='X icon'
                            className="invert"
                            style={{ width: 'auto', height: '24px' }}
                        />
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300 group-hover:duration-200"></div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 bg-zinc-900 opacity-50"></div>
        </footer>
    );
};

export default Footer;