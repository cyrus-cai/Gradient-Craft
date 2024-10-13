import React from 'react';

interface BrandOption {
    brand: string;
    gradients?: { colors: string[] }[];
}

interface BrandButtonProps {
    brand: BrandOption;
    isSelected: boolean;
    onSelect: () => void;
    getBrandColor: (brand: BrandOption) => string;
    getTextColor: (bgColor: string) => string;
}

const BrandButton: React.FC<BrandButtonProps> = ({ brand, isSelected, onSelect, getBrandColor, getTextColor }) => {
    const brandColor = getBrandColor(brand);
    const textColor = getTextColor(brandColor);

    return (
        <button
            className={`w-full items-center justify-start flex px-4 py-2 text-center rounded-xl text-xs transition-all duration-300 ${isSelected
                ? `${textColor} font-serif`
                : 'bg-amber-100/25 text-gray-700 hover:bg-amber-100 font-serif'
                }`}
            style={isSelected ? { backgroundColor: brandColor } : {}}
            onClick={onSelect}
        >
            {brand.brand}
        </button>
    );
};

export default BrandButton