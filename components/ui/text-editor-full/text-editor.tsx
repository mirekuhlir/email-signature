import React, { useState, useRef, useCallback } from "react";
import { Toolbar } from "./toolbar";
import { ColorPicker } from "./color-picker";
import { formatHtmlToJson } from "./utils";

interface Position {
  x: number;
  y: number;
}

export function TextEditor() {
  const [content, setContent] = useState<string>("");
  const [jsonContent, setJsonContent] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  const fonts = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
  ];

  const handleFormat = useCallback((command: string, value?: string) => {
    if (command === "fontName" && value) {
      document.execCommand("fontName", false, value);
    } else {
      document.execCommand(command, false, value);
    }
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const handleColorChange = (color: string) => {
    handleFormat("foreColor", color);
    setShowColorPicker(false);
  };

  const handleColorPickerOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setShowColorPicker(true);
  };

  const handleFontChange = (font: string) => {
    handleFormat("fontName", font);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      setJsonContent(JSON.stringify(formatHtmlToJson(html), null, 2));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Toolbar
          onFormatClick={handleFormat}
          onColorClick={handleColorPickerOpen}
          onFontChange={handleFontChange}
          fonts={fonts}
        />

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[200px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {showColorPicker && (
          <ColorPicker
            position={position}
            onColorSelect={handleColorChange}
            onClose={() => setShowColorPicker(false)}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Content Preview (JSON)</h3>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          {jsonContent}
        </pre>
      </div>
    </div>
  );
}
