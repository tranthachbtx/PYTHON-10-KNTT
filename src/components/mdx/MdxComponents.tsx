import { Alert } from "./Alert";
import { Quiz } from "./Quiz";
import { GlassCard } from "./GlassCard";
import { CodeBlock } from "./CodeBlock";
import { FlowChart } from "./FlowChart";
import { MotionH2, MotionH3, MotionTable } from "./MotionElements";
import {
    MDXP,
    MDXUl,
    MDXOl,
    MDXA,
    MDXThead,
    MDXTbody,
    MDXTr,
    MDXTh,
    MDXTd,
    MDXHr,
    MDXCode
} from "./ScientificTypography";
import { MDXPre } from "./MDXPre";

/**
 * 🛠️ DEEP SYSTEM AUDIT FIX (FINAL STAGE): Ultra-Stable Registry
 * To eliminate 'ReferenceError: k is not defined', we have:
 * 1. Moved all component logic into standalone files.
 * 2. Replaced all arrow functions with named 'export function' declarations.
 * 3. Simplified the registry to a direct mapping of stable imports.
 */

export const MdxComponents = {
    // Custom Scientific Components
    Alert: Alert,
    Quiz: Quiz,
    GlassCard: GlassCard,
    CodeBlock: CodeBlock,
    FlowChart: FlowChart,

    // Standard MDX Elements - Stable Mappings
    h2: MotionH2,
    h3: MotionH3,
    p: MDXP,
    ul: MDXUl,
    ol: MDXOl,
    a: MDXA,
    table: MotionTable,
    thead: MDXThead,
    tbody: MDXTbody,
    tr: MDXTr,
    th: MDXTh,
    td: MDXTd,
    hr: MDXHr,
    pre: MDXPre,
    code: MDXCode,
};
