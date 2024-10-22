import { ExternalLink, Plane, Send, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import BrandList from './LPanelComponents/BrandList';
import Image from "next/image"
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
                <div className="flex flex-col gap-6 sticky top-0 bg-white/25 backdrop-blur-2xl z-50">
                    <div className='px-6 pt-6'>
                        <PannelHeader />
                    </div>
                    <Separator className="dark:bg-zinc-700" />
                </div>
                <BrandList
                    groupedOptions={groupedOptions}
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                    onCategorySelect={onCategorySelect}
                    onTypeSelect={setSelectedType}
                    getOptionColor={getOptionColor}
                    getTextColor={getTextColor}
                />
                <div className='flex items-center justify-center gap-6 w-full p-12'>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <div className='flex items-center'>
                            <Image
                                src={`/Icons/Github.svg`}
                                height={24}
                                width={24}
                                alt=''
                                className="mr-2 dark:invert group-hover:scale-110 transition-transform duration-200"
                            />
                        </div>
                    </Link>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <Image
                            src={`/Icons/X.png`}
                            height={20}
                            width={20}
                            alt=''
                            className="mr-2 dark:invert group-hover:scale-110 transition-transform duration-200"
                        />
                    </Link>
                    <Link
                        href="https://t.me/+jq2ARZn6BeI5ODJl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <Send />
                        {/* <Image
                            src={`/Icons/X.png`}
                            height={20}
                            width={20}
                            alt=''
                            className="mr-2 dark:invert group-hover:scale-110 transition-transform duration-200"
                        /> */}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LPanel;