import { ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface GradientDisplayProps {
    colors: string[];
    onExport: () => void;
}

export const GradientDisplay: React.FC<GradientDisplayProps> = ({ colors, onExport }) => {
    const [colorCardHovering, setColorCardHovering] = React.useState(false);

    return (
        <div
            className="w-full max-w-md"
            onMouseEnter={() => setColorCardHovering(true)}
            onMouseLeave={() => setColorCardHovering(false)}
        >
            <div className='flex flex-col'>
                <div
                    className="h-28 rounded-xl shadow-inner"
                    style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }}
                />
                <div className='w-full flex justify-end -mt-10 -ml-2'>
                    {colorCardHovering ?
                        <Button onClick={onExport} size='icon'>
                            <ArrowDownToLine className='w-4' />
                        </Button> :
                        <div className='h-8 w-8'></div>
                    }
                </div>
            </div>
        </div>
    );
};