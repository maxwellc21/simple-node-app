export default [
    {
        languageOptions: {
            globals: {
                browser: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
            },
        },
        rules: {
            'no-console': 'off', // Example rule to allow console logs
        },
        files: ['*.js'], // Apply this config to JavaScript files
    },
];
