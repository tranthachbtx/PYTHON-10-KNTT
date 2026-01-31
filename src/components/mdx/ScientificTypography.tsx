import React from "react";
import { cn } from "@/lib/utils";

export function MDXP(props: any) {
    const { children } = props;

    // Check if children contain a summary tag to avoid invalid HTML nesting (p > summary)
    const isSummary = React.Children.toArray(children).some(
        (child: any) =>
            child && (
                child.type === "summary" ||
                child.type === "details" || // Safety for details too
                (child.props && (child.props.mdxType === "summary" || child.props.originalType === "summary"))
            )
    );

    if (isSummary) {
        return <>{children}</>;
    }

    return (
        <p className="text-lg leading-relaxed [&:not(:first-child)]:mt-4 text-slate-950 font-medium" {...props} />
    );
}

export function MDXUl(props: any) {
    return (
        <ul className="my-4 ml-8 list-disc text-slate-950 font-medium space-y-1 text-lg" {...props} />
    );
}

export function MDXOl(props: any) {
    return (
        <ol className="my-4 ml-8 list-decimal text-slate-950 font-medium space-y-1 text-lg" {...props} />
    );
}

export function MDXA(props: any) {
    return (
        <a className="font-black text-primary hover:text-secondary underline decoration-4 underline-offset-4 transition-all" {...props} />
    );
}

export function MDXThead(props: any) {
    return (
        <thead className="bg-slate-950 text-white uppercase font-black text-sm" {...props} />
    );
}

export function MDXTbody(props: any) {
    return (
        <tbody className="divide-y-2 divide-black/5 text-slate-900 font-bold" {...props} />
    );
}

export function MDXTr(props: any) {
    return (
        <tr className="hover:bg-primary/5 transition-colors" {...props} />
    );
}

export function MDXTh(props: any) {
    return (
        <th className="px-6 py-4" {...props} />
    );
}

export function MDXTd(props: any) {
    return (
        <td className="px-6 py-4 border-r border-black/5 last:border-0" {...props} />
    );
}

export function MDXHr(props: any) {
    return (
        <hr className="my-10 border-t-4 border-black/5 rounded-full w-1/4 mx-auto" {...props} />
    );
}

export function MDXCode(props: any) {
    const isInline = !props.className;
    if (isInline) {
        return (
            <code className="bg-primary/10 px-2 py-0.5 rounded-lg text-[0.9em] font-black text-primary border border-primary/20" {...props} />
        );
    }
    return <code className="font-mono !bg-transparent !p-0" {...props} />;
}
