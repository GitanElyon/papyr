# papyr

Papyr is a lightweight, fast and modern note-taking app and the core of the Papyrus ecosystem.

It aims a seamless markdown experience focusing on writing without distractions.

## 🌐 Live Demo

Visit the live application at: [https://gitanelyon.github.io/papyr](https://gitanelyon.github.io/papyr)

## 🚀 Development

Project Setup
```sh
npm install
```

Compile for Development
```sh
npm run dev
```

Compile for Production
```sh
npm run build
```

Unit Test with [Vitest](https://vitest.dev/)
```sh
npm run test:unit
```

Lint with [ESLint](https://eslint.org/)
```sh
npm run lint
```

## 📦 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a new deployment.

The deployment workflow:
1. Builds the Vue.js application
2. Uploads the built assets to GitHub Pages
3. Makes the site available at the GitHub Pages URL
