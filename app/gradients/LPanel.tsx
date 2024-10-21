import { ExternalLink, Plane, Send, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import BrandList from './LPanelComponents/BrandList';
import Link from 'next/link';
import PannelHeader from './LPanelComponents/PannelHeader';
import { Separator } from '@/components/ui/separator';
import { pinyin } from 'pinyin-pro';

interface ColorOption {
    type: 'brand' | 'album';
    name: string;
    gradients?: { colors: string[] }[];
    artist?: string;
    tags?: string[];
}

interface LPanelProps {
    colorOptions: ColorOption[];
    selectedCategory: string | null;
    onCategorySelect: (category: string | null) => void;
    onColorSelect: (color: string) => void;
}

const LPanel: React.FC<LPanelProps> = ({
    colorOptions,
    selectedCategory,
    onCategorySelect }) => {
    const [selectedType, setSelectedType] = useState<'all' | 'brands' | 'albums'>('all');
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        const bannerClosed = localStorage.getItem('telegramBannerClosed');
        if (bannerClosed === 'true') {
            setShowBanner(false);
        }
    }, []);

    const closeBanner = () => {
        setShowBanner(false);
        localStorage.setItem('telegramBannerClosed', 'true');
    };

    const getOptionColor = useCallback((option: ColorOption) => {
        if (option.name === 'All') return '#FFD700';
        if (option.gradients && option.gradients.length > 0) {
            return option.gradients[0].colors[0];
        }
        return '#000000';
    }, []);

    const getTextColor = useCallback((bgColor: string) => {
        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return `text-${brightness > 160 ? 'gray-900 dark:gray-900' : 'white dark:white'}`;
    }, []);

    const getPinyinFirstLetter = (str: string): string => {
        const pinyinResult = pinyin(str, { pattern: 'first', toneType: 'none' });
        return pinyinResult[0].toUpperCase();
    };

    const filteredOptions = selectedType === 'all'
        ? colorOptions
        : colorOptions.filter(option => option.type === selectedType.slice(0, -1));

    const sortedOptions = [...filteredOptions].sort((a, b) => {
        const pinyinA = pinyin(a.name, { pattern: 'first', toneType: 'none' });
        const pinyinB = pinyin(b.name, { pattern: 'first', toneType: 'none' });
        return pinyinA.localeCompare(pinyinB);
    });

    const groupedOptions = sortedOptions.reduce((acc, option) => {
        const firstLetter = getPinyinFirstLetter(option.name);
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(option);
        return acc;
    }, {} as Record<string, ColorOption[]>);

    return (
        <div className="fixed left-4 top-4 bottom-4 w-1/5 2xl:w-80 bg-gradient-to-r from-white/100 to-white/75 dark:from-zinc-900/100 dark:to-zinc-800/75 shadow-lg rounded-3xl overflow-hidden z-10">
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <PannelHeader />
                </div>
                <Separator className="dark:bg-zinc-700" />
                {showBanner && (
                    <div className='relative mt-4 mx-6'>
                        <button
                            className='flex flex-col items-center justify-between px-4 py-6 gap-4 rounded-3xl text-white bg-[#55b1f6] w-full group hover:bg-[#54a7e6]'
                            onClick={() => window.open("https://t.me/+jq2ARZn6BeI5ODJl")}
                        >
                            <Send className="w-12 transition-transform duration-300 group-hover:animate-spin-hover" />
                            <p className='text-md font-semibold'>
                                Join telegram Dashboard for latest updates
                            </p>
                        </button>
                        <button
                            onClick={closeBanner}
                            className="absolute top-2 right-2 text-white hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
                <div className="px-6 py-6 overflow-y-auto flex-grow">
                    <BrandList
                        groupedOptions={groupedOptions}
                        selectedCategory={selectedCategory}
                        selectedType={selectedType}
                        onCategorySelect={onCategorySelect}
                        onTypeSelect={setSelectedType}
                        getOptionColor={getOptionColor}
                        getTextColor={getTextColor}
                    />
                    <Link className='flex pt-12 w-full items-center justify-center' href={'https://x.com/gradientcraft/status/1845187126847209554'}>
                        <Badge variant="secondary" className="dark:bg-zinc-700 dark:text-zinc-200">
                            v0.1.2
                            <ExternalLink className='w-3' />
                        </Badge>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LPanel;