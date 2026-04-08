// src/app/apply-association/layout.tsx

export default function AssociationLayout({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      // ❌ REMOVE <html> and <body> tags here
      // ✅ Just use a div or a Fragment to wrap your UI
      <div className="min-h-screen bg-[#050805]">
        {/* Your public-facing navigation */}
        
  
        <main>
          {children}
        </main>
      </div>
    )
  }