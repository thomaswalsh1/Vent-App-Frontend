const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}",
		flowbite.content()
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
			},
			lineClamp: {
				7: '7',
				8: '8',
				9: '9',
				10: '10',
				15: '15',
			},
			animation: {
				slideup: 'slide-up 1s ease-in-out',
			},
			keyframes: {
				'0%, 100%': { transform: 'translateX(100%)'}
			}

		}
	},
	plugins: [require("tailwindcss-animate"), flowbite.plugin(), require('@tailwindcss/line-clamp')],
}

