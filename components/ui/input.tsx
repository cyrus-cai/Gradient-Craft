import React, { useState } from 'react';

import { Search } from 'lucide-react';

const EnhancedInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800/50 z-10" size={20} />
        <input
          type={type}
          className={`
            flex h-12 w-full rounded-full border px-10 py-1 text-sm shadow-sm
            transition-all duration-300 ease-in-out
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-amber-800/50
            focus:outline-none focus:ring-2
            bg-stone-100/50 backdrop-blur-3xl
            disabled:cursor-not-allowed disabled:opacity-50
          border-orange-600/50 ring-orange-400/50
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={ref}
          {...props}
        />
        <div className="absolute px-2 py-1 right-4 top-1/2 rounded-sm font-mono transform -translate-y-1/2 text-xs text-amber-800 bg-amber-500/10">
          /
        </div>
        <div className="absolute px-2 py-1 right-12 top-1/2 rounded-sm font-mono transform -translate-y-1/2 text-xs text-amber-800 bg-amber-500/10">
          ⌘+k
        </div>
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };