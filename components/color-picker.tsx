import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface ColorPickerProps {
    onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const animatedProps = useSpring({
        to: { x: selectedPoint?.x || 0, y: selectedPoint?.y || 0 },
        config: {
            tension: 120,  // 减小张力
            friction: 14,  // 增加摩擦力
            mass: 1,       // 增加质量
        },
    });

    const drawColorPicker = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Draw color gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgb(255,0,0)');
        gradient.addColorStop(0.17, 'rgb(255,255,0)');
        gradient.addColorStop(0.33, 'rgb(0,255,0)');
        gradient.addColorStop(0.5, 'rgb(0,255,255)');
        gradient.addColorStop(0.67, 'rgb(0,0,255)');
        gradient.addColorStop(0.83, 'rgb(255,0,255)');
        gradient.addColorStop(1, 'rgb(255,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add white gradient
        const whiteGradient = ctx.createLinearGradient(0, 0, 0, height);
        whiteGradient.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = whiteGradient;
        ctx.fillRect(0, 0, width, height);

        // Add black gradient
        const blackGradient = ctx.createLinearGradient(0, 0, width, 0);
        blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
        blackGradient.addColorStop(1, 'rgba(0,0,0,1)');

        ctx.fillStyle = blackGradient;
        ctx.fillRect(0, 0, width, height);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawColorPicker(ctx, canvas.width, canvas.height);
    }, [drawColorPicker]);

    const updateColor = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = Array.from(imageData.data).slice(0, 3);
        const color = `rgb(${r},${g},${b})`;

        onColorSelect(color);
    }, [onColorSelect]);

    const handleInteraction = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 0), canvas.width);
        const y = Math.min(Math.max(event.clientY - rect.top, 0), canvas.height);

        setSelectedPoint({ x, y });
        updateColor(x, y);
    }, [updateColor]);

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        handleInteraction(event);
    }, [handleInteraction]);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging) {
            handleInteraction(event);
        }
    }, [isDragging, handleInteraction]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <div className="relative inline-block">
            <canvas
                ref={canvasRef}
                width={200}
                height={200}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                className="cursor-pointer rounded-2xl"
            />
            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none"></div>
            {selectedPoint && (
                <animated.div
                    style={{
                        left: animatedProps.x,
                        top: animatedProps.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
                />
            )}
        </div>
    );
};

export default ColorPicker;