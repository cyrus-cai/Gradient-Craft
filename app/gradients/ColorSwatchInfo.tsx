import FloatingFeedback from '@/components/feedback';
import React from 'react';

interface Gradient {
    name: string;
    colors: string[];
}

interface BrandGradient {
    brand: string;
    gradients: Gradient[];
}

interface SelectedGradientInfo extends Gradient {
    brand: string;
}

interface ColorSwatchInfoProps {
    selectedGradientInfo: SelectedGradientInfo | null;
}

const ColorSwatchInfo: React.FC<ColorSwatchInfoProps> = ({ selectedGradientInfo }) => {
    if (!selectedGradientInfo) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 italic">Select a gradient to view details</p>
            </div>
        );
    }

    const { name, colors, brand } = selectedGradientInfo;

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col justify-center">
                <div className="w-full h-72" style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }} />
                <div className='flex gap-1.5 px-6 pt-4 pb-2 items-end'>
                    <h3 className="text-xl font-serif font-semibold">{name}</h3>
                    <p className="text-sm text-gray-600">from {brand}</p>
                </div>
                <div className="grid grid-cols-2 px-6">
                    {colors.map((color, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
                            <span className="text-sm">{color}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full flex flex-row-reverse px-4 text-xs text-black/25'>big-view currently in beta & please feedback  (right bottom)</div>
        </div>
    );
};

export default ColorSwatchInfo;