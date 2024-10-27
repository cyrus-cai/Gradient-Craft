import { AnimatePresence, motion } from 'framer-motion';
import { CircleDashed, Copy, Images, Square, Type } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CustomSelect } from './CustomSelect';
import Link from 'next/link';
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
    onCopy: (text: string, label: string) => void;
    onFrameworkChange: (value: string) => void;
}

export const CopyOptions: React.FC<CopyOptionsProps> = ({
    selectedFramework,
    frameworkOptions,
    copyOptions,
    onCopy,
    onFrameworkChange
}) => {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCopy = useCallback((text: string, label: string) => {
        onCopy(text, label);
        setCopiedStates(prev => ({ ...prev, [label]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [label]: false }));
        }, 1500);
    }, [onCopy]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!copyOptions.length) return;

        const activeElement = document.activeElement;
        const isInsideComponent = containerRef.current?.contains(activeElement);
        const isNoFocus = activeElement === document.body;

        if (!isInsideComponent && !isNoFocus) return;

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
            handleCopy(option.action(), option.label);
            event.preventDefault();
        }
    }, [copyOptions, handleCopy]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div ref={containerRef} className="bg-white dark:bg-zinc-900">
            <div className='flex items-center justify-between py-4'>
                <h3 className="font-semibold font-serif text-zinc-600 dark:text-zinc-300 text-sm">Copy Options</h3>
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
                        className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 relative
                            ${copiedStates[option.label]
                                ? 'bg-yellow-400/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200/90 font-medium'
                                : 'bg-yellow-600/5 text-amber-700 hover:bg-yellow-600/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            } font-mono focus:outline-none outline-none focus:ring-2 focus:ring-amber-200/20 dark:focus:ring-amber-300/10`}
                        onClick={() => handleCopy(option.action(), option.label)}
                        onMouseEnter={() => setHoveredOption(option.label)}
                        onMouseLeave={() => setHoveredOption(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            {option.label === 'Text' && <Type className='w-4 text-amber-600/80 dark:text-amber-400/60' />}
                            {option.label === 'Foreground' && <Type className='w-4 text-amber-600/80 dark:text-amber-400/60' />}
                            {option.label === 'Background' && <Images className='w-4 text-amber-600/80 dark:text-amber-400/60' />}
                            {option.label === 'Border' && <Square className='w-4 text-amber-600/80 dark:text-amber-400/60' />}
                            {option.label === 'Ring' && <CircleDashed className='w-4 text-amber-600/80 dark:text-amber-400/60' />}
                            <AnimatePresence>
                                {copiedStates[option.label] ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-amber-700 dark:text-amber-200/90"
                                    >
                                        Copied!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="text-amber-700 dark:text-amber-400/75"
                                    >
                                        {option.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        {hoveredOption === option.label && !copiedStates[option.label] ? (
                            <Copy className="w-4 h-4 text-amber-600/80 dark:text-amber-400/60 absolute right-4 transition-colors duration-300" />
                        ) : (
                            <Shortcut>{option.shortcut}</Shortcut>
                        )}
                    </motion.button>
                ))}
            </div>
            <div className='pt-6 px-2'>
                <p className='font-mono text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors'>
                    border or ring works incorrectly?
                    <div className='hover:underline'>
                        <Link href={'https://gcraft.notion.site/How-to-correctly-use-tailwind-border-or-ring-12870a0688948059b1d5fa7965a85755'}
                            className="text-zinc-500 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
                            Please check this example.
                        </Link>
                    </div>
                </p>
            </div>
        </div>
    );
};