'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toast, ToastProvider } from "@/components/ui/toast"

import ColorSwatchInfo from './RPanel';
import { EnhancedInput } from '@/components/ui/input';
import FloatingFeedback from '@/components/feedback';
import FloatingPopup from './CentreComponents/FloatingPopup';
import Fuse from 'fuse.js'
import LPanel from './LPanel';
import albumGradients from '../data/albumColors.json';
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

const useFuzzySearch = (
    colorOptions: ColorOption[],
    searchTerm: string,
    selectedCategory: string | null
) => {
    // 转换数据,添加 metadata
    const allGradientsWithMetadata = useMemo(() =>
        colorOptions.flatMap(option =>
            option.gradients.map(gradient => ({
                ...gradient,
                type: option.type,
                parentName: option.name,
                artist: option.artist,
                tags: option.tags
            }))
        ), [colorOptions]);

    // 创建 Fuse 实例
    const fuse = useMemo(() => {
        const baseGradients = selectedCategory
            ? allGradientsWithMetadata.filter(g => g.parentName === selectedCategory)
            : allGradientsWithMetadata;

        return new Fuse(baseGradients, fuseOptions);
    }, [allGradientsWithMetadata, selectedCategory]);

    // 执行搜索
    const searchResults = useMemo(() => {
        if (!searchTerm) {
            return selectedCategory
                ? allGradientsWithMetadata.filter(g => g.parentName === selectedCategory)
                : allGradientsWithMetadata;
        }

        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
    }, [searchTerm, selectedCategory, fuse, allGradientsWithMetadata]);

    return searchResults;
};

const fuseOptions = {
    keys: [
        {
            name: 'name',
            weight: 0.4
        },
        {
            name: 'colors',
            weight: 0.2
        },
        {
            name: 'artist',
            weight: 0.2
        },
        {
            name: 'parentName',
            weight: 0.1
        },
        {
            name: 'tags',
            weight: 0.1
        }
    ],
    threshold: 0.3,
    distance: 100,
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    useExtendedSearch: true,
    ignoreLocation: true,
    findAllMatches: true
};

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
    const searchResults = useFuzzySearch(colorOptions, searchTerm, selectedCategory);
    const [isIMEActive, setIsIMEActive] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState<boolean>(true);


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
            // 如果搜索框有焦点且正在进行 IME 输入，不处理方向键
            const searchInput = searchInputRef.current;
            if (!searchInput) return;

            if (document.activeElement === searchInput && isIMEActive) {
                return;
            }

            const gradients = selectedColor ? findSimilarGradients(selectedColor) : searchResults;
            const cols = window.innerWidth >= 1536 ? 8 : window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 3 : 1;

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
                    // 如果搜索框有焦点，只有在不是正在输入的情况下才处理方向键
                    if (document.activeElement === searchInput && searchTerm) {
                        return;
                    }
                    e.preventDefault();
                    newIndex = Math.max(0, focusedGradientIndex - 1);
                    arrowKeyPressed = true;
                    break;
                case 'ArrowRight':
                    // 如果搜索框有焦点，只有在不是正在输入的情况下才处理方向键
                    if (document.activeElement === searchInput && searchTerm) {
                        return;
                    }
                    e.preventDefault();
                    newIndex = Math.min(gradients.length - 1, focusedGradientIndex + 1);
                    arrowKeyPressed = true;
                    break;
                case '/':
                    e.preventDefault();
                    searchInput.focus();
                    return;
                case 'k':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        searchInput.focus();
                    }
                    return;
                case 'Escape':
                    if (document.activeElement === searchInput) {
                        searchInput.blur();
                        setSearchTerm('');
                    }
                    return;
                default:
                    return;
            }

            // 只有在不是输入状态下才模糊搜索框
            if (arrowKeyPressed && !isIMEActive) {
                searchInput.blur();
            }

            if (newIndex !== focusedGradientIndex && newIndex >= 0 && newIndex < gradients.length) {
                const gradient = gradients[newIndex];
                handleGradientSelect(gradient, gradient.type, gradient.parentName, newIndex, gradient.artist, gradient.tags);
                scrollToGradient(newIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        focusedGradientIndex,
        selectedColor,
        searchResults,
        handleGradientSelect,
        scrollToGradient,
        findSimilarGradients,
        isIMEActive,
        searchTerm
    ]);


    const highlightMatch = (text: string, query: string): string => {
        if (!query) return text;

        try {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            // 使用 Tailwind 的类名
            return text.replace(regex, `<span class="bg-yellow-200/40 dark:bg-yellow-200/20 rounded px-0.5">$1</span>`);
        } catch {
            return text;
        }
    };

    const renderGradient = useCallback((gradient: (Gradient & { type: 'brand' | 'album', parentName: string, artist?: string }), index: number) => {
        const gradientId = `gradient-${index}`;
        const isSelected = selectedGradient === gradientId;
        const isFocused = focusedGradientIndex === index;

        const highlightedName = highlightMatch(gradient.name, searchTerm);
        const description = gradient.type === 'album'
            ? `${gradient.artist} - ${gradient.parentName}`
            : `from ${gradient.parentName}`;
        const highlightedDescription = highlightMatch(description, searchTerm);

        return (
            <div
                key={index}
                className={`relative w-full h-36 rounded-3xl bg-yellow-600/5 dark:bg-yellow-600/5 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-yellow-500 bg-yellow-400/20 dark:bg-yellow-600/5' : ''
                    } ${isFocused ? 'ring-2 ring-yellow-500 dark:ring-yellow-400' : ''
                    }`}
                onClick={() => handleGradientSelect(gradient, gradient.type, gradient.parentName, index, gradient.artist)}
            >
                <div
                    className="w-12 h-12 flex-shrink-0 rounded-full"
                    style={{
                        background: `linear-gradient(to right, ${gradient.colors.join(', ')})`,
                    }}
                />
                <div className="mt-2 text-center">
                    <span
                        className="text-zinc-600 dark:text-zinc-300 block text-sm font-serif font-semibold"
                        dangerouslySetInnerHTML={{ __html: highlightedName }}
                    />
                    <p
                        className="text-xs text-zinc-500 dark:text-zinc-400 mt-1"
                        dangerouslySetInnerHTML={{ __html: highlightedDescription }}
                    />
                </div>
            </div>
        );
    }, [selectedGradient, focusedGradientIndex, handleGradientSelect, searchTerm]);

    return (
        <ToastProvider>
            <div className="flex bg-yellow-600/5 dark:bg-zinc-900 min-h-screen overflow-hidden px-96">
                <LPanel
                    colorOptions={colorOptions}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    onColorSelect={setSelectedColor}
                />

                {/* Main Content */}
                <div className="px-6 pt-10 pb-4 fixed z-50 backdrop:blur-2xl">
                    {isVisible && <FloatingPopup
                        imageUrl="/magicuipro2.jpg"
                        title="Magic UI Pro"
                        linkUrl="https://pro.magicui.design/?ref=gcraft"
                        onClose={() => setIsVisible(false)}
                    />}
                    <EnhancedInput
                        autoFocus
                        shortcut="/"
                        withGlow={true}
                        ref={searchInputRef}
                        type="text"
                        placeholder={`Search ${totalUniqueColors} gradients...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="dark:bg-zinc-800 dark:text-white"
                        // 添加 IME 事件处理
                        onCompositionStart={() => setIsIMEActive(true)}
                        onCompositionEnd={() => setIsIMEActive(false)}
                    />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pt-40 pb-96 overflow-hidden">
                        <h3 className="text-xl font-serif font-semibold mb-4 px-4 text-zinc-800 dark:text-zinc-200">
                            {selectedColor
                                ? 'Similar Gradients'
                                : (selectedCategory ? `${selectedCategory} ` : 'All Gradients')}
                        </h3>

                        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4">
                            {(selectedColor ? findSimilarGradients(selectedColor) : searchResults).map((gradient, index) =>
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