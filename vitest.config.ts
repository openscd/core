/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
	test: {
		include: ['src/**/*.spec.ts'],
		browser: {
			headless: true,
			enabled: true,
			provider: 'playwright',
			instances: [
				{
					browser: 'chromium',
					// setupFile: './chromium-setup.js', // TODO: is this needed?
				},
			],
		},
	},
})