import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { getAllLessonsSimple } from "@/lib/mdx";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { TeacherToggle } from "@/components/ui/TeacherToggle";

export const metadata: Metadata = {
  title: "Python 10 KNTT - Học lập trình thật vui!",
  description:
    "Trang web hỗ trợ học tập môn Tin học 10 - Ngôn ngữ lập trình Python (Sách KNTT)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get all lessons for navigation
  const lessons = getAllLessonsSimple().map((l) => ({
    slug: l.slug,
    subject: l.subject,
    grade: l.grade,
    title: l.frontmatter.title,
    order: l.frontmatter.order,
  }));

  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className="antialiased pb-0 bg-background selection:bg-primary/20 transition-[padding] duration-300"
        suppressHydrationWarning
      >
        <SettingsProvider>
          {/* Background Blobs for Pastel feel */}
          <div className="fixed inset-0 overflow-hidden -z-10 bg-[radial-gradient(#0ea5e910_1.5px,transparent_1.5px)] [background-size:24px_24px]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
          </div>

          <CustomCursor />
          <Navigation lessons={lessons} />
          <main className="min-h-screen px-4 pt-6 md:px-8 md:pt-8 max-w-none">
            {children}
          </main>
        </SettingsProvider>
      </body>
    </html>
  );
}
