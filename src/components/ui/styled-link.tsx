import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { baseStyles, variants as buttonVariants, sizes } from './button';

interface StyledLinkProps {
  href: string;
  children: ReactNode;
  variant?:
    | 'button-blue'
    | 'button-brand-blue'
    | 'button-orange'
    | 'button-red'
    | 'button-black'
    | 'button-gray'
    | 'button-outline'
    | 'button-ghost'
    | 'button-link'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'underline'
    | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  prefetch?: boolean;
}

const StyledLink: FC<StyledLinkProps> = ({
  href,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  /*   prefetch = false, */
}) => {
  const variants = {
    'button-blue': buttonVariants.blue,
    'button-brand-blue': buttonVariants.brandBlue,
    'button-orange': buttonVariants.orange,
    'button-red': buttonVariants.red,
    'button-black': buttonVariants.black,
    'button-gray': buttonVariants.gray,
    'button-outline': buttonVariants.outline,
    'button-ghost': buttonVariants.ghost,
    'button-link': buttonVariants.link,
    default: 'text-gray-900 hover:text-gray-600 text-lg font-medium',
    primary: 'text-blue-600 hover:text-blue-800 font-medium',
    secondary: 'text-gray-500 hover:text-gray-700 text-sm',
    underline:
      'text-gray-700 hover:text-gray-900 border-b-1 border-gray-600 hover:border-gray-900',
    none: '',
  };

  const variantStyles = variants[variant];
  const sizeStyles = variant.startsWith('button-') ? sizes[size] : '';

  return (
    <Link
      href={href}
      /*    link preload warning  */
      /*      prefetch={prefetch} */
      className={`${variant.startsWith('button-') ? baseStyles : ''} ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
