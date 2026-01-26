const { defineConfig } = require("cypress");

module.exports = defineConfig({
	chromeWebSecurity: false,
	e2e: {
		setupNodeEvents(on, config) {
			return config;
		},
		baseUrl: "http://localhost:5173",
		video: false,
	},
	component: {
		devServer: {
			framework: "vue",
			bundler: "vite",
		},
		supportFile: "cypress/support/component.js",
		indexHtmlFile: "cypress/support/component-index.html",
		specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
	},
});
