import React, { useState, useMemo } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Download, ChevronRight, Search, Filter, BookOpen, Code, BarChart3, Database, Brain, TrendingUp, Award, Calendar, Tag, Clock, FileText, Play, Eye, ArrowRight } from 'lucide-react';

// Types
type SkillLevel = 'learning' | 'practiced' | 'shipped' | 'advanced';
type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface RoadmapNode {
  id: string;
  label: string;
  level: SkillLevel;
  description: string;
  projectCount: number;
  writeUpCount: number;
  category: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  domain: string;
  tools: string[];
  methods: string[];
  difficulty: ProjectDifficulty;
  outcome: string;
  metrics?: string;
  githubUrl?: string;
  notebookUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

interface Skill {
  slug: string;
  title: string;
  level: SkillLevel;
  theory: {
    summary: string;
    concepts: string[];
    pitfalls: string[];
  };
  projects: string[];
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  date: string;
  tags: string[];
}

// Sample Data
const profileData = {
  name: "Your Name",
  title: "Aspiring Data Scientist",
  tagline: "Bridging theory and practice through end-to-end machine learning projects and rigorous analytical thinking",
  bio: "Former economics researcher turned data scientist with a passion for building ML systems that solve real-world problems. I combine statistical rigor with hands-on engineering to ship models that matter—from exploratory analysis to production deployment.",
  email: "your.email@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
};

const roadmapNodes: RoadmapNode[] = [
  { id: 'python', label: 'Python', level: 'advanced', description: 'NumPy, Pandas, scikit-learn, data structures', projectCount: 8, writeUpCount: 3, category: 'programming' },
  { id: 'sql', label: 'SQL', level: 'shipped', description: 'PostgreSQL, query optimization, window functions', projectCount: 4, writeUpCount: 1, category: 'programming' },
  { id: 'r', label: 'R', level: 'practiced', description: 'tidyverse, statistical modeling, visualization', projectCount: 3, writeUpCount: 1, category: 'programming' },
  { id: 'stats', label: 'Statistics', level: 'advanced', description: 'Hypothesis testing, regression, Bayesian inference', projectCount: 6, writeUpCount: 4, category: 'foundation' },
  { id: 'probability', label: 'Probability', level: 'shipped', description: 'Distributions, sampling, Monte Carlo methods', projectCount: 4, writeUpCount: 2, category: 'foundation' },
  { id: 'supervised', label: 'Supervised ML', level: 'advanced', description: 'Classification, regression, ensemble methods', projectCount: 9, writeUpCount: 5, category: 'ml' },
  { id: 'unsupervised', label: 'Unsupervised ML', level: 'shipped', description: 'Clustering, dimensionality reduction, anomaly detection', projectCount: 5, writeUpCount: 2, category: 'ml' },
  { id: 'deep-learning', label: 'Deep Learning', level: 'practiced', description: 'Neural networks, CNNs, transfer learning', projectCount: 4, writeUpCount: 2, category: 'ml' },
  { id: 'nlp', label: 'NLP', level: 'practiced', description: 'Text processing, transformers, sentiment analysis', projectCount: 3, writeUpCount: 1, category: 'ml' },
  { id: 'data-eng', label: 'Data Engineering', level: 'shipped', description: 'ETL pipelines, data warehousing, Airflow', projectCount: 3, writeUpCount: 1, category: 'engineering' },
  { id: 'viz', label: 'Visualization', level: 'advanced', description: 'Matplotlib, Seaborn, Plotly, Tableau', projectCount: 10, writeUpCount: 2, category: 'engineering' },
  { id: 'mlops', label: 'MLOps', level: 'learning', description: 'Model deployment, monitoring, CI/CD', projectCount: 2, writeUpCount: 1, category: 'engineering' },
  { id: 'healthcare', label: 'Healthcare Analytics', level: 'shipped', description: 'Clinical predictions, survival analysis', projectCount: 3, writeUpCount: 1, category: 'domain' },
  { id: 'finance', label: 'Finance', level: 'practiced', description: 'Risk modeling, time series, portfolio optimization', projectCount: 4, writeUpCount: 2, category: 'domain' },
];

const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'Customer Churn Prediction System',
    slug: 'churn-prediction',
    summary: 'End-to-end ML pipeline predicting customer churn with 89% accuracy using XGBoost',
    domain: 'Business',
    tools: ['Python', 'XGBoost', 'Flask', 'Docker'],
    methods: ['Ensemble Learning', 'Feature Engineering', 'SHAP'],
    difficulty: 'advanced',
    outcome: 'Reduced churn by 23% in test deployment',
    metrics: '89% accuracy, 0.85 F1-score',
    githubUrl: '#',
    demoUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Real-Time Anomaly Detection Dashboard',
    slug: 'anomaly-detection',
    summary: 'Streaming analytics pipeline detecting anomalies in IoT sensor data',
    domain: 'IoT',
    tools: ['Python', 'Kafka', 'Isolation Forest', 'Plotly'],
    methods: ['Unsupervised Learning', 'Stream Processing'],
    difficulty: 'advanced',
    outcome: 'Detected 97% of critical failures with <5min latency',
    githubUrl: '#',
    notebookUrl: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'Healthcare Cost Prediction Model',
    slug: 'healthcare-costs',
    summary: 'Statistical analysis and ML modeling of medical insurance costs',
    domain: 'Healthcare',
    tools: ['Python', 'scikit-learn', 'statsmodels'],
    methods: ['Linear Regression', 'Random Forest', 'A/B Testing'],
    difficulty: 'intermediate',
    outcome: 'R² = 0.83, interpretable model for policy decisions',
    metrics: 'RMSE: $2,134',
    githubUrl: '#',
    notebookUrl: '#',
    featured: true,
  },
];

