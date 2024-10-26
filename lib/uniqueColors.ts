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
    const allNames: string[] = [];

    mixedGradients.forEach(item => {
        if ('album' in item || 'brand' in item) {
            item.gradients.forEach(gradient => {
                allNames.push(gradient.name);
            });
        }
    });

    return allNames.length;
};

export default countUniqueColors;