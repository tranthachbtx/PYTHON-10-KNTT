import fs from "fs";
import path from "path";
import matter from "gray-matter";

const lessonsDirectory = path.join(process.cwd(), "content/lessons");

export interface Lesson {
    slug: string;
    frontmatter: {
        title: string;
        description: string;
        order: number;
        [key: string]: any;
    };
    content: string;
}

export function getAllLessons(): Lesson[] {
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
                frontmatter: data as Lesson["frontmatter"],
                content,
            };
        });

    // Sort lessons by order
    return allLessons.sort((a, b) => {
        return (a.frontmatter.order || 999) - (b.frontmatter.order || 999);
    });
}

export function getLessonBySlug(slug: string): Lesson | null {
    try {
        const fullPath = path.join(lessonsDirectory, `${slug}.mdx`);
        if (!fs.existsSync(fullPath)) {
            // Try .md
            const mdPath = path.join(lessonsDirectory, `${slug}.md`);
            if (!fs.existsSync(mdPath)) return null;
        }

        // We prefer .mdx so checking it first
        const realPath = fs.existsSync(fullPath) ? fullPath : path.join(lessonsDirectory, `${slug}.md`);

        const fileContents = fs.readFileSync(realPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug,
            frontmatter: data as Lesson["frontmatter"],
            content,
        };
    } catch (error) {
        return null;
    }
}
