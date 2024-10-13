import React, { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import BetaFeature from './LPanelComponents/BetaFeature';
import BrandList from './LPanelComponents/BrandList';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import PannelHeader from './LPanelComponents/PannelHeader';
import { Separator } from '@/components/ui/separator';

interface BrandOption {
    brand: string;
    gradients?: { colors: string[] }[];
}

interface LPanelProps {
    brandGradients: BrandOption[];
    selectedBrand: string | null;
    onBrandSelect: (brand: string | null) => void;
    onColorSelect: (color: string) => void;
}

const LPanel: React.FC<LPanelProps> = ({
    brandGradients,
    selectedBrand,
    onBrandSelect,
    onColorSelect
}) => {
    const getBrandColor = useCallback((brand: BrandOption) => {
        if (brand.brand === 'All') return '#FFD700';
        if (brand.gradients && brand.gradients.length > 0) {
            return brand.gradients[0].colors[0];
        }
        return '#000000';
    }, []);

    const getTextColor = useCallback((bgColor: string) => {
        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 160 ? 'text-gray-900' : 'text-white';
    }, []);

    const sortedBrands: BrandOption[] = [...brandGradients].sort((a, b) => a.brand.localeCompare(b.brand));

    const groupedBrands = sortedBrands.reduce((acc, brand) => {
        const firstLetter = brand.brand[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(brand);
        return acc;
    }, {} as Record<string, BrandOption[]>);

    return (
        <div className="fixed left-4 top-4 bottom-4 w-1/5 2xl:w-80 bg-gradient-to-r from-white/100 to-white/75 shadow-lg rounded-3xl overflow-hidden z-10">
            <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-6">
                    <PannelHeader />
                    <BetaFeature onColorSelect={onColorSelect} />
                </div>
                <Separator />
                <div className="px-6 py-6 overflow-y-auto flex-grow">
                    <BrandList
                        groupedBrands={groupedBrands}
                        selectedBrand={selectedBrand}
                        onBrandSelect={onBrandSelect}
                        getBrandColor={getBrandColor}
                        getTextColor={getTextColor}
                    />
                    <Link className='flex pt-12 w-full items-center justify-center' href={'https://x.com/gradientcraft/status/1845187126847209554'}>
                        <Badge variant="secondary">
                            v0.1.1
                            <ExternalLink className='w-3' />
                        </Badge>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default LPanel;