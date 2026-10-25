import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { basename, resolve, sep } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(process.argv[2] || resolve(root, 'dist'))
const digest = (buffer) => createHash('sha256').update(buffer).digest('hex')
const provenance = JSON.parse(
    await readFile(resolve(root, 'public/documents/provenance.json'), 'utf8'),
)

async function inspect(directory) {
    for (const entry of await readdir(directory)) {
        const file = resolve(directory, entry)
        const info = await lstat(file)
        if (info.isSymbolicLink())
            throw new Error(`Symlink in deployment artifact: ${entry}`)
        if (
            /^(?:\.env(?:\.|$)|\.git$|node_modules$)/i.test(basename(file)) ||
            /\.(?:pem|key|p12|pfx)$/i.test(file)
        ) {
            throw new Error(
                `Potentially sensitive file in deployment artifact: ${entry}`,
            )
        }
        if (info.isDirectory()) await inspect(file)
    }
}

await inspect(output)
for (const document of provenance) {
    const file = resolve(output, document.file)
    if (!file.startsWith(`${output}${sep}`))
        throw new Error('Document path escapes deployment output')
    if (digest(await readFile(file)) !== document.sha256) {
        throw new Error(
            `Original document integrity check failed: ${document.file}`,
        )
    }
}
const html = await readFile(resolve(output, 'index.html'), 'utf8')
if (!html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error('Production Content Security Policy is missing')
}
console.log(
    `Deployment verified: ${provenance.length} original document hashes; no secret-file patterns or symlinks.`,
)
