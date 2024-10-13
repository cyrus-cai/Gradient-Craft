import { ChevronDown, FlaskConical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import ColorPicker from '@/components/color-picker';
import { Switch } from '@/components/ui/switch';

interface BetaFeatureProps {
    onColorSelect: (color: string) => void;
}

const BetaFeature: React.FC<BetaFeatureProps> = ({ onColorSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [pickerEnabled, setPickerEnabled] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const switchRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current && switchRef.current) {
            const switchHeight = switchRef.current.offsetHeight;
            const fullHeight = contentRef.current.scrollHeight;
            setContentHeight(pickerEnabled ? fullHeight : switchHeight + 32);
        }
    }, [pickerEnabled, isExpanded]);

    return (
        <div
            className="bg-white overflow-hidden transition-all duration-300 ease-in-out"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex items-center justify-between cursor-pointer">
                <div className='flex items-center gap-2'>
                    <FlaskConical className='w-4 h-4' />
                    <p className='text-sm font-semibold'> Beta Feature</p>
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-500 ease-in-out transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                />
            </div>

            <div
                ref={contentRef}
                style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }}
                className="transition-all duration-500 ease-in-out"
            >
                <div className="flex flex-col items-start py-4">
                    <div ref={switchRef} className='flex items-center gap-2 mb-2'>
                        <div className='flex flex-col'>
                            <label htmlFor="picker-enabled" className='font-semibold text-sm'>
                                Picker
                            </label>
                            <label htmlFor="picker-enabled" className='text-xs'>
                                Color picker is currently in beta and may not be fully precise.
                            </label>
                        </div>
                        <Switch
                            id="picker-enabled"
                            checked={pickerEnabled}
                            onCheckedChange={setPickerEnabled}
                        />
                    </div>
                    {pickerEnabled && (
                        <div className={`transition-all duration-300 ${pickerEnabled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                            {ColorPicker && <ColorPicker onColorSelect={onColorSelect} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BetaFeature