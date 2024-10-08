interface Gradient {
    name: string;
    colors: string[];
}

interface BrandGradient {
    brand: string;
    gradients: Gradient[];
}


const countUniqueColors = (brandGradients: BrandGradient[]): number => {
    const uniqueColors = new Set<string>();

    brandGradients.forEach(brand => {
        brand.gradients.forEach((gradient: { colors: any[]; }) => {
            gradient.colors.forEach(color => {
                uniqueColors.add(color.toLowerCase()); // 转换为小写以避免大小写导致的重复
            });
        });
    });

    return uniqueColors.size;
};

export default countUniqueColors