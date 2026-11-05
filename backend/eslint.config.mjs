import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default tseslint.config({ ignores: ['dist/**', 'node_modules/**'] }, ...tseslint.configs.recommended, prettierPlugin, {
    rules: {
        eqeqeq: ['error', 'always'],
        'no-implicit-coercion': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
});
