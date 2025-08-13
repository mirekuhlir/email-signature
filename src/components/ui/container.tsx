interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  isZeroPadding?: boolean;
}

export const Container = ({
  children,
  className = '',
  isZeroPadding,
}: ContainerProps) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto ${isZeroPadding ? '' : 'px-4 lg:px-0'} ${className}`}
    >
      {children}
    </div>
  );
};
