import React, { useEffect, useRef, useState } from 'react';

import { Search } from 'lucide-react';
import { Shortcut } from './shortcut';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, shortcut, ...props }, ref) => {
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
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800/50 dark:text-amber-300/70 z-10"
          size={20}
        />
        <input
          type={type}
          className={`
            flex h-12 w-full rounded-full border px-10 py-1 text-sm shadow-sm
            transition-all duration-300 ease-in-out
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-amber-800/50 dark:placeholder:text-amber-300/50
            focus:outline-none focus:ring-2
            bg-white/25 dark:bg-amber-900/40 backdrop-blur-3xl
            disabled:cursor-not-allowed disabled:opacity-50
            border-orange-600/50 dark:border-amber-700/50
            ring-orange-400/50 dark:ring-amber-500/50
            text-amber-900 dark:text-amber-100
            ${isFocused ? 'ring-2' : ''}
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
          <Shortcut className='absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-300'>
            {shortcut}
          </Shortcut>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };