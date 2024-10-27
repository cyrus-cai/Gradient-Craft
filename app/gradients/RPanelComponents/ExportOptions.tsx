//ExportOptions.ts

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { ArrowDownToLine } from 'lucide-react';
import { Shortcut } from '@/components/ui/shortcut';

interface ExportOption {
    label: string;
    action: () => void;
    icon: React.ReactNode;
    shortcut?: string;
}

interface ExportOptionsProps {
    exportOptions: ExportOption[];
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ exportOptions }) => {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [exportedStates, setExportedStates] = useState<{ [key: string]: boolean }>({});

    const handleExport = (label: string, action: () => void) => {
        action();
        setExportedStates(prev => ({ ...prev, [label]: true }));
        setTimeout(() => setExportedStates(prev => ({ ...prev, [label]: false })), 1500);
    };

    return (
        <div className="bg-white dark:bg-zinc-900">
            <div className='flex items-center justify-between py-4'>
                <h3 className="font-semibold font-serif text-zinc-600 dark:text-zinc-300 text-sm">Export Options</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {exportOptions.map((option, idx) => (
                    <motion.button
                        key={idx}
                        className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 relative
                            ${exportedStates[option.label]
                                ? 'bg-yellow-400/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200/90 font-medium'
                                : 'bg-yellow-600/5 text-amber-700 hover:bg-amber-50/50 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            } font-mono focus:outline-none outline-none focus:ring-2 focus:ring-amber-200/20 dark:focus:ring-amber-300/10`}
                        onClick={() => handleExport(option.label, option.action)}
                        onMouseEnter={() => setHoveredOption(option.label)}
                        onMouseLeave={() => setHoveredOption(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            {React.cloneElement(option.icon as React.ReactElement, {
                                className: 'w-4 text-amber-600/80 dark:text-amber-400/60'
                            })}
                            <AnimatePresence>
                                {exportedStates[option.label] ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-amber-700 dark:text-amber-200/90"
                                    >
                                        Exported!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="text-amber-700 dark:text-amber-400/75"
                                    >
                                        for {option.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        {hoveredOption === option.label && !exportedStates[option.label] ? (
                            <ArrowDownToLine className="w-4 h-4 text-amber-600/80 dark:text-amber-400/60 absolute right-4 transition-colors duration-300" />
                        ) : option.shortcut ? (
                            <Shortcut>{option.shortcut}</Shortcut>
                        ) : null}
                    </motion.button>
                ))}
            </div>
            {/* <div className='flex flex-col gap-1 bg-gradient-to-r from-slate-300/100 via-sky-300/100 to-sky-200/100 [background:linear-gradient(90deg,var(--tw-gradient-stops))]'>
                <div className='relative border-transparent rounded-lg before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:p-[1px] before:bg-gradient-to-br before:from-green-500/80 before:to-green-500/80 before:content-[""]'>
                    Test A
                </div>
                <div className='relative p-[1px] before:bg-gradient-to-br before:from-red-600/80 before:to-pink-300/80 before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:content-[""]'>
                    <div className='bg-white'>
                        Example Text 1
                    </div>
                </div>
                <div className='relative p-[2px] before:bg-gradient-to-t before:from-lime-500/100 before:to-orange-600/50 before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:content-[""]'>
                    <div className='bg-white'>
                        Example Text
                    </div>
                </div>
            </div > */}
        </div >
    );
};