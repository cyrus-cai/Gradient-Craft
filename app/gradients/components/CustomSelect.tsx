import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface FrameworkOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: FrameworkOption[];
    value: string;
    onChange: (value: string) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-xs rounded-xl font-mono bg-amber-100/25 text-gray-700 hover:bg-amber-100/50 transition-all duration-200 flex justify-between items-center border border-transparent focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
                <Image
                    src={`/Icons/${options.find(option => option.value === value)?.label}.svg`}
                    height={16}
                    width={16}
                    alt=''
                    className="mr-2"
                />
                <span className="truncate">
                    {options.find(option => option.value === value)?.label}
                </span>
                <ChevronDown size={14} className={`ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg max-h-64 overflow-auto border border-amber-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`w-full px-4 py-2 flex items-center text-xs font-mono text-left hover:bg-amber-100/50 transition-colors duration-200 ${option.value === value ? 'bg-amber-100/25 font-semibold' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};