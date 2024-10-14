import React, { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import BrandList from './LPanelComponents/BrandList';
import { ExternalLink } from 'lucide-react';
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
        return brightness > 160 ? 'text-gray-900' : 'text-white';
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
        <div className="fixed left-4 top-4 bottom-4 w-1/5 2xl:w-80 bg-gradient-to-r from-white/100 to-white/75 shadow-lg rounded-3xl overflow-hidden z-10">
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <PannelHeader />
                </div>
                <Separator />
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
                        <Badge variant="secondary">
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