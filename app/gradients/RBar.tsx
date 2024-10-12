import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownToLine, ChevronDown, CircleDashed, Copy, Images, Square, Type, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Shortcut } from '@/components/ui/shortcut';
import { findClosestTailwindColor } from '@/lib/colorUtils';

interface Gradient {
    name: string;
    colors: string[];
}

interface SelectedGradientInfo extends Gradient {
    brand: string;
}

interface ColorSwatchInfoProps {
    selectedGradientInfo: SelectedGradientInfo | null;
    onClose: () => void;
}

interface FrameworkOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: FrameworkOption[];
    value: string;
    onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
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

const ColorSwatchInfo: React.FC<ColorSwatchInfoProps> = ({ selectedGradientInfo, onClose }) => {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isVisible, setIsVisible] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedFramework, setSelectedFramework] = useState<string>('tailwind');
    const [lastCopied, setLastCopied] = useState<string | null>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [colorCardHovering, setColorCardHovering] = useState(false)

    useEffect(() => {
        if (selectedGradientInfo) {
            setIsVisible(true);
        }
    }, [selectedGradientInfo]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!selectedGradientInfo) return;

            const copyOptions = getCopyOptions();
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
                copyToClipboard(option.action(), option.label);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedGradientInfo, selectedFramework]);


    useEffect(() => {
        if (selectedGradientInfo) {
            setIsVisible(true);
        }
    }, [selectedGradientInfo]);

    if (!selectedGradientInfo) {
        return null;
    }

    const copyBackgroundStyle = () => {
        let style = '';
        switch (selectedFramework) {
            case 'tailwind':
                style = generateTailwindBackground(selectedGradientInfo);
                break;
            case 'css':
                style = generateCSSGradient(selectedGradientInfo, 'background');
                break;
            case 'swiftui':
                style = generateSwiftUIGradient(selectedGradientInfo, 'background');
                break;
        }
        copyToClipboard(style, 'Background Style');
    };

    const copyTextStyle = () => {
        let style = '';
        switch (selectedFramework) {
            case 'tailwind':
                style = generateTailwindText(selectedGradientInfo);
                break;
            case 'css':
                style = generateCSSGradient(selectedGradientInfo, 'text');
                break;
            case 'swiftui':
                style = generateSwiftUIGradient(selectedGradientInfo, 'foreground');
                break;
        }
        copyToClipboard(style, 'Text Style');
    };

    const copyToClipboard = useCallback((text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [label]: true }));
        setLastCopied(label);
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [label]: false }));
            setLastCopied(null);
        }, 2000);
    }, []);

    const generateTailwindText = (gradient: Gradient) => {
        const gradientClasses = gradient.colors.map((color, index) => {
            const closestColor = findClosestTailwindColor(color);
            if (index === 0) return `from-${closestColor}`;
            if (index === gradient.colors.length - 1) return `to-${closestColor}`;
            return `via-${closestColor}`;
        }).join(' ');
        return `text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses}`;
    };

    const generateTailwindBackground = (gradient: Gradient) => {
        const gradientClasses = gradient.colors.map((color, index) => {
            const closestColor = findClosestTailwindColor(color);
            if (index === 0) return `from-${closestColor}`;
            if (index === gradient.colors.length - 1) return `to-${closestColor}`;
            return `via-${closestColor}`;
        }).join(' ');
        return `bg-gradient-to-r ${gradientClasses}`;
    };

    const generateTailwindBorder = (gradient: Gradient) => {
        const borderColor = findClosestTailwindColor(gradient.colors[0]);
        return `border border-${borderColor}`;
    };

    const generateTailwindRing = (gradient: Gradient) => {
        const ringColor = findClosestTailwindColor(gradient.colors[0]);
        return `ring-1 ring-${ringColor}`;
    };


    const generateCSSGradient = (gradient: Gradient, type: 'background' | 'text' | 'both' = 'both') => {
        const backgroundCode = `background: linear-gradient(to right, ${gradient.colors.join(', ')});`;
        const gradientTextCode = `
background: linear-gradient(to right, ${gradient.colors.join(', ')});
-webkit-background-clip: text;
background-clip: text;
color: transparent;
`;

        switch (type) {
            case 'background':
                return `/* 渐变背景 */\n${backgroundCode}`;
            case 'text':
                return `/* 渐变文本 */\n${gradientTextCode}`;
            case 'both':
            default:
                return `/* 渐变背景 */\n${backgroundCode}\n\n/* 渐变文本 */\n${gradientTextCode}`;
        }
    };

    const generateSwiftUIGradient = (gradient: Gradient, style: 'foreground' | 'background') => {
        const convertHexToRGB = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return { r, g, b };
        };

        const colors = gradient.colors.map(color => {
            const { r, g, b } = convertHexToRGB(color);
            return `Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}), // ${color}`;
        }).join('\n        ');

        const gradientDefinition = `
LinearGradient(
    gradient: Gradient(colors: [
        ${colors}
    ]),
    startPoint: .leading,
    endPoint: .trailing
)`;

        if (style === 'foreground') {
            return `// 用作前景样式 (iOS 15+)
.foregroundStyle(${gradientDefinition})`;
        } else {
            return `// 用作背景
.background(${gradientDefinition})`;
        }
    };


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!selectedGradientInfo) return;

            if (event.key === 'b' || event.key === 'B') {
                copyBackgroundStyle();
            } else if (event.key === 't' || event.key === 'T') {
                copyTextStyle();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedGradientInfo, selectedFramework]);

    if (!selectedGradientInfo) {
        return null;
    }

    const { name, colors, brand } = selectedGradientInfo;


    const exportImage = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 400, 0);
                colors.forEach((color, index) => {
                    gradient.addColorStop(index / (colors.length - 1), color);
                });
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 400);

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-gradient.png`;
                link.click();
            }
        }
    };

    const frameworkOptions = [
        { value: 'tailwind', label: 'Tailwind' },
        { value: 'css', label: 'CSS' },
        { value: 'swiftui', label: 'SwiftUI' },
    ];

    const getCopyOptions = () => {
        switch (selectedFramework) {
            case 'tailwind':
                return [
                    { label: 'Text', action: () => generateTailwindText(selectedGradientInfo), shortcut: 'Enter' },
                    { label: 'Background', action: () => generateTailwindBackground(selectedGradientInfo), shortcut: '⌘+Enter' },
                    { label: 'Border', action: () => generateTailwindBorder(selectedGradientInfo), shortcut: '3' },
                    { label: 'Ring', action: () => generateTailwindRing(selectedGradientInfo), shortcut: '4' },
                ];
            case 'css':
                return [
                    { label: 'Text', action: () => generateCSSGradient(selectedGradientInfo, 'text'), shortcut: 'Enter' },
                    { label: 'Background', action: () => generateCSSGradient(selectedGradientInfo, 'background'), shortcut: '⌘+Enter' },
                ];
            case 'swiftui':
                return [
                    { label: 'Foreground', action: () => generateSwiftUIGradient(selectedGradientInfo, 'foreground'), shortcut: 'Enter' },
                    { label: 'Background', action: () => generateSwiftUIGradient(selectedGradientInfo, 'background'), shortcut: '⌘+Enter' },
                ];
            default:
                return [];
        }
    };

    const copyOptions = getCopyOptions();

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed right-4 top-4 bottom-4 lg:w-1/5 2xl:w-80 bg-gradient-to-r from-white/75 to-white/50 shadow-lg rounded-3xl overflow-hidden z-10 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className='mb-4 w-full flex items-center justify-between'>
                        <h2 className="text-2xl font-serif font-semibold text-gray-800">{name}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 font-serif">from {brand}</p>
                    <div className="w-full max-w-md"
                        onMouseEnter={() => setColorCardHovering(true)}
                        onMouseLeave={() => setColorCardHovering(false)}
                    >

                        <div className='flex flex-col'>
                            <div className="h-28 rounded-xl shadow-inner"
                                style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }} />
                            <div className='w-full flex justify-end -mt-10 -ml-2'>
                                {colorCardHovering ? <Button onClick={exportImage} size='icon'>
                                    <ArrowDownToLine className='w-4' />
                                </Button> :
                                    <div className='h-8 w-8'></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="px-6 py-6 overflow-y-auto flex-grow">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold font-serif text-gray-600 text-sm">Colors</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {colors.map((color, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center rounded-xl text-gray-700 cursor-pointer hover:bg-amber-100/50 p-2 relative overflow-hidden"
                                        onClick={() => copyToClipboard(color, `Color ${index + 1}`)}
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
                                                    className="text-xs font-mono text-amber-600 font-semibold"
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
                                            <Copy className="w-4 h-4 text-amber-600" />
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center justify-between py-4'>
                                <h3 className="font-semibold font-serif text-gray-600 text-sm">Copy Options</h3>
                                <CustomSelect
                                    options={frameworkOptions}
                                    value={selectedFramework}
                                    onChange={setSelectedFramework}
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
                                        onClick={() => copyToClipboard(option.action(), option.label)}
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
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} width="400" height="400" style={{ display: 'none' }} />
        </div>
    );
};

export default ColorSwatchInfo;