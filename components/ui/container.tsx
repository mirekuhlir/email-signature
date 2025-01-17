interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-0">{children}</div>
  );
};
