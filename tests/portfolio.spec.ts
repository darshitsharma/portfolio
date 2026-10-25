import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { experience, personalProjects, profile } from '../src/data'

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
    await expect(page.locator('.avatar-stage .floating-tag')).toHaveText(['PyTorch', 'LangChain', 'PySpark', 'Google Cloud'])
    const robotLogos = page.locator('.avatar-stage .floating-tag img')
    await expect(robotLogos).toHaveCount(3)
    await expect.poll(() => robotLogos.evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
})

test('highlights applied R&D and production GenAI with readable impact text', async ({ page }) => {
    const cards = page.locator('.impact-card')
    await expect(cards).toHaveCount(4)
    await expect(cards.nth(2)).toContainText('Patent-pending digital AI twin')
    await expect(cards.nth(2).locator('.impact-value')).toHaveText('R&D')
    await expect(cards.nth(3)).toContainText('Production-grade systems')
    await expect(cards.nth(3)).toContainText('>96.8% Top-K retrieval accuracy')
    await expect(page.getByRole('heading', { name: 'API response time', exact: true })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'People upskilled in GenAI', exact: true })).toHaveCount(0)
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.evaluate(() => new Promise(requestAnimationFrame))
        await page.evaluate(() => document.fonts.ready)
        for (const [selector, minimum] of [['h3', 14], ['p', 15], ['.metric-label', 12]] as const) {
            const sizes = await cards.locator(selector).evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)))
            expect(sizes.every(size => size >= minimum)).toBe(true)
        }
        await expect.poll(() => cards.locator('h3,p,.metric-label,.impact-value').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent))).toEqual([])
    }
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
        await expect(page.getByRole('heading', { name: 'Engineering decisions', exact: true })).toBeVisible()
        await expect(page.locator('.project-decisions dt')).toHaveCount(2)
        await expect(page.getByRole('heading', { name: 'Evaluation & scope', exact: true })).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(button).toBeFocused()
    }
})

test('shows evidenced personal projects separately from professional case studies', async ({ page }) => {
    const companyTab = page.getByRole('tab', { name: 'Company projects', exact: true })
    const personalTab = page.getByRole('tab', { name: 'Personal projects', exact: true })
    await expect(companyTab).toHaveAttribute('aria-selected', 'true')
    await expect(companyTab).toHaveCSS('background-color', 'rgb(36, 75, 115)')
    await expect(page.locator('.project-tile-header').filter({ hasText: 'Company project' })).toHaveCount(4)
    await expect(page.locator('.personal-project')).toHaveCount(0)
    await page.getByRole('button', { name: 'GenAI & Agents', exact: true }).click()
    await personalTab.click()
    await expect(personalTab).toHaveAttribute('aria-selected', 'true')
    await expect(personalTab).toHaveCSS('background-color', 'rgb(34, 93, 71)')
    const githubMark = page.getByRole('link', { name: 'GitHub profile', exact: true }).locator('img')
    await expect(githubMark).toHaveAttribute('src', /logos\/github\.svg$/)
    await expect.poll(() => githubMark.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    await expect(page.getByRole('tabpanel', { name: 'Company projects', exact: true })).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Personal projects', exact: true })).toBeVisible()
    await expect(page.locator('.personal-project')).toHaveCount(2)
    await expect(page.locator('.personal-project.project-card')).toHaveCount(2)
    await expect(page.locator('.project-tile-header').filter({ hasText: 'Personal project' })).toHaveCount(2)
    for (const project of personalProjects) {
        const entry = page.getByRole('article', { name: project.title, exact: true })
        await expect(entry).toContainText(project.description)
        await expect(entry.locator('li')).toHaveCount(2)
        const source = entry.getByRole('link', { name: `View ${project.title} on GitHub`, exact: true })
        await expect(source).toHaveAttribute('href', project.repository)
        await expect(source).toHaveAttribute('target', '_blank')
        await expect(source).toHaveAttribute('rel', 'noopener noreferrer')
    }
    await expect(page.getByRole('article', { name: 'CredScope-AI', exact: true })).toHaveCount(0)
    await expect(page.locator('#amex-title').locator('..')).toContainText('not classification accuracy')
    await personalTab.focus()
    await page.keyboard.press('ArrowLeft')
    await expect(companyTab).toBeFocused()
    await expect(companyTab).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.project-card')).toHaveCount(2)
    await expect(page.locator('.personal-project')).toHaveCount(0)
    await page.keyboard.press('End')
    await expect(personalTab).toBeFocused()
    await expect(page.locator('.personal-project')).toHaveCount(2)
    await page.keyboard.press('Home')
    await expect(companyTab).toBeFocused()
})

test('links verified Toptal membership and contains new content at phone widths', async ({ page }) => {
    const membership = page.getByRole('link', { name: 'Toptal network member', exact: true })
    await expect(membership).toHaveAttribute('href', profile.toptal)
    await expect(membership).toHaveAttribute('title', /22 Oct 2026/)
    await expect(membership).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(page.locator('.contact-links').getByRole('link', { name: /TOPTAL NETWORK/ })).toHaveAttribute('href', profile.toptal)
    await page.getByRole('tab', { name: 'Personal projects', exact: true }).click()
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.evaluate(() => new Promise(requestAnimationFrame))
        await page.evaluate(() => document.fonts.ready)
        const overflow = await page.locator('.personal-project h3,.personal-project p,.personal-project li,.network-link,.personal-work-heading,.project-tabs button,.project-tile-header').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent))
        expect(overflow).toEqual([])
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
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
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
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

test('downloads the unchanged original resume PDF', async ({ page, baseURL }) => {
    const resumeLink = page.getByRole('link', { name: 'Resume PDF', exact: true })
    await expect(resumeLink).toHaveAttribute('href', new URL('documents/Darshit_Sharma_3_years.pdf', baseURL).pathname)
    const downloading = page.waitForEvent('download')
    await resumeLink.click()
    const download = await downloading
    expect(download.suggestedFilename()).toBe('Darshit_Sharma_3_years.pdf')
    const path = await download.path()
    expect(path).not.toBeNull()
    const buffer = await readFile(path!)
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-')
    const original = await readFile(new URL('../public/documents/Darshit_Sharma_3_years.pdf', import.meta.url))
    expect(buffer.equals(original)).toBe(true)
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
    await expect(page.locator('.contact-links a').nth(1)).toContainText('LET’S CONNECT ON LINKEDIN')
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
    await expect(page.getByText('GIVE ME A CALL', { exact: true })).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('6377597572')
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
    await page.getByRole('link', { name: 'Resume PDF', exact: true }).click()
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
    await expect.poll(() => page
        .locator('h1,h2,h3,.button,.impact-value,.skill-pills>span')
        .evaluateAll((elements) =>
            elements
                .filter((element) => element.scrollWidth > element.clientWidth + 1)
                .map((element) => element.textContent),
        )).toEqual([])
})
