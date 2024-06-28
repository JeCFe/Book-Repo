import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";

const head = cva("font-bold tracking-tight text-slate-700", {
  variants: {
    size: {
      medium: "text-lg",
      large: "text-2xl md:text-4xl",
    },
    theme: {
      light: "text-slate-700",
      dark: "text-slate-500",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "light",
  },
});

const body = cva("", {
  variants: {
    size: {
      medium: "text-sm",
      large: "md:text-2xl text-lg",
    },
    theme: {
      light: "text-slate-900",
      dark: "text-slate-200",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "light",
  },
});

export function RenderSection({
  title,
  children,
  size,
  theme,
}: {
  title: string;
  children: ReactNode;
} & VariantProps<typeof head> &
  VariantProps<typeof body>) {
  return (
    <div className="flex flex-col">
      <h4 className={head({ size, theme })}>{title}</h4>
      <div className={body({ size, theme })}>{children}</div>
    </div>
  );
}
