# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Node.js (if not already installed)
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Verify installation by running: `node --version` (should be 18 or higher)
- Verify npm: `npm --version`

### 2. Navigate to Project Directory
```bash
cd /Users/rodrigomac/Documents/my-product-docs
```

### 3. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
- Markdown rendering libraries
- And all other required dependencies

**Expected time:** 1-2 minutes

### 4. Start the Development Server
```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### 5. Open the App
Open your browser and navigate to: **http://localhost:3000**

### 6. Configure Folder Paths

#### For PRDs:
1. In the app, you'll see the PRD section by default
2. Click "Change" next to "PRD Folder"
3. Enter the absolute path to your PRDs folder:
   - Example: `/Users/rodrigomac/Documents/my-product-docs/prds`
4. Click "Save"
5. Your PRDs should now appear in the list

#### For Prototypes:
1. Click the "Prototypes" tab at the top
2. Click "Change" next to "Prototype Folder"
3. Enter the absolute path to your prototypes folder:
   - Example: `/Users/rodrigomac/Documents/my-product-docs/prototypes`
4. Click "Save"
5. Your prototypes should now appear in the grid

### 7. You're Ready!
- Browse and search your PRDs
- Click on PRDs to read them
- Click on prototypes to open them

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies installation fails?
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't see PRDs or Prototypes?
- Make sure you're using **absolute paths** (full path starting with `/`)
- Verify the folders exist and contain files
- Check that you have read permissions for the folders
- Look at the browser console (F12) for any error messages

### Prototypes not opening?
- Ensure prototype directories contain:
  - An `index.html` file, OR
  - Any `.html` file, OR
  - A `url.txt` file with a web URL

## Next Steps

- Add more PRDs to your `/prds` folder
- Organize prototypes in your `/prototypes` folder
- Customize the styling if needed
- Check the main README.md for more details

## Stopping the Server

Press `Ctrl + C` in your terminal to stop the development server.

