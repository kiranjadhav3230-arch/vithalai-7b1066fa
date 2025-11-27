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
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'display': ['Space Grotesk', 'Inter', 'sans-serif'],
				'chat': ['Noto Sans', 'Noto Sans Devanagari', 'Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'fadeInUp': {
					'from': { opacity: '0', transform: 'translateY(20px)' },
					'to': { opacity: '1', transform: 'translateY(0)' }
				},
				'slideInRight': {
					'from': { opacity: '0', transform: 'translateX(30px)' },
					'to': { opacity: '1', transform: 'translateX(0)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(255, 111, 0, 0.6)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'slideInLeft': {
					'from': { opacity: '0', transform: 'translateX(-30px)' },
					'to': { opacity: '1', transform: 'translateX(0)' }
				},
				'scaleIn': {
					'from': { opacity: '0', transform: 'scale(0.9)' },
					'to': { opacity: '1', transform: 'scale(1)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(255, 111, 0, 0.2)' },
					'50%': { boxShadow: '0 0 40px rgba(255, 111, 0, 0.4), 0 0 60px rgba(255, 111, 0, 0.2)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-20px) rotate(5deg)' }
				},
				'liquid-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%', transform: 'rotate(0deg)' },
					'50%': { backgroundPosition: '100% 50%', transform: 'rotate(1deg)' }
				},
				'morph': {
					'0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
				},
				'float-3d': {
					'0%, 100%': { transform: 'translateY(0px) translateZ(0px) rotateX(0deg)' },
					'50%': { transform: 'translateY(-15px) translateZ(20px) rotateX(5deg)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'blur-pulse': {
					'0%, 100%': { backdropFilter: 'blur(20px)' },
					'50%': { backdropFilter: 'blur(30px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'float-slow': 'float-slow 6s ease-in-out infinite',
				'fadeInUp': 'fadeInUp 0.5s ease-out',
				'slideInRight': 'slideInRight 0.5s ease-out',
				'slideInLeft': 'slideInLeft 0.5s ease-out',
				'scaleIn': 'scaleIn 0.6s ease-out',
				'shimmer': 'shimmer 3s linear infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite',
				'liquid-flow': 'liquid-flow 5s ease infinite',
				'morph': 'morph 8s ease-in-out infinite',
				'float-3d': 'float-3d 6s ease-in-out infinite',
				'ripple': 'ripple 0.6s ease-out',
				'blur-pulse': 'blur-pulse 4s ease-in-out infinite'
			},
			backdropBlur: {
				xs: '2px',
				ultra: '40px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
