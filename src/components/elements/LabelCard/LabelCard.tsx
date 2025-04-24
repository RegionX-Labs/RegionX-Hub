import React from 'react';
import styles from './LabelCard.module.scss';

interface ButtonProps {
  label: string;
  color?:
    | 'yellowDark'
    | 'greenDark'
    | 'orangeDark'
    | 'pinkDark'
    | 'cyan'
    | 'redDark'
    | 'purpleDark'
    | 'teal'
    | 'blueDark'
    | 'gray6'
    | 'dark5'
    | 'gray5'
    | 'greenPrimary';
  variant?: 'primary' | 'transparent';
  pillStyle?: boolean;
  textColor?: 'light' | 'dark';
}

const LabelCard: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  color = 'yellowDark',
  pillStyle = false,
  textColor = 'light',
}) => {
  return (
    <div
      className={`${styles.LabelCardWrapper} ${styles[textColor]} ${styles[variant]} ${variant === 'transparent' ? styles[color] : ''} ${pillStyle ? styles.pill : ''}`}
      style={{ '--label-color': `var(--${color})` } as React.CSSProperties}
    >
      {label}
    </div>
  );
};

export default LabelCard;
