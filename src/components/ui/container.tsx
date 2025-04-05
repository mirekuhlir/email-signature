interface ContainerProps {
  children: React.ReactNode;
  isZeroPadding?: boolean;
}

export const Container = ({ children, isZeroPadding }: ContainerProps) => {
  return (
    <div
      className={`w-full max-w-4xl mx-auto ${isZeroPadding ? '' : 'px-4 lg:px-0'}`}
    >
      {children}
    </div>
  );
};
