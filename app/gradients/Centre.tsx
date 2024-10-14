'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast, ToastProvider } from "@/components/ui/toast"

import ColorSwatchInfo from './RPanel';
import { EnhancedInput } from '@/components/ui/input';
import FloatingFeedback from '@/components/feedback';
import LPanel from './LPanel';
import albumGradients from '../data/albumColors.json'; // 假设有这个文件
import brandGradients from '../data/brandColors.json';
import { colorDifference } from '../../lib/colorUtils';
import countUniqueColors from '@/lib/uniqueColors';

interface Gradient {
    name: string;
    colors: string[];
}

interface ColorOption {
    type: 'brand' | 'album';
    name: string;
    gradients: Gradient[];
    artist?: string;
    tags?: string[];
}

interface SelectedGradientInfo extends Gradient {
    type: 'brand' | 'album';
    parentName: string;
    artist?: string;
    tags?: string[];
}

const Centre = () => {
    const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
    const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
    const [selectedGradientInfo, setSelectedGradientInfo] = useState<SelectedGradientInfo | null>(null);
    const [focusedGradientIndex, setFocusedGradientIndex] = useState<number>(0);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const brandOptions: ColorOption[] = brandGradients.map(brand => ({
            type: 'brand',
            name: brand.brand,
            gradients: brand.gradients
        }));

        const albumOptions: ColorOption[] = albumGradients.map(album => ({
            type: 'album',
            name: album.album,
            gradients: album.gradients,
            artist: album.artist,
            tags: album.tags
        }));

        setColorOptions([...brandOptions, ...albumOptions]);

        const uniqueColorCount = countUniqueColors([...brandGradients, ...albumGradients]);
        setTotalUniqueColors(uniqueColorCount);

        // Select the first gradient by default
        if (brandOptions.length > 0 && brandOptions[0].gradients.length > 0) {
            const firstGradient = brandOptions[0].gradients[0];
            handleGradientSelect(firstGradient, 'brand', brandOptions[0].name, 0);
        }
    }, []);

    const handleGradientSelect = useCallback((
        gradient: Gradient,
        type: 'brand' | 'album',
        parentName: string,
        index: number,
        artist?: string,
        tags?: string[]
    ) => {
        setSelectedGradientInfo({ ...gradient, type, parentName, artist, tags });
        setSelectedGradient(`gradient-${index}`);
        setFocusedGradientIndex(index);
    }, []);

    const allGradients = colorOptions.flatMap(option =>
        option.gradients.map(gradient => ({
            ...gradient,
            type: option.type,
            parentName: option.name,
            artist: option.artist,
            tags: option.tags
        }))
    );

    const filteredGradients = selectedCategory === null
        ? allGradients
        : allGradients.filter(g => g.parentName === selectedCategory);

    const searchFilteredGradients = filteredGradients.filter(gradient =>
        gradient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gradient.colors.some(color => color.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (gradient.type === 'album' && gradient.artist?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            let arrowKeyPressed = false;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = Math.max(0, focusedGradientIndex - cols);
                    arrowKeyPressed = true;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = Math.min(gradients.length - 1, focusedGradientIndex + cols);
                    arrowKeyPressed = true;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    newIndex = Math.max(0, focusedGradientIndex - 1);
                    arrowKeyPressed = true;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    newIndex = Math.min(gradients.length - 1, focusedGradientIndex + 1);
                    arrowKeyPressed = true;
                    break;
                case '/':
                    e.preventDefault();
                    searchInputRef.current?.focus();
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

            if (arrowKeyPressed) {
                searchInputRef.current?.blur();
            }

            if (newIndex !== focusedGradientIndex && newIndex >= 0 && newIndex < gradients.length) {
                const gradient = gradients[newIndex];
                handleGradientSelect(gradient, gradient.type, gradient.parentName, newIndex, gradient.artist, gradient.tags);
                scrollToGradient(newIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedGradientIndex, selectedColor, searchFilteredGradients, handleGradientSelect, scrollToGradient, findSimilarGradients]);

    const renderGradient = useCallback((gradient: (Gradient & { type: 'brand' | 'album', parentName: string, artist?: string }), index: number) => {
        const gradientId = `gradient-${index}`;
        const isSelected = selectedGradient === gradientId;
        const isFocused = focusedGradientIndex === index;

        return (
            <div
                key={index}
                className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-amber-500 bg-amber-400/20' : ''} ${isFocused ? 'ring-2 ring-amber-500' : ''}`}
                onClick={() => handleGradientSelect(gradient, gradient.type, gradient.parentName, index, gradient.artist)}
            >
                <div
                    className="w-12 h-12 flex-shrink-0 rounded-full"
                    style={{
                        background: `linear-gradient(to right, ${gradient.colors.join(', ')})`,
                    }}
                />
                <div className="mt-2 text-center">
                    <span className="text-gray-600 block text-sm font-serif font-semibold">{gradient.name}</span>
                    <p className="text-xs text-gray-500 mt-1">
                        {gradient.type === 'album' ? `${gradient.artist} - ${gradient.parentName}` : `from ${gradient.parentName}`}
                    </p>
                </div>
            </div>
        );
    }, [selectedGradient, focusedGradientIndex, handleGradientSelect]);

    return (
        <ToastProvider>
            <div className="flex bg-amber-50 min-h-screen overflow-hidden px-96">
                <LPanel
                    colorOptions={colorOptions}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    onColorSelect={setSelectedColor}
                />

                {/* Main Content */}
                <div className="px-6 pt-10 pb-4 fixed z-50 backdrop:blur-2xl">
                    <EnhancedInput
                        autoFocus
                        shortcut="/"
                        ref={searchInputRef}
                        type="text"
                        placeholder={`Search ${totalUniqueColors} gradients...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pt-40 pb-96 overflow-hidden">
                        <h3 className="text-xl font-serif font-semibold mb-4 px-12">
                            {selectedColor
                                ? 'Similar Gradients'
                                : (selectedCategory ? `${selectedCategory} Gradients` : 'All Gradients')}
                        </h3>
                        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 px-4">
                            {(selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients).map((gradient, index) =>
                                renderGradient(gradient, index)
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

export default Centre;