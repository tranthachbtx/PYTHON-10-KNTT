import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content");

export interface Lesson {
    slug: string;
    subject: string;
    grade: string;
    frontmatter: {
        title: string;
        description: string;
        order: number;
        [key: string]: any;
    };
    content: string;
}

export function getAllLessons(subject: string = "informatics", grade: string = "grade-10"): Lesson[] {
    const lessonsDirectory = path.join(CONTENT_PATH, subject, grade);

    // Check if directory exists
    if (!fs.existsSync(lessonsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(lessonsDirectory);
    const allLessons = fileNames
        .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx?$/, "");
            const fullPath = path.join(lessonsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                subject,
                grade,
                frontmatter: data as Lesson["frontmatter"],
                content,
            };
        });

    // Sort lessons by order
    return allLessons.sort((a, b) => {
        return (a.frontmatter.order || 999) - (b.frontmatter.order || 999);
    });
}

export function getLessonBySlug(slug: string, subject: string = "informatics", grade: string = "grade-10"): Lesson | null {
    try {
        const lessonsDirectory = path.join(CONTENT_PATH, subject, grade);
        const fullPath = path.join(lessonsDirectory, `${slug}.mdx`);

        let realPath = "";
        if (fs.existsSync(fullPath)) {
            realPath = fullPath;
        } else {
            const mdPath = path.join(lessonsDirectory, `${slug}.md`);
            if (fs.existsSync(mdPath)) {
                realPath = mdPath;
            } else {
                return null;
            }
        }

        const fileContents = fs.readFileSync(realPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug,
            subject,
            grade,
            frontmatter: data as Lesson["frontmatter"],
            content,
        };
    } catch (error) {
        return null;
    }
}
export function getAllLessonsSimple(): Lesson[] {
    const subjects = fs.readdirSync(CONTENT_PATH);
    let allLessons: Lesson[] = [];

    subjects.forEach(subject => {
        const subjectPath = path.join(CONTENT_PATH, subject);
        if (fs.statSync(subjectPath).isDirectory()) {
            const grades = fs.readdirSync(subjectPath);
            grades.forEach(grade => {
                const gradePath = path.join(subjectPath, grade);
                if (fs.statSync(gradePath).isDirectory()) {
                    const lessons = getAllLessons(subject, grade);
                    allLessons = [...allLessons, ...lessons];
                }
            });
        }
    });

    return allLessons;
}
