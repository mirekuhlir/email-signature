interface HrProps {
  className?: string;
}

export const Hr = ({ className }: HrProps) => {
  return <hr className={`border-gray-300 w-full ${className}`} />;
};