const allProjects: Project[] = [
  ...featuredProjects,
  {
    id: '4',
    title: 'Sentiment Analysis of Product Reviews',
    slug: 'sentiment-analysis',
    summary: 'NLP pipeline analyzing 100K+ customer reviews using transformers',
    domain: 'E-commerce',
    tools: ['Python', 'HuggingFace', 'BERT', 'spaCy'],
    methods: ['Transfer Learning', 'Text Classification'],
    difficulty: 'intermediate',
    outcome: '92% accuracy on multi-class sentiment',
    githubUrl: '#',
  },
  {
    id: '5',
    title: 'Time Series Forecasting: Stock Prices',
    slug: 'stock-forecasting',
    summary: 'ARIMA and LSTM models for financial time series prediction',
    domain: 'Finance',
    tools: ['Python', 'TensorFlow', 'statsmodels'],
    methods: ['ARIMA', 'LSTM', 'Walk-forward Validation'],
    difficulty: 'advanced',
    outcome: 'MAPE: 3.2% on out-of-sample data',
    githubUrl: '#',
    notebookUrl: '#',
  },
  {
    id: '6',
    title: 'Image Classification: Medical X-Rays',
    slug: 'xray-classification',
    summary: 'CNN model detecting pneumonia from chest X-rays',
    domain: 'Healthcare',
    tools: ['Python', 'PyTorch', 'ResNet50'],
    methods: ['Transfer Learning', 'Data Augmentation'],
    difficulty: 'advanced',
    outcome: '94% accuracy, 96% sensitivity',
    githubUrl: '#',
  },
];

const posts: Post[] = [
  {
    slug: 'bias-variance-tradeoff',
    title: 'Understanding the Bias-Variance Tradeoff: Theory and Practice',
    excerpt: 'A deep dive into one of ML\'s fundamental concepts with practical examples',
    readTime: 8,
    date: '2024-11-15',
    tags: ['Machine Learning', 'Theory', 'Model Selection'],
  },
  {
    slug: 'feature-engineering-guide',
    title: 'Feature Engineering: From Raw Data to ML-Ready Features',
    excerpt: 'Systematic approaches to creating informative features for your models',
    readTime: 12,
    date: '2024-10-22',
    tags: ['Feature Engineering', 'Best Practices', 'Tutorial'],
  },
  {
    slug: 'ml-model-deployment',
    title: 'Deploying ML Models: From Jupyter to Production',
    excerpt: 'Lessons learned shipping a classification model to 10K+ users',
    readTime: 15,
    date: '2024-09-18',
    tags: ['MLOps', 'Deployment', 'Case Study'],
  },
];

