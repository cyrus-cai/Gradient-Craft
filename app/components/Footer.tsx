import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-transparent py-8">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <div
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => window.open("https://github.com/cyrus-cai/Gradient-Craft")}
                    >
                        <Image
                            src='/Icons/Github.svg'
                            width={20}
                            height={20}
                            alt='Github icon'
                        />
                        <p className='text-sm'>
                            Gradient Craft is an Opensource Project under MIT license
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div
                        className="cursor-pointer"
                        onClick={() => window.open("https://x.com/gradientcraft")}
                    >
                        <Image
                            src='/Icons/X.png'
                            width={24}
                            height={24}
                            alt='X icon'
                            style={{ width: 'auto', height: '24px' }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;