"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  length?: number;
  onChange?: (code: string) => void;
  className?: string;
};

const OtpInput = ({ length = 6, onChange, className = "" }: Props) => {
  const [values, setValues] = useState<string[]>(Array.from({ length }, () => ""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    onChange?.(values.join(""));
  }, [values, onChange]);

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 1);
    setValues((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        setValues((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const chars = pasted.slice(0, length - index).split("");
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < chars.length; i++) {
        next[index + i] = chars[i];
      }
      return next;
    });
    const nextIndex = Math.min(index + chars.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const boxClass =
    "w-12 h-12 text-center text-[16px] border border-grey-500 rounded bg-transparent focus:outline-none focus:bg-primary/10 transition-all ease-linear duration-300";

  const renderInputs = useMemo(() => {
    const first = Math.floor(length / 2);
    const second = length - first;
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex gap-2">
          {Array.from({ length: first }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={1}
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              className={boxClass}
            />
          ))}
        </div>
        <span className="w-1 h-1 bg-grey-600 rounded-full"></span>
        <div className="flex gap-2">
          {Array.from({ length: second }).map((_, j) => {
            const idx = first + j;
            return (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={1}
                value={values[idx]}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={(e) => handlePaste(idx, e)}
                className={boxClass}
              />
            );
          })}
        </div>
      </div>
    );
  }, [boxClass, className, length, values]);

  return renderInputs;
};

export default OtpInput;


