export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AnimatedIconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

export interface AnimatedIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}
