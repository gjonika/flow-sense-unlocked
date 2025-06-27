
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					vibrant: 'hsl(var(--primary-vibrant))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					accent: 'hsl(var(--secondary-accent))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced semantic color system
				'brand-primary': '#059669',
				'brand-secondary': '#0891b2',
				'bg-light': '#F8F8F8',
				'bg-lighter': '#F5F5F5',
				'bg-completed': '#F9FAFB',
				'gray-text': '#4B5563',
				'gray-light': '#D1D5DB',
				'gray-subtle': '#E5E7EB',
				// Enhanced color system
				surface: {
					subtle: 'hsl(var(--background-subtle))',
					muted: 'hsl(var(--background-muted))',
					completed: 'hsl(var(--completed-bg))'
				},
				// Legacy colors maintained for compatibility
				ivory: '#FFFFF0',
				'olive-light': '#A3B18A',
				olive: '#588157',
				'olive-dark': '#3A5A40',
				baltic: {
					'sea': '#5C8A87',
					'sand': '#DAD8C4',
					'deep': '#3A4F52',
					'pine': '#4B6C64',
					'fog': '#F1F3F2'
				}
			},
			fontSize: {
				// Enhanced semantic typography scale
				'page-title': ['2.2rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.025em' }],
				'section-title': ['1.6rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
				'card-title': ['1.2rem', { lineHeight: '1.4', fontWeight: '500' }],
				'body-lg': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
				'body-sm': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
				// Legacy typography scale
				'primary-title': ['2.2rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.025em' }],
				'body': ['1rem', { lineHeight: '1.625' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'touch': '44px'
			},
			transitionProperty: {
				'size': 'width, height',
				'bg-transform': 'background-color, transform',
			},
			transitionDuration: {
				'400': '400ms',
				'600': '600ms',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'smooth-fade-in': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'gentle-scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.98)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 8px hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.5)' }
				},
				'skeleton-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'smooth-fade-in': 'smooth-fade-in 0.4s ease-out',
				'gentle-scale-in': 'gentle-scale-in 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
			},
			backdropBlur: {
				'xs': '2px',
				'8': '8px',
				'12': '12px'
			},
			boxShadow: {
				'glow': '0 0 20px -5px hsl(var(--primary) / 0.3)',
				'glow-lg': '0 0 40px -10px hsl(var(--primary) / 0.4)',
				'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
				'soft-lg': '0 8px 30px -5px rgba(0, 0, 0, 0.1)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
