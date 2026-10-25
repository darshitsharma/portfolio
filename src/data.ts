export const profile = {
    name: 'Darshit Sharma',
    role: 'Data Scientist | Machine Learning Engineer | AI Engineer',
    email: 'darsu2000sharma@gmail.com',
    phone: '+91-6377597572',
    linkedin: 'https://www.linkedin.com/in/darshit-sharma',
}

export type Project = {
    id: string
    number: string
    category: 'ML Engineering' | 'Generative AI' | 'Data Engineering'
    title: string
    description: string
    tags: string[]
    metrics: { value: string; label: string }[]
    problem: string
    architecture: string[]
    outcome: string
    visual: 'twin' | 'voice' | 'data' | 'agents'
}

export const projects: Project[] = [
    {
        id: 'digital-twin',
        number: '01',
        category: 'ML Engineering',
        title: 'A digital twin. Real-world impact.',
        description:
            'Predicting wheel-end forces and moments without the cost of physical transducers.',
        tags: ['TCN + XGBoost', 'Vertex AI', 'FastAPI', 'MLflow'],
        metrics: [
            { value: 'INR 20 Cr', label: 'one-time savings' },
            { value: '<50ms', label: 'API response' },
        ],
        problem:
            'Physical Wheel Force Transducers make vehicle testing expensive. A multi-output regression model using Temporal Convolutional Networks and XGBoost predicts forces and moments directly from vehicle sensor data.',
        architecture: [
            'Vehicle sensor data feeds TCN and XGBoost models, achieving less than 0.05 NRMSE across all wheels.',
            'FastAPI and Celery decouple heavy inference from API requests, with MLflow tracking and autonomous data drift detection.',
            'Google Cloud Vertex AI dynamically spins up containers for 50 concurrent batch jobs, each producing 50,000+ predictions within 15 minutes.',
        ],
        outcome:
            'INR 20 Cr in one-time savings, INR 30 lakh saved per project cycle, and 60% faster vehicle validation cycles.',
        visual: 'twin',
    },
    {
        id: 'voice-rag',
        number: '02',
        category: 'Generative AI',
        title: 'Complex data. A simple conversation.',
        description:
            'A voice-enabled RAG assistant that puts engine testing knowledge within reach.',
        tags: ['LangChain', 'Whisper', 'pgvector', 'RAG Fusion'],
        metrics: [
            { value: '>96.8%', label: 'Top-K retrieval accuracy' },
            { value: '80%', label: 'productivity gain' },
        ],
        problem:
            'Engineers need fast access to engine testing knowledge. A FastAPI and PostgreSQL platform combines database management with natural-language voice queries.',
        architecture: [
            'OpenAI Whisper transcribes audio queries with 94% speech-to-text accuracy.',
            'LangChain orchestrates a RAG pipeline with pgvector for retrieval.',
            'RAG Fusion generates query variations; Reciprocal Rank Fusion re-ranks hybrid search results.',
        ],
        outcome:
            'Above 96.8% Top-K retrieval accuracy and an 80% improvement in engineer productivity.',
        visual: 'voice',
    },
    {
        id: 'big-data',
        number: '03',
        category: 'Data Engineering',
        title: 'Big data. Bigger business outcomes.',
        description:
            'Turning large-scale vehicle test data into actionable engineering intelligence.',
        tags: ['PySpark', 'Dataproc', 'Celery + Redis', 'pgvector'],
        metrics: [
            { value: 'INR 152 Cr', label: 'business impact' },
            { value: '1,100', label: 'concurrent requests' },
        ],
        problem:
            'Large-scale vehicle test analysis and historical data retrieval were time-intensive. An end-to-end analytics platform automates analysis and surfaces relevant historical tables and graphs.',
        architecture: [
            'Apache Spark (PySpark) on Google Cloud Dataproc processes vehicle test data at scale.',
            'A structured pgvector RAG system matches complex vehicle test parameters with 92.8% Top-K retrieval accuracy.',
            'An asynchronous Celery and Redis request manager orchestrates long-running analytics jobs without REST API timeouts.',
        ],
        outcome:
            'INR 152 Cr in product development business impact, 95% improved engineer efficiency, and up to 1,100 parallel requests with zero REST API timeouts.',
        visual: 'data',
    },
    {
        id: 'agentic-hr',
        number: '04',
        category: 'Generative AI',
        title: 'An agentic approach to hiring.',
        description:
            'A multi-agent HR workflow. Winner of the Mahindra AI Hackathon 2024.',
        tags: ['Multi-agent AI', 'NLP', 'Computer Vision', 'HR Automation'],
        metrics: [
            { value: '1st place', label: 'Mahindra AI Hackathon 2024' },
            { value: 'End-to-end', label: 'HR workflow' },
        ],
        problem:
            'Architected a multi-agent AI system to automate multiple stages of HR workflows, from CV screening to final candidate ratings.',
        architecture: [
            'Screen and categorize CVs by role.',
            'Generate role-specific interview questions.',
            'Analyze candidate responses alongside facial expressions and produce candidate ratings.',
        ],
        outcome:
            'Winner of the Mahindra AI Hackathon in October 2024. This is a description of the supplied project, not an endorsement of facial-expression analysis as a hiring measure.',
        visual: 'agents',
    },
]

export type ExperienceDocument = {
    title: string
    description: string
    issued: string
    kind: 'award' | 'certificate'
    format: 'image' | 'pdf'
    file: string
    preview?: string
}

export type Experience = {
    role: string
    company: string
    date: string
    current: boolean
    summary: string
    points: string[]
    tags: string[]
    documents: ExperienceDocument[]
}

