// gradientUtils.ts

import { findClosestTailwindColor } from '@/lib/colorUtils';

interface Gradient {
    name: string;
    colors: string[];
}

// Helper function to convert opacity to Tailwind format
const getOpacityValue = (opacity: number): string => {
    const opacityMap: { [key: number]: string } = {
        0: '0',
        5: '5',
        10: '10',
        15: '15',
        20: '20',
        25: '25',
        30: '30',
        35: '35',
        40: '40',
        45: '45',
        50: '50',
        55: '55',
        60: '60',
        65: '65',
        70: '70',
        75: '75',
        80: '80',
        85: '85',
        90: '90',
        95: '95',
        100: '100'
    };

    const closestOpacity = Object.keys(opacityMap)
        .map(Number)
        .reduce((prev, curr) => {
            return Math.abs(curr - opacity) < Math.abs(prev - opacity) ? curr : prev;
        });

    return opacityMap[closestOpacity];
};

export const generateTailwindText = (gradient: Gradient, angle: number, opacity: number): string => {
    // 根据角度选择最接近的 Tailwind 渐变方向
    const getGradientDirection = (angle: number): string => {
        // 将角度标准化到 0-360 范围
        const normalizedAngle = ((angle % 360) + 360) % 360;

        // 映射到最接近的 Tailwind 方向
        if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'bg-gradient-to-r';
        if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'bg-gradient-to-br';
        if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'bg-gradient-to-b';
        if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'bg-gradient-to-bl';
        if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'bg-gradient-to-l';
        if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'bg-gradient-to-tl';
        if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'bg-gradient-to-t';
        return 'bg-gradient-to-tr';
    };

    const gradientClasses = gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        const opacityValue = getOpacityValue(opacity);
        if (index === 0) return `from-${closestColor}/${opacityValue}`;
        if (index === gradient.colors.length - 1) return `to-${closestColor}/${opacityValue}`;
        return `via-${closestColor}/${opacityValue}`;
    }).join(' ');

    // 只使用 Tailwind 类，移除自定义 background
    return `text-transparent bg-clip-text ${getGradientDirection(angle)} ${gradientClasses}`.trim();
};

export const generateTailwindBackground = (gradient: Gradient, angle: number, opacity: number): string => {
    const gradientClasses = gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        const opacityValue = getOpacityValue(opacity);
        if (index === 0) return `from-${closestColor}/${opacityValue}`;
        if (index === gradient.colors.length - 1) return `to-${closestColor}/${opacityValue}`;
        return `via-${closestColor}/${opacityValue}`;
    }).join(' ');

    return `bg-gradient-to-r ${gradientClasses} [background:linear-gradient(${angle}deg,var(--tw-gradient-stops))]`;
};

const generateGradientBorderCSS = (colors: string[], angle: number, opacity: number) => {
    const colorStops = colors.map(color => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }).join(', ');

    return `linear-gradient(${angle}deg, ${colorStops})`;
};

export const generateTailwindBorder = (gradient: Gradient, angle: number, opacity: number): string => {
    // 根据角度选择最接近的 Tailwind 渐变方向
    const getGradientDirection = (angle: number): string => {
        const normalizedAngle = ((angle % 360) + 360) % 360;

        if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'before:bg-gradient-to-r';
        if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'before:bg-gradient-to-br';
        if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'before:bg-gradient-to-b';
        if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'before:bg-gradient-to-bl';
        if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'before:bg-gradient-to-l';
        if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'before:bg-gradient-to-tl';
        if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'before:bg-gradient-to-t';
        return 'before:bg-gradient-to-tr';
    };

    return `relative p-[1px] ${getGradientDirection(angle)} ${gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        const opacityValue = getOpacityValue(opacity);
        if (index === 0) return `before:from-${closestColor}/${opacityValue}`;
        if (index === gradient.colors.length - 1) return `before:to-${closestColor}/${opacityValue}`;
        return `before:via-${closestColor}/${opacityValue}`;
    }).join(' ')} before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:content-[""]`;
};

export const generateTailwindRing = (gradient: Gradient, angle: number, opacity: number): string => {
    // 根据角度选择最接近的 Tailwind 渐变方向
    const getGradientDirection = (angle: number): string => {
        const normalizedAngle = ((angle % 360) + 360) % 360;

        if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'before:bg-gradient-to-r';
        if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'before:bg-gradient-to-br';
        if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'before:bg-gradient-to-b';
        if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'before:bg-gradient-to-bl';
        if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'before:bg-gradient-to-l';
        if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'before:bg-gradient-to-tl';
        if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'before:bg-gradient-to-t';
        return 'before:bg-gradient-to-tr';
    };

    return `relative p-[2px] ${getGradientDirection(angle)} ${gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        const opacityValue = getOpacityValue(opacity);
        if (index === 0) return `before:from-${closestColor}/${opacityValue}`;
        if (index === gradient.colors.length - 1) return `before:to-${closestColor}/${opacityValue}`;
        return `before:via-${closestColor}/${opacityValue}`;
    }).join(' ')} before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:content-[""]`;
};

export const generateCSSGradient = (
    gradient: Gradient,
    type: 'background' | 'text' | 'border' | 'ring' | 'both' = 'both',
    angle: number,
    opacity: number
): string => {
    const gradientCSS = generateGradientBorderCSS(gradient.colors, angle, opacity);

    switch (type) {
        case 'background':
            return `/* Gradient background */\nbackground: ${gradientCSS};`;
        case 'text':
            return `/* Gradient text */
background: ${gradientCSS};
-webkit-background-clip: text;
background-clip: text;
color: transparent;`;
        case 'border':
            return `/* Gradient border */
border: 1px solid transparent;
background-image: ${gradientCSS};
background-origin: border-box;
background-clip: padding-box, border-box;`;
        case 'ring':
            return `/* Gradient ring */
outline: 2px solid transparent;
background-image: ${gradientCSS};
background-origin: border-box;
background-clip: padding-box, border-box;`;
        case 'both':
        default:
            return `/* Gradient background */
background: ${gradientCSS};

/* Gradient text */
.gradient-text {
  background: ${gradientCSS};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Gradient border */
.gradient-border {
  border: 1px solid transparent;
  background-image: ${gradientCSS};
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* Gradient ring */
.gradient-ring {
  outline: 2px solid transparent;
  background-image: ${gradientCSS};
  background-origin: border-box;
  background-clip: padding-box, border-box;
}`;
    }
};

// SwiftUI utilities
export const generateSwiftUIGradient = (gradient: Gradient, style: 'foreground' | 'background'): string => {
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
        return `// Foreground style (iOS 15+)
.foregroundStyle(${gradientDefinition})`;
    } else {
        return `// Background style
.background(${gradientDefinition})`;
    }
};

export const generateGradientCSS = (colors: string[]): string => {
    return `background: linear-gradient(to right, ${colors.join(', ')});`;
};