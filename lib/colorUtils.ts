import colors from 'tailwindcss/colors';

// 将Tailwind颜色对象扁平化为 { [colorName: string]: string } 格式
const flattenedColors = Object.entries(colors).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
        acc[key] = value;
    } else if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, hex]) => {
            if (typeof hex === 'string') {
                acc[`${key}-${shade}`] = hex;
            }
        });
    }
    return acc;
}, {} as { [key: string]: string });

// 计算两个颜色之间的欧几里得距离
function colorDistance(color1: string, color2: string): number {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

export function findClosestTailwindColor(hexColor: string): string {
    let closestColor = '';
    let minDistance = Infinity;

    Object.entries(flattenedColors).forEach(([colorName, tailwindHex]) => {
        const distance = colorDistance(hexColor, tailwindHex);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = colorName;
        }
    });

    return closestColor;
}

export const colorDifference = (color1: string, color2: string) => {
    const rgb1 = color1.match(/\d+/g)?.map(Number) || [];
    const rgb2 = color2.match(/\d+/g)?.map(Number) || [];
    return Math.sqrt(
        Math.pow((rgb1[0] || 0) - (rgb2[0] || 0), 2) +
        Math.pow((rgb1[1] || 0) - (rgb2[1] || 0), 2) +
        Math.pow((rgb1[2] || 0) - (rgb2[2] || 0), 2)
    );
};