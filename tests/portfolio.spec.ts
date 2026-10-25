import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { experience } from '../src/data'

test.beforeEach(async ({ page }) => {
    await page.goto('./')
    await page.evaluate(() => document.fonts.ready)
})

test('renders the portfolio with no horizontal overflow', async ({ page }) => {
    await expect(page).toHaveTitle('Darshit Sharma | AI & ML Engineer')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'DarshitSharma.',
    )
    await expect(page.locator('.project-card')).toHaveCount(4)
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
        ),
    ).toBe(true)
    await expect(page.locator('.impact-card').first()).toContainText('172+')
})

test('filters projects and opens each case study', async ({ page }) => {
    await page
        .getByRole('button', { name: 'GenAI & Agents', exact: true })
        .click()
    await expect(page.locator('.project-card')).toHaveCount(2)
    await expect(
        page.getByRole('button', { name: 'GenAI & Agents', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'ML & Data', exact: true }).click()
    await expect(page.locator('.project-card')).toHaveCount(2)
    await page.getByRole('button', { name: 'All work', exact: true }).click()
    for (const button of await page
        .getByRole('button', { name: 'Read case study:' })
        .all()) {
        await button.click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(
            page.getByRole('heading', { name: 'Under the hood' }),
        ).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(button).toBeFocused()
    }
})

test('expands and collapses experience', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /Data Science Intern/ })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#experience-details-1')).toContainText(
        'named-entity recognition',
    )
    await toggle.click()
    await expect(page.locator('#experience-details-1')).toBeHidden()
})

test('keeps text readable and toggle states visible on desktop and phones', async ({ page }) => {
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const selector of ['.experience-toggle p', '#experience-details-0 li', '.project-content > p']) {
            expect(await page.locator(selector).first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(15)
        }
        expect(await page.locator('.skill-pills > span').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(13)
        for (const selector of ['.avatar-pause', '#experience-details-0 .icon-button', '.project-filters button']) {
            const bounds = await page.locator(selector).first().boundingBox()
            expect(bounds!.height).toBeGreaterThanOrEqual(44)
        }
        const expanded = page.locator('.experience-toggle[aria-expanded="true"] .chevron').first()
        const collapsed = page.locator('.experience-toggle[aria-expanded="false"] .chevron').first()
        const background = (element: Element) => getComputedStyle(element).backgroundColor
        expect(await expanded.evaluate(background)).not.toBe(await collapsed.evaluate(background))
    }
    await page.getByRole('button', { name: 'GenAI & Agents', exact: true }).click()
    const selected = page.getByRole('button', { name: 'GenAI & Agents', exact: true })
    await expect(selected).toHaveAttribute('aria-pressed', 'true')
    await expect(selected).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(selected).toHaveCSS('background-color', 'rgb(36, 75, 115)')
})

