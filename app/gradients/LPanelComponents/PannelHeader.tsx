import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis, Github, Scale, Twitter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PannelHeader: React.FC = () => {
    const [isEllipsisHovered, setIsEllipsisHovered] = React.useState(false);

    return (
        <div className='w-full flex items-center justify-between gap-2'>
            <Link href="/">
                <div className='flex items-center gap-1'>
                    <Image
                        src='/BrandIconText.png'
                        width={144}
                        height={24}
                        alt='brandiconimage'
                        className="dark:invert" // Invert colors for dark mode
                    />
                </div>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        className={`rounded-full p-1 transition-colors duration-200 ${isEllipsisHovered
                            ? 'bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700'
                            : ''
                            }`}
                        onMouseEnter={() => setIsEllipsisHovered(true)}
                        onMouseLeave={() => setIsEllipsisHovered(false)}
                    >
                        <Ellipsis className='text-neutral-400 dark:text-neutral-500' />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <DropdownMenuItem asChild>
                        <Link href="/license" className="flex items-center gap-2 w-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <Scale className="w-4 h-4" />
                            <span>License</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="https://github.com/cyrus-cai/Gradient-Craft" className="flex items-center gap-2 w-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <Github className="w-4 h-4" />
                            <span>Github</span>
                            <Badge variant='secondary' className="dark:bg-zinc-700 dark:text-zinc-300">Opensource</Badge>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="https://x.com/gradientcraft" className="flex items-center gap-2 w-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <Twitter className="w-4 h-4" />
                            <span>Follow us on X</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default PannelHeader;