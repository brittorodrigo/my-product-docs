import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { folderPath } = await request.json()

    if (!folderPath) {
      return NextResponse.json(
        { error: 'Folder path is required' },
        { status: 400 }
      )
    }

    // Resolve relative to project root
    const projectRoot = process.cwd()
    const absolutePath = folderPath.startsWith('/') ? folderPath : join(projectRoot, folderPath)

    const files = await readdir(absolutePath)
    const prdFiles = []

    for (const file of files) {
      const filePath = join(absolutePath, file)
      const fileStat = await stat(filePath)

      if (fileStat.isFile() && file.endsWith('.md')) {
        try {
          const content = await readFile(filePath, 'utf-8')
          const stats = await stat(filePath)

          prdFiles.push({
            name: file,
            path: filePath,
            lastModified: stats.mtime,
            content: content,
          })
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error)
        }
      }
    }

    // Sort by last modified date (newest first)
    prdFiles.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

    return NextResponse.json({ prds: prdFiles })
  } catch (error) {
    console.error('Error loading PRDs:', error)
    return NextResponse.json(
      { error: 'Failed to load PRDs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

