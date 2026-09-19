interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export function Shield({ size = 22, color = "currentColor", className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shield-mark ${className ?? ""}`}
      aria-hidden="true"
    >
      <path
        d="M12 2.5L20 6V11.5C20 16.2 16.9 20 12 21.5C7.1 20 4 16.2 4 11.5V6L12 2.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
