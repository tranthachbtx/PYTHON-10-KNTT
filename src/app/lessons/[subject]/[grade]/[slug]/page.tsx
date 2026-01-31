import { getLessonBySlug, getAllLessons } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { MdxComponents } from "@/components/mdx/MdxComponents";
import { ContentPanel } from "@/components/layout/ContentPanel";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

interface LessonPageProps {
    params: Promise<{
        subject: string;
        grade: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const subjects = ["informatics", "experiential"];
    const grades = ["grade-10", "grade-11", "grade-12"];

    const allParams = [];

    for (const subject of subjects) {
        for (const grade of grades) {
            const lessons = getAllLessons(subject, grade);
            for (const lesson of lessons) {
                allParams.push({
                    subject,
                    grade,
                    slug: lesson.slug,
                });
            }
        }
    }

    return allParams;
}

export async function generateMetadata({ params }: LessonPageProps) {
    const { subject, grade, slug } = await params;
    const lesson = getLessonBySlug(slug, subject, grade);

    if (!lesson) {
        return {
            title: "Lesson Not Found",
        };
    }

    const subjectLabel = subject === "informatics" ? "Tin học" : "HĐ Trải nghiệm";
    const gradeLabel = grade.replace("grade-", "Lớp ");

    return {
        title: `${lesson.frontmatter.title} | ${subjectLabel} ${gradeLabel}`,
        description: lesson.frontmatter.description,
    };
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { subject, grade, slug } = await params;
    const lesson = getLessonBySlug(slug, subject, grade);

    if (!lesson) {
        notFound();
    }

    return (

        <div className="relative min-h-screen py-12 md:py-20 px-4 md:px-8">
            <ContentPanel />

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            {/* Header Section - Compact */}
            <div className="relative z-10 mb-10 text-center xl:mr-80">
                <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary font-black text-sm mb-4 uppercase tracking-widest border border-primary/20">
                    Bài {lesson.frontmatter.order}
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black mb-6 !leading-tight text-slate-950">
                    {lesson.frontmatter.title.split(':')[1]?.trim() || lesson.frontmatter.title}
                </h1>
                <p className="text-xl text-slate-700 mx-auto leading-relaxed font-medium opacity-80 italic max-w-3xl">
                    {lesson.frontmatter.description}
                </p>
            </div>

            {/* Content Container - Full Width Expansion */}
            <article className="relative z-10 mx-auto max-w-5xl bg-white rounded-[3rem] p-6 md:p-12 border-2 border-slate-100 shadow-float min-h-screen xl:mr-80">
                <div className="prose prose-xl dark:prose-invert max-w-none 
                    prose-headings:font-display prose-headings:font-black prose-headings:scroll-mt-24
                    prose-p:text-slate-900 prose-p:leading-relaxed
                    prose-li:text-slate-900 prose-li:leading-relaxed
                    prose-strong:text-black prose-strong:font-black
                    prose-img:rounded-[3rem] prose-img:shadow-float prose-img:border-8 prose-img:border-white/50
                ">
                    <MDXRemote
                        source={lesson.content}
                        components={MdxComponents}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [rehypeHighlight, rehypeSlug],
                            }
                        }}
                    />
                </div>
            </article>

            {/* Footer Navigation or similar could go here */}
            <div className="mt-20 text-center relative z-10 xl:mr-80">
                <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full mb-8" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Chúc mừng bạn đã hoàn thành bài học này! 🏆
                </p>
            </div>
        </div>
    );
}
