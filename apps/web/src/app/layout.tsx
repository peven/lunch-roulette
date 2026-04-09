export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 20 }}>
        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <a href="/">Home</a>
          <a href="/restaurants">Restaurants</a>
          <a href="/roulette">Roulette</a>
          <a href="/intentions">Intentions</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
