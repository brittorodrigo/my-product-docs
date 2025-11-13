import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, readdir } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

export async function POST(request: NextRequest) {
  try {
    const { folderPath, action, oldTag, newTag } = await request.json()

    if (!folderPath || !action) {
      return NextResponse.json(
        { error: 'Folder path and action are required' },
        { status: 400 }
      )
    }

    // Resolve relative to project root
    const projectRoot = process.cwd()
    const absolutePath = folderPath.startsWith('/') ? folderPath : join(projectRoot, folderPath)

    const files = await readdir(absolutePath)
    let updatedCount = 0

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const filePath = join(absolutePath, file)
      const content = await readFile(filePath, 'utf-8')
      const parsed = matter(content)

      let tags = parsed.data.tags || []
      let modified = false

      if (action === 'rename' && oldTag && newTag) {
        // Rename tag
        if (tags.includes(oldTag)) {
          tags = tags.map((tag: string) => tag === oldTag ? newTag : tag)
          modified = true
        }
      } else if (action === 'delete' && oldTag) {
        // Delete tag
        if (tags.includes(oldTag)) {
          tags = tags.filter((tag: string) => tag !== oldTag)
          modified = true
        }
      }

      if (modified) {
        // Update frontmatter
        const updatedFrontmatter = {
          ...parsed.data,
          tags: tags,
        }

        // Write back to file
        const updatedContent = matter.stringify(parsed.content, updatedFrontmatter)
        await writeFile(filePath, updatedContent, 'utf-8')
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} PRD(s)`,
      updatedCount,
    })
  } catch (error) {
    console.error('Error bulk updating PRDs:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update PRDs', details: (error as Error).message },
      { status: 500 }
    )
  }
}

