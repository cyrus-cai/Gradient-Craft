import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useState } from 'react';

import Image from 'next/image';

const GradientCard: React.FC<{
    gradient: { colors: string[], name: string },
    index: number,
    showCompany: boolean,
    company: string,
    copyOptions: { label: string, action: () => void }[]
}> = ({ gradient, index, showCompany, company, copyOptions }) => {
    const [isSelected, setIsSelected] = useState(false);
    const gradientId = `gradient-${index}`;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    className={`relative w-full h-36 rounded-3xl bg-amber-400/10 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected ? 'ring-2 ring-amber-500' : ''
                        }`}
                    onClick={() => setIsSelected(!isSelected)}
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
            <PopoverContent className="w-64 p-3" sideOffset={5}>
                <div className="space-y-1.5">
                    {copyOptions.map((option, idx) => (
                        <button
                            key={idx}
                            className="flex items-center w-full gap-2 px-4 py-3 hover:bg-gradient-to-r hover:from-amber-100/50 hover:to-amber-200/50 rounded-2xl transition-all duration-300 ease-in-out text-left group focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                option.action();
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
    );
};

export default GradientCard;