const skills: Record<string, Skill> = {
  'supervised': {
    slug: 'supervised',
    title: 'Supervised Machine Learning',
    level: 'advanced',
    theory: {
      summary: 'Supervised learning maps inputs to outputs using labeled training data. Core paradigm for classification and regression tasks.',
      concepts: [
        'Loss functions and optimization (gradient descent, Adam)',
        'Regularization techniques (L1/L2, dropout, early stopping)',
        'Ensemble methods (bagging, boosting, stacking)',
        'Cross-validation and hyperparameter tuning',
        'Evaluation metrics (accuracy, precision, recall, F1, AUC-ROC)',
      ],
      pitfalls: [
        'Overfitting to training data—always validate on held-out sets',
        'Class imbalance—use SMOTE, class weights, or stratified sampling',
        'Data leakage—never let test data influence preprocessing',
        'Ignoring feature scaling for distance-based algorithms',
      ],
    },
    projects: ['churn-prediction', 'healthcare-costs', 'xray-classification'],
  },
};

// Components
const Navigation = ({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'projects', label: 'Projects' },
    { id: 'writing', label: 'Writing' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => onNavigate('home')}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {profileData.name}
          </button>
          <div className="flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const LevelBadge = ({ level }: { level: SkillLevel }) => {
  const colors = {
    learning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    practiced: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-green-100 text-green-800 border-green-300',
    advanced: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

const HomePage = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {profileData.name}
          </h1>
          <p className="text-2xl text-gray-600 mb-4">{profileData.title}</p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            {profileData.tagline}
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <button 
              onClick={() => onNavigate('resume')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Download size={20} />
              Download Resume
            </button>
            <button 
              onClick={() => onNavigate('roadmap')}
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
            >
              Explore Roadmap
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex justify-center gap-6">
            <a href={profileData.github} className="text-gray-600 hover:text-gray-900 transition-colors">
              <Github size={24} />
            </a>
            <a href={profileData.linkedin} className="text-gray-600 hover:text-gray-900 transition-colors">
              <Linkedin size={24} />
            </a>
            <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-gray-900 transition-colors">
              <Mail size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Proof Strip */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map(project => (
            <div 
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate('project-detail', project)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <Award className="text-blue-600 flex-shrink-0" size={20} />
              </div>
              <p className="text-sm text-gray-600 mb-4">{project.summary}</p>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tools.slice(0, 3).map(tool => (
                    <span key={tool} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-green-700 mb-3">
                ✓ {project.outcome}
              </p>
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <Github size={14} /> Code
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <ExternalLink size={14} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {profileData.bio}
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">14</div>
              <div className="text-sm text-gray-600">Skills Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-sm text-gray-600">Technical Articles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadmapPage = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const categories = [
    { id: 'programming', label: 'Programming', color: 'blue' },
    { id: 'foundation', label: 'Statistics & Math', color: 'purple' },
    { id: 'ml', label: 'Machine Learning', color: 'green' },
    { id: 'engineering', label: 'Data Engineering', color: 'orange' },
    { id: 'domain', label: 'Domain Applications', color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Science Roadmap</h1>
          <p className="text-lg text-gray-600">
            My learning journey mapped by skills, with projects and artifacts for each domain
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4 flex-wrap">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full bg-${cat.color}-500`}></div>
              <span className="text-sm text-gray-700">{cat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roadmapNodes.map(node => {
            const category = categories.find(c => c.id === node.category);
            return (
              <div
                key={node.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer"
                onClick={() => onNavigate('skill-detail', node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{node.label}</h3>
                  <LevelBadge level={node.level} />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{node.description}</p>
                
                <div className="flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Code size={14} />
                    {node.projectCount} projects
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    {node.writeUpCount} posts
                  </div>
                </div>

                {hoveredNode === node.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-blue-600 flex items-center gap-1">
                      Click to explore <ChevronRight size={12} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SkillDetailPage = ({ skillId, onNavigate }: { skillId: string; onNavigate: (page: string, data?: any) => void }) => {
  const skill = skills[skillId] || skills['supervised'];
  const relatedProjects = allProjects.filter(p => skill.projects.includes(p.slug));

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <button 
          onClick={() => onNavigate('roadmap')}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-1"
        >
          ← Back to Roadmap
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{skill.title}</h1>
            <LevelBadge level={skill.level} />
          </div>
        </div>

        {/* Theory Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Theory & Concepts</h2>
          </div>
          
          <p className="text-gray-700 mb-6">{skill.theory.summary}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Concepts</h3>
            <ul className="space-y-2">
              {skill.theory.concepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Pitfalls</h3>
            <ul className="space-y-2">
              {skill.theory.pitfalls.map((pitfall, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500 mt-1">⚠</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practice Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Projects & Practice</h2>
          </div>

          <div className="space-y-4">
            {relatedProjects.map(project => (
              <div 
                key={project.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate('project-detail', project)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{project.summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tools.map(tool => (
                    <span key={tool} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-700 font-medium">✓ {project.outcome}</span>
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Github size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artifacts Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Database className="text-purple-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Resources & Artifacts</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">Jupyter Notebooks</h4>
              <p className="text-sm text-gray-600 mb-3">Interactive analysis and experimentation</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                <Eye size={14} /> View 3 notebooks
              </button>
            </div>
            
            <div className="border border-gray-200 rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">GitHub Repositories</h4>
              <p className="text-sm text-gray-600 mb-3">Production-ready code implementations</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                <Github size={14} /> View {relatedProjects.length} repos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const domains = ['all', ...Array.from(new Set(allProjects.map(p => p.domain)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' || project.domain === selectedDomain;
      const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesDomain && matchesDifficulty;
    });
  }, [searchTerm, selectedDomain, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
          <p className="text-lg text-gray-600">
            End-to-end machine learning projects demonstrating theory, implementation, and impact
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart3 size={16} className="inline mr-1" />
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate('project-detail', project)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                {project.featured && <Award className="text-yellow-500" size={20} />}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{project.summary}</p>
              
              <div className="mb-3">
                <span className="text-xs text-gray-500 mr-2">{project.domain}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {project.difficulty}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tools.slice(0, 3).map(tool => (
                  <span key={tool} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {tool}
                  </span>
                ))}
                {project.tools.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                    +{project.tools.length - 3} more
                  </span>
                )}
              </div>
              
              <p className="text-sm font-medium text-green-700 mb-3">
                ✓ {project.outcome}
              </p>
              
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                {project.githubUrl && (
                  <a href={project.githubUrl} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <Github size={14} /> Code
                  </a>
                )}
                {project.notebookUrl && (
                  <a href={project.notebookUrl} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <FileText size={14} /> Notebook
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <Play size={14} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectDetailPage = ({ project, onNavigate }: { project: Project; onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => onNavigate('projects')}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-1"
        >
          ← Back to Projects
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex gap-3 items-center">
                <span className="text-gray-600">{project.domain}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {project.difficulty}
                </span>
              </div>
            </div>
            {project.featured && <Award className="text-yellow-500" size={28} />}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Problem Statement</h2>
            <p className="text-gray-700">{project.summary}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Approach & Methodology</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.methods.map(method => (
                <span key={method} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded">
                  {method}
                </span>
              ))}
            </div>
            <p className="text-gray-700">
              Implemented a comprehensive machine learning pipeline including data preprocessing, feature engineering, 
              model training with cross-validation, and hyperparameter tuning. Selected evaluation metrics aligned with 
              business objectives and validated model performance on held-out test data.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map(tool => (
                <span key={tool} className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Results & Impact</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
              <p className="text-green-800 font-medium">{project.outcome}</p>
              {project.metrics && (
                <p className="text-green-700 text-sm mt-1">{project.metrics}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Learnings & Tradeoffs</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Model interpretability vs. performance: chose ensemble methods for better accuracy while maintaining explainability through SHAP values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Feature engineering significantly outperformed raw features, demonstrating domain knowledge importance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Production deployment considerations: model size, latency, and monitoring requirements</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">View Project Artifacts</h2>
            <div className="flex gap-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Github size={18} />
                  View on GitHub
                </a>
              )}
              {project.notebookUrl && (
                <a 
                  href={project.notebookUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText size={18} />
                  View Notebook
                </a>
              )}
              {project.demoUrl && (
                <a 
                  href={project.demoUrl}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Play size={18} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WritingPage = ({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Writing</h1>
          <p className="text-lg text-gray-600">
            Technical articles exploring ML concepts, best practices, and lessons from real projects
          </p>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div
              key={post.slug}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate('post-detail', post)}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime} min read
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResumePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Resume</h1>
          <a
            href="/resume.pdf"
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
            <p className="text-xl text-gray-600 mb-4">{profileData.title}</p>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <span>{profileData.email}</span>
              <span>•</span>
              <span>GitHub: github.com/yourusername</span>
              <span>•</span>
              <span>LinkedIn: linkedin.com/in/yourusername</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Skills</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Programming & Tools</h4>
                  <p className="text-gray-700">Python, R, SQL, Git, Docker, Jupyter</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Machine Learning</h4>
                  <p className="text-gray-700">scikit-learn, TensorFlow, PyTorch, XGBoost</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Engineering</h4>
                  <p className="text-gray-700">Pandas, NumPy, SQL, Spark, Airflow</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Visualization</h4>
                  <p className="text-gray-700">Matplotlib, Seaborn, Plotly, Tableau</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Projects</h3>
              <div className="space-y-4">
                {featuredProjects.map(project => (
                  <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{project.summary}</p>
                    <p className="text-sm text-green-700 mt-1">✓ {project.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
              <div>
                <h4 className="font-semibold text-gray-900">Bachelor of Science in [Your Major]</h4>
                <p className="text-gray-600">[Your University] • [Year]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            I'm always open to discussing data science opportunities, collaborations, or just chatting about ML
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Ways to Reach Me</h3>
            <div className="space-y-4">
              <a 
                href={`mailto:${profileData.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Mail size={20} className="text-blue-600" />
                <span>{profileData.email}</span>
              </a>
              <a 
                href={profileData.linkedin}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={20} className="text-blue-600" />
                <span>LinkedIn Profile</span>
              </a>
              <a 
                href={profileData.github}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Github size={20} className="text-blue-600" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
            <p className="text-gray-700 mb-4">
              I typically respond within 24-48 hours. For urgent inquiries, LinkedIn messages tend to get the fastest response.
            </p>
            <p className="text-gray-700">
              Open to: Full-time roles, internships, consulting projects, research collaborations
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Thank you for your message! I'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function DataSciencePortfolio() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'roadmap' && <RoadmapPage onNavigate={handleNavigate} />}
      {currentPage === 'skill-detail' && <SkillDetailPage skillId={pageData || 'supervised'} onNavigate={handleNavigate} />}
      {currentPage === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
      {currentPage === 'project-detail' && pageData && <ProjectDetailPage project={pageData} onNavigate={handleNavigate} />}
      {currentPage === 'writing' && <WritingPage onNavigate={handleNavigate} />}
      {currentPage === 'resume' && <ResumePage />}
      {currentPage === 'contact' && <ContactPage />}
    </div>
  );
}