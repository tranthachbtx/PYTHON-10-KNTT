import React from "react";
import { CodeBlock } from "./CodeBlock";

export function MDXPre(props: any) {
    const codeElement = props.children;
    const className = codeElement?.props?.className || "";
    const language = className.split(' ').find((c: string) => c.startsWith('language-'))?.replace('language-', '') || 'python';

    // We return the CodeBlock component directly with children
    return <CodeBlock language={language}>{codeElement}</CodeBlock>;
}
