import React from "react";

type HeadlineType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type VariantType =
  | HeadlineType
  | "lead"
  | "large"
  | "body"
  | "small"
  | "tiny"
  | "labelBase";

type WeightType =
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "fontBlack";

const joinClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

const variantStyles: Record<VariantType, string> = {
  h1: "text-5xl font-bold tracking-tight",
  h2: "text-4xl font-semibold tracking-tight",
  h3: "text-3xl font-medium",
  h4: "text-2xl font-medium",
  h5: "text-xl font-medium",
  h6: "text-lg font-medium",
  lead: "text-xl font-normal leading-relaxed",
  large: "text-lg",
  body: "text-base",
  small: "text-sm",
  tiny: "text-xs",
  labelBase: "block text-base font-medium text-gray-600",
};

const weightStyles: Record<WeightType, string> = {
  thin: "font-thin",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  fontBlack: "font-black",
};

type TypographyProps = {
  id?: string;
  variant?: VariantType;
  weight?: WeightType;
  textColor?: string;
  italic?: boolean;
  underline?: boolean;
  linethrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  children: React.ReactNode;
  className?: string;
};

export const Typography = ({
  id,
  variant = "body",
  weight,
  textColor = "text-black",
  italic = false,
  underline = false,
  linethrough = false,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  className,
  children,
}: TypographyProps) => {
  let Component: React.ElementType;

  if (variant === "labelBase") {
    Component = "label";
  } else if (variant.startsWith("h")) {
    Component = variant as HeadlineType;
  } else {
    Component = "p";
  }

  const classes = joinClasses(
    variantStyles[variant],
    weight && weightStyles[weight],
    textColor,
    italic && "italic",
    underline && "underline",
    linethrough && "line-through",
    uppercase && "uppercase",
    lowercase && "lowercase",
    capitalize && "capitalize",
    className,
  );

  return (
    <Component id={id} className={classes}>
      {children}
    </Component>
  );
};
