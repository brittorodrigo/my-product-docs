import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import matter from 'gray-matter'

export async function POST(request: NextRequest) {
  try {
    const { filePath, updates } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Read the current file
    const content = await readFile(filePath, 'utf-8')
    const parsed = matter(content)

    // Update frontmatter with new values
    const updatedFrontmatter = {
      ...parsed.data,
      ...updates,
    }

    // Stringify the updated content with frontmatter
    const updatedContent = matter.stringify(parsed.content, updatedFrontmatter)

    // Write back to file
    await writeFile(filePath, updatedContent, 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'PRD updated successfully',
      updates: updatedFrontmatter
    })
  } catch (error) {
    console.error('Error updating PRD:', error)
    return NextResponse.json(
      { error: 'Failed to update PRD', details: (error as Error).message },
      { status: 500 }
    )
  }
}

