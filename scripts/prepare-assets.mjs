import { constants } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { chromium } from '@playwright/test'

const root = resolve(import.meta.dirname, '..')
const downloads = resolve(process.env.HOME, 'Downloads')
const documents = [
    ['exit_docs/Awards/_App_wwwroot_ECards_QUARTER_AWARD_25001262_25022895_D_08102026104124.jpg', 'mahindra-problem-solving-2026.png'],
    ['exit_docs/Awards/_App_wwwroot_ECards_EXCELLENCE_AWARD_25022895_08102026104113.jpg', 'mahindra-quality-of-delivery-2025.png'],
    ['exit_docs/Awards/_App_wwwroot_ECards_Quarter AwardCertificate25008546_25022895_07112024091255.jpg', 'mahindra-productivity-2024.png'],
    ['exit_docs/Awards/ExcellenceCertificate_25022895_26082024091228.jpg', 'mahindra-discretionary-effort-2024.png'],
    ['TEMP/Internship certificate Mahindra.pdf', 'mahindra-internship-certificate.pdf'],
    ['TEMP/Internship-Certificate MyEra.pdf', 'myera-internship-certificate.pdf'],
]
const sites = [
    ['Python', 'https://www.python.org/'],
    ['NumPy', 'https://numpy.org/'],
    ['Pandas', 'https://pandas.pydata.org/'],
    ['SciPy', 'https://scipy.org/'],
    ['Polars', 'https://pola.rs/'],
    ['JAX', 'https://docs.jax.dev/'],
    ['PyTorch', 'https://pytorch.org/'],
    ['TensorFlow', 'https://www.tensorflow.org/'],
    ['Scikit-Learn', 'https://scikit-learn.org/stable/', 'https://scikit-learn.org/stable/_static/scikit-learn-logo-without-subtitle.svg'],
    ['XGBoost', 'https://xgboost.ai/', 'https://xgboost.ai/images/logo/xgboost-logo.png'],
    ['LangChain', 'https://www.langchain.com/'],
    ['CrewAI', 'https://www.crewai.com/'],
    ['OpenAI', 'https://openai.com/'],
    ['Ollama', 'https://ollama.com/'],
    ['FastAPI', 'https://fastapi.tiangolo.com/'],
    ['Celery', 'https://docs.celeryq.dev/'],
    ['gRPC', 'https://grpc.io/'],
    ['MCP', 'https://modelcontextprotocol.io/'],
    ['FastMCP', 'https://gofastmcp.com/'],
    ['PostgreSQL', 'https://www.postgresql.org/'],
    ['pgvector', 'https://raw.githubusercontent.com/pgvector/pgvector/master/README.md'],
    ['Pinecone', 'https://www.pinecone.io/'],
    ['MongoDB', 'https://www.mongodb.com/'],
    ['Redis', 'https://redis.io/'],
    ['Google Cloud', 'https://cloud.google.com/'],
    ['AWS', 'https://aws.amazon.com/'],
    ['PySpark', 'https://spark.apache.org/'],
    ['MLflow', 'https://mlflow.org/'],
    ['Docker', 'https://www.docker.com/'],
    ['Kubernetes', 'https://kubernetes.io/'],
    ['Jenkins', 'https://www.jenkins.io/'],
    ['Git', 'https://git-scm.com/'],
    ['Plotly', 'https://plotly.com/'],
    ['Seaborn', 'https://seaborn.pydata.org/'],
    ['Matplotlib', 'https://matplotlib.org/'],
]
const digest = (buffer) => createHash('sha256').update(buffer).digest('hex')
await mkdir(resolve(root, 'public/documents'), { recursive: true })
await mkdir(resolve(root, 'public/logos'), { recursive: true })
const copies = []
for (const [original, filename] of documents) {
    const source = resolve(downloads, original)
    const destination = resolve(root, 'public/documents', filename)
    try {
        await copyFile(source, destination, constants.COPYFILE_EXCL)
    } catch (error) {
        if (error.code !== 'EEXIST') throw error
    }
    const sha256 = digest(await readFile(source))
    if (sha256 !== digest(await readFile(destination))) {
        throw new Error(`Copy differs from original: ${filename}`)
    }
    copies.push({ original: `Downloads/${original}`, file: `documents/${filename}`, sha256 })
    console.log(`Verified original copy: ${filename}`)
    if (filename.endsWith('.pdf')) {
        execFileSync('sips', ['-s', 'format', 'png', destination, '--out', destination.replace(/\.pdf$/, '.png')])
    }
}

