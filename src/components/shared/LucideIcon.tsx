import React from 'react';
import * as Icons from 'lucide-react';

const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

interface LucideIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, size = 16, className = "", color, style, strokeWidth = 2.5 }) => {
    if (!name) return null;
    const pascalName = kebabToPascal(name);
    // @ts-ignore
    const IconComponent = Icons[pascalName] || Icons[`${pascalName}Icon`] || Icons.CircleHelp;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};
