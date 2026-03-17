import globals from "globals";
import js from "@eslint/js";

export default [{
    ignores: [
        "dist/**",
        "node_modules/**"
    ]},
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "single"],
            "semi": ["error", "never"],
            "eqeqeq": "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { "before": true, "after": true }],
            "no-console": "off",
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        },
    },
];
