import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { path: prototypePath } = await request.json()

    if (!prototypePath) {
      return NextResponse.json(
        { error: 'Prototype path is required' },
        { status: 400 }
      )
    }

    const stats = await stat(prototypePath)

    if (!stats.isDirectory()) {
      return NextResponse.json(
        { error: 'Path is not a directory' },
        { status: 400 }
      )
    }

    // Check for common prototype files
    const files = await readdir(prototypePath)
    const htmlFiles = files.filter(f => f.endsWith('.html'))
    const indexHtml = htmlFiles.find(f => f.toLowerCase() === 'index.html')
    const firstHtml = htmlFiles[0]

    // Check for URL/link file
    const urlFile = files.find(f => f.toLowerCase() === 'url.txt' || f.toLowerCase() === 'link.txt')

    if (urlFile) {
      try {
        const urlContent = await readFile(join(prototypePath, urlFile), 'utf-8')
        const url = urlContent.trim()
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return NextResponse.json({ url })
        }
      } catch (error) {
        console.error('Error reading URL file:', error)
      }
    }

    // If HTML file exists, serve it through our API
    if (indexHtml || firstHtml) {
      const htmlFile = indexHtml || firstHtml
      // Return the path so the client can fetch it through our serve endpoint
      return NextResponse.json({ 
        path: join(prototypePath, htmlFile),
        type: 'local-html',
        fileName: htmlFile
      })
    }

    // If no HTML found, return error
    return NextResponse.json(
      { error: 'No HTML file or URL found in prototype directory' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error opening prototype:', error)
    return NextResponse.json(
      { error: 'Failed to open prototype', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

