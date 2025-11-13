import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Try to get git history for this file
    try {
      // Get git log for the file
      const { stdout } = await execAsync(
        `git log --follow --format="%H|%ai" -- "${filePath}"`,
        { cwd: process.cwd() }
      )

      if (!stdout.trim()) {
        return NextResponse.json({ versions: [] })
      }

      const commits = stdout.trim().split('\n')
      const versions = []

      for (const commit of commits.slice(0, 10)) { // Limit to last 10 versions
        const [hash, date] = commit.split('|')
        
        try {
          // Get file content at this commit
          const { stdout: content } = await execAsync(
            `git show ${hash}:"${filePath.replace(process.cwd() + '/', '')}"`,
            { cwd: process.cwd() }
          )

          // Try to extract version from frontmatter if it exists
          const versionMatch = content.match(/^---\s*\n[\s\S]*?version:\s*['"]?([^\n'"]+)['"]?\s*\n[\s\S]*?---/)
          const version = versionMatch ? versionMatch[1] : undefined

          versions.push({
            date: new Date(date),
            content: content,
            version: version,
          })
        } catch (err) {
          console.error(`Error getting content for commit ${hash}:`, err)
        }
      }

      return NextResponse.json({ versions })
    } catch (gitError) {
      // If git fails (e.g., not a git repo), return empty version history
      console.log('Git history not available:', gitError)
      return NextResponse.json({ versions: [] })
    }
  } catch (error) {
    console.error('Error fetching version history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version history', details: (error as Error).message },
      { status: 500 }
    )
  }
}

