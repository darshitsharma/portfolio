/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { experience, personalProjects, profile, projects, skillGroups } from './data'
import brandAssets from './brand-assets.json'
import provenance from '../public/documents/provenance.json'

describe('portfolio content integrity', () => {
    it('includes all four case studies, three roles, and four skill groups', () => {
        expect(projects).toHaveLength(4)
        expect(experience).toHaveLength(3)
        expect(skillGroups).toHaveLength(4)
        expect(new Set(projects.map((project) => project.id)).size).toBe(4)
    })

    it('explains engineering decisions and evaluation scope for every case study', () => {
        for (const project of projects) {
            expect(project.architecture.length).toBeGreaterThanOrEqual(4)
            expect(project.engineering).toHaveLength(2)
            expect(project.evaluation.length).toBeGreaterThan(100)
        }
        expect(projects[0].evaluation).toContain('API response time')
        expect(projects[1].evaluation).toContain('not a claim')
    })

    it('keeps evidenced personal projects separate from employer work', () => {
        expect(personalProjects.map(project => project.id)).toEqual(['agentflow', 'credscope-ai', 'amex'])
        for (const project of personalProjects) {
            expect(project.repository).toMatch(/^https:\/\/github\.com\/darshitsharma\//)
            expect(project.highlights).toHaveLength(2)
            expect(project.evidence).toContain('25 Oct 2026')
        }
        expect(personalProjects[1].evidence).toContain('Synthetic-data')
        expect(personalProjects[2].highlights.join(' ')).toContain('not classification accuracy')
        expect(profile.toptal).toBe('https://www.toptal.com/developers/resume/darshit-sharma')
        expect(profile.toptalMemberSince).toBe('22 Oct 2026')
    })

    it('attaches the four supplied awards only to the Mahindra role', () => {
        expect(experience[0].documents).toHaveLength(4)
        expect(experience[0].documents.every((document) => document.kind === 'award')).toBe(true)
        expect(experience[0].documents.map((document) => document.issued)).toEqual([
            '08 Jul 2026', '06 Aug 2025', '07 Nov 2024', '26 Aug 2024',
        ])
    })

    it('describes each role without turning the experience section into a metrics list', () => {
        for (const item of experience) {
            expect(item.summary.length).toBeGreaterThan(100)
            expect(item.points.length).toBeGreaterThanOrEqual(2)
            expect(item.points.join(' ')).not.toMatch(/\d+%/)
        }
        expect(experience[0].points.join(' ')).toContain('Mahindra AI Academy')
        expect(experience[1].points.join(' ')).toContain('DistilBERT')
        expect(experience[2].points.join(' ')).toContain('GitHub Actions')
    })

    it('attaches one local PDF certificate to each internship', () => {
        for (const item of experience.slice(1)) {
            expect(item.documents).toHaveLength(1)
            expect(item.documents[0].kind).toBe('certificate')
            expect(item.documents[0].format).toBe('pdf')
            expect(item.documents[0].file).toMatch(/^documents\/.+\.pdf$/)
        }
    })

    it('bundles byte-identical original documents and real PDF previews', () => {
        expect(provenance).toHaveLength(6)
        for (const document of experience.flatMap((item) => item.documents)) {
            const file = readFileSync(new URL(`../public/${document.file}`, import.meta.url))
            expect(createHash('sha256').update(file).digest('hex')).toBe(
                provenance.find((entry) => entry.file === document.file)?.sha256,
            )
            if (document.format === 'pdf') {
                expect(file.subarray(0, 5).toString()).toBe('%PDF-')
                const preview = readFileSync(new URL(`../public/${document.preview}`, import.meta.url))
                expect(preview.subarray(1, 4).toString()).toBe('PNG')
            } else {
                expect([...file.subarray(0, 4)]).toEqual([137, 80, 78, 71])
            }
        }
    })

    it('bundles official-source skill logos and the LinkedIn company icon', () => {
        expect(brandAssets.company.source).toBe('https://www.linkedin.com/company/mahindragroup/')
        const skills = skillGroups.flatMap((group) => group.skills)
        for (const [name, logo] of Object.entries(brandAssets.skills)) {
            expect(skills).toContain(name)
            expect(logo.source).toMatch(/^https:\/\//)
        }
        for (const logo of [brandAssets.company, ...Object.values(brandAssets.skills)]) {
            expect(logo.file).toMatch(/^logos\//)
            expect(readFileSync(new URL(`../public/${logo.file}`, import.meta.url)).length).toBeGreaterThan(100)
        }
    })

    it('rejects deployment artifacts with secret-file patterns or changed originals', async () => {
        const directory = await mkdtemp(join(tmpdir(), 'portfolio-build-'))
        const verify = () => execFileSync(process.execPath, ['scripts/verify-build.mjs', directory], { stdio: 'pipe' })
        try {
            await mkdir(join(directory, 'documents'))
            await cp('public/documents', join(directory, 'documents'), { recursive: true })
            await writeFile(join(directory, 'index.html'), '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;">')
            expect(verify().toString()).toContain('6 original document hashes')
            await writeFile(join(directory, '.env'), 'NOT_A_REAL_SECRET=test-fixture')
            expect(verify).toThrow()
            await rm(join(directory, '.env'))
            await writeFile(join(directory, provenance[0].file), 'altered-document-test-fixture')
            expect(verify).toThrow()
        } finally {
            await rm(directory, { recursive: true, force: true })
        }
    })
})
