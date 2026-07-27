// Minimal root layout — frontend is static HTML in /public/pages/
// This layout only exists for the API routes to work
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
