import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface GradientDisplayProps {
    colors: string[];
    angle: number;
    onAngleChange: (angle: number) => void;
}

export const GradientDisplay: React.FC<GradientDisplayProps> = ({
    colors,
    angle,
    onAngleChange
}) => {
    const handleAngleChange = (value: number[]) => {
        onAngleChange(value[0]);
    };

    return (
        <div className="w-full max-w-md space-y-4">
            <div className="flex flex-col">
                <div
                    className="h-64 rounded-xl shadow-inner transition-all duration-300"
                    style={{
                        background: `linear-gradient(${angle}deg, ${colors.join(', ')})`
                    }}
                />
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center justify-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <p className="font-serif font-semibold">
                                Angle
                            </p>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div>
                                            <Badge variant="secondary" className="cursor">
                                                Beta
                                            </Badge>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[200px] p-2">
                                        <p className="font-mono text-xs">Currently works with tailwind text & bg.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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
            </div>
        </div>
    );
};

export default GradientDisplay;