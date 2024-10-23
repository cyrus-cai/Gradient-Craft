// GradientDisplay.tsx
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface GradientDisplayProps {
    colors: string[];
    angle: number;
    opacity: number;
    onAngleChange: (angle: number) => void;
    onOpacityChange: (opacity: number) => void;
}

export const GradientDisplay: React.FC<GradientDisplayProps> = ({
    colors,
    angle,
    opacity,
    onAngleChange,
    onOpacityChange
}) => {
    const handleAngleChange = (value: number[]) => {
        onAngleChange(value[0]);
    };

    const handleOpacityChange = (value: number[]) => {
        onOpacityChange(value[0]);
    };

    return (
        <div className="w-full max-w-md space-y-4">
            <div className="flex flex-col">
                <div
                    className="h-64 rounded-xl shadow-inner transition-all duration-300"
                    style={{
                        background: `linear-gradient(${angle}deg, ${colors.map(color => {
                            // Convert hex to rgba for opacity support
                            const r = parseInt(color.slice(1, 3), 16);
                            const g = parseInt(color.slice(3, 5), 16);
                            const b = parseInt(color.slice(5, 7), 16);
                            return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
                        }).join(', ')})`
                    }}
                />
                <div className="mt-4 space-y-4">
                    {/* Angle Control */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Gradient Angle
                            </span>
                            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                {angle}°
                            </span>
                        </div>
                        <Slider
                            value={[angle]}
                            onValueChange={handleAngleChange}
                            min={0}
                            max={360}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Opacity Control */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Opacity
                            </span>
                            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                {opacity}%
                            </span>
                        </div>
                        <Slider
                            value={[opacity]}
                            onValueChange={handleOpacityChange}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};