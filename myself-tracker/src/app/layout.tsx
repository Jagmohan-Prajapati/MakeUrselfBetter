import "./globals.css";

export const metadata = {
  title: "MakeUrselfBetter",
  description: "Personal serverless tracker for you and your friends"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}