export const PrimaryButton = ({
  children,
  className,
  size,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) => {
  return (
    <button
      className={`btn btn-primary text-primary-content ${className} ${size ? `btn-${size}` : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  children,
  className,
  size,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) => {
  return (
    <button
      className={`btn btn-secondary text-secondary-content ${className} ${size ? `btn-${size}` : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const OutlineButton = ({
  children,
  className,
  size,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) => {
  return (
    <button
      className={`btn btn-outline rounded-full text-primary-content ${className} ${
        size ? `btn-${size}` : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
