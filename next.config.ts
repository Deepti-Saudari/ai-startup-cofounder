@"
"use client"

export default function AICoFounder() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test</h1>
      <p className="text-gray-600">If this works, className is working</p>
    </div>
  )
}
"@ | Out-File -FilePath "components\ai-cofounder.tsx" -Encoding UTF8