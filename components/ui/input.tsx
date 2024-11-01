import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { Shortcut } from './shortcut';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  withGlow?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, shortcut, withGlow = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const input = innerRef.current;
      if (input) {
        input.addEventListener('focus', setEnglishInputMethod);
        return () => {
          input.removeEventListener('focus', setEnglishInputMethod);
        };
      }
    }, []);

    const setEnglishInputMethod = () => {
      if (innerRef.current && 'inputMode' in innerRef.current) {
        innerRef.current.inputMode = 'none';
        setTimeout(() => {
          if (innerRef.current) {
            innerRef.current.inputMode = 'text';
          }
        }, 1);
      }
    };

    React.useImperativeHandle(ref, () => innerRef.current!, []);

    return (
      <div className="relative w-80">
        {withGlow && (
          <>
            {/* 主光晕效果 */}
            <div className="absolute -inset-2 opacity-70">
              <div
                className="absolute inset-0 blur-2xl bg-[length:200%_200%] animate-gradient-fast"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      115deg,
                      rgb(249 115 22 / 0.3),
                      rgb(168 85 247 / 0.3) 30%,
                      rgb(234 179 8 / 0.3) 60%
                    )
                  `
                }}
              />
              <div
                className="absolute inset-0 blur-2xl bg-[length:200%_200%] animate-gradient-fast-reverse"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      -115deg,
                      rgb(234 179 8 / 0.3),
                      rgb(168 85 247 / 0.3) 30%,
                      rgb(249 115 22 / 0.3) 60%
                    )
                  `
                }}
              />
            </div>

            {/* 柔和的脉冲效果 */}
            <div className="absolute -inset-1 opacity-40">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-orange-600/40 via-purple-600/40 to-yellow-600/40 animate-pulse-fast" />
            </div>
          </>
        )}
        <div className="relative">
          <Image
            src='/Icons/advanced_search.png'
            width={18}
            height={18}
            alt='brandiconimage'
            className="absolute left-4 top-3 transform z-10"
          />

          <input
            type={type}
            className={`
  relative flex h-12 w-full rounded-full px-12 py-1 text-sm shadow-sm
  transition-all duration-300 ease-in-out
  border-0 file:bg-transparent file:text-sm file:font-medium

  /* Light Mode */
  bg-white/40
  text-yellow-900
  placeholder:text-yellow-800/50
  ring-0

  /* Dark Mode - 优化后 */
  dark:bg-yellow-950/40
  dark:text-slate-400
  dark:placeholder:text-slate-400/50
  dark:ring-0

  /* 其他状态 */
  backdrop-blur-3xl
  disabled:cursor-not-allowed disabled:opacity-50
  focus:ring-0
  focus:outline-none
  ${className}
`}
            onFocus={() => {
              setIsFocused(true);
              setEnglishInputMethod();
            }}
            onBlur={() => setIsFocused(false)}
            ref={innerRef}
            {...props}
          />
          {shortcut && (
            <Shortcut className='absolute right-4 top-1/2 -translate-y-1/2 text-yellow-700 dark:text-yellow-600/50'>
              {shortcut}
            </Shortcut>
          )}
        </div>
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };