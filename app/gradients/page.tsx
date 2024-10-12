'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Toast, ToastProvider } from "@/components/ui/toast"

import ColorSwatchInfo from './ColorSwatchInfo';
import FloatingFeedback from '@/components/feedback';
import FloatingSidebar from './FloatingSideBar';
import brandGradients from '../colors.json';
import { colorDifference } from '../../lib/colorUtils';
import countUniqueColors from '@/lib/uniqueColors';

interface Gradient {
    name: string;
    colors: string[];
}

interface BrandGradient {
    brand: string;
    gradients: Gradient[];
}

interface SelectedGradientInfo extends Gradient {
    brand: string;
}

const GradientShowcase = () => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
    const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
    const [hoveredGradientId, setHoveredGradientId] = useState<string | null>(null);
    const [selectedGradientInfo, setSelectedGradientInfo] = useState<SelectedGradientInfo | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const handleGradientSelect = useCallback((gradient: Gradient, brand: string) => {
        setSelectedGradientInfo({ ...gradient, brand });
    }, []);

    const handleCopyButtonMouseEnter = useCallback((gradientId: string) => {
        setHoveredGradientId(gradientId);
    }, []);

    const handleCopyButtonMouseLeave = useCallback(() => {
        setHoveredGradientId(null);
    }, []);

    useEffect(() => {
        const uniqueColorCount = countUniqueColors(brandGradients);
        setTotalUniqueColors(uniqueColorCount);
    }, []);

    const allGradients = brandGradients.flatMap(b => b.gradients);

    const filteredGradients = selectedBrand === 'All' || selectedBrand === null
        ? allGradients
        : brandGradients.find(b => b.brand === selectedBrand)?.gradients || [];

    const searchFilteredGradients = filteredGradients.filter(gradient =>
        gradient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gradient.colors.some(color => color.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const findSimilarGradients = (color: string) => {
        return allGradients
            .map(gradient => ({
                gradient,
                difference: Math.min(...gradient.colors.map(c => colorDifference(color, c)))
            }))
            .sort((a, b) => a.difference - b.difference)
            .slice(0, 12)
            .map(item => item.gradient);
    };

    const handleBrandSelect = (brand: string | null) => {
        setSelectedColor(null);
        setSelectedBrand(brand);
    };

    const handleColorSelect = (color: string) => {
        setSelectedBrand(null);
        setSelectedColor(color);
    };

    const renderGradient = (gradient: Gradient, index: number, showCompany: boolean) => {
        const company = showCompany
            ? brandGradients.find(brand =>
                brand.gradients.some(g => g.name === gradient.name)
            )?.brand || 'Unknown'
            : selectedBrand || 'All';

        const gradientId = `gradient-${index}`;
        const isSelected = selectedGradient === gradientId;

        return (
            <div
                key={index}
                className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-amber-500 bg-amber-400/20' : ''}`}
                onMouseEnter={() => handleCopyButtonMouseEnter(gradientId)}
                onMouseLeave={handleCopyButtonMouseLeave}
                onClick={() => {
                    setSelectedGradient(gradientId);
                    handleGradientSelect(gradient, showCompany ? company : selectedBrand || 'Unknown');
                }}
            >
                <div
                    className="w-12 h-12 flex-shrink-0 rounded-full"
                    style={{
                        background: `linear-gradient(to right, ${gradient.colors.join(', ')})`,
                    }}
                />
                <div className="mt-2 text-center">
                    <span className="text-gray-600 block text-sm font-serif font-semibold">{gradient.name}</span>
                    {showCompany && <p className="text-xs text-gray-500 mt-1">from {company}</p>}
                </div>
            </div>
        );
    };

    const handleClose = () => {
        setSelectedGradient(null);
    };

    return (
        <ToastProvider>
            <div className="flex bg-amber-50 min-h-screen overflow-hidden px-96">
                <FloatingSidebar
                    brandGradients={brandGradients}
                    selectedBrand={selectedBrand}
                    onBrandSelect={handleBrandSelect}
                    onColorSelect={handleColorSelect}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search Bar */}
                    <div className="px-6 pt-10 pb-4 fixed z-50 backdrop:blur-2xl">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder={`Search ${totalUniqueColors} gradients...`}
                                value={searchTerm}
                                autoFocus
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-32 py-3 text-sm bg-gradient-to-r from-amber-500/15 to-amber-200/25 rounded-full shadow-sm border border-orange-300 text-orange-700 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                            {searchTerm && (
                                <button
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors duration-300"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pt-40 pb-96 overflow-hidden">
                        <h3 className="text-xl font-serif font-semibold mb-4 px-12">
                            {selectedColor
                                ? 'Similar Gradients'
                                : (selectedBrand ? `${selectedBrand} Gradients` : 'All Gradients')}
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 px-4">
                            {(selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients).map((gradient, index) =>
                                renderGradient(gradient, index, !selectedBrand || selectedBrand === 'All')
                            )}
                        </div>
                        {selectedGradientInfo && (
                            <ColorSwatchInfo selectedGradientInfo={selectedGradientInfo} onClose={handleClose} />
                        )}
                    </div>
                </div>

                <Toast />
            </div>
            <FloatingFeedback />
        </ToastProvider>
    );
};

export default GradientShowcase;