import { ChevronDown, Ellipsis, ExternalLink, FlaskConical, Scale } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import ColorPicker from '@/components/color-picker';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface BrandOption {
    brand: string;
    gradients?: { colors: string[] }[];
}

interface LPanelProps {
    brandGradients: BrandOption[];
    selectedBrand: string | null;
    onBrandSelect: (brand: string | null) => void;
    onColorSelect: (color: string) => void;
}

const LPanel: React.FC<LPanelProps> = ({
    brandGradients,
    selectedBrand,
    onBrandSelect,
    onColorSelect
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [pickerEnabled, setPickerEnabled] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const switchRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isEllipsisHovered, setIsEllipsisHovered] = useState<boolean>(false);

    useEffect(() => {
        if (contentRef.current && switchRef.current) {
            const switchHeight = switchRef.current.offsetHeight;
            const fullHeight = contentRef.current.scrollHeight;
            setContentHeight(pickerEnabled ? fullHeight : switchHeight + 32);
        }
    }, [pickerEnabled, isExpanded]);

    const getBrandColor = useCallback((brand: BrandOption) => {
        if (brand.brand === 'All') return '#FFD700';
        if (brand.gradients && brand.gradients.length > 0) {
            return brand.gradients[0].colors[0];
        }
        return '#000000';
    }, []);

    const getTextColor = useCallback((bgColor: string) => {
        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 160 ? 'text-gray-900' : 'text-white';
    }, []);

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
                onClick={() => onBrandSelect(brand.brand === 'All' ? null : brand.brand)}
            >
                {brand.brand}
            </button>
        );
    };

    const allOption: BrandOption = { brand: 'All' };
    const sortedBrands: BrandOption[] = [...brandGradients].sort((a, b) => a.brand.localeCompare(b.brand));

    const groupedBrands = sortedBrands.reduce((acc, brand) => {
        const firstLetter = brand.brand[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(brand);
        return acc;
    }, {} as Record<string, BrandOption[]>);

    return (
        <div className="fixed left-4 top-4 bottom-4 w-1/5 2xl:w-80 bg-gradient-to-r from-white/100 to-white/75 shadow-lg rounded-3xl overflow-hidden z-10">
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className="w-full max-w-md">
                        <div className='mb-12 w-full flex items-center justify-between gap-2'>
                            <Link href="/">
                                <div className='flex items-center gap-1'>
                                    <Image
                                        src='/BrandIconText.png'
                                        width={144}
                                        height={24}
                                        alt='brandiconimage'
                                    />
                                </div>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div
                                        className={`rounded-full p-1 transition-colors duration-200 ${isEllipsisHovered ? 'bg-gradient-to-r from-zinc-50 to-zinc-100' : ''
                                            }`}
                                        onMouseEnter={() => setIsEllipsisHovered(true)}
                                        onMouseLeave={() => setIsEllipsisHovered(false)}
                                    >
                                        <Ellipsis className='text-neutral-400' />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/license" className="flex items-center gap-2 w-full">
                                            <Scale className="w-4 h-4" />
                                            <span>License</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem asChild>
                                        <Link href="https://example.com" className="flex items-center gap-2 w-full">
                                            <ExternalLink className="w-4 h-4" />
                                            <span>External Link</span>
                                        </Link>
                                    </DropdownMenuItem> */}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                            {ColorPicker && <ColorPicker onColorSelect={onColorSelect} />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <Link className='flex pt-12 w-full items-center justify-center' href={'https://x.com/gradientcraft/status/1845187126847209554'}>
                        <Badge variant="secondary">
                            v0.1.1
                            <ExternalLink className='w-3' />
                        </Badge>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LPanel;