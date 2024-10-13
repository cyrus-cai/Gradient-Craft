// gradientUtils.ts

import { findClosestTailwindColor } from '@/lib/colorUtils';

interface Gradient {
    name: string;
    colors: string[];
}

// Tailwind utilities
export const generateTailwindText = (gradient: Gradient): string => {
    const gradientClasses = gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        if (index === 0) return `from-${closestColor}`;
        if (index === gradient.colors.length - 1) return `to-${closestColor}`;
        return `via-${closestColor}`;
    }).join(' ');
    return `text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses}`;
};

export const generateTailwindBackground = (gradient: Gradient): string => {
    const gradientClasses = gradient.colors.map((color, index) => {
        const closestColor = findClosestTailwindColor(color);
        if (index === 0) return `from-${closestColor}`;
        if (index === gradient.colors.length - 1) return `to-${closestColor}`;
        return `via-${closestColor}`;
    }).join(' ');
    return `bg-gradient-to-r ${gradientClasses}`;
};

export const generateTailwindBorder = (gradient: Gradient): string => {
    const borderColor = findClosestTailwindColor(gradient.colors[0]);
    return `border border-${borderColor}`;
};

export const generateTailwindRing = (gradient: Gradient): string => {
    const ringColor = findClosestTailwindColor(gradient.colors[0]);
    return `ring-1 ring-${ringColor}`;
};

// CSS utilities
export const generateCSSGradient = (gradient: Gradient, type: 'background' | 'text' | 'both' = 'both'): string => {
    const backgroundCode = `background: linear-gradient(to right, ${gradient.colors.join(', ')});`;
    const gradientTextCode = `
background: linear-gradient(to right, ${gradient.colors.join(', ')});
-webkit-background-clip: text;
background-clip: text;
color: transparent;
`;

    switch (type) {
        case 'background':
            return `/* Gradient background */\n${backgroundCode}`;
        case 'text':
            return `/* Gradient text */\n${gradientTextCode}`;
        case 'both':
        default:
            return `/* Gradient background */\n${backgroundCode}\n\n/* Gradient text */\n${gradientTextCode}`;
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