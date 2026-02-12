export interface CtaData {
  id: number;
  text: string;
  target?: string;
  type: 'button' | 'link';
  href?: string | null;
  styles: 'filled' | 'outlined';
  size: 'small' | 'medium' | 'large';
  bgColor?: string;
  iconName?: string | null;
  iconPosition?: 'leading' | 'trailing';
}






