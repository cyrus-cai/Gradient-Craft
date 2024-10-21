import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'gradient-x': 'gradient-x 15s ease infinite',
				'gradient-y': 'gradient-y 15s ease infinite',
				'gradient-xy': 'gradient-xy 15s ease infinite',
				'slide-left': 'slide-left 0.3s ease-out forwards',
				'spin-slow': 'spin 3s linear infinite',
				'spin-hover': 'spin 0.5s linear',
				pulse: 'pulse var(--duration) ease-out infinite'
			},
			keyframes: {
				'slide-left': {
					'0%': {
						transform: 'translateX(0)'
					},
					'50%': {
						transform: 'translateX(-8px)'
					},
					'100%': {
						transform: 'translateX(-4px)'
					}
				},
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'gradient-y': {
					'0%, 100%': {
						'background-size': '400% 400%',
						'background-position': 'center top'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'center center'
					}
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					}
				},
				'gradient-xy': {
					'0%, 100%': {
						'background-size': '400% 400%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					}
				},
				pulse: {
					'0%, 100%': {
						boxShadow: '0 0 0 0 var(--pulse-color)'
					},
					'50%': {
						boxShadow: '0 0 0 8px var(--pulse-color)'
					}
				}
			},
			backgroundImage: {
				'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
