import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  RefObject,
} from 'react';

interface AutoScaleContainerProps {
  children: ReactNode;
  margin?: number; // Total margin to subtract from available width
  minScale?: number; // Minimum scale factor
  dependencies?: React.DependencyList; // Additional dependencies to trigger scale recalculation
  className?: string;
  style?: React.CSSProperties;
  containerRef?: RefObject<HTMLElement | null>; // Optional external container ref to measure width from
  isActive?: boolean;
}

export const AutoScaleContainer: React.FC<AutoScaleContainerProps> = ({
  children,
  margin = 32,
  minScale = 0.1,
  dependencies = [],
  className = '',
  style = {},
  containerRef: externalContainerRef,
  isActive = false,
}) => {
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Use external containerRef if provided, otherwise use internal one
  const containerRef = externalContainerRef || internalContainerRef;

  // Calculate scale based on container and content width
  const calculateScale = () => {
    if (!containerRef.current || !contentRef.current || !isActive) return;

    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentRef.current.scrollWidth;
    const availableWidth = containerWidth - margin;

    if (contentWidth > availableWidth) {
      const newScale = availableWidth / contentWidth;
      setScale(Math.max(newScale, minScale));
    } else {
      setScale(1);
    }
  };

  // Effect to calculate scale on mount and when dependencies change
  useEffect(() => {
    if (isActive) {
      // Add a small delay to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        calculateScale();
      }, 10);
      return () => clearTimeout(timeoutId);
    } else {
      setScale(1);
    }
  }, [margin, minScale, isActive, ...dependencies]);

  // ResizeObserver to recalculate scale when window resizes
  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !isActive) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isActive, containerRef, contentRef]);

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div
      ref={externalContainerRef ? undefined : internalContainerRef}
      className={className}
      style={style}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'bottom left',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoScaleContainer;