export const experience: Experience[] = [
    {
        role: 'Data Scientist',
        company: 'Mahindra Group',
        date: 'Aug 2024 - Present',
        current: true,
        summary:
            'Developing practical AI and machine learning solutions across Mahindra businesses, from early experimentation to production delivery.',
        points: [
            'Work with business and engineering teams to translate operational challenges into analytics and AI solutions, spanning customer insights and engine and vehicle testing.',
            'Build machine learning and generative AI workflows, connecting model development with the services and integrations needed to put them into production.',
            'Contribute to the Mahindra AI Academy by shaping learning paths that help teams understand and apply generative AI in their work.',
            'Mentor interns through the AI product lifecycle, helping them move from exploration and experimentation to implementation and delivery.',
        ],
        tags: ['Enterprise AI', 'Technical leadership', 'ML in production'],
        documents: [
            {
                title: "Quarterly Excellence Award - Q4 F'2026",
                description: 'Recognized for effective problem solving.',
                issued: '08 Jul 2026',
                kind: 'award',
                format: 'image',
                file: 'documents/mahindra-problem-solving-2026.png',
            },
            {
                title: 'Excellence Award - Quality of Delivery',
                description: 'Recognized for ensuring quality of delivery.',
                issued: '06 Aug 2025',
                kind: 'award',
                format: 'image',
                file: 'documents/mahindra-quality-of-delivery-2025.png',
            },
            {
                title: "Quarterly Excellence Award - Q2 F'2025",
                description: 'Recognized for enhancing productivity.',
                issued: '07 Nov 2024',
                kind: 'award',
                format: 'image',
                file: 'documents/mahindra-productivity-2024.png',
            },
            {
                title: 'Excellence Award - Discretionary Effort',
                description: 'Recognized for showcasing discretionary effort.',
                issued: '26 Aug 2024',
                kind: 'award',
                format: 'image',
                file: 'documents/mahindra-discretionary-effort-2024.png',
            },
        ],
    },
    {
        role: 'Data Science Intern',
        company: 'Mahindra Group',
        date: 'Oct 2023 - Jun 2024',
        current: false,
        summary:
            'Worked on multilingual speech and text workflows to help teams understand customer conversations, identify recurring needs, and turn unstructured call data into useful insights.',
        points: [
            'Prepared customer-call audio and combined Azure Speech-to-Text with translation services to make multilingual conversations usable for downstream analysis.',
            'Fine-tuned DistilBERT on domain-specific transcripts to better understand sentiment in customer interactions.',
            'Developed a transformer-based spaCy named-entity recognition pipeline to surface caller intents, product mentions, and recurring customer pain points.',
        ],
        tags: ['NLP', 'Azure AI', 'DistilBERT', 'spaCy'],
        documents: [
            {
                title: 'Mahindra Internship Certificate',
                description: 'Data Sciences, Group Technology Office. 11 Oct 2023 - 30 Jun 2024.',
                issued: '02 Jul 2024',
                kind: 'certificate',
                format: 'pdf',
                file: 'documents/mahindra-internship-certificate.pdf',
                preview: 'documents/mahindra-internship-certificate.png',
            },
        ],
    },
    {
        role: 'DevOps Intern',
        company: 'MyEra Technologies',
        date: 'Apr 2023 - May 2023',
        current: false,
        summary:
            'Supported software delivery by automating testing and release workflows for Node.js projects, with a focus on consistent, dependable deployments.',
        points: [
            'Built GitHub Actions CI/CD workflows for Node.js applications, connecting automated testing to the release process.',
            'Added pre-release checks to catch issues before deployment and make the path from a code change to a release more reliable.',
        ],
        tags: ['GitHub Actions', 'CI/CD', 'Node.js'],
        documents: [
            {
                title: 'MyEra DevOps Internship Certificate',
                description: 'DevOps internship at MyEra Technologies Pvt. Ltd. 01 Apr 2023 - 31 May 2023.',
                issued: '01 Jun 2024',
                kind: 'certificate',
                format: 'pdf',
                file: 'documents/myera-internship-certificate.pdf',
                preview: 'documents/myera-internship-certificate.png',
            },
        ],
    },
]

export const skillGroups = [
    {
        title: 'Languages & core',
        number: '01',
        skills: [
            'Python',
            'C/C++',
            'NumPy',
            'Pandas',
            'SciPy',
            'Polars',
            'JAX',
            'cuDF',
        ],
    },
    {
        title: 'ML, deep learning & GenAI',
        number: '02',
        skills: [
            'PyTorch',
            'TensorFlow',
            'Scikit-Learn',
            'XGBoost',
            'LangChain',
            'LangGraph',
            'CrewAI',
            'OpenAI',
            'LLaMA',
            'Ollama',
            'NLP',
            'Computer Vision',
            'RAG Pipelines',
            'LoRA / QLoRA',
            'Agentic Design Patterns',
        ],
    },
    {
        title: 'Backend, protocols & databases',
        number: '03',
        skills: [
            'FastAPI',
            'Celery',
            'REST APIs',
            'gRPC',
            'MCP',
            'FastMCP',
            'JSON-RPC',
            'A2A/A2P',
            'PostgreSQL',
            'pgvector',
            'Pinecone',
            'MongoDB',
            'Redis',
        ],
    },
    {
        title: 'Cloud, MLOps & big data',
        number: '04',
        skills: [
            'Google Cloud',
            'Vertex AI',
            'Dataproc',
            'Azure ML Studio',
            'AWS',
            'PySpark',
            'MLflow',
            'Docker',
            'Kubernetes',
            'CI/CD',
            'Jenkins',
            'Git',
            'Plotly',
            'Seaborn',
            'Matplotlib',
        ],
    },
]

export const education =
    'B.Tech in Computer Science and Engineering, JECRC University, Jaipur, India. Aug 2020 - Jul 2024. CGPA: 9.48/10.'
