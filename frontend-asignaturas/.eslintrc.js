module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
            presets: ['@babel/preset-react'],
        },
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
    ],
    rules: {
        // React específicas
        'react/react-in-jsx-scope': 'off', // No necesario en React 17+
        'react/prop-types': 'warn', // Advertencia para prop-types
        'react/jsx-uses-react': 'off', // No necesario en React 17+
        'react/jsx-uses-vars': 'error',
        'react/jsx-key': 'error',
        'react/no-unused-state': 'warn',
        'react/no-direct-mutation-state': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-pascal-case': 'warn',

        // React Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Variables
        'no-unused-vars': ['warn', {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true
        }],
        'no-undef': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',

        // Código general
        'no-trailing-spaces': 'warn',
        'no-multiple-empty-lines': ['warn', { max: 2 }],
        'eol-last': 'warn',
        'comma-dangle': ['warn', 'only-multiline'],
        'quotes': ['warn', 'single', { avoidEscape: true }],
        'semi': ['warn', 'always'],
        'indent': ['warn', 2, { SwitchCase: 1 }],

        // Mejores prácticas
        'eqeqeq': ['error', 'always'],
        'no-var': 'error',
        'prefer-const': 'warn',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',

        // Accesibilidad - más permisivo pero útil
        'jsx-a11y/anchor-is-valid': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-a11y/alt-text': 'warn',

        // Desactivar reglas problemáticas para desarrollo
        'jsx-a11y/no-autofocus': 'off',
        'react/jsx-no-target-blank': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    globals: {
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
    },
    overrides: [
        {
            files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
            env: {
                jest: true,
            },
            rules: {
                'no-console': 'off',
            },
        },
        {
            files: ['src/setupTests.js', 'src/reportWebVitals.js'],
            rules: {
                'no-console': 'off',
            },
        },
    ],
};