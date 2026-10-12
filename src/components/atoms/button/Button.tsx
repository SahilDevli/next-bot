"use client";

import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "icon" | "chip";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

/* Shared button. `primary` is the send/enter key in the typing bar,
   `icon` the header controls, `chip` the suggestion pills. */
export default function Button({
  variant = "primary",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.base, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...rest} />;
}
