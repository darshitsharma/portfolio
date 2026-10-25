import { defineConfig, devices } from '@playwright/test'

const production = process.env.PLAYWRIGHT_PRODUCTION === '1'
const basePath = production ? process.env.PAGES_BASE_PATH || '/' : '/'
if (!/^\/(?:[a-zA-Z0-9._-]+\/)*$/.test(basePath)) throw new Error('PAGES_BASE_PATH must be an absolute path with a trailing slash')
const port = production ? 4173 : 5173
const baseURL = `http://127.0.0.1:${port}${basePath}`

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    workers: 1,
    timeout: 30_000,
    reporter: 'list',
    use: {
        baseURL,
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        launchOptions: {
            args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
        },
    },
    projects: [
        {
            name: 'desktop',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 1000 },
            },
        },
        {
            name: 'mobile',
            use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
        },
    ],
    webServer: {
        command: production
            ? `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort --base ${basePath}`
            : 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
        url: baseURL,
        reuseExistingServer: !production && !process.env.CI,
    },
})
