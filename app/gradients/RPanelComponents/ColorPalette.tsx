import { AnimatePresence, motion } from 'framer-motion';

import { Copy } from 'lucide-react';
import React from 'react';

interface ColorPaletteProps {
    colors: string[];
    copiedStates: { [key: string]: boolean };
    onCopy: (color: string, label: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, copiedStates, onCopy }) => {
    return (
        <div>
            <h4 className="font-semibold font-serif text-zinc-600 dark:text-zinc-300 text-sm">Colors</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {colors.map((color, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center rounded-xl text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-800/30 p-2 relative overflow-hidden"
                        onClick={() => onCopy(color, `Color ${index + 1}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-6 h-6 rounded-full mr-3 shadow-inner" style={{ backgroundColor: color }} />
                        <AnimatePresence>
                            {copiedStates[`Color ${index + 1}`] ? (
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold"
                                >
                                    Copied!
                                </motion.span>
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="text-xs font-mono"
                                >
                                    {color}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <motion.div
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                        >
                            <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};