import { Copy, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
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

const ColorSwatchInfo: React.FC<ColorSwatchInfoProps> = ({ selectedGradientInfo, onClose }) => {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (selectedGradientInfo) {
            setIsVisible(true);
        }
    }, [selectedGradientInfo]);

    if (!selectedGradientInfo) {
        return null;
    }

    const { name, colors, brand } = selectedGradientInfo;

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

    const generateColorArray = (gradient: Gradient) => {
        return `const colors = [${gradient.colors.map(color => `'${color}'`).join(', ')}];`;
    };

    const copyOptions = [
        { label: 'Tailwind Text', action: () => generateTailwindText(selectedGradientInfo) },
        { label: 'Tailwind Background', action: () => generateTailwindBackground(selectedGradientInfo) },
        { label: 'CSS Text', action: () => generateCSSGradient(selectedGradientInfo, 'text') },
        { label: 'CSS Background', action: () => generateCSSGradient(selectedGradientInfo, 'background') },
        { label: 'SwiftUI Foreground', action: () => generateSwiftUIGradient(selectedGradientInfo, 'foreground') },
        { label: 'SwiftUI Background', action: () => generateSwiftUIGradient(selectedGradientInfo, 'background') },
        { label: 'Color Array', action: () => generateColorArray(selectedGradientInfo) },
    ];

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [label]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [label]: false }));
        }, 2000);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed right-4 top-4 bottom-4 w-1/5 bg-gradient-to-r from-white/100 to-white/75 shadow-lg rounded-3xl overflow-hidden z-10 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className="w-full max-w-md">
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
                        <div className="h-28 rounded-xl mb-6 shadow-inner" style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }} />
                    </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="px-6 py-6 overflow-y-auto flex-grow">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold font-serif text-gray-600 mb-3 text-xs">Colors</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {colors.map((color, index) => (
                                    <div key={index} className="flex items-center rounded-xl p-2 bg-amber-100/25 text-gray-700">
                                        <div className="w-6 h-6 rounded-full mr-3 shadow-inner" style={{ backgroundColor: color }} />
                                        <span className="text-xs font-mono">{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold font-serif text-gray-600 mb-3 text-xs">Copy Options</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {copyOptions.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-full items-center justify-between flex px-4 py-2 text-left rounded-xl text-xs transition-all duration-300 ${copiedStates[option.label]
                                            ? 'bg-amber-100 text-gray-800 font-medium'
                                            : 'bg-amber-100/25 text-gray-700 hover:bg-amber-100'
                                            } font-serif focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                                        onClick={() => copyToClipboard(option.action(), option.label)}
                                    >
                                        <span className="flex items-center">
                                            <Image
                                                src={`/Icons/${option.label}.svg`}
                                                height={16}
                                                width={16}
                                                alt=''
                                                className="mr-2"
                                            />
                                            {copiedStates[option.label] ? 'Copied!' : option.label}
                                        </span>
                                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorSwatchInfo;