---
title: Useful Pre-commit hooks
created: 2026-01-16
published: 2026-01-16
updated: 2026-01-16
up:
related:
tags:
  - t/on/git
summary:
publish: true
description: Collection of essential pre-commit hooks to automate code quality.
---
A curated collection of `pre-commit` hooks to automate code linting, formatting, and security checks.


> [!info] 🏗️ Work in Progress...
> If interested, bookmark this page!

## General Housekeeping
### Pre-commit Hooks
[link](https://github.com/pre-commit/pre-commit-hooks)

Basic hooks to maintain file integrity across different environments.

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v6.0.0
    hooks:
      - id: check-yaml
        args: ['--allow-multiple-documents']
      - id: end-of-file-fixer
      - id: trailing-whitespace
```

### Secret Detection
[link](https://github.com/Yelp/detect-secrets)

Prevents accidental commits of sensitive information (API keys, tokens).

```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

### Conventional Commits
[link](https://github.com/commitizen-tools/commitizen)

Enforces standardized commit messages to ensure the repository history remains readable and compatible with automated changelog tools.

```yaml
repos:
  - repo: https://github.com/commitizen-tools/commitizen
    rev: v4.11.1
    hooks:
      - id: commitizen
```

## Python

Coming soon....