import { parseDocument } from 'htmlparser2'
import React, { useMemo } from 'react'

export type ReactHtmlComponents = Record<string, React.FC<any>>

const RenderSection: React.FC<any> = ({ Components, data, name, attribs, children, type }) => {
  if (type === 'text') return data
  if (type !== 'tag') return null
  const attr = (() => {
    const attributes = { ...attribs, className: (attribs as any)?.class }
    delete attributes.class
    return attributes
  })()
  const Tag = (Components || {})[name] || name

  if (!children || (children.length === 0 && !data)) return <Tag {...attr} />
  return (
    <Tag {...attr}>
      {data ||
        children.map((p: any, index: number) => (
          <RenderSection key={p.endIndex || `tag-${index}`} {...p} />
        ))}
    </Tag>
  )
}

export const ReactHtml: React.FC<{
  html: string
  Components?: ReactHtmlComponents
}> = React.memo(({ html, Components }) => {
  const parsed = useMemo(() => {
    if (!html) return undefined
    return parseDocument(html)
  }, [html])

  if (!parsed || parsed.children.length === 0) return null
  return (
    <>
      {parsed.children.map((p, index) => (
        <RenderSection key={p.endIndex || `tag-${index}`} {...p} Components={Components} />
      ))}
    </>
  )
})
