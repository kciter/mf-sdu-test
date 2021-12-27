import React from 'react';

interface Props {
  src?: string;
  alt?: string;
  size?: number;
}

const Image = ({ src, alt, size }: Props) => {
  return <img src={src} alt={alt} style={{ width: size, height: size }} />;
};

export default Image;