await writeFile(resolve(root, 'public/documents/provenance.json'), `${JSON.stringify(copies, null, 4)}\n`)
if (process.argv.includes('--documents-only')) process.exit(0)

const browser = await chromium.launch()
const context = await browser.newContext()
const manifest = {
    company: {
        source: 'https://www.linkedin.com/company/mahindragroup/',
        asset: 'https://media.licdn.com/dms/image/v2/D4D0BAQGQCdkOp2uW-g/company-logo_200_200/company-logo_200_200/0/1664681376096/mahindragroup_logo?e=2147483647&v=beta&t=avsS_sj6oI0ugQi0G7ei0ti6ZTtn5TUBVjjZ_f4Tq5I',
        file: 'logos/mahindra-linkedin.jpg',
    },
    skills: {},
}
try {
    const company = await context.request.get(manifest.company.asset, { timeout: 20000 })
    if (!company.ok() || !company.headers()['content-type']?.startsWith('image/')) {
        throw new Error('Could not retrieve the verified LinkedIn company image')
    }
    await writeFile(resolve(root, 'public', manifest.company.file), await company.body())
    console.log('Saved Mahindra Group LinkedIn icon')
    const queue = [...sites]
    await Promise.all(Array.from({ length: 4 }, async () => {
        const page = await context.newPage()
        while (queue.length) {
            const [name, source, asset] = queue.shift()
            try {
                const response = await context.request.get(source, { timeout: 15000 })
                if (!response.ok()) throw new Error(`HTTP ${response.status()}`)
                const html = await response.text()
                const candidates = asset ? [{ url: asset }] : await page.evaluate(({ html, source }) => {
                    const parsed = new DOMParser().parseFromString(html, 'text/html')
                    return [...parsed.querySelectorAll('link[rel][href]')]
                        .filter(link => /(^|\s)(icon|apple-touch-icon|mask-icon)(\s|$)/i.test(link.rel))
                        .map(link => ({
                            url: new URL(link.getAttribute('href'), source).href,
                            score: /\.svg(?:\?|$)/i.test(link.getAttribute('href')) ? 3 : /apple-touch-icon/i.test(link.rel) ? 2 : 1,
                        }))
                        .filter(icon => icon.url.startsWith('https:'))
                        .sort((first, second) => second.score - first.score)
                }, { html, source: response.url() })
                let saved = false
                for (const { url } of candidates) {
                    const icon = await context.request.get(url, { timeout: 10000 })
                    const mime = icon.headers()['content-type']?.split(';')[0]
                    const extension = { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico' }[mime]
                    if (!icon.ok() || !extension) continue
                    const file = `logos/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${extension}`
                    await writeFile(resolve(root, 'public', file), await icon.body())
                    manifest.skills[name] = { file, source, asset: url }
                    console.log(`Saved official site icon: ${name}`)
                    saved = true
                    break
                }
                if (!saved) console.log(`No verified icon; retaining text only: ${name}`)
            } catch (error) {
                console.log(`Retaining text only: ${name} (${error.message.split('\n')[0]})`)
            }
        }
        await page.close()
    }))
    manifest.skills = Object.fromEntries(Object.entries(manifest.skills).sort(([first], [second]) => first.localeCompare(second)))
    await writeFile(resolve(root, 'src/brand-assets.json'), `${JSON.stringify(manifest, null, 4)}\n`)
} finally {
    await browser.close()
}