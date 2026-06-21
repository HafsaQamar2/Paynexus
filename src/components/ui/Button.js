const variants = {
  primary: "bg-navy text-white hover:bg-navy-600 disabled:bg-navy-400",
  outline: "bg-white text-navy border border-border hover:bg-surface",
  ghost: "bg-transparent text-navy hover:bg-navy-50",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
