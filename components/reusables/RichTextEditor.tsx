"use client";

import React, { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function handleInput() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  return (
    <div className="border border-grey-400 rounded-md">
      <div className="flex items-center gap-1 px-2 py-1 border-b border-grey-400 bg-white">
        <button className="p-1 rounded hover:bg-grey-100" type="button" onClick={() => exec("bold")}
          aria-label="Bold">
          <Bold className="size-4" />
        </button>
        <button className="p-1 rounded hover:bg-grey-100" type="button" onClick={() => exec("italic")} aria-label="Italic">
          <Italic className="size-4" />
        </button>
        <button className="p-1 rounded hover:bg-grey-100" type="button" onClick={() => exec("underline")} aria-label="Underline">
          <Underline className="size-4" />
        </button>
        <span className="mx-1 h-4 w-px bg-grey-300" />
        <button className="p-1 rounded hover:bg-grey-100" type="button" onClick={() => exec("insertUnorderedList")} aria-label="Bullet list">
          <List className="size-4" />
        </button>
        <button className="p-1 rounded hover:bg-grey-100" type="button" onClick={() => exec("insertOrderedList")} aria-label="Numbered list">
          <ListOrdered className="size-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-grey-100"
          type="button"
          aria-label="Insert link"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
        >
          <LinkIcon className="size-4" />
        </button>
      </div>
      <div
        ref={ref}
        className="min-h-[140px] px-3 py-2 text-sm bg-white focus:outline-none"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}


