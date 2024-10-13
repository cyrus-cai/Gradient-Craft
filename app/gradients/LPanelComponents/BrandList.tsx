import BrandButton from './BrandButton';
import React from 'react';

interface BrandOption {
    brand: string;
    gradients?: { colors: string[] }[];
}

interface BrandListProps {
    groupedBrands: Record<string, BrandOption[]>;
    selectedBrand: string | null;
    onBrandSelect: (brand: string | null) => void;
    getBrandColor: (brand: BrandOption) => string;
    getTextColor: (bgColor: string) => string;
}

const BrandList: React.FC<BrandListProps> = ({ groupedBrands, selectedBrand, onBrandSelect, getBrandColor, getTextColor }) => {
    const allOption: BrandOption = { brand: 'All' };

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <BrandButton
                    brand={allOption}
                    isSelected={selectedBrand === null}
                    onSelect={() => onBrandSelect(null)}
                    getBrandColor={getBrandColor}
                    getTextColor={getTextColor}
                />
            </div>
            {Object.entries(groupedBrands).map(([letter, brands]) => (
                <div key={letter}>
                    <h4 className="font-semibold font-serif text-gray-600 mb-2">{letter}</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {brands.map((brand) => (
                            <BrandButton
                                key={brand.brand}
                                brand={brand}
                                isSelected={selectedBrand === brand.brand}
                                onSelect={() => onBrandSelect(brand.brand)}
                                getBrandColor={getBrandColor}
                                getTextColor={getTextColor}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BrandList