import React, { useCallback, useEffect, useRef, useState } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  className?: string;
  children: (item: T) => React.ReactNode;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  overscan = 3,
  className,
  children,
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = Math.ceil(items.length / 3) * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) * 3 - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) * 3 + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const getGridPosition = (index: number) => {
    const adjustedIndex = index + startIndex;
    const row = Math.floor(adjustedIndex / 3);
    return row * itemHeight;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ 
        position: 'relative',
        overflowY: 'auto',
        height: 'calc(100vh - 16rem)',
        scrollBehavior: 'smooth'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div className={className}>
          {visibleItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                position: 'absolute',
                top: getGridPosition(index),
                left: `${(index + startIndex) % 3 * 33.333}%`,
                width: '33.333%',
                padding: '0 0.75rem'
              }}
            >
              {children(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}