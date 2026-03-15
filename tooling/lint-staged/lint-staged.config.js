const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": [
    "eslint --config tooling/eslint/eslint.config.js --quiet --fix",
    "prettier --write",
  ],
  "*.{json,css,md,html}": ["prettier --write"],
  "*.py": ["uv run ruff check --fix", "uv run ruff format"],
};

export default lintStagedConfig;
