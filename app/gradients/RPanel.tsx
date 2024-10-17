import { Layout, Monitor, Music, Smartphone, Tablet, Tag, User, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateCSSGradient, generateSwiftUIGradient } from './RPanelComponents/gradientUtils';
import { generateTailwindBackground, generateTailwindBorder, generateTailwindRing, generateTailwindText } from './RPanelComponents/gradientUtils';

import { ColorPalette } from './RPanelComponents/ColorPalette';
import { CopyOptions } from './RPanelComponents/CopyOptions';
import { ExportOptions } from './RPanelComponents/ExportOptions';
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
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedFramework, setSelectedFramework] = useState<string>('tailwind');
    const isMounted = useRef(true);

    useEffect(() => {
        // 创建 canvas 元素
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;

        // 清理函数
        return () => {
            isMounted.current = false;
            if (canvasRef.current && document.body.contains(canvasRef.current)) {
                try {
                    document.body.removeChild(canvasRef.current);
                } catch (error) {
                    console.error('Error removing canvas:', error);
                }
            }
            canvasRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (selectedGradientInfo) {
            setIsVisible(true);
        }
    }, [selectedGradientInfo]);

    const copyToClipboard = useCallback((text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [label]: true }));
        const timer = setTimeout(() => {
            if (isMounted.current) {
                setCopiedStates(prev => ({ ...prev, [label]: false }));
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const exportImage = useCallback((width: number, height: number, fileName: string) => {
        if (canvasRef.current && selectedGradientInfo) {
            const canvas = canvasRef.current;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                selectedGradientInfo.colors.forEach((color, index) => {
                    gradient.addColorStop(index / (selectedGradientInfo.colors.length - 1), color);
                });
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${selectedGradientInfo.name.replace(/\s+/g, '-').toLowerCase()}-${fileName}.png`;
                link.click();

                setTimeout(() => {
                    if (isMounted.current) {
                        URL.revokeObjectURL(link.href);
                    }
                }, 100);
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

    const getExportOptions = [
        { label: 'iPhone', action: () => exportImage(1170, 2532, 'iphone'), icon: <Smartphone className='w-4 text-amber-600' /> },
        { label: 'iPad', action: () => exportImage(2048, 2732, 'ipad'), icon: <Tablet className='w-4 text-amber-600' /> },
        { label: 'Mac', action: () => exportImage(2560, 1600, 'mac'), icon: <Monitor className='w-4 text-amber-600' /> },
        { label: 'PPT', action: () => exportImage(1920, 1080, 'ppt'), icon: <Layout className='w-4 text-amber-600' /> },
        { label: 'Avatar', action: () => exportImage(500, 500, 'avatar'), icon: <User className='w-4 text-amber-600' /> },
    ];

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    if (!selectedGradientInfo) {
        return null;
    }

    return (
        <motion.div
            className="fixed right-4 top-4 bottom-4 lg:w-1/5 2xl:w-80 bg-gradient-to-r from-white/75 to-white/50 dark:from-gray-800/75 dark:to-gray-800/50 shadow-lg rounded-3xl overflow-hidden z-10"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: isVisible ? 0 : '100%', opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className='mb-4 w-full flex items-center justify-between'>
                        <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedGradientInfo.name}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-serif">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-serif flex items-center">
                            <Tag size={12} className="mr-1" />
                            {selectedGradientInfo.tags.join(', ')}
                        </p>
                    )}
                    <GradientDisplay colors={selectedGradientInfo.colors} />
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
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
                        <ExportOptions
                            exportOptions={getExportOptions}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RPanel;