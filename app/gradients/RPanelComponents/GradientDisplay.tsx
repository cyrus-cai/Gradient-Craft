import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface GradientDisplayProps {
    colors: string[];
}

export const GradientDisplay: React.FC<GradientDisplayProps> = ({ colors }) => {

    return (
        <div
            className="w-full max-w-md"
        >
            <div className='flex flex-col'>
                <div
                    className="h-28 rounded-xl shadow-inner"
                    style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }}
                />

            </div>
        </div>
    );
};