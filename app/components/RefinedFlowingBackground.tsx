'use client'

import React, { useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

const RefinedFlowingBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateGradient = (mouseX: number, mouseY: number) => {
            const { width, height } = container.getBoundingClientRect();
            const xPercent = (mouseX / width) * 100;
            const yPercent = (mouseY / height) * 100;

            container.style.setProperty('--mouse-x', `${xPercent}%`);
            container.style.setProperty('--mouse-y', `${yPercent}%`);
        };

        const handleMouseMove = (e: MouseEvent) => {
            updateGradient(e.clientX, e.clientY);
        };

        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden"
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-orange-100 dark:from-gray-900 dark:to-amber-900"></div>
        </motion.div>
    );
};

export default RefinedFlowingBackground;