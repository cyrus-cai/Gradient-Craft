'use client'

import { ChevronDown, Copy, FlaskConical, Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast, ToastProvider } from "@/components/ui/toast"
import { colorDifference, findClosestTailwindColor } from '../../lib/colorUtils';

import ColorPicker from '@/components/color-picker';
import ColorSwatchInfo from './ColorSwatchInfo';
import FloatingFeedback from '@/components/feedback';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import brandGradients from '../colors.json';
import countUniqueColors from '@/lib/uniqueColors';
import { useToast } from "@/hooks/use-toast"

interface Gradient {
    name: string;
    colors: string[];
}

interface BrandGradient {
    brand: string;
    gradients: Gradient[];
}

type BrandOption = BrandGradient | { brand: 'All' };

interface SelectedGradientInfo extends Gradient {
    brand: string;
}

const GradientShowcase = () => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [lastUsedOption, setLastUsedOption] = useState<string>('Tailwind BG');
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [pickerEnabled, setPickerEnabled] = useState<boolean>(false);
    const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
    const { toast } = useToast()
    const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const switchRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isAnyPopoverOpen, setIsAnyPopoverOpen] = useState<boolean>(false);
    const [hoveredGradientId, setHoveredGradientId] = useState<string | null>(null);
    const hoverTimerRef = useRef<number | null>(null);
    const [selectedGradientInfo, setSelectedGradientInfo] = useState<SelectedGradientInfo | null>(null);

    const handleGradientSelect = useCallback((gradient: Gradient, brand: string) => {
        setSelectedGradientInfo({ ...gradient, brand });
    }, []);

    const handleCopyButtonMouseEnter = useCallback((gradientId: string) => {
        if (hoverTimerRef.current !== null) {
            clearTimeout(hoverTimerRef.current);
        }
        hoverTimerRef.current = window.setTimeout(() => {
            setHoveredGradientId(gradientId);
        }, 200);
    }, []);

    const handleCopyButtonMouseLeave = useCallback(() => {
        if (hoverTimerRef.current !== null) {
            clearTimeout(hoverTimerRef.current);
        }
        hoverTimerRef.current = window.setTimeout(() => {
            setHoveredGradientId(null);
        }, 300);
    }, []);

    const handlePopoverMouseLeave = useCallback(() => {
        setHoveredGradientId(null);
    }, []);

    useEffect(() => {
        return () => {
            if (hoverTimerRef.current !== null) {
                clearTimeout(hoverTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const savedOption = localStorage.getItem('lastUsedCopyOption');
        if (savedOption) {
            setLastUsedOption(savedOption);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (hoverTimerRef.current !== null) {
                clearTimeout(hoverTimerRef.current);
            }
        };
    }, []);

    const copyToClipboard = useCallback((text: string, title: string, gradientId: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: `Copied ${title}`,
            description: text,
            duration: 3000,
        });
        setLastUsedOption(title);
        localStorage.setItem('lastUsedCopyOption', title);
        setOpenPopoverId(null);  // Close the popover immediately
        setHoveredGradientId(null);  // Reset the hovered gradient
    }, [toast, setLastUsedOption]);

    const generateGradientClasses = useCallback((gradient: { colors: string[] }) => {
        return gradient.colors.map((color, index) => {
            const closestColor = findClosestTailwindColor(color);
            if (index === 0) return `from-${closestColor}`;
            if (index === gradient.colors.length - 1) return `to-${closestColor}`;
            return `via-${closestColor}`;
        }).join(' ');
    }, []);

    const generateTailwindBackground = useCallback((gradient: { colors: string[] }) => {
        const gradientClasses = generateGradientClasses(gradient);
        return `bg-gradient-to-r ${gradientClasses}`;
    }, [generateGradientClasses]);

    const generateTailwindText = useCallback((gradient: { colors: string[] }) => {
        const gradientClasses = generateGradientClasses(gradient);
        return `text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses}`;
    }, [generateGradientClasses]);

    const generateCSSGradient = useCallback((gradient: { colors: string[] }, type: 'background' | 'text' | 'both' = 'both') => {
        const backgroundCode = `background: linear-gradient(to right, ${gradient.colors.join(', ')});`;
        const gradientTextCode = `
background: linear-gradient(to right, ${gradient.colors.join(', ')});
-webkit-background-clip: text;
background-clip: text;
color: transparent;
`;

        switch (type) {
            case 'background':
                return `/* 渐变背景 */\n${backgroundCode}`;
            case 'text':
                return `/* 渐变文本 */\n${gradientTextCode}`;
            case 'both':
            default:
                return `/* 渐变背景 */\n${backgroundCode}\n\n/* 渐变文本 */\n${gradientTextCode}`;
        }
    }, []);

    const generateSwiftUIGradient = useCallback((gradient: { colors: string[] }, style: 'foreground' | 'background') => {
        const convertHexToRGB = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return { r, g, b };
        };

        const colors = gradient.colors.map(color => {
            const { r, g, b } = convertHexToRGB(color);
            return `Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}), // ${color}`;
        }).join('\n        ');

        const gradientDefinition = `
LinearGradient(
    gradient: Gradient(colors: [
        ${colors}
    ]),
    startPoint: .leading,
    endPoint: .trailing
)`;

        if (style === 'foreground') {
            return `// 用作前景样式 (iOS 15+)
.foregroundStyle(${gradientDefinition})`;
        } else {
            return `// 用作背景
.background(${gradientDefinition})`;
        }
    }, []);

    const generateReactNativeGradient = useCallback((gradient: { colors: string[] }) => {
        return `<LinearGradient
  colors={[${gradient.colors.map(color => `'${color}'`).join(', ')}]}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
/>`;
    }, []);

    const generateFlutterGradient = useCallback((gradient: { colors: string[] }) => {
        const colors = gradient.colors.map(color => `Color(0xFF${color.slice(1)})`).join(', ');
        return `BoxDecoration(
  gradient: LinearGradient(
    colors: [${colors}],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  ),
)`;
    }, []);

    const generateColorArray = useCallback((gradient: { colors: string[] }) => {
        return `const colors = [${gradient.colors.map(color => `'${color}'`).join(', ')}];`;
    }, []);


    useEffect(() => {
        if (contentRef.current && switchRef.current) {
            const switchHeight = switchRef.current.offsetHeight;
            const fullHeight = contentRef.current.scrollHeight;
            setContentHeight(pickerEnabled ? fullHeight : switchHeight + 32);
        }
    }, [pickerEnabled, isExpanded]);


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

    const allOption: BrandOption = { brand: 'All' };
    const sortedBrands: BrandOption[] = [...brandGradients].sort((a, b) => a.brand.localeCompare(b.brand));

    const groupedBrands = sortedBrands.reduce((acc, brand) => {
        const firstLetter = brand.brand[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(brand);
        return acc as Record<string, BrandOption[]>;
    }, {} as Record<string, BrandOption[]>);

    const handleBrandSelect = (brand: string | null) => {
        setSelectedColor(null); // 清除颜色选择
        setSelectedBrand(brand);
    };

    const handleColorSelect = (color: string) => {
        setSelectedBrand(null); // 清除品牌选择
        setSelectedColor(color);
    };

    const renderBrandButton = (brand: BrandOption) => {
        const isSelected = selectedBrand === brand.brand || (selectedBrand === null && brand.brand === 'All');
        const brandColor = getBrandColor(brand);
        const textColor = getTextColor(brandColor);
        return (
            <button
                key={brand.brand}
                className={`w-full items-center justify-start flex px-4 py-2 text-center rounded-xl text-xs transition-all duration-300 ${isSelected
                    ? `${textColor} font-serif`
                    : 'bg-amber-100/25 text-gray-700 hover:bg-amber-100 font-serif'
                    }`}
                style={isSelected ? { backgroundColor: brandColor } : {}}
                onClick={() => handleBrandSelect(brand.brand === 'All' ? null : brand.brand)}
            >
                {brand.brand}
            </button>
        );
    };

    const renderGradient = (gradient: Gradient, index: number, showCompany: boolean) => {
        const company = showCompany
            ? brandGradients.find(brand =>
                brand.gradients.some(g => g.name === gradient.name)
            )?.brand || 'Unknown'
            : selectedBrand || 'All';

        const gradientId = `gradient-${index}`;
        const isSelected = selectedGradient === gradientId;

        const copyOptions = [
            { label: 'Tailwind Text', action: () => copyToClipboard(generateTailwindText(gradient), "Tailwind Text", gradientId) },
            { label: 'Tailwind Background', action: () => copyToClipboard(generateTailwindBackground(gradient), "Tailwind BG", gradientId) },
            { label: 'CSS Text', action: () => copyToClipboard(generateCSSGradient(gradient, 'text'), "CSS Text", gradientId) },
            { label: 'CSS Background', action: () => copyToClipboard(generateCSSGradient(gradient, 'background'), "CSS Background", gradientId) },
            { label: 'SwiftUI Foreground', action: () => copyToClipboard(generateSwiftUIGradient(gradient, 'foreground'), "SwiftUI Foreground", gradientId) },
            { label: 'SwiftUI Background', action: () => copyToClipboard(generateSwiftUIGradient(gradient, 'background'), "SwiftUI Background", gradientId) },
            // { label: 'React Native', action: () => copyToClipboard(generateReactNativeGradient(gradient), "React Native", gradientId) },
            // { label: 'Flutter', action: () => copyToClipboard(generateFlutterGradient(gradient), "Flutter", gradientId) },
            { label: 'Color Array', action: () => copyToClipboard(generateColorArray(gradient), "Color Array", gradientId) },
        ];
        return (
            <div
                key={index}
                className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 `}
                onMouseEnter={() => handleCopyButtonMouseEnter(gradientId)}
                onMouseLeave={handleCopyButtonMouseLeave}
                onClick={() => {
                    setSelectedGradient(gradientId);
                    handleGradientSelect(gradient, showCompany ? company : selectedBrand || 'Unknown');
                }}
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <div
                            className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-amber-500 bg-amber-400/20' : ''}`}
                            onMouseEnter={() => handleCopyButtonMouseEnter(gradientId)}
                            onMouseLeave={handleCopyButtonMouseLeave}
                            onClick={() => setSelectedGradient(gradientId)}
                        >
                            <div
                                className="w-14 h-14 flex-shrink-0 rounded-full"
                                style={{
                                    background: `linear-gradient(to right, ${gradient.colors.join(', ')})`,
                                }}
                            />
                            <div className="mt-2 text-center">
                                <span className="text-gray-600 block text-sm font-serif font-semibold">{gradient.name}</span>
                                {showCompany && <p className="text-xs text-gray-500 mt-1">from {company}</p>}
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-64 p-3"
                        sideOffset={5}
                        onMouseLeave={handlePopoverMouseLeave}
                    >
                        <div className="space-y-1.5">
                            {copyOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    className="flex items-center w-full gap-2 px-4 py-3 hover:bg-gradient-to-r hover:from-amber-100/50 hover:to-amber-200/50 rounded-2xl transition-all duration-300 ease-in-out text-left group focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        option.action();
                                        setHoveredGradientId(null);
                                        setIsAnyPopoverOpen(false);
                                    }}
                                >
                                    <Image
                                        src={`/Icons/${option.label}.svg`}
                                        height={16}
                                        width={16}
                                        alt=''
                                    />
                                    <span className="text-sm font-medium text-amber-900 group-hover:text-amber-950 transition-colors duration-300">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        );
    };

    const getBrandColor = useCallback((brand: BrandOption) => {
        if (brand.brand === 'All') return '#FFD700'; // Gold color for 'All'
        if ('gradients' in brand && brand.gradients.length > 0) {
            return brand.gradients[0].colors[0];
        }
        return '#000000';
    }, []);

    const getTextColor = useCallback((bgColor: string) => {
        // 简单的亮度计算，决定文本颜色是黑色还是白色
        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 160 ? 'text-gray-900' : 'text-white';
    }, []);

    return (
        <ToastProvider>
            <div className="flex bg-amber-50 min-h-screen overflow-hidden px-8 lg:px-24 xl:px-40 2xl:pl-80 2xl:pr-96">
                {/* Floating Sidebar */}
                <div className="fixed xl:left-32 2xl:left-72 top-8 bottom-8 w-72 bg-gradient-to-r from-white/100 to-white/75 shadow-lg rounded-3xl overflow-hidden z-10">
                    <div className="h-full flex flex-col overflow-y-auto">
                        <div className="p-6">
                            <div className="w-full max-w-md">
                                <div className='mb-12 w-full flex items-center justify-start gap-2'>
                                    <Link href="/">
                                        <div className='flex items-center gap-1'>
                                            <Image
                                                src='/BrandIconText.png'
                                                width={144}
                                                height={24}
                                                alt='brandiconimage'
                                            />
                                            {/* <Badge variant='secondary'>v0.1.0</Badge> */}
                                        </div>
                                    </Link>
                                </div>

                                <div
                                    className="bg-white overflow-hidden transition-all duration-300 ease-in-out"
                                    onMouseEnter={() => setIsExpanded(true)}
                                    onMouseLeave={() => setIsExpanded(false)}
                                >
                                    <div className="flex items-center justify-between cursor-pointer">
                                        <div className='flex items-center gap-2'>
                                            <FlaskConical className='w-4 h-4' />
                                            <p className='text-sm font-semibold'> Beta Feature</p>
                                        </div>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-500 ease-in-out transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </div>

                                    <div
                                        ref={contentRef}
                                        style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }}
                                        className="transition-all duration-500 ease-in-out"
                                    >
                                        <div className="flex flex-col items-start py-4">
                                            <div ref={switchRef} className='flex items-center gap-2 mb-2'>
                                                <div className='flex flex-col'>
                                                    <label htmlFor="picker-enabled" className='font-semibold text-sm'>
                                                        Picker
                                                    </label>
                                                    <label htmlFor="picker-enabled" className='text-xs'>
                                                        Color picker is currently in beta and may not be fully precise.
                                                    </label>
                                                </div>
                                                <Switch
                                                    id="picker-enabled"
                                                    checked={pickerEnabled}
                                                    onCheckedChange={setPickerEnabled}
                                                />
                                            </div>
                                            {pickerEnabled && (
                                                <div className={`transition-all duration-300 ${pickerEnabled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                                                    {ColorPicker && <ColorPicker onColorSelect={handleColorSelect} />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Brands */}
                        <Separator />

                        <div className="px-6 py-6 overflow-y-auto flex-grow">
                            <div className="space-y-4">
                                <div className="mb-4">
                                    {renderBrandButton(allOption)}
                                </div>
                                {Object.entries(groupedBrands).map(([letter, brands]) => (
                                    <div key={letter}>
                                        <h4 className="font-semibold font-serif text-gray-600 mb-2">{letter}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {brands.map((brand) => renderBrandButton(brand))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden ml-80 mr-24">
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

                    <div className="flex-1 overflow-y-auto p-6 pt-40 overflow-hidden">
                        <h3 className="text-xl font-serif font-semibold mb-4">
                            {selectedColor
                                ? 'Similar Gradients'
                                : (selectedBrand ? `${selectedBrand} Gradients` : 'All Gradients')}
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                            {(selectedColor ? findSimilarGradients(selectedColor) : searchFilteredGradients).map((gradient, index) =>
                                renderGradient(gradient, index, !selectedBrand || selectedBrand === 'All')
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                {selectedGradientInfo && (
                    <div
                        className="fixed top-96 right-12 h-96 w-96 bg-gradient-to-r from-white/75 to-white/100 shadow-md rounded-3xl overflow-hidden z-10 animate-fadeIn"
                        style={{
                            animation: 'fadeIn 0.5s ease-out'
                        }}
                    >
                        <ColorSwatchInfo selectedGradientInfo={selectedGradientInfo} />
                    </div>
                )}

                <Toast />
            </div>
            <FloatingFeedback />
        </ToastProvider >
    );
};

export default GradientShowcase;