test('previews and downloads all six documents under the correct roles', async ({ page, baseURL }) => {
    for (const [index, item] of experience.entries()) {
        const card = page.locator('.experience-card').nth(index)
        const toggle = card.locator('.experience-toggle')
        if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click()
        await expect(card.locator('.experience-document')).toHaveCount(index === 0 ? 4 : 1)
        for (const document of item.documents) {
            const preview = card.getByRole('button', { name: `Preview ${document.title}`, exact: true })
            await preview.click()
            const dialog = page.getByRole('dialog')
            await expect(dialog.getByRole('heading', { name: document.title, exact: true })).toBeVisible()
            await expect.poll(() => dialog.locator('.document-image').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
            await expect(dialog.getByRole('link', { name: 'Open original' })).toHaveAttribute('href', new URL(document.file, baseURL).pathname)
            await expect(dialog.getByRole('link', { name: 'Open original' })).toHaveAttribute('target', '_blank')
            const downloading = page.waitForEvent('download')
            await dialog.getByRole('link', { name: `Download ${document.title}`, exact: true }).click()
            const download = await downloading
            expect(download.suggestedFilename()).toBe(document.file.split('/').pop())
            const path = await download.path()
            expect(await readFile(path!)).toEqual(await readFile(`public/${document.file}`))
            await page.keyboard.press('Escape')
            await expect(dialog).toHaveCount(0)
            await expect(preview).toBeFocused()
        }
    }
})

test('loads bundled official skill and company logos without broken images', async ({ page, baseURL }) => {
    const company = page.locator('.company-symbol img')
    await expect(company).toHaveCount(2)
    await expect(company.first()).toHaveAttribute('src', new URL('logos/mahindra-linkedin.jpg', baseURL).pathname)
    for (const group of await page.locator('.skill-group').all()) {
        await group.scrollIntoViewIfNeeded()
        await expect.poll(() => group.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
    }
    expect(await page.locator('.skill-pills img').count()).toBeGreaterThan(25)
    for (const image of await page.locator('.skill-pills img').all()) {
        expect((await image.getAttribute('src'))?.startsWith(new URL('logos/', baseURL).pathname)).toBe(true)
        await expect(image).toHaveAttribute('alt', '')
    }
    await expect.poll(() => company.evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
})

test('keeps document lists and previews contained at narrow widths', async ({ page }) => {
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        const preview = page.getByRole('button', { name: /Preview Quarterly Excellence Award - Q4/ })
        await preview.click()
        const dialog = page.getByRole('dialog')
        expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        const image = await dialog.locator('.document-image').boundingBox()
        expect(image!.width).toBeLessThan(width)
        expect(await dialog.locator('.document-image').evaluate(element => getComputedStyle(element).objectFit)).toBe('contain')
        await dialog.getByRole('button', { name: 'Close document', exact: true }).click()
    }
})

test('has accessible award and certificate previews', async ({ page }) => {
    const previews = [
        'Preview Quarterly Excellence Award - Q4 F\'2026',
        'Preview Mahindra Internship Certificate',
    ]
    for (const [index, name] of previews.entries()) {
        if (index === 1) await page.getByRole('button', { name: /Data Science Intern/ }).click()
        await page.getByRole('button', { name, exact: true }).click()
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        expect(results.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(node => node.target) }))).toEqual([])
        await page.keyboard.press('Escape')
    }
})

test('does not expose chatbot controls or open a chat shortcut', async ({ page }) => {
    await expect(page.getByRole('button', { name: /AI twin/i })).toHaveCount(0)
    await expect(page.getByRole('textbox')).toHaveCount(0)
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.keyboard.press('Meta+k')
    await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('downloads a valid generated resume PDF', async ({ page }) => {
    const downloading = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Resume PDF' }).click()
    const download = await downloading
    expect(download.suggestedFilename()).toBe('Darshit_Sharma_Resume.pdf')
    const path = await download.path()
    expect(path).not.toBeNull()
    const buffer = await readFile(path!)
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-')
    expect(buffer.toString()).toContain('Darshit Sharma')
    expect(buffer.toString()).toContain('JECRC')
    expect(buffer.length).toBeGreaterThan(10000)
})

test('preserves contact destinations', async ({ page }) => {
    await expect(page.locator('.contact-links a').nth(0)).toHaveAttribute(
        'href',
        'mailto:darsu2000sharma@gmail.com',
    )
    await expect(page.locator('.contact-links a').nth(1)).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/darshit-sharma',
    )
    await expect(page.locator('.contact-links a').nth(2)).toHaveAttribute(
        'href',
        'tel:+91-6377597572',
    )
})

test('production policy blocks inline scripts without breaking portfolio features', async ({ page }) => {
    test.skip(process.env.PLAYWRIGHT_PRODUCTION !== '1', 'Production-build policy check')
    const violations: string[] = []
    page.on('console', message => {
        if (message.text().startsWith('csp-violation:')) violations.push(message.text())
    })
    await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', event => {
            console.error(`csp-violation:${event.effectiveDirective}:${event.blockedURI}`)
        })
    })
    await page.reload()
    const policy = page.locator('meta[http-equiv="Content-Security-Policy"]')
    const content = await policy.getAttribute('content')
    expect(content).toContain("script-src 'self'")
    expect(content).not.toContain("'unsafe-eval'")
    expect(content).toContain("object-src 'none'")
    expect(content).toContain("form-action 'none'")
    expect(content).toContain("base-uri 'none'")
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute('content', 'no-referrer')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible()
    const downloading = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Resume PDF' }).click()
    const download = await downloading
    expect((await readFile((await download.path())!)).subarray(0, 5).toString()).toBe('%PDF-')
    expect(violations).toEqual([])
    await page.evaluate(() => {
        const script = document.createElement('script')
        script.textContent = 'document.documentElement.dataset.inlineProbe = "executed"'
        document.head.append(script)
    })
    await expect.poll(() => violations.some(value => value.includes('script-src-elem:inline'))).toBe(true)
    await expect(page.locator('html')).not.toHaveAttribute('data-inline-probe', 'executed')
})

