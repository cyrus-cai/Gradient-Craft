interface Gradient {
    name: string;
    colors: string[];
}

interface BrandGradient {
    brand: string;
    priority: number;
    gradients: Gradient[];
}

interface AlbumGradient {
    album: string;
    artist: string;
    labels: string;
    priority: number;
    tags: string[];
    gradients: Gradient[];
}

type MixedGradient = BrandGradient | AlbumGradient;

const countUniqueColors = (mixedGradients: MixedGradient[]): number => {
    const uniqueColors = new Set<string>();

    mixedGradients.forEach(item => {
        if ('album' in item) {
            // This is an AlbumGradient
            item.gradients.forEach(gradient => {
                gradient.colors.forEach(color => {
                    uniqueColors.add(color.toLowerCase());
                });
            });
        } else if ('brand' in item) {
            // This is a BrandGradient
            item.gradients.forEach(gradient => {
                gradient.colors.forEach(color => {
                    uniqueColors.add(color.toLowerCase());
                });
            });
        }
    });

    return uniqueColors.size;
};

export default countUniqueColors;