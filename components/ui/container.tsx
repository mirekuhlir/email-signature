interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-0">{children}</div>
  );
};
