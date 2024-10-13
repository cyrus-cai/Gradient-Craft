'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronUp, Clipboard, Copy, RefreshCw, Twitter, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Toast, ToastProvider } from "@/components/ui/toast"

import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/ui/input';
import brandGradients from '../brandColors.json';
import { colorDifference } from '../../lib/colorUtils';
import countUniqueColors from '@/lib/uniqueColors';
import { useToast } from "@/hooks/use-toast"

interface Gradient {
    name: string;
    colors: string[];
}

interface SelectedGradientInfo extends Gradient {
    brand: string;
}

const CentreMobile = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
    const [selectedGradientInfo, setSelectedGradientInfo] = useState<SelectedGradientInfo | null>(null);
    const [desktopUrl] = useState<string>('https://www.gcraft.site/gradients');
    const [themeColors, setThemeColors] = useState<[string, string]>(['#F59E0B', '#F97316']);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const { toast } = useToast();

    const banners = [
        {
            text: " Full features in desktop",
            className: "bg-gradient-to-r from-sky-600 to-sky-300 text-white text-sm font-bold px-4 py-3 flex items-center justify-center w-full transition-all duration-300",
            onClick: () => copyDesktopUrl()
        },
        {
            text: "Follow us on X for the latest updates!",
            className: "bg-gradient-to-r from-zinc-950 to-violet-950 text-white p-3 text-center text-sm font-serif flex items-center justify-center cursor-pointer",
            onClick: () => openXApp(),
            icon: <Twitter size={16} className="mr-2" />
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        const uniqueColorCount = countUniqueColors(brandGradients);
        setTotalUniqueColors(uniqueColorCount);
        setThemeColors([getRandomColor(), getRandomColor()]);
    }, []);

    const allGradients = brandGradients.flatMap(b => b.gradients);

    const searchFilteredGradients = allGradients.filter(gradient =>
        gradient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gradient.colors.some(color => color.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const findSimilarGradients = useCallback((color: string) => {
        return allGradients
            .map(gradient => ({
                gradient,
                difference: Math.min(...gradient.colors.map(c => colorDifference(color, c)))
            }))
            .sort((a, b) => a.difference - b.difference)
            .slice(0, 12)
            .map(item => item.gradient);
    }, [allGradients]);

    const handleGradientSelect = useCallback((gradient: Gradient, brand: string) => {
        setSelectedGradientInfo({ ...gradient, brand });
    }, []);

    const renderGradient = useCallback((gradient: Gradient, index: number) => {
        const company = brandGradients.find(brand =>
            brand.gradients.some(g => g.name === gradient.name)
        )?.brand || 'Unknown';

        return (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:scale-105"
                onClick={() => handleGradientSelect(gradient, company)}
            >
                <div
                    className="w-full h-full"
                    style={{
                        background: `linear-gradient(to right, ${gradient.colors.join(', ')})`,
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2">
                    <span className="text-gray-800 block text-xs font-serif font-semibold truncate">{gradient.name}</span>
                    <p className="text-xs text-gray-600 truncate">{company}</p>
                </div>
            </motion.div>
        );
    }, [handleGradientSelect]);

    const copyDesktopUrl = () => {
        navigator.clipboard.writeText(desktopUrl)
            .then(() => toast({ title: "Success", description: "Desktop URL copied to clipboard!" }))
            .catch(err => console.error('Failed to copy: ', err));
    };

    const openXApp = () => {
        const xAppUrl = 'twitter://user?screen_name=gradientcraft';
        const xWebUrl = 'https://x.com/gradientcraft';

        window.location.href = xAppUrl;

        setTimeout(() => {
            if (document.hidden) return;
            window.location.href = xWebUrl;
        }, 500);
    };

    const copyColor = (color: string) => {
        navigator.clipboard.writeText(color)
            .then(() => {
                setCopiedColor(color);
                toast({ title: "Success", description: `Color ${color} copied to clipboard!` });
                setTimeout(() => setCopiedColor(null), 2000);
            })
            .catch(err => console.error('Failed to copy: ', err));
    };

    return (
        <ToastProvider>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
                {/* Top banner carousel */}


                {/* Search bar */}
                <div className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-40 shadow-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentBanner}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0 }}
                            className={banners[currentBanner].className}
                            onClick={banners[currentBanner].onClick}
                        >
                            {banners[currentBanner].icon}
                            {banners[currentBanner].text}
                        </motion.div>
                    </AnimatePresence>
                    <div className='px-4 py-3'>
                        <EnhancedInput
                            type="text"
                            placeholder={`Explore ${totalUniqueColors} unique gradients...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border-gray-200 focus:border-gray-400"
                        // startAdornment={<RefreshCw className="text-gray-400" size={18} />}
                        // endAdornment={searchTerm && (
                        //     <X className="text-gray-400 cursor-pointer" size={18} onClick={() => setSearchTerm('')} />
                        // )}
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 pb-24">
                    <h3 className="text-xl font-serif font-semibold mb-4 text-gray-800">
                        {selectedColor ? 'Similar Palettes' : 'Curated Gradients'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {(selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients).slice(0, 30).map((gradient, index) =>
                            renderGradient(gradient, index)
                        )}
                    </div>
                    {selectedGradientInfo && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-t-3xl"
                        >
                            <div className="flex justify-between items-center mb-3 pt-4 px-4">
                                <h4 className="font-serif font-semibold text-gray-800">{selectedGradientInfo.name}</h4>
                                <X className="text-gray-500 cursor-pointer" onClick={() => setSelectedGradientInfo(null)} />
                            </div>
                            <p className="text-sm text-gray-600 mb-4 px-4">from {selectedGradientInfo.brand}</p>
                            <div className="flex space-x-6 mb-5 px-4">
                                {selectedGradientInfo.colors.map((color, index) => (
                                    <div key={index} className="relative">
                                        <div
                                            className="w-12 h-12 rounded-full shadow-inner cursor-pointer transform transition-transform hover:scale-110"
                                            style={{ backgroundColor: color }}
                                            onClick={() => copyColor(color)}
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute -bottom-2 -right-2 h-6 w-6"
                                            onClick={() => copyColor(color)}
                                        >
                                            {copiedColor === color ? <Check size={12} /> :
                                                <div className='flex items-center justify-center w-6 h-6 bg-gradient-to-r from-amber-500/75 to-red-500/75 backdrop-blur-3xl rounded-full text-white'>
                                                    <Copy className='w-3' />
                                                </div>

                                            }
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className="w-full rounded-none bg-gradient-to-r from-sky-600 to-sky-300 text-white font-bold py-3"
                                onClick={copyDesktopUrl}
                            >
                                Full features in desktop
                            </Button>
                        </motion.div>
                    )}
                </div>

                <Toast />
            </div>
        </ToastProvider>
    );
};

export default CentreMobile;