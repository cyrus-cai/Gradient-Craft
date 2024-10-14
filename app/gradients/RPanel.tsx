import { Music, Tag, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateCSSGradient, generateSwiftUIGradient } from './RPanelComponents/gradientUtils';
import { generateTailwindBackground, generateTailwindBorder, generateTailwindRing, generateTailwindText } from './RPanelComponents/gradientUtils';

import { ColorPalette } from './RPanelComponents/ColorPalette';
import { CopyOptions } from './RPanelComponents/CopyOptions';
import { GradientDisplay } from './RPanelComponents/GradientDisplay';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

interface Gradient {
    name: string;
    colors: string[];
}

interface SelectedGradientInfo extends Gradient {
    type: 'brand' | 'album';
    parentName: string;
    artist?: string;
    tags?: string[];
}

interface RPanelProps {
    selectedGradientInfo: SelectedGradientInfo | null;
    onClose: () => void;
}

const RPanel: React.FC<RPanelProps> = ({ selectedGradientInfo, onClose }) => {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isVisible, setIsVisible] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedFramework, setSelectedFramework] = useState<string>('tailwind');

    useEffect(() => {
        if (selectedGradientInfo) {
            setIsVisible(true);
        }
    }, [selectedGradientInfo]);

    const copyToClipboard = useCallback((text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [label]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [label]: false }));
        }, 2000);
    }, []);

    const exportImage = useCallback(() => {
        if (canvasRef.current && selectedGradientInfo) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 400, 0);
                selectedGradientInfo.colors.forEach((color, index) => {
                    gradient.addColorStop(index / (selectedGradientInfo.colors.length - 1), color);
                });
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 400);

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${selectedGradientInfo.name.replace(/\s+/g, '-').toLowerCase()}-gradient.png`;
                link.click();
            }
        }
    }, [selectedGradientInfo]);

    const frameworkOptions = [
        { value: 'tailwind', label: 'Tailwind' },
        { value: 'css', label: 'CSS' },
        { value: 'swiftui', label: 'SwiftUI' },
    ];

    const getCopyOptions = useCallback(() => {
        if (!selectedGradientInfo) return [];

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
    }, [selectedGradientInfo, selectedFramework]);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    if (!selectedGradientInfo) {
        return null;
    }

    return (
        <motion.div
            className="fixed right-4 top-4 bottom-4 lg:w-1/5 2xl:w-80 bg-gradient-to-r from-white/75 to-white/50 shadow-lg rounded-3xl overflow-hidden z-10"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: isVisible ? 0 : '100%', opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className='mb-4 w-full flex items-center justify-between'>
                        <h2 className="text-2xl font-serif font-semibold text-gray-800">{selectedGradientInfo.name}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-serif">
                        {selectedGradientInfo.type === 'album' ? (
                            <span className="flex items-center">
                                <Music size={12} className="mr-1" />
                                {selectedGradientInfo.artist} - {selectedGradientInfo.parentName}
                            </span>
                        ) : (
                            `from ${selectedGradientInfo.parentName}`
                        )}
                    </p>
                    {selectedGradientInfo.type === 'album' && selectedGradientInfo.tags && (
                        <p className="text-xs text-gray-500 mb-4 font-serif flex items-center">
                            <Tag size={12} className="mr-1" />
                            {selectedGradientInfo.tags.join(', ')}
                        </p>
                    )}
                    <GradientDisplay colors={selectedGradientInfo.colors} onExport={exportImage} />
                </div>
                <Separator className="bg-gray-200" />
                <div className="px-6 py-6 overflow-y-auto flex-grow">
                    <div className="space-y-6">
                        <ColorPalette
                            colors={selectedGradientInfo.colors}
                            copiedStates={copiedStates}
                            onCopy={copyToClipboard}
                        />
                        <CopyOptions
                            selectedFramework={selectedFramework}
                            frameworkOptions={frameworkOptions}
                            copyOptions={getCopyOptions()}
                            copiedStates={copiedStates}
                            onCopy={copyToClipboard}
                            onFrameworkChange={setSelectedFramework}
                        />
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} width="400" height="400" style={{ display: 'none' }} />
        </motion.div>
    );
};

export default RPanel;