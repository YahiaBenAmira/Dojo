import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RichTextEditor.css";
import _ from "lodash";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "align",
  "color",
  "background",
];

const RichTextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quillEditor = quillRef.current.getEditor();
    if (quillEditor && value !== quillEditor.root.innerHTML) {
      quillEditor.root.innerHTML = value;
    }
  }, [value]);

  // Create a debounced version of the onChange function
  const debouncedOnChange = useRef(_.debounce(onChange, 1000)).current;

  const handleChange = (content, delta, source, editor) => {
    debouncedOnChange(editor.getHTML());
  };

  return (
    <div className="RichTextEditor">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Enter some text..."
      />
    </div>
  );
};

export default RichTextEditor;
