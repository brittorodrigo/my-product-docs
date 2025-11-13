# Personal Documentation Hub

A powerful Next.js application that serves as a centralized hub for managing Product Requirements Documents (PRDs) and prototypes. This app provides an intuitive interface for organizing, searching, and viewing your product documentation.

## ✨ Features

### Core Features
- **📄 PRD Repository**: Browse, search, and view all your PRD documents
- **🎨 Beautiful Markdown Rendering**: Syntax highlighting, tables, and rich formatting
- **📱 Prototype Directory**: Quick access to all your prototypes with one-click opening
- **🎯 Responsive Design**: Works beautifully on desktop and mobile
- **🌙 Dark Mode**: Automatic dark mode based on system preferences
- **🔍 Real-time Search**: Search across PRD titles, content, and tags
- **🎨 Modern UI**: Glass-morphism design with blue gradient color palette

### Advanced Features 🚀

#### 📑 Tags & Categorization
- Filter PRDs by tags defined in YAML frontmatter
- Multi-tag filtering support
- Visual tag pills with beautiful styling
- Search by tags

#### 📋 Table of Contents
- Automatic TOC generation from markdown headings
- Sticky sidebar navigation on larger screens
- Smooth scroll to sections
- Active section highlighting
- Supports nested headings (H1-H6)

#### 🕐 Version History
- Git-powered version tracking
- View past versions with dates
- Quick access via version history button
- Shows commit history for each PRD

#### 🎯 Status Tracking
- Visual status indicators (Draft, Approved, In Progress, etc.)
- Color-coded status badges
- Version numbers displayed

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ - [Download here](https://nodejs.org/)
- **npm** or **yarn**
- **Git** (optional, for version history feature)

### Installation

1. **Navigate to the project directory**:
```bash
cd my-product-docs
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Adding PRDs with Metadata

To take full advantage of the advanced features, add YAML frontmatter to your PRD markdown files:

```markdown
---
tags: [feature, mobile, ui-update]
status: Draft
version: 1.0
---

# Your PRD Title

Your content here...
```

### Supported Frontmatter Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `tags` | Array | Categories for filtering | `[feature, mobile, v2]` |
| `status` | String | Current status | `Draft`, `Approved`, `In Progress` |
| `version` | String | Version number | `1.0`, `2.1` |

### Tag Best Practices

- Use lowercase, hyphenated names
- Common tags: `feature`, `bug-fix`, `enhancement`, `mobile`, `web`, `backend`, `frontend`
- Limit to 3-5 tags per PRD for best UX
- Be consistent across documents

### Example PRD Structure

```markdown
---
tags: [feature, backend, api]
status: Approved
version: 2.1
---

# PRD: Authentication System

## Executive Summary
Brief overview of the feature...

## Problem Statement
What problem are we solving?

## Goals
- Goal 1
- Goal 2

## Product Requirements
Detailed requirements...
```

## 📁 Project Structure

```
my-product-docs/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── prds/         # PRD-related endpoints
│   │   │   ├── route.ts           # Fetch PRDs with metadata
│   │   │   └── versions/          # Version history
│   │   │       └── route.ts
│   │   └── prototypes/   # Prototype endpoints
│   │       ├── route.ts
│   │       ├── open/
│   │       └── serve/
│   ├── globals.css        # Global styles + custom scrollbar
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (side-by-side layout)
├── components/            # React components
│   ├── PRDRepository.tsx  # PRD list with tags & filtering
│   ├── PRDViewer.tsx      # PRD viewer with TOC & version history
│   └── PrototypeDirectory.tsx  # Prototype list
├── prds/                  # 📝 Your PRD markdown files go here
│   ├── prd-personal-documentation-hub.md
│   ├── prd-example.md
│   └── prd-example-2.md
├── prototypes/            # 🎨 Your prototype folders go here
│   ├── todo-list-app/    # Example: TaskFlow todo app
│   └── example-prototype/
├── agents/                # AI agent instructions
│   └── PRD Rules.md       # Guidelines for writing PRDs
├── prompts/               # Prompt templates
└── README.md
```

## 🎨 Customization

### Adding PRDs

1. Create a new markdown file in the `/prds` folder:
```bash
touch prds/prd-my-feature.md
```

2. Add frontmatter and content:
```markdown
---
tags: [feature, frontend]
status: Draft
version: 1.0
---

# My Feature PRD

Content here...
```

3. The PRD will automatically appear in the app!

### Adding Prototypes

1. Create a prototype folder:
```bash
mkdir prototypes/my-prototype
```

2. Add your HTML files:
```bash
cd prototypes/my-prototype
touch index.html
```

3. **OR** link to external prototype:
```bash
echo "https://your-prototype-url.com" > url.txt
```

The prototype will appear in the Prototypes section and can be opened with one click!

## 🔧 Advanced Features Usage

### Table of Contents

The TOC is automatically generated from your markdown headings. Structure your PRD properly:

```markdown
# Main Title

## Section 1
Content...

### Subsection 1.1
Content...

### Subsection 1.2
Content...

## Section 2
Content...
```

The TOC appears as a sticky sidebar on the left when viewing a PRD (on larger screens).

### Version History

Version history is powered by Git. To enable it:

1. **Initialize git** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Commit changes** to PRDs:
```bash
git add prds/your-prd.md
git commit -m "Updated requirements section"
```

3. **View history**: Click the "Version History" button in the PRD viewer to see all past versions

### Filtering by Tags

1. Tags appear at the top of the PRD list
2. Click any tag to filter PRDs
3. Click multiple tags to filter by all selected tags
4. Click "Clear all" to reset filters

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: ReactMarkdown + remark-gfm
- **Metadata Parsing**: gray-matter
- **Version Control**: Git
- **Date Handling**: date-fns

## 🎯 Use Cases

- **Product Managers**: Organize and track all PRDs in one place
- **Engineering Teams**: Quick access to requirements and prototypes
- **Design Teams**: View prototypes and design specifications
- **Solo Developers**: Personal documentation hub for side projects

## 🌟 Example PRDs Included

1. **Personal Documentation Hub PRD** - The PRD for this very app!
2. **Example Feature PRD** - Demonstrates tagging and status
3. **API Integration Layer PRD** - Backend-focused example

## 🎨 Example Prototypes Included

1. **TaskFlow Todo App** - A beautiful, interactive todo list prototype
2. **Example Prototype** - Simple HTML prototype template

## 🚀 Building for Production

To build the app for production:

```bash
npm run build
npm start
```

The app will be optimized and ready to deploy!

## 📝 License

This project is for personal use. Feel free to modify and extend it for your needs!

## 🤝 Contributing

This is a personal documentation hub, but feel free to fork and customize for your own use!

## 📧 Questions?

Check the included PRD for this app at `prds/prd-personal-documentation-hub.md` for detailed feature specifications.

---

**Built with ❤️ for Product Managers and Developers**
