import { Music, Tag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import React from 'react';

interface ColorOption {
    type: 'brand' | 'album';
    name: string;
    gradients?: { colors: string[] }[];
    artist?: string;
    tags?: string[];
}

interface BrandButtonProps {
    option: ColorOption;
    isSelected: boolean;
    onSelect: () => void;
    getOptionColor: (option: ColorOption) => string;
    getTextColor: (bgColor: string) => string;
}

const BrandButton: React.FC<BrandButtonProps> = ({ option, isSelected, onSelect, getOptionColor, getTextColor }) => {
    const optionColor = getOptionColor(option);
    const textColor = getTextColor(optionColor);

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 ${isSelected
                                ? `${textColor} font-serif`
                                : 'bg-amber-100/25 text-gray-700 hover:bg-amber-100 dark:bg-gray-800/25 dark:text-gray-300 dark:hover:bg-gray-700 font-serif'
                                }`}
                            style={isSelected ? { backgroundColor: optionColor } : {}}
                            onClick={onSelect}
                            aria-label={`Select ${option.type} ${option.name}`}
                        >
                            <div className="flex items-center overflow-hidden">
                                {option.type === 'album' && (
                                    <Music className="w-3 h-3 mr-2 flex-shrink-0" />
                                )}
                                <span className="truncate">{option.name}</span>
                            </div>
                            {option.type === 'album' && option.artist && (
                                <span className="ml-2 text-xs opacity-75 truncate">
                                    {option.artist}
                                </span>
                            )}
                        </button>
                    </TooltipTrigger>
                    {/* <TooltipContent>
                        <p>{option.name}</p>
                        {option.type === 'album' && (
                            <>
                                <p>Artist: {option.artist}</p>
                                {option.tags && option.tags.length > 0 && (
                                    <div className="flex items-center mt-1">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {option.tags.join(', ')}
                                    </div>
                                )}
                            </>
                        )}
                    </TooltipContent> */}
                </Tooltip>
            </TooltipProvider>
        </>
    );
};

export default BrandButton;