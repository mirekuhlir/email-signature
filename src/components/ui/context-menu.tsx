import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  label?: string;
  items?: MenuItem[];
  placement?: 'left' | 'right';
  children?: React.ReactNode;
  el?: React.ElementType;
  buttonClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  label,
  items,
  placement = 'left',
  children,
  el,
  buttonClassName,
  size = 'md',
  isLoading = false,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuPortalRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = !!buttonRef.current?.contains(target);
      const clickedMenu = !!menuPortalRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 270) {
        setDirection('up');
      } else {
        setDirection('down');
      }
    }
  }, [isOpen]);

  // Compute fixed position for the portal menu
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const triggerEl = buttonRef.current;
      if (!triggerEl) return;

      const rect = triggerEl.getBoundingClientRect();
      const gap = 4;

      let computedTop = rect.bottom + gap;
      let computedLeft = rect.left;
      const minWidth = rect.width;

      const menuEl = menuPortalRef.current;
      const menuWidth = menuEl?.getBoundingClientRect().width ?? undefined;
      const menuHeight = menuEl?.getBoundingClientRect().height ?? undefined;

      if (direction === 'up' && typeof menuHeight === 'number') {
        computedTop = rect.top - menuHeight - gap;
      } else {
        computedTop = rect.bottom + gap;
      }

      if (placement === 'left' && typeof menuWidth === 'number') {
        computedLeft = rect.right - menuWidth;
      } else {
        computedLeft = rect.left;
      }

      // Clamp to viewport with small margins
      const margin = 8;
      const widthForClamp =
        typeof menuWidth === 'number' ? menuWidth : minWidth;
      computedLeft = Math.max(
        margin,
        Math.min(computedLeft, window.innerWidth - widthForClamp - margin),
      );
      computedTop = Math.max(
        margin,
        Math.min(computedTop, window.innerHeight - margin),
      );

      setDropdownStyle({ top: computedTop, left: computedLeft, minWidth });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, direction, placement]);

  // Function to handle child clicks
  const handleChildClick = (originalOnClick?: () => void) => {
    return () => {
      if (originalOnClick) {
        originalOnClick();
      }
      setIsOpen(false); // Close menu when child is clicked
    };
  };

  // Clone children and add onClick handlers
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childElement = child as React.ReactElement<{
        onClick?: () => void;
      }>;
      return React.cloneElement(childElement, {
        onClick: handleChildClick(childElement.props.onClick),
      });
    }
    return child;
  });

  const MenuContainer: React.ElementType = el || 'div';

  let buttonContent: React.ReactNode;
  if (isLoading) {
    buttonContent = <Loader2 className="h-4 w-4 animate-spin" />;
  } else if (label) {
    buttonContent = label;
  } else {
    buttonContent = '•••';
  }

  return (
    <div className="relative inline-block">
      <Button
        className={buttonClassName}
        size={size}
        variant="white"
        ref={buttonRef}
        disabled={isDisabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonContent}
      </Button>

      {isOpen &&
        createPortal(
          <MenuContainer
            ref={menuPortalRef as unknown as React.Ref<HTMLDivElement>}
            className="fixed z-50 rounded shadow-lg bg-white border border-gray-200"
            style={{
              top: dropdownStyle?.top ?? -9999,
              left: dropdownStyle?.left ?? -9999,
              minWidth: dropdownStyle?.minWidth,
              zIndex: 1000,
            }}
          >
            <div className="py-1">
              {children
                ? clonedChildren
                : items &&
                  items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden"
                    >
                      {item.label}
                    </button>
                  ))}
            </div>
          </MenuContainer>,
          document.body,
        )}
    </div>
  );
};
