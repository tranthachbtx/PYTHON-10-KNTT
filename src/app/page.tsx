import { getAllLessons } from "@/lib/mdx";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  const lessons = getAllLessons();

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-medium text-primary animate-fade-in">
          <Star size={16} className="fill-primary" />
          <span>Học Python thật dễ dàng</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Chinh phục Python 10<br />
          <span className="text-primary">Kết nối tri thức</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Khám phá thế giới lập trình với giáo trình tương tác, thiết kế đẹp mắt và bài tập thực hành thú vị. Học mọi lúc, mọi nơi!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/lessons/${lessons[0]?.slug}`} className="px-8 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all flex items-center justify-center gap-2">
            Bắt đầu học ngay
            <ArrowRight size={20} />
          </Link>
          <a href="#lessons" className="px-8 py-4 rounded-full glass hover:bg-white/50 transition-all font-medium flex items-center justify-center gap-2">
            Xem danh sách bài
          </a>
        </div>
      </section>


      {/* Lessons List */}
      <section id="lessons" className="space-y-6">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="group glass p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {lesson.frontmatter.order}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Bài học
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {lesson.frontmatter.title.split(':')[1] || lesson.frontmatter.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                {lesson.frontmatter.description}
              </p>

              <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                Học bài này <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
