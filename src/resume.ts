import { jsPDF } from 'jspdf'
import { education, experience, profile, projects, skillGroups } from './data'

export function downloadResumePdf() {
    const document = new jsPDF({ unit: 'mm', format: 'a4' })
    let cursor = 19
    const pageWidth = 174
    function write(
        text: string,
        size = 10,
        bold = false,
        color: [number, number, number] = [51, 65, 85],
    ) {
        document.setFont('helvetica', bold ? 'bold' : 'normal')
        document.setFontSize(size)
        document.setTextColor(...color)
        const lines = document.splitTextToSize(text, pageWidth) as string[]
        const lineHeight = size * 0.44
        for (const line of lines) {
            if (cursor + lineHeight > 279) {
                document.addPage()
                cursor = 20
            }
            document.text(line, 18, cursor)
            cursor += lineHeight
        }
        cursor += 2
    }
    function section(title: string) {
        if (cursor > 250) {
            document.addPage()
            cursor = 20
        }
        cursor += 5
        write(title.toUpperCase(), 11, true, [37, 99, 235])
        document.setDrawColor(225, 231, 239)
        document.line(18, cursor - 2, 192, cursor - 2)
        cursor += 3
    }
    write(profile.name, 26, true, [15, 23, 42])
    write(profile.role, 10)
    write(`${profile.email}  |  ${profile.phone}`, 9)
    write('linkedin.com/in/darshit-sharma', 9)
    section('Work experience')
    for (const item of experience) {
        write(`${item.role} - ${item.company}`, 12, true)
        write(item.date, 9)
        for (const point of item.points) write(`- ${point}`)
        cursor += 3
    }
    section('Flagship projects')
    for (const project of projects) {
        const titles: Record<string, string> = {
            'digital-twin': 'AI Digital Twin of Wheel Force Transducer',
            'voice-rag': 'Voice-Enabled RAG Application for Engine Testing',
            'big-data': 'Big Data Analytics and Structured RAG Pipeline',
            'agentic-hr':
                'Agentic AI HR Workflow - Mahindra AI Hackathon 2024 Winner',
        }
        write(titles[project.id], 12, true)
        write(project.problem)
        for (const step of project.architecture) write(`- ${step}`)
        write(project.outcome, 10, true)
        cursor += 3
    }
    section('Technical skills')
    for (const group of skillGroups) {
        write(group.title, 10, true)
        write(group.skills.join(', '), 9)
    }
    section('Education')
    write(education)
    const pages = document.getNumberOfPages()
    for (let page = 1; page <= pages; page++) {
        document.setPage(page)
        document.setFontSize(8)
        document.setTextColor(100, 116, 139)
        document.text(
            `Darshit Sharma | Resume generated from supplied content | ${page} / ${pages}`,
            18,
            289,
        )
    }
    document.save('Darshit_Sharma_Resume.pdf')
}
