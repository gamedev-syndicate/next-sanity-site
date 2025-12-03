export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override all parent layout styling for Sanity Studio
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        background: 'white',
        zIndex: 9999,
        overflow: 'auto'
      }}
    >
      {children}
    </div>
  )
}
