//RPanel.tsx
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
    const [gradientAngle, setGradientAngle] = useState(90);
    const [gradientOpacity, setGradientOpacity] = useState(100); // 添加透明度状态

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

    // const exportImage = useCallback((width: number, height: number, fileName: string) => {
    //     if (canvasRef.current && selectedGradientInfo) {
    //         const canvas = canvasRef.current;
    //         canvas.width = width;
    //         canvas.height = height;
    //         const ctx = canvas.getContext('2d');
    //         if (ctx) {
    //             const gradient = ctx.createLinearGradient(0, 0, width, 0);
    //             selectedGradientInfo.colors.forEach((color, index) => {
    //                 gradient.addColorStop(index / (selectedGradientInfo.colors.length - 1), color);
    //             });
    //             ctx.fillStyle = gradient;
    //             ctx.fillRect(0, 0, width, height);

    //             const dataUrl = canvas.toDataURL('image/png');
    //             const link = document.createElement('a');
    //             link.href = dataUrl;
    //             link.download = `${selectedGradientInfo.name.replace(/\s+/g, '-').toLowerCase()}-${fileName}.png`;
    //             link.click();

    //             setTimeout(() => {
    //                 if (isMounted.current) {
    //                     URL.revokeObjectURL(link.href);
    //                 }
    //             }, 100);
    //         }
    //     }
    // }, [selectedGradientInfo]);

    const exportImage = useCallback((width: number, height: number, fileName: string) => {
        if (canvasRef.current && selectedGradientInfo) {
            const canvas = canvasRef.current;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // 计算渐变的起点和终点
                const angle = gradientAngle * (Math.PI / 180); // 转换为弧度
                const centerX = width / 2;
                const centerY = height / 2;

                // 计算渐变线的长度（使用对角线长度确保覆盖整个画布）
                const gradientLength = Math.sqrt(width * width + height * height);

                // 计算渐变的起点和终点
                const startX = centerX - Math.cos(angle) * gradientLength / 2;
                const startY = centerY - Math.sin(angle) * gradientLength / 2;
                const endX = centerX + Math.cos(angle) * gradientLength / 2;
                const endY = centerY + Math.sin(angle) * gradientLength / 2;

                // 创建线性渐变
                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

                // 添加颜色停止点，并应用不透明度
                selectedGradientInfo.colors.forEach((color, index) => {
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);
                    const a = gradientOpacity / 100; // 转换百分比为小数
                    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
                    gradient.addColorStop(index / (selectedGradientInfo.colors.length - 1), rgba);
                });

                // 填充渐变
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                // 如果透明度小于100%，需要添加透明背景
                if (gradientOpacity < 100) {
                    // 创建临时画布来组合背景
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = width;
                    tempCanvas.height = height;
                    const tempCtx = tempCanvas.getContext('2d');

                    if (tempCtx) {
                        // 绘制棋盘格背景表示透明度
                        const squareSize = 10;
                        for (let x = 0; x < width; x += squareSize) {
                            for (let y = 0; y < height; y += squareSize) {
                                tempCtx.fillStyle = ((x + y) / squareSize) % 2 === 0 ? '#ffffff' : '#f0f0f0';
                                tempCtx.fillRect(x, y, squareSize, squareSize);
                            }
                        }

                        // 绘制渐变
                        tempCtx.drawImage(canvas, 0, 0);

                        // 将临时画布的内容复制回主画布
                        ctx.clearRect(0, 0, width, height);
                        ctx.drawImage(tempCanvas, 0, 0);
                    }
                }

                // 导出图片
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
    }, [selectedGradientInfo, gradientAngle, gradientOpacity]);

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
                    {
                        label: 'Text',
                        action: () => generateTailwindText(selectedGradientInfo, gradientAngle, gradientOpacity),
                        shortcut: 'Enter'
                    },
                    {
                        label: 'Background',
                        action: () => generateTailwindBackground(selectedGradientInfo, gradientAngle, gradientOpacity),
                        shortcut: '⌘+Enter'
                    },
                    {
                        label: 'Border',
                        action: () => generateTailwindBorder(selectedGradientInfo, gradientAngle, gradientOpacity),
                        shortcut: '3'
                    },
                    {
                        label: 'Ring',
                        action: () => generateTailwindRing(selectedGradientInfo, gradientAngle, gradientOpacity),
                        shortcut: '4'
                    }
                ];
            case 'css':
                return [
                    {
                        label: 'Text',
                        action: () => generateCSSGradient(selectedGradientInfo, 'text', gradientAngle, gradientOpacity),
                        shortcut: 'Enter'
                    },
                    {
                        label: 'Background',
                        action: () => generateCSSGradient(selectedGradientInfo, 'background', gradientAngle, gradientOpacity),
                        shortcut: '⌘+Enter'
                    },
                    {
                        label: 'Border',
                        action: () => generateCSSGradient(selectedGradientInfo, 'border', gradientAngle, gradientOpacity),
                        shortcut: '3'
                    },
                    {
                        label: 'Ring',
                        action: () => generateCSSGradient(selectedGradientInfo, 'ring', gradientAngle, gradientOpacity),
                        shortcut: '4'
                    }
                ];
            case 'swiftui':
                return [
                    { label: 'Foreground', action: () => generateSwiftUIGradient(selectedGradientInfo, 'foreground'), shortcut: 'Enter' },
                    { label: 'Background', action: () => generateSwiftUIGradient(selectedGradientInfo, 'background'), shortcut: '⌘+Enter' },
                ];
            default:
                return [];
        }
    }, [selectedGradientInfo, selectedFramework, gradientAngle, gradientOpacity]);

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
            className="fixed right-4 top-4 bottom-4 lg:w-1/5 2xl:w-80 bg-gradient-to-r from-white/50 to-white/25 dark:from-zinc-800/75 dark:to-zinc-800/50 shadow-lg rounded-3xl overflow-hidden z-10"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: isVisible ? 0 : '100%', opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <div className='mb-2 w-full flex items-center justify-between'>
                        <h2 className="text-2xl font-serif font-semibold text-zinc-800 dark:text-zinc-200">{selectedGradientInfo.name}</h2>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
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
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 font-serif flex items-center">
                            <Tag size={12} className="mr-1" />
                            {selectedGradientInfo.tags.join(', ')}
                        </p>
                    )}
                    <GradientDisplay
                        colors={selectedGradientInfo.colors}
                        angle={gradientAngle}
                        opacity={gradientOpacity}
                        onAngleChange={setGradientAngle}
                        onOpacityChange={setGradientOpacity}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700" />
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
                            // copiedStates={copiedStates}
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