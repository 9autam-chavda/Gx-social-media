import { icons } from './iconMap';

const iconSizes = {
  tiny: 14,
  meta: 16,
  inline: 18,
  button: 20,
  nav: 24,
};

const Icon = ({ name, size = iconSizes.inline, className = '', strokeWidth = 2, ...props }) => {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return <IconComponent aria-hidden="true" focusable="false" size={size} strokeWidth={strokeWidth} className={className} {...props} />;
};

export default Icon;
