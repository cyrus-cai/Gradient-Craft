//ExportOptions.ts

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { ArrowDownToLine } from 'lucide-react';

interface ExportOption {
    label: string;
    action: () => void;
    icon: React.ReactNode;
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
        setTimeout(() => setExportedStates(prev => ({ ...prev, [label]: false })), 2000);
    };

    return (
        <div>
            <div className='flex items-center justify-between py-4'>
                <h3 className="font-semibold font-serif text-zinc-600 dark:text-zinc-300 text-sm">Export Options</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {exportOptions.map((option, idx) => (
                    <motion.button
                        key={idx}
                        className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 relative ${exportedStates[option.label]
                            ? 'bg-yellow-600/5 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-600/5 font-medium'
                            : 'bg-yellow-600/5 text-yellow-700 hover:bg-yellow-600/5 dark:bg-yellow-900/25 dark:text-yellow-600/50 dark:hover:bg-yellow-800/50'
                            } font-serif focus:outline-none outline-none`}
                        onClick={() => handleExport(option.label, option.action)}
                        onMouseEnter={() => setHoveredOption(option.label)}
                        onMouseLeave={() => setHoveredOption(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            {React.cloneElement(option.icon as React.ReactElement, {
                                className: 'w-4 h-4 text-yellow-600 dark:text-yellow-400'
                            })}
                            <AnimatePresence>
                                {exportedStates[option.label] ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-yellow-800 dark:text-yellow-600/5 font-semibold"
                                    >
                                        Exported!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        for {option.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        {hoveredOption === option.label && !exportedStates[option.label] && (
                            <ArrowDownToLine className="w-4 h-4 text-yellow-600 dark:text-yellow-400 absolute right-4 transition-colors duration-300" />
                        )}

                    </motion.button>
                ))}
            </div>
            {/* <div className='flex flex-col gap-1'>
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
