import { Album, Globe, Twitter } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import BrandButton from './BrandButton';

interface ColorOption {
    type: 'brand' | 'album';
    name: string;
    gradients?: { colors: string[] }[];
    artist?: string;
    tags?: string[];
}

interface BrandListProps {
    groupedOptions: Record<string, ColorOption[]>;
    selectedCategory: string | null;
    selectedType: 'all' | 'brands' | 'albums';
    onCategorySelect: (category: string | null) => void;
    onTypeSelect: (type: 'all' | 'brands' | 'albums') => void;
    getOptionColor: (option: ColorOption) => string;
    getTextColor: (bgColor: string) => string;
}

const BrandList: React.FC<BrandListProps> = ({
    groupedOptions,
    selectedCategory,
    selectedType,
    onCategorySelect,
    onTypeSelect,
    getOptionColor,
    getTextColor
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const allOption: ColorOption = {
        type: selectedType === 'albums' ? 'album' : 'brand',
        name: 'All'
    };

    const filteredOptions = useMemo(() => {
        let filtered: Record<string, ColorOption[]> = {};
        Object.entries(groupedOptions).forEach(([letter, options]) => {
            let matchingOptions = options;

            if (selectedType !== 'all') {
                matchingOptions = matchingOptions.filter(option =>
                    (selectedType === 'brands' && option.type === 'brand') ||
                    (selectedType === 'albums' && option.type === 'album')
                );
            }

            if (searchTerm && (selectedCategory !== null || selectedType !== 'albums')) {
                matchingOptions = matchingOptions.filter(option =>
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (matchingOptions.length > 0) {
                filtered[letter] = matchingOptions;
            }
        });
        return filtered;
    }, [groupedOptions, searchTerm, selectedType, selectedCategory]);

    return (
        <div className="h-[calc(100vh-4rem)] overflow-y-auto relative">
            {/* 优化顶部导航栏间距 */}
            <div className="sticky top-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl z-40">
                <div className="px-6 pt-4 pb-4">
                    <div className="flex gap-6 w-fit">
                        {(['all', 'brands', 'albums'] as const).map((type) => {
                            const Icon = type === 'all' ? Globe : type === 'brands' ? Twitter : Album;
                            return (
                                <button
                                    key={type}
                                    className={`group relative flex items-center gap-2 py-1
                                        ${selectedType === type
                                            ? 'text-yellow-600 dark:text-yellow-500'
                                            : 'text-zinc-400 dark:text-zinc-500'
                                        }`}
                                    onClick={() => onTypeSelect(type)}
                                >
                                    {/* <Icon className={`w-4 h-4 transition-all duration-300
                                        ${selectedType === type
                                            ? 'text-yellow-600 dark:text-yellow-500'
                                            : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300'
                                        }`}
                                    /> */}
                                    <span className={`text-sm font-medium tracking-wide transition-all
                                        ${selectedType === type ? '' : ''}`}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </span>
                                    {selectedType === type && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 优化内容区域间距 */}
            <div className="px-6">
                <div className="pt-2">
                    <BrandButton
                        option={allOption}
                        isSelected={selectedCategory === null}
                        onSelect={() => onCategorySelect(null)}
                        getOptionColor={getOptionColor}
                        getTextColor={getTextColor}
                    />
                </div>

                {Object.entries(filteredOptions).map(([letter, options], index) => (
                    <div key={letter} className={index !== 0 ? 'mb-8 mt-4' : 'mb-8 mt-1'}>
                        <h4 className="sticky top-[3.5rem] font-medium text-md text-zinc-800 font-serif dark:text-zinc-500
                            px-1 py-2 backdrop-blur-xl z-30">
                            {letter}
                        </h4>
                        <div className="grid gap-2">
                            {options.map((option) => (
                                <BrandButton
                                    key={`${option.type}-${option.name}`}
                                    option={option}
                                    isSelected={selectedCategory === option.name}
                                    onSelect={() => onCategorySelect(option.name)}
                                    getOptionColor={getOptionColor}
                                    getTextColor={getTextColor}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandList;