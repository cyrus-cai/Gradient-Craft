import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Header(): JSX.Element {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-filter backdrop-blur-2xl">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Image
                    src='/BrandIconText.png'
                    width={144}
                    height={24}
                    alt='brandiconimage'
                />
                <div className="flex font-semibold items-center space-x-8 py-2 px-4 rounded-xl  hover:bg-gradient-to-r from-amber-500 to-red-500">
                    <Link href="/gradients" className="text-sm transition-colors">Gradients Park</Link>
                </div>
            </nav>
        </header>
    );
}

const LicensePage = () => {
    return (
        <div className="min-h-screen bg-amber-50 p-8">
            <Link href="/">
                <Header />
            </Link>
            <div className="max-w-6xl mx-auto py-16">
                {/* <h1 className="text-4xl font-bold text-gray-800 mb-8">All Licenses</h1> */}
                <div className="bg-white rounded-3xl p-16">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gradient Craft License</h2>
                    <div className="space-y-4 text-gray-600">
                        <p className="font-semibold">ISC License</p>
                        <p>
                            Copyright (c) for portions of Gradient Craft are held by Cole Bemis 2013-2024 as part of Feather (MIT).
                            All other copyright (c) for Gradient Craft are held by Gradient Craft Contributors 2024.
                        </p>
                        <p>
                            Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is
                            hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
                        </p>
                        <p className="uppercase">
                            The software is provided "as is" and the author disclaims all warranties with regard to this software
                            including all implied warranties of merchantability and fitness. In no event shall the author be liable
                            for any special, direct, indirect, or consequential damages or any damages whatsoever resulting from loss
                            of use, data or profits, whether in an action of contract, negligence or other tortious action, arising
                            out of or in connection with the use or performance of this software.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicensePage;