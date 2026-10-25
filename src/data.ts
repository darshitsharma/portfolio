export const profile = {
    name: 'Darshit Sharma',
    role: 'Data Scientist | Machine Learning Engineer | AI Engineer',
    email: 'darsu2000sharma@gmail.com',
    phone: '+91-6377597572',
    linkedin: 'https://www.linkedin.com/in/darshit-sharma',
    github: 'https://github.com/darshitsharma',
    toptal: 'https://www.toptal.com/developers/resume/darshit-sharma',
    toptalMemberSince: '22 Oct 2026',
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
    engineering: { title: string; detail: string }[]
    evaluation: string
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
            'Wheel-end forces and moments are important inputs to vehicle validation, but collecting them with physical Wheel Force Transducers adds equipment cost and testing overhead. The goal was to estimate these signals from vehicle sensor data and reduce dependence on dedicated transducer hardware without losing sight of prediction quality.',
        architecture: [
            'Developed multi-output regression using Temporal Convolutional Networks and XGBoost to map vehicle sensor inputs to wheel-end force and moment targets across all wheels.',
            'Implemented a FastAPI service with Celery workers so computationally heavy inference runs outside the synchronous request path instead of holding an API connection open.',
            'Integrated MLflow and autonomous data-drift detection into the end-to-end pipeline to track model work and monitor changes in the data used by the system.',
            'Deployed automated batch inference on Google Cloud Vertex AI, dynamically starting containers for up to 50 concurrent jobs and 50,000+ predictions per job within a 15-minute window.',
        ],
        engineering: [
            { title: 'Model quality and system latency are separate concerns', detail: 'The regression task is evaluated on normalized error, while the API is designed around responsiveness. Moving heavy work to Celery lets a fast request interface coexist with much larger inference workloads.' },
            { title: 'A model is only one part of the product', detail: 'Serving, batch orchestration, experiment tracking, and drift monitoring connect the predictive model to an engineering workflow that can be operated beyond a notebook.' },
        ],
        evaluation: 'Reported prediction error is below 0.05 NRMSE across all wheels. The sub-50ms figure describes API response time, not completion of an entire batch inference job; the batch volume and execution window are reported separately.',
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
            'Engine testing knowledge is useful only when engineers can locate the relevant information quickly. This project combined a database management platform with a voice-enabled retrieval workflow, allowing spoken questions to reach the underlying testing knowledge rather than requiring users to navigate it manually.',
        architecture: [
            'Built the engine-testing data platform around FastAPI and PostgreSQL, connecting database management with the natural-language retrieval workflow.',
            'Used OpenAI Whisper to convert spoken questions into text, with reported speech-to-text accuracy of 94%. LangChain then orchestrates the retrieval-augmented generation pipeline.',
            'Implemented retrieval with pgvector and hybrid search. RAG Fusion generates several variations of a question so that retrieval is not limited to one wording.',
            'Applied Reciprocal Rank Fusion to combine the ranked search results before passing retrieved context through the RAG workflow.',
        ],
        engineering: [
            { title: 'Voice is an entry point, not a separate search system', detail: 'Transcribing the question first lets spoken input reuse the same retrieval workflow as text. Speech recognition and knowledge retrieval remain separately measurable stages.' },
            { title: 'Fuse rankings across query variations', detail: 'Different formulations can surface different relevant records. Reciprocal Rank Fusion combines their ranked results without treating raw scores from different searches as directly comparable.' },
        ],
        evaluation: 'The resume reports 94% speech-to-text accuracy, above 96.8% Top-K retrieval accuracy, and an 80% productivity improvement. Retrieval accuracy measures finding relevant context; it is not a claim that every generated answer is correct.',
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
            'Vehicle test analysis combines large datasets, long-running computation, and the need to find comparable historical tests. The platform brings these tasks together: automate the analysis, retrieve relevant tables and graphs, and keep the request interface usable while substantial processing continues in the background.',
        architecture: [
            'Programmed an end-to-end vehicle-test analytics platform using Apache Spark through PySpark on Google Cloud Dataproc to automate large-scale analysis.',
            'Created a structured RAG workflow with pgvector to match complex vehicle-test parameters against historical data and surface relevant tables and graphs.',
            'Built an asynchronous request manager with Celery and Redis to orchestrate analytics work outside the REST request lifecycle.',
            'Supported parallel execution of up to 1,100 requests while eliminating REST API timeouts from the long-running analytics workflow.',
        ],
        engineering: [
            { title: 'Separate distributed computation from request handling', detail: 'Spark addresses the scale of the analysis; Celery and Redis address the lifecycle of requests waiting for that work. These are complementary responsibilities rather than interchangeable scaling tools.' },
            { title: 'Retrieve engineering artifacts, not just prose', detail: 'Matching structured test parameters makes historical tables and graphs discoverable in context, connecting retrieval to the artifacts engineers actually use for comparison and analysis.' },
        ],
        evaluation: 'Reported results include 92.8% Top-K retrieval accuracy and a 95% improvement in engineer efficiency. The concurrency figure refers to analytics requests, not 1,100 Spark clusters. INR 152 Cr is reported product-development business impact, distinct from the digital twin project\'s one-time savings.',
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
            'Recruitment involves several connected tasks rather than a single question-and-answer exchange. This hackathon project explored a multi-agent workflow that links CV screening, role-specific interview preparation, response analysis, and candidate ratings in one coordinated process.',
        architecture: [
            'Architected a multi-agent system to screen and categorize CVs according to the role being considered.',
            'Generated role-specific interview questions to carry information from the screening stage into the interview workflow.',
            'Combined analysis of candidate responses with a facial-expression analysis component described in the hackathon submission.',
            'Produced candidate ratings as the final stage of the coordinated workflow, demonstrating the full sequence in a competition setting.',
        ],
        engineering: [
            { title: 'Organize the workflow around distinct responsibilities', detail: 'Screening, question generation, and response analysis have different inputs and outputs. A multi-agent design makes these stages explicit instead of collapsing the full workflow into one prompt.' },
            { title: 'Keep prototype scope and hiring validity distinct', detail: 'A hackathon demonstration is not evidence of a validated hiring system. Facial expressions should not be treated as a reliable proxy for ability; consequential hiring decisions require human oversight and appropriate fairness and privacy review.' },
        ],
        evaluation: 'Winner of the Mahindra AI Hackathon in October 2024. No production hiring outcomes, predictive-validity results, or fairness benchmarks are claimed for this prototype.',
        outcome:
            'Winner of the Mahindra AI Hackathon in October 2024. This is a description of the supplied project, not an endorsement of facial-expression analysis as a hiring measure.',
        visual: 'agents',
    },
]

export type PersonalProject = {
    id: string
    title: string
    category: string
    description: string
    highlights: string[]
    tags: string[]
    repository: string
    evidence: string
}

export const personalProjects: PersonalProject[] = [
    {
        id: 'agentflow',
        title: 'AgentFlow',
        category: 'Agent orchestration',
        description: 'A full-stack workspace for configuring AI agents, connecting them in visual workflows, and inspecting their conversations, memory, and execution logs.',
        highlights: [
            'Pairs a React Flow editor with a FastAPI back end and local Ollama inference; agent execution uses LangGraph, with conditional workflow routing and fan-in handling.',
            'Implements short-term semantic recall and persistent facts with ChromaDB, alongside PostgreSQL message history, Telegram integration, and a monitoring dashboard.',
        ],
        tags: ['FastAPI', 'React Flow', 'LangGraph', 'Ollama', 'ChromaDB'],
        repository: 'https://github.com/darshitsharma/AgentFlow',
        evidence: 'README and backend/app/workflow_engine.py reviewed on 25 Oct 2026. Personal project; no production-scale or commercial outcome claimed.',
    },
    {
        id: 'credscope-ai',
        title: 'CredScope-AI',
        category: 'Financial ML prototype',
        description: 'An MSME financial-health prototype connecting model training, a scoring API, and a dashboard for financial health, credit eligibility, and recommended credit limits.',
        highlights: [
            'Uses XGBoost regression and classification pipelines to model financial-health scores, credit eligibility, and recommended credit limits from the supplied synthetic dataset.',
            'Connects a FastAPI scoring service to a Next.js dashboard for financial indicators and model explanations. Built as an assignment prototype, not a validated lending system.',
        ],
        tags: ['XGBoost', 'FastAPI', 'Next.js', 'Scikit-Learn'],
        repository: 'https://github.com/darshitsharma/CredScope-AI',
        evidence: 'README and ml_pipeline/train_models.py reviewed on 25 Oct 2026. Synthetic-data assignment; no real-world credit performance or deployment claimed.',
    },
    {
        id: 'amex',
        title: 'AMEX sequence modeling',
        category: 'Kaggle research notebook',
        description: 'A competition notebook exploring TensorFlow GRU sequence modeling and RAPIDS for the American Express prediction challenge on Kaggle.',
        highlights: [
            'Builds a TensorFlow GRU model and uses the competition-specific AMEX metric to evaluate predictions across validation folds.',
            'Explores large-data processing in the Kaggle environment with RAPIDS. The repository reports a 0.787 competition-metric score, not classification accuracy or a verified leaderboard rank.',
        ],
        tags: ['TensorFlow', 'GRU', 'RAPIDS', 'Kaggle'],
        repository: 'https://github.com/darshitsharma/AMEX',
        evidence: 'README and amex-tensorflow-and-rapids.ipynb reviewed on 25 Oct 2026. Score is repository-reported; no independent rerun or leaderboard verification.',
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
