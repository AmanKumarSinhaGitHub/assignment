import React, { useState, FormEvent } from "react";

interface CommentFormProps {
  submitLabel: string;
  handleSubmit: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ submitLabel, handleSubmit }) => {
  const [text, setText] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    handleSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <textarea
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow duration-200"
        rows={3}
        placeholder="What are your thoughts?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!text.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default CommentForm;
