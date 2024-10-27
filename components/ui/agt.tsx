import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from 'react';

const AnimatedGradientTextDemo = () => {
    return (
        <div className="z-10 flex min-h-4 items-center justify-center px-4">
            <Link
                href="https://gcraft.notion.site/Gradient-Craft-Releasing-Note-12870a068894800392c4c4e520dffd31?pvs=73"
                className="group relative flex items-center gap-2 rounded-full bg-gray-50/90 px-4 py-2 text-xs shadow-lg ring-1 ring-gray-200/50 transition-all hover:bg-gray-100/95 hover:shadow-xl dark:bg-zinc-800/90 dark:ring-zinc-700/50 dark:hover:bg-zinc-800/95"
            >
                <span className="text-xs">🎉</span>
                <hr className="h-2 w-px shrink-0 bg-gray-200 dark:bg-zinc-600" />
                <span className="bg-gradient-to-r from-amber-500 via-fuchsia-500 to-amber-500 bg-clip-text font-semibold text-transparent dark:from-amber-400 dark:via-fuchsia-400 dark:to-amber-400">
                    Introducing v0.18
                </span>
                <ChevronRight className="h-3 w-3 text-gray-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-zinc-400 dark:group-hover:text-zinc-300" />
            </Link>
        </div>
    );
};

export default AnimatedGradientTextDemo;