test('keeps normal-motion layouts contained across phone, tablet, and desktop', async ({
    page,
}) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.reload()
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('canvas')).toBeVisible()
    for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await expect
            .poll(() =>
                page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            )
            .toBe(true)
    }
    expect(errors).toEqual([])
})

test('keeps the companion and page available without WebGL', async ({
    page,
}) => {
    await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext
        HTMLCanvasElement.prototype.getContext = function (
            type: string,
            ...args: unknown[]
        ) {
            if (type.startsWith('webgl') || type === 'experimental-webgl') return null
            return Reflect.apply(original, this, [type, ...args])
        } as typeof original
    })
    await page.reload()
    await expect(
        page.getByRole('img', { name: 'Digital companion', exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('button', { name: 'Read case study:' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
})

test('has no serious accessibility violations on the portfolio', async ({
    page,
}) => {
    const pageResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    expect(
        pageResults.violations.map(({ id, nodes }) => ({
            id,
            elements: nodes.map((node) => node.target),
        })),
    ).toEqual([])
})

test('renders nonblank 3D pixels, moves, and pauses', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.reload()
    await expect(page.locator('canvas')).toBeVisible()
    await expect(page.locator('canvas')).toHaveAttribute('data-engine', /three\.js/)
    await expect
        .poll(() =>
            page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
                const gl = canvas.getContext('webgl2')!
                const buffer = new Uint8Array(canvas.width * canvas.height * 4)
                gl.readPixels(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    buffer,
                )
                return buffer.filter((value, index) => index % 4 === 3 && value > 0)
                    .length
            }),
        )
        .toBeGreaterThan(1000)
    const before = await page
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
    await page.mouse.move(40, 40)
    await expect
        .poll(() =>
            page
                .locator('canvas')
                .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
        )
        .not.toBe(before)
    await page.getByRole('button', { name: 'Pause avatar animation' }).click()
    await expect(
        page.getByRole('button', { name: 'Play avatar animation' }),
    ).toBeVisible()
})

test('supports mobile navigation and narrow layouts', async ({
    page,
    isMobile,
}) => {
    test.skip(!isMobile, 'Mobile-only layout check')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page
        .getByRole('navigation', { name: 'Mobile navigation' })
        .getByRole('link', { name: 'Contact' })
        .click()
    await expect(
        page.getByRole('button', { name: 'Open navigation' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#contact')).toBeInViewport()
    await page.setViewportSize({ width: 320, height: 740 })
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
        ),
    ).toBe(true)
    const overflowing = await page
        .locator('h1,h2,h3,.button,.impact-value,.skill-pills>span')
        .evaluateAll((elements) =>
            elements
                .filter((element) => element.scrollWidth > element.clientWidth + 1)
                .map((element) => element.textContent),
        )
    expect(overflowing).toEqual([])
})
