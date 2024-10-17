import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 dark:bg-gray-900/25 backdrop-filter backdrop-blur-2xl">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Image
                    src='/BrandIconText.png'
                    width={144}
                    height={24}
                    alt='brandiconimage'
                />
                <div className="flex items-center space-x-8">
                    <div className="font-semibold py-2 px-4 rounded-xl hover:bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300">
                        <Link href="/gradients" className="text-sm transition-colors dark:text-white">Gradients Park</Link>
                    </div>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className='flex items-center'>
                            <Image
                                src={`/Icons/Github.svg`}
                                height={24}
                                width={24}
                                alt=''
                                className="mr-2 dark:invert"
                            />
                            <div className="text-sm font-mono text-white bg-gradient-to-r from-sky-500 to-teal-400 px-2 py-1 rounded-tr-full rounded-tl-full rounded-br-full">
                                it's opensource!
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Image
                            src={`/Icons/X.png`}
                            height={20}
                            width={20}
                            alt=''
                            className="mr-2 dark:invert"
                        />
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;