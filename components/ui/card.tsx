export const Card = ({
  children,
  className,
  size,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <div
      className={`card w-full bg-base-100 card-${size} shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};
