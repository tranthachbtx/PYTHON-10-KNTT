import { getAllLessons } from "@/lib/mdx";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import SubjectGradePortal from "@/components/home/SubjectGradePortal";

export default function Home() {
  const subjects = ["informatics", "experiential"];
  const grades = ["grade-10", "grade-11", "grade-12"];

  // Flatten all lessons into one array
  const allLessons = subjects.flatMap(subject =>
    grades.flatMap(grade => getAllLessons(subject, grade))
  );

  // Default lesson for the hero button
  const defaultLessons = getAllLessons("informatics", "grade-10");

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass mb-8 text-sm font-black text-primary animate-fade-in border border-primary/20 shadow-lg shadow-primary/5">
          <Star size={16} className="fill-primary" />
          <span className="uppercase tracking-widest">Học tập đa phương thức</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-display font-black mb-8 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-500 bg-clip-text text-transparent leading-[1.1] md:leading-[1.1]">
          Kiến thức trong tầm tay<br />
          <span className="text-primary relative inline-block">
            Mọi lúc, mọi nơi
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/10 rounded-full -rotate-1" />
          </span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Hệ thống học liệu tương tác dành cho học sinh THPT theo chương trình
          <span className="text-slate-900 font-black px-2">Kết nối tri thức</span>.
          Khám phá tri thức qua trải nghiệm số đỉnh cao.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href={`/lessons/${defaultLessons[0]?.subject}/${defaultLessons[0]?.grade}/${defaultLessons[0]?.slug}`} className="px-10 py-5 rounded-[2rem] bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 text-lg group">
            Bắt đầu học ngay
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#lessons" className="px-10 py-5 rounded-[2rem] glass hover:bg-white/80 transition-all font-black text-slate-700 flex items-center justify-center gap-2 text-lg border-2 border-white/50 shadow-xl shadow-slate-200/50">
            Khám phá lộ trình
          </a>
        </div>
      </section>

      {/* Subject & Grade Portal */}
      <SubjectGradePortal initialLessons={allLessons} />
    </div>
  );
}
