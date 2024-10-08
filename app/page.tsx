'use client'

import { Copy, Download, Github, LucideIcon, Palette, Search } from 'lucide-react';
import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import brandGradients from './colors.json';
import countUniqueColors from '@/lib/uniqueColors';

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
      <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-orange-100"></div>
    </motion.div>
  );
};

export default function Home(): JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <RefinedFlowingBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        {/* <Features />
        <Showcase /> */}
        <Footer />
      </div>
    </div>
  );
}

function Header(): JSX.Element {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-filter backdrop-blur-2xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Image
          src='/BrandIconText.png'
          width={144}
          height={24}
          alt='brandiconimage'
        />
        <div className="flex font-semibold items-center space-x-8 py-2 px-4 rounded-xl  hover:bg-gradient-to-r from-amber-500 to-red-500">
          <Link href="/gradients" className="text-sm transition-colors">Gradients Park</Link>
        </div>
      </nav>
    </header>
  );
}

function Hero(): JSX.Element {

  useEffect(() => {
    const uniqueColorCount = countUniqueColors(brandGradients);
    setTotalUniqueColors(uniqueColorCount);
  }, []);

  const [totalUniqueColors, setTotalUniqueColors] = useState<number | string>('');
  const { scrollY } = useScroll();
  const y: MotionValue<number> = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity: MotionValue<number> = useTransform(scrollY, [0, 300], [1, 0]);

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
          <span className='text-black/100'>Gradient Craft</span>
          <span className='text-black/60'>is a gradients library</span>
          <span className='text-black/60'>for Front-End.</span>
        </motion.h1>
        <motion.div
          className="text-xl mb-10 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className='flex items-center font-serif gap-2'>
            Works with
            <Image
              src='/Icons/Tailwind Background.svg'
              width={32}
              height={32}
              alt='brandiconimage'
            />
            <Image
              src='/Icons/CSS Background.svg'
              width={32}
              height={32}
              alt='brandiconimage'
            />
            <Image
              src='/Icons/SwiftUI Background.svg'
              width={32}
              height={32}
              alt='brandiconimage'
            />
            <Image
              src='/Icons/React Native.svg'
              width={32}
              height={32}
              alt='brandiconimage'
            />
            <Image
              src='/Icons/Flutter.svg'
              width={32}
              height={32}
              alt='brandiconimage'
            />
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
                <input
                  type="text"
                  placeholder={`Search ${totalUniqueColors} gradients...`}
                  className="w-full pl-8 pr-32 py-3 text-sm bg-gradient-to-r from-amber-500/15 to-amber-200/25 rounded-full shadow-sm border border-orange-300 text-orange-700 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
              </div>
              {/* Explore Now <ArrowRight className="ml-2 w-5 h-5" /> */}
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

function Features(): JSX.Element {
  const features: Feature[] = [
    { icon: Palette, title: "Curated Collection", description: "Handpicked gradients for every style" },
    { icon: Copy, title: "One-Click Copy", description: "Instantly use gradients in your projects" },
    { icon: Download, title: "Multiple Formats", description: "Copy properties for multiple langs like Tailwind/Css/Swift/RN/Flutter" },
  ];

  return (
    <section id="features" className="py-20 bg-amber-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tighter">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps extends Feature {
  index: number;
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps): JSX.Element {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-gray-100 p-4 rounded-full mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function Showcase(): JSX.Element {
  const gradients: string[] = [
    "linear-gradient(to right, #ff6e7f, #bfe9ff)",
    "linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)",
    "linear-gradient(to right, #654ea3, #eaafc8)",
    "linear-gradient(to right, #00b09b, #96c93d)",
    "linear-gradient(to right, #EECDA3, #EF629F)",
    "linear-gradient(to right, #43C6AC, #191654)",
  ];

  return (
    <section id="showcase" className="py-20 bg-amber-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tighter">Gradient Showcase</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {gradients.map((gradient, index) => (
            <GradientCard key={index} gradient={gradient} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface GradientCardProps {
  gradient: string;
  index: number;
}

function GradientCard({ gradient, index }: GradientCardProps): JSX.Element {
  return (
    <Link href="/gradients" passHref legacyBehavior>
      <motion.a
        className="h-48 rounded-2xl overflow-hidden cursor-pointer block"
        style={{ background: gradient }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  );
}

const Footer = () => {
  return (
    <footer className="bg-transparent py-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* <p className="text-sm text-black/50">&copy; 2024 GradientCraft. All rights reserved.</p> */}
          <div
            className=" cursor-pointer flex items-center gap-2"
            onClick={() => window.open("https://github.com/cyrus-cai/Gradient-Craft")}
          >
            <Image
              src='/Icons/Github.svg'
              width={20}
              height={20}
              alt='X icon'
            />
            <p className='text-sm'>
              Gradient Craft is a Opensource Project under MIT license
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div
            className="cursor-pointer"
            onClick={() => window.open("https://x.com/gradientcraft")}
          >
            <Image
              src='/Icons/X.png'
              width={24}
              height={24}
              alt='X icon'
              style={{ width: 'auto', height: '24px' }}
            />
          </div>

        </div>
      </div>
    </footer>
  );
};