import React from 'react';

interface Props {
  children?: React.ReactNode;
  size?: number;
  block?: boolean;
  paragraph?: boolean;
  strong?: boolean;
  underline?: boolean;
  delete?: boolean;
  mark?: boolean;
  code?: boolean;
  color?: string;
}

const Text = ({ children, size, block, paragraph, strong, underline, delete: del, mark, code, color }: Props) => {
  const Tag = block ? 'div' : paragraph ? 'p' : 'span';

  const fontStyle: React.CSSProperties = {
    fontWeight: strong ? 'bold' : undefined,
    fontSize: size,
    textDecoration: underline ? 'underline' : undefined,
    color: color,
  };

  if (mark) {
    children = <mark>{children}</mark>;
  }
  if (code) {
    children = <code>{children}</code>;
  }
  if (del) {
    children = <del>{children}</del>;
  }

  return <Tag style={fontStyle}>{children}</Tag>;
};

export default Text;
