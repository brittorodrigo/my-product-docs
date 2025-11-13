# Personal Documentation Hub

A Next.js application that serves as a centralized hub for managing Product Requirements Documents (PRDs) and prototypes. This app provides two core capabilities:

1. **PRD Repository Hub**: View, search, and read all PRD markdown documents from a designated folder
2. **Prototype Directory**: List and open all prototypes organized as directories

## Features

- 📄 **PRD Repository**: Browse and search through all PRD markdown files
- 🔍 **Real-time Search**: Search PRDs by name or content
- 📖 **Markdown Viewer**: Beautiful markdown rendering with syntax highlighting
- 📁 **Prototype Directory**: List all prototype directories
- 🚀 **Quick Access**: Click to open prototypes instantly
- ⚙️ **Configurable Folders**: Set custom folder paths for PRDs and prototypes
- 🌙 **Dark Mode**: Automatic dark mode support

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Setup Instructions

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including Next.js, React, Tailwind CSS, and markdown rendering libraries.

### Step 2: Run the Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Step 3: Configure Folder Paths

1. Open the app in your browser
2. In the **PRDs** section, click "Change" next to the PRD folder path
3. Enter the absolute path to your PRDs folder (e.g., `/Users/rodrigomac/Documents/my-product-docs/prds`)
4. Click "Save"
5. Repeat for the **Prototypes** section with your prototypes folder path

**Note**: The app uses absolute paths. Make sure to use the full path to your folders.

## Project Structure

```
my-product-docs/
├── app/
│   ├── api/
│   │   ├── prds/
│   │   │   └── route.ts          # API endpoint for loading PRDs
│   │   └── prototypes/
│   │       ├── route.ts          # API endpoint for listing prototypes
│   │       └── open/
│   │           └── route.ts      # API endpoint for opening prototypes
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   ├── FolderConfig.tsx          # Folder path configuration component
│   ├── Navigation.tsx             # Top navigation bar
│   ├── PRDRepository.tsx         # PRD list and search component
│   ├── PRDViewer.tsx             # Markdown viewer component
│   └── PrototypeDirectory.tsx    # Prototype directory listing
├── prds/                         # Your PRD markdown files (example)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Usage

### Viewing PRDs

1. Navigate to the **PRDs** section (default view)
2. Configure your PRD folder path if not already set
3. Browse the list of PRDs sorted by last modified date
4. Use the search bar to filter PRDs by name or content
5. Click on any PRD to view it in the markdown viewer
6. Click "Back to PRD List" to return to the list

### Accessing Prototypes

1. Navigate to the **Prototypes** section
2. Configure your prototype folder path if not already set
3. Browse the grid of prototype directories
4. Click on any prototype to open it:
   - If the directory contains an `index.html` or any `.html` file, it will open in your browser
   - If the directory contains a `url.txt` or `link.txt` file with a URL, it will open that URL
   - Otherwise, an error message will be displayed

### Prototype Directory Structure

For best results, organize your prototypes as follows:

**Option 1: HTML Prototype**
```
prototypes/
  └── my-prototype/
      └── index.html
```

**Option 2: URL-based Prototype**
```
prototypes/
  └── figma-design/
      └── url.txt  (contains: https://www.figma.com/file/...)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Building for Production

To create a production build:

```bash
npm run build
npm run start
```

## Troubleshooting

### PRDs not loading
- Ensure the folder path is an absolute path (starts with `/` on Mac/Linux or `C:\` on Windows)
- Check that the folder contains `.md` files
- Verify you have read permissions for the folder

### Prototypes not opening
- Make sure the prototype directory contains an HTML file or a `url.txt` file
- Check browser popup blockers if opening external URLs
- Verify the file paths are correct

### Search not working
- Ensure PRDs have been loaded successfully
- Try refreshing the page
- Check browser console for errors

## Technology Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering
- **date-fns** - Date formatting

## Notes

- Folder paths are stored in browser localStorage and persist between sessions
- The app reads files directly from your file system (server-side)
- For security reasons, the app only reads files from configured folders
- File watching is not yet implemented - refresh the page to see new files

## Future Enhancements

Based on the PRD, potential future features:
- File watching for automatic refresh
- Multiple folder support
- Preview thumbnails for prototypes
- Advanced search with filters
- Export functionality
- Cloud sync support

## License

This is a personal project for managing documentation and prototypes.
