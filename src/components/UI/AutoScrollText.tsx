import { useEffect, useRef, useState } from "react";

export const AutoScrollText = ({ text }: { text: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = textRef.current;
    if (wrapper && content) {
      setIsOverflowing(content.scrollWidth > wrapper.clientWidth);
    }
  }, [text]);

  return (
    <div
      ref={wrapperRef}
      className={`scroll-wrapper text-[#4E6C50] ${
        !isOverflowing ? "no-scroll" : ""
      }`}
    >
      <span ref={textRef} className="scroll-content">
        {text}
      </span>
    </div>
  );
};
