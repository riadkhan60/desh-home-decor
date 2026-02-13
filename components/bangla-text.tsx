'use client';

import * as React from 'react';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

function isBanglaText(text: string): boolean {
  // Bengali and related range: \u0980 - \u09FF
  return /[\u0980-\u09FF]/.test(text);
}

type BanglaTextProps<T extends ElementType = 'span'> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function BanglaText<T extends ElementType = 'span'>(props: BanglaTextProps<T>) {
  const { as, className, children, ...rest } = props;
  const Tag = (as || 'span') as ElementType;

  const plain =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
        ? children.filter((c) => typeof c === 'string').join(' ')
        : '';

  const useBanglaFont = plain && isBanglaText(plain);

  return (
    <Tag
      className={cn(useBanglaFont && 'font-bengali', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export { isBanglaText };

