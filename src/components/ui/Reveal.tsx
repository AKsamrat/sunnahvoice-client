import { useRef, type FC, type ReactNode } from "react";
import { useInView } from "../../hooks";


interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

const Reveal: FC<RevealProps> = ({
    children,
    className = "",
    delay = 0,
    direction = "up",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref as React.RefObject<HTMLElement | null>);

    const transforms: Record<string, string> = {
        up: inView ? "translateY(0)" : "translateY(52px)",
        down: inView ? "translateY(0)" : "translateY(-52px)",
        left: inView ? "translateX(0)" : "translateX(-52px)",
        right: inView ? "translateX(0)" : "translateX(52px)",
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: transforms[direction],
                transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default Reveal;