import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Header(): JSX.Element {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-filter backdrop-blur-2xl">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/">
                    <Image
                        src='/BrandIconText.png'
                        width={144}
                        height={24}
                        alt='brandiconimage'
                    />
                </Link>
                <div className="flex font-semibold items-center space-x-8 py-2 px-4 rounded-xl  hover:bg-gradient-to-r from-yellow-500 to-red-500">
                    <Link href="/gradients" className="text-sm transition-colors">Gradients Park</Link>
                </div>
            </nav>
        </header>
    );
}

const LicensePage = () => {
    return (
        <div className="min-h-screen bg-yellow-600/5/15 p-8">
            <Header />
            <div className="max-w-6xl mx-auto py-16">
                {/* <h1 className="text-4xl font-bold text-zinc-800 mb-8">All Licenses</h1> */}
                <div className="bg-white rounded-3xl p-16">
                    <h2 className="text-2xl font-semibold text-zinc-800 mb-6 font-serif">Gradient Craft License</h2>
                    <div className="space-y-6 text-zinc-600 font-serif">
                        <p className="font-semibold text-lg">MIT License</p>
                        <p>
                            Copyright (c) 2024 Gradient Craft
                        </p>
                        <p>
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the "Software"), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:
                        </p>
                        <p>
                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.
                        </p>
                        <p className="uppercase">
                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicensePage;