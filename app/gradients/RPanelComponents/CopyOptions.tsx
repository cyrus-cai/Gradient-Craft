import { AnimatePresence, motion } from 'framer-motion';
import { CircleDashed, Copy, Images, Square, Type } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';

import { CustomSelect } from './CustomSelect';
import { Shortcut } from '@/components/ui/shortcut';

interface CopyOption {
    label: string;
    action: () => string;
    shortcut: string;
}

interface CopyOptionsProps {
    selectedFramework: string;
    frameworkOptions: { value: string; label: string; }[];
    copyOptions: CopyOption[];
    copiedStates: { [key: string]: boolean };
    onCopy: (text: string, label: string) => void;
    onFrameworkChange: (value: string) => void;
}

export const CopyOptions: React.FC<CopyOptionsProps> = ({
    selectedFramework,
    frameworkOptions,
    copyOptions,
    copiedStates,
    onCopy,
    onFrameworkChange
}) => {
    const [hoveredOption, setHoveredOption] = React.useState<string | null>(null);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!copyOptions.length) return;

        const keyToIndex: { [key: string]: number } = {
            'Enter': 0,
            '1': 0,
            '2': 1,
            '3': 2,
            '4': 3,
            '5': 4,
            '6': 5,
            '7': 6,
            '8': 7,
            '9': 8,
        };

        let index = keyToIndex[event.key];

        if (event.key === 'Enter' && event.metaKey) {
            index = 1;
        }

        if (index !== undefined && index < copyOptions.length) {
            const option = copyOptions[index];
            onCopy(option.action(), option.label);
        }
    }, [copyOptions, onCopy]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div>
            <div className='flex items-center justify-between py-4'>
                <h3 className="font-semibold font-serif text-gray-600 text-sm">Copy Options</h3>
                <CustomSelect
                    options={frameworkOptions}
                    value={selectedFramework}
                    onChange={onFrameworkChange}
                />
            </div>
            <div className="grid grid-cols-1 gap-2">
                {copyOptions.map((option, idx) => (
                    <motion.button
                        key={idx}
                        className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 relative ${copiedStates[option.label]
                            ? 'bg-amber-200 text-amber-800 font-medium'
                            : 'bg-amber-100/25 text-amber-700 hover:bg-amber-100'
                            } font-serif focus:outline-none outline-none`}
                        onClick={() => onCopy(option.action(), option.label)}
                        onMouseEnter={() => setHoveredOption(option.label)}
                        onMouseLeave={() => setHoveredOption(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            {option.label === 'Text' && <Type className='w-4 text-amber-600' />}
                            {option.label === 'Foreground' && <Type className='w-4 text-amber-600' />}
                            {option.label === 'Background' && <Images className='w-4 text-amber-600' />}
                            {option.label === 'Border' && <Square className='w-4 text-amber-600' />}
                            {option.label === 'Ring' && <CircleDashed className='w-4 text-amber-600' />}
                            <AnimatePresence>
                                {copiedStates[option.label] ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-amber-800 font-semibold"
                                    >
                                        Copied!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        {option.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        {hoveredOption === option.label && !copiedStates[option.label] ? (
                            <Copy className="w-4 h-4 text-amber-600 absolute right-4 transition-colors duration-300" />
                        ) : (
                            <Shortcut>{option.shortcut}</Shortcut>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};