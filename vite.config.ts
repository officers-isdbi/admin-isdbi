import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@client': path.resolve(__dirname, './src'),
			'#client': path.resolve(__dirname, './src/components'),
			$client: path.resolve(__dirname, './src/api'),
			'&client': path.resolve(__dirname, './src/config'),
			'@common': path.resolve(__dirname, './common'),
		},
	},
});
