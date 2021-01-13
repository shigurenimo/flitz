module.exports = {
  env: {
    es2020: true,
  },
  extends: ["react-app", "plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  rules: {
    "import/no-anonymous-default-export": "error",
    "import/no-webpack-loader-syntax": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": "off",
  },
}
