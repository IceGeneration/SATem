"use client"

import type React from "react"

interface RichTextParserProps {
  content: string
}

export default function RichTextParser({ content }: RichTextParserProps) {
  const parseContent = (text: string) => {
    // Split by lines to process each line
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []

    lines.forEach((line, index) => {
      const processedLine = line

      // Process headers
      if (processedLine.startsWith("# ")) {
        const headerText = processedLine.substring(2)
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-blue-800 mb-4 mt-6">
            {parseInlineFormatting(headerText)}
          </h1>,
        )
        return
      }

      if (processedLine.startsWith("## ")) {
        const headerText = processedLine.substring(3)
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-blue-700 mb-3 mt-5">
            {parseInlineFormatting(headerText)}
          </h2>,
        )
        return
      }

      if (processedLine.startsWith("### ")) {
        const headerText = processedLine.substring(4)
        elements.push(
          <h3 key={index} className="text-xl font-bold text-blue-600 mb-2 mt-4">
            {parseInlineFormatting(headerText)}
          </h3>,
        )
        return
      }

      // Process regular paragraphs
      if (processedLine.trim()) {
        elements.push(
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {parseInlineFormatting(processedLine)}
          </p>,
        )
      } else {
        // Empty line creates spacing
        elements.push(<br key={index} />)
      }
    })

    return elements
  }

  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let partIndex = 0

    // Process bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    let boldMatch

    // Process rich text [[content]]
    const richTextRegex = /\[\[(.*?)\]\]/g
    let richMatch

    // Collect all matches with their positions
    const matches: Array<{ start: number; end: number; type: "bold" | "rich"; content: string }> = []

    // Find bold matches
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      matches.push({
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        type: "bold",
        content: boldMatch[1],
      })
    }

    // Find rich text matches
    while ((richMatch = richTextRegex.exec(text)) !== null) {
      matches.push({
        start: richMatch.index,
        end: richMatch.index + richMatch[0].length,
        type: "rich",
        content: richMatch[1],
      })
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Process text with matches
    matches.forEach((match) => {
      // Add text before match
      if (currentIndex < match.start) {
        parts.push(<span key={partIndex++}>{text.substring(currentIndex, match.start)}</span>)
      }

      // Add formatted match
      if (match.type === "bold") {
        parts.push(
          <strong key={partIndex++} className="font-bold text-gray-900">
            {match.content}
          </strong>,
        )
      } else if (match.type === "rich") {
        // Parse HTML content in rich text
        parts.push(<span key={partIndex++} dangerouslySetInnerHTML={{ __html: match.content }} />)
      }

      currentIndex = match.end
    })

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(<span key={partIndex++}>{text.substring(currentIndex)}</span>)
    }

    return parts.length > 0 ? parts : [text]
  }

  return <div className="prose max-w-none">{parseContent(content)}</div>
}
