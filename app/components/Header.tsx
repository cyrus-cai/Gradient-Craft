import { Github, Star } from 'lucide-react';
import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-filter backdrop-blur-2xl">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Image
                    src='/BrandIconText.png'
                    width={144}
                    height={24}
                    alt='brandiconimage'
                />
                <div className="flex items-center space-x-8">
                    <div className="font-semibold py-2 px-4 rounded-xl hover:bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300">
                        <Link href="/gradients" className="text-sm transition-colors">Gradients Park</Link>
                    </div>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center space-x-1 bg-gradient-to-r from-purple-800 to-red-600 text-white py-2 pl-2 pr-4 rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden font-mono"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center space-x-2">
                            {isHovered ? (
                                <Github className="w-5 h-5 animate-bounce" />
                            ) : (
                                <Star className="w-5 h-5 animate-pulse" />
                            )}
                            <span className="text-sm font-medium whitespace-nowrap">
                                {isHovered ? "Let's paint the Web !" : "Star us on GitHub"}
                            </span>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="w-64 h-64 bg-white opacity-10 rounded-full scale-0 group-hover:scale-110 transition-all duration-300 ease-out"></div>
                        </div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;