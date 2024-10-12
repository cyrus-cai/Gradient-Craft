'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Toast, ToastProvider } from "@/components/ui/toast"

import ColorSwatchInfo from './RBar';
import { EnhancedInput } from '@/components/ui/input';
import FloatingFeedback from '@/components/feedback';
import FloatingSidebar from './LBar';
import brandGradients from '../brandColors.json';
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
    const [selectedGradientInfo, setSelectedGradientInfo] = useState<SelectedGradientInfo | null>(null);
    const [focusedGradientIndex, setFocusedGradientIndex] = useState<number>(0);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const handleGradientSelect = useCallback((gradient: Gradient, brand: string, index: number) => {
        setSelectedGradientInfo({ ...gradient, brand });
        setSelectedGradient(`gradient-${index}`);
        setFocusedGradientIndex(index);
    }, []);

    useEffect(() => {
        const uniqueColorCount = countUniqueColors(brandGradients);
        setTotalUniqueColors(uniqueColorCount);
    }, []);

    useEffect(() => {
        const uniqueColorCount = countUniqueColors(brandGradients);
        setTotalUniqueColors(uniqueColorCount);

        // Select the first gradient by default
        if (brandGradients.length > 0 && brandGradients[0].gradients.length > 0) {
            const firstGradient = brandGradients[0].gradients[0];
            handleGradientSelect(firstGradient, brandGradients[0].brand, 0);
        }
    }, [handleGradientSelect]);

    const allGradients = brandGradients.flatMap(b => b.gradients);

    const filteredGradients = selectedBrand === 'All' || selectedBrand === null
        ? allGradients
        : brandGradients.find(b => b.brand === selectedBrand)?.gradients || [];

    const searchFilteredGradients = filteredGradients.filter(gradient =>
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

    const scrollToGradient = useCallback((index: number) => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const gradientElements = gridElement.children;
        if (index < 0 || index >= gradientElements.length) return;

        const gradientElement = gradientElements[index] as HTMLElement;
        gradientElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const gradients = selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients;
            const cols = window.innerWidth >= 1536 ? 7 : window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 3 : 1;

            let newIndex = focusedGradientIndex;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = Math.max(0, focusedGradientIndex - cols);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = Math.min(gradients.length - 1, focusedGradientIndex + cols);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    newIndex = Math.max(0, focusedGradientIndex - 1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    newIndex = Math.min(gradients.length - 1, focusedGradientIndex + 1);
                    break;
                case '/':
                    {
                        e.preventDefault();
                        searchInputRef.current?.focus();
                    }
                    return;
                case 'k':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        searchInputRef.current?.focus();
                    }
                    return;
                default:
                    return;
            }

            if (newIndex !== focusedGradientIndex && newIndex >= 0 && newIndex < gradients.length) {
                const gradient = gradients[newIndex];
                const company = brandGradients.find(brand =>
                    brand.gradients.some(g => g.name === gradient.name)
                )?.brand || 'Unknown';
                handleGradientSelect(gradient, company, newIndex);
                scrollToGradient(newIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedGradientIndex, selectedColor, searchFilteredGradients, handleGradientSelect, scrollToGradient, findSimilarGradients]);

    const renderGradient = useCallback((gradient: Gradient, index: number, showCompany: boolean) => {
        const company = showCompany
            ? brandGradients.find(brand =>
                brand.gradients.some(g => g.name === gradient.name)
            )?.brand || 'Unknown'
            : selectedBrand || 'All';

        const gradientId = `gradient-${index}`;
        const isSelected = selectedGradient === gradientId;
        const isFocused = focusedGradientIndex === index;

        return (
            <div
                key={index}
                className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-amber-500 bg-amber-400/20' : ''} ${isFocused ? 'ring-2 ring-amber-500' : ''}`}
                onClick={() => handleGradientSelect(gradient, company, index)}
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
    }, [selectedGradient, focusedGradientIndex, selectedBrand, handleGradientSelect]);

    return (
        <ToastProvider>
            <div className="flex bg-amber-50 min-h-screen overflow-hidden px-96">
                <FloatingSidebar
                    brandGradients={brandGradients}
                    selectedBrand={selectedBrand}
                    onBrandSelect={setSelectedBrand}
                    onColorSelect={setSelectedColor}
                />

                {/* Main Content */}
                <div className="px-6 pt-10 pb-4 fixed z-50 backdrop:blur-2xl">
                    <EnhancedInput
                        autoFocus
                        ref={searchInputRef}
                        type="text"
                        placeholder={`Search ${totalUniqueColors} gradients...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search Bar */}

                    <div className="flex-1 overflow-y-auto pt-40 pb-96 overflow-hidden">
                        <h3 className="text-xl font-serif font-semibold mb-4 px-12">
                            {selectedColor
                                ? 'Similar Gradients'
                                : (selectedBrand ? `${selectedBrand} Gradients` : 'All Gradients')}
                        </h3>
                        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 px-4">
                            {(selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients).map((gradient, index) =>
                                renderGradient(gradient, index, !selectedBrand || selectedBrand === 'All')
                            )}
                        </div>
                        {selectedGradientInfo && (
                            <ColorSwatchInfo selectedGradientInfo={selectedGradientInfo} onClose={() => setSelectedGradientInfo(null)} />
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