import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
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

    const items = await readdir(absolutePath)
    const prototypes = []

    for (const item of items) {
      const itemPath = join(absolutePath, item)
      const itemStat = await stat(itemPath)

      if (itemStat.isDirectory()) {
        prototypes.push({
          name: item,
          path: itemPath,
          lastModified: itemStat.mtime,
          type: 'directory' as const,
        })
      }
    }

    // Sort by last modified date (newest first)
    prototypes.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

    return NextResponse.json({ prototypes })
  } catch (error) {
    console.error('Error loading prototypes:', error)
    return NextResponse.json(
      { error: 'Failed to load prototypes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

