import { Layout, Monitor, Music, Smartphone, Tablet, Tag, User } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateCSSGradient, generateSwiftUIGradient } from './RPanelComponents/gradientUtils';
import { generateTailwindBackground, generateTailwindBorder, generateTailwindRing, generateTailwindText } from './RPanelComponents/gradientUtils';

import { ColorPalette } from './RPanelComponents/ColorPalette';
import { CopyOptions } from './RPanelComponents/CopyOptions';
import { ExportOptions } from './RPanelComponents/ExportOptions';
import { GradientDisplay } from './RPanelComponents/GradientDisplay';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

interface RPanelProps {
    selectedGradientInfo: {
        name: string;
        colors: string[];
        type: 'brand' | 'album';
        parentName: string;
        artist?: string;
        tags?: string[];
    } | null;
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
        { label: 'iPhone', action: () => exportImage(1170, 2532, 'iphone'), icon: <Smartphone className='w-4 text-yellow-600' /> },
        { label: 'iPad', action: () => exportImage(2048, 2732, 'ipad'), icon: <Tablet className='w-4 text-yellow-600' /> },
        { label: 'Mac', action: () => exportImage(2560, 1600, 'mac'), icon: <Monitor className='w-4 text-yellow-600' /> },
        { label: 'PPT', action: () => exportImage(1920, 1080, 'ppt'), icon: <Layout className='w-4 text-yellow-600' /> },
        { label: 'Avatar', action: () => exportImage(500, 500, 'avatar'), icon: <User className='w-4 text-yellow-600' /> },
    ];

    if (!selectedGradientInfo) {
        return null;
    }

    return (
        <>
            {/* Social Links & Share Button */}
            <motion.div
                className="fixed right-4 top-4 z-50 flex items-center gap-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center bg-white/10 dark:bg-zinc-800/50 backdrop-blur-lg px-2 rounded-full">
                    <Link
                        href="https://t.me/+jq2ARZn6BeI5ODJl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:bg-zinc-100 dark:hover:bg-zinc-700 p-3 rounded-xl transition-all"
                    >
                        <Image
                            src="/Icons/tgLogo.svg"
                            height={18}
                            width={18}
                            alt="Twitter"
                            className="dark:invert group-hover:scale-110 transition-transform"
                        />
                    </Link>
                    <Link
                        href="https://x.com/gradientcraft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:bg-zinc-100 dark:hover:bg-zinc-700 p-3 rounded-xl transition-all"
                    >
                        <Image
                            src="/Icons/X.png"
                            height={16}
                            width={16}
                            alt="Twitter"
                            className="dark:invert group-hover:scale-110 transition-transform"
                        />
                    </Link>
                    <Link
                        href="https://github.com/cyrus-cai/Gradient-Craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:bg-zinc-100 dark:hover:bg-zinc-700 p-3 rounded-xl transition-all"
                    >
                        <Image
                            src="/Icons/Github.svg"
                            height={18}
                            width={18}
                            alt="GitHub"
                            className="dark:invert group-hover:scale-110 transition-transform"
                        />
                    </Link>
                </div>
            </motion.div>

            {/* Main Panel */}
            <motion.div
                className="fixed right-4 top-16 bottom-4 w-1/8 2xl:w-80 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden z-10 border border-zinc-200/50 dark:border-zinc-700/50"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: isVisible ? 0 : '100%', opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
                <div className="h-full flex flex-col">
                    {/* Header Section */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-serif font-semibold text-zinc-800 dark:text-zinc-100">
                                    {selectedGradientInfo?.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    {selectedGradientInfo?.type === 'album' ? (
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                                            <Music className="w-3.5 h-3.5" />
                                            <span>{selectedGradientInfo.artist}</span>
                                            <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                            <span>{selectedGradientInfo.parentName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                            from {selectedGradientInfo?.parentName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedGradientInfo?.type === 'album' && selectedGradientInfo.tags && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedGradientInfo.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-4">
                            <GradientDisplay
                                colors={selectedGradientInfo?.colors || []}
                                angle={gradientAngle}
                                opacity={gradientOpacity}
                                onAngleChange={setGradientAngle}
                                onOpacityChange={setGradientOpacity}
                            />
                        </div>
                    </div>

                    <Separator className="bg-zinc-200 dark:bg-zinc-800" />

                    {/* Content Section */}
                    <div className="flex-grow overflow-y-auto px-6 py-4">
                        <div className="space-y-6">
                            <ColorPalette
                                colors={selectedGradientInfo?.colors || []}
                                copiedStates={copiedStates}
                                onCopy={copyToClipboard}
                            />
                            <CopyOptions
                                selectedFramework={selectedFramework}
                                frameworkOptions={frameworkOptions}
                                copyOptions={getCopyOptions()}
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
        </>
    );
};

export default RPanel;