/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                // Colores institucionales Universidad Alexander von Humboldt
                humboldt: {
                    50:  '#f0f4ff',
                    100: '#e0eaff',
                    200: '#c7d7ff',
                    300: '#a4baff',
                    400: '#8193ff',
                    500: '#5a6cff',
                    600: '#3f4bff',
                    700: '#2d37e8',
                    800: '#1f2bb8',
                    900: '#0d1458', // Azul marino principal
                },
                // Rojo institucional (secundario)
                humboldtRed: {
                    50:  '#fff1f1',
                    100: '#ffe1e1',
                    200: '#ffc7c7',
                    300: '#ffa0a0',
                    400: '#ff6b6b',
                    500: '#ff3a3a',
                    600: '#ed1515',
                    700: '#c70d0d', // Rojo institucional
                    800: '#a40f0f',
                    900: '#881414',
                },
                // Colores de soporte mejorados
                primary: {
                    50:  '#f0f4ff',
                    100: '#e0eaff',
                    200: '#c7d7ff',
                    300: '#a4baff',
                    400: '#8193ff',
                    500: '#5a6cff',
                    600: '#3f4bff',
                    700: '#2d37e8',
                    800: '#1f2bb8',
                    900: '#0d1458', // Azul marino Humboldt
                },
                secondary: {
                    50:  '#fff1f1',
                    100: '#ffe1e1',
                    200: '#ffc7c7',
                    300: '#ffa0a0',
                    400: '#ff6b6b',
                    500: '#ff3a3a',
                    600: '#ed1515',
                    700: '#c70d0d', // Rojo Humboldt
                    800: '#a40f0f',
                    900: '#881414',
                },
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                danger: {
                    50: '#fff1f1',
                    100: '#ffe1e1',
                    200: '#ffc7c7',
                    300: '#ffa0a0',
                    400: '#ff6b6b',
                    500: '#ff3a3a',
                    600: '#ed1515',
                    700: '#c70d0d',
                    800: '#a40f0f',
                    900: '#881414',
                },
                gray: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
                serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'humboldt': '0 4px 25px -5px rgba(13, 20, 88, 0.1), 0 10px 40px -7px rgba(13, 20, 88, 0.1)',
                'humboldt-red': '0 4px 25px -5px rgba(199, 13, 13, 0.1), 0 10px 40px -7px rgba(199, 13, 13, 0.1)',
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 40px -7px rgba(0, 0, 0, 0.1)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}