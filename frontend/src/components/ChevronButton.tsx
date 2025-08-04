import { Action } from './Action';

export const ChevronButton = ({
  collapsed,
  onToggle,
  direction = 'none',
}: {
  collapsed: boolean;
  onToggle: () => void;
  direction?: 'left' | 'right' | 'none';
}) => {
  if (direction === 'none') {
    return (
      <Action
        icon="ChevronRight"
        iconOff="ChevronLeft"
        isOn={!collapsed}
        onClick={onToggle}
        variant="subtle"
        size="sm"
        radius="md"
      />
    );
  }

  const icon = direction === 'left' ? 'ChevronLeft' : 'ChevronRight';
  const iconOff = direction === 'left' ? 'ChevronRight' : 'ChevronLeft';
  return (
    <Action
      icon={icon}
      iconOff={iconOff}
      isOn={!collapsed}
      onClick={onToggle}
      variant="subtle"
      size="sm"
      radius="md"
    />
  );
};
