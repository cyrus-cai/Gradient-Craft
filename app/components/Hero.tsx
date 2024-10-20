'use client'

import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { EnhancedInput } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import brandGradients from '../data/brandColors.json';
import countUniqueColors from '@/lib/uniqueColors';

const Hero: React.FC = () => {
    const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
    const { scrollY } = useScroll();
    const y: MotionValue<number> = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity: MotionValue<number> = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const uniqueColorCount = countUniqueColors(brandGradients);
        setTotalUniqueColors(uniqueColorCount);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-start overflow-hidden px-4">
            <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
            </motion.div>
            <div className="relative z-10 text-start max-w-3xl mx-auto">
                <motion.h1
                    className="text-7xl font-bold mb-12 tracking-tighter flex flex-col gap-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className='text-black dark:text-white'>Gradient Craft</span>
                    <span className='text-black/60 dark:text-white/80'>is a gradients library</span>
                    <span className='text-black/60 dark:text-white/80'>for Front-End.</span>
                </motion.h1>
                <motion.div
                    className="text-xl mb-10 font-light text-black dark:text-white/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className='flex items-center font-serif gap-2'>
                        Works with
                        {['Tailwind', 'CSS', 'SwiftUI', 'React Native', 'Flutter'].map((tech) => (
                            <Image
                                key={tech}
                                src={`/Icons/${tech}.svg`}
                                width={32}
                                height={32}
                                alt={`${tech} icon`}
                            />
                        ))}
                        ...
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link href="/gradients" passHref legacyBehavior>
                        <motion.div
                            className="inline-flex items-center justify-center font-bold rounded-full hover:bg-opacity-90 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="relative mb-4">
                                <EnhancedInput
                                    type="text"
                                    placeholder={`Search ${totalUniqueColors} gradients...`}
                                />
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;