export const metadata = {
  title: 'Chirobot',
  description: 'Alleviate immediate discomfort and connect with the best chiropractor in your area.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}