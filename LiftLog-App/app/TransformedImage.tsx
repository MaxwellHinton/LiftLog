import React from 'react';
import { Image, ImageStyle, ImageResizeMode } from 'react-native';

interface TransformedImageProps {
  source: any;
  style?: ImageStyle;
  mode?: ImageResizeMode;
}

const TransformedImage: React.FC<TransformedImageProps> = ({ source, style, mode }) => {
  return <Image source={source} style={style} resizeMode={mode}/>;
};

export default TransformedImage;