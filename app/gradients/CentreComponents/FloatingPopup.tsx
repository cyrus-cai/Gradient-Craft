import React, { useEffect, useState } from 'react';
import { Scale, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface FloatingPopupProps {
    imageUrl?: string;
    title?: string;
    description?: string;
    linkUrl?: string;
    onClose?: () => void;
}

const FloatingPopup: React.FC<FloatingPopupProps> = ({
    imageUrl = "/api/placeholder/400/320",
    title = "Premium UI Components",
    description = "Elevate your design with our premium collection",
    linkUrl = "https://example.com",
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Add entrance animation after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (e.target instanceof Element && e.target.closest('button[aria-label="Close"]')) {
            return;
        }
        e.preventDefault();
        window.open(linkUrl, '_blank');
    };

    return (
        <div className={`fixed 2xl:right-[15%] xl:right-1/4 bottom-4 z-50 lg:scale-75 xl:scale-90 2xl:scale-100 transition-all duration-500 ease-in-out transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50
                dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl
                border border-gray-200 dark:border-gray-700">
                <div
                    className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"

                >
                    {/* Close Button */}
                    {onClose && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClose();
                            }}
                            className="absolute right-2 top-2 z-50 p-2 bg-black/10 backdrop-blur-sm
                                text-white rounded-full opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 hover:bg-black/20"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Image Container */}
                    <div className="relative w-80 h-48 overflow-hidden" onClick={handleClick}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700
                                group-hover:scale-110 scale-105"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-4 bg-gradient-to-b from-transparent to-white/5" onClick={handleClick}>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary"
                                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900
                                    dark:text-indigo-300">
                                AD
                            </Badge>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {title}
                            </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingPopup;