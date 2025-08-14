import React, { useState } from "react";
import CommentForm from "./CommentForm";

import { Comment as CommentType } from "../page";

interface CommentProps {
  comment: CommentType;
  addComment: (text: string, parentId: number) => void;
}

export default function Comment({ comment, addComment }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (text: string) => {
    addComment(text, comment.id);
    setIsReplying(false);
  };

  return (
    <div className="group">
      <div className="bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="p-4">
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap mb-3">{comment.text}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              {isReplying ? "Cancel Reply" : "Reply"}
            </button>
          </div>
          {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-blue-100">
              <CommentForm submitLabel="Reply" handleSubmit={handleReply} />
            </div>
          )}
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-4 ml-8 pl-4 border-l-2 border-blue-100 space-y-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} addComment={addComment} />
          ))}
        </div>
      )}
    </div>
  );
}
