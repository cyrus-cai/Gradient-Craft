import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownToLine, Copy, Layout, Monitor, Smartphone, Tablet, User } from 'lucide-react';
import React, { useState } from 'react';

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
                            ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 font-medium'
                            : 'bg-amber-100/25 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/25 dark:text-amber-300 dark:hover:bg-amber-800/50'
                            } font-serif focus:outline-none outline-none`}
                        onClick={() => handleExport(option.label, option.action)}
                        onMouseEnter={() => setHoveredOption(option.label)}
                        onMouseLeave={() => setHoveredOption(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            {React.cloneElement(option.icon as React.ReactElement, {
                                className: 'w-4 h-4 text-amber-600 dark:text-amber-400'
                            })}
                            <AnimatePresence>
                                {exportedStates[option.label] ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-amber-800 dark:text-amber-200 font-semibold"
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
                            <ArrowDownToLine className="w-4 h-4 text-amber-600 dark:text-amber-400 absolute right-4 transition-colors duration-300" />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};