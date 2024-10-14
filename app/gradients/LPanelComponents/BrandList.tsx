import { Album, Boxes, ChartArea, Globe, Search, Tag, Twitter } from 'lucide-react';
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

            // Filter by type (all, brands, albums)
            if (selectedType !== 'all') {
                matchingOptions = matchingOptions.filter(option =>
                    (selectedType === 'brands' && option.type === 'brand') ||
                    (selectedType === 'albums' && option.type === 'album')
                );
            }

            // Apply search filter only if a category is selected or we're not in 'albums' mode
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
        <div className="space-y-4">
            <div className="mb-4">
                {/* <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-sm border bg-amber-50  focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div> */}
                <div className="flex justify-between mb-4">
                    {(['all', 'brands', 'albums'] as const).map((type) => {
                        const Icon = type === 'all' ? Globe : type === 'brands' ? Twitter : Album;
                        return (
                            <button
                                key={type}
                                className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 flex items-center space-x-2 ${selectedType === type
                                    ? 'bg-amber-400 text-white'
                                    : 'bg-amber-100 text-gray-700'
                                    }`}
                                onClick={() => onTypeSelect(type)}
                            >
                                <Icon size={16} />
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </button>
                        );
                    })}
                </div>
                <BrandButton
                    option={allOption}
                    isSelected={selectedCategory === null}
                    onSelect={() => onCategorySelect(null)}
                    getOptionColor={getOptionColor}
                    getTextColor={getTextColor}
                />
            </div>
            {Object.entries(filteredOptions).map(([letter, options]) => (
                <div key={letter}>
                    <h4 className="font-semibold font-serif text-gray-600 mb-2">{letter}</h4>
                    <div className="grid grid-cols-1 gap-2">
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
    );
};

export default BrandList;