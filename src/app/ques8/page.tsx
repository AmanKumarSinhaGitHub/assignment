"use client";

import React, { useState } from "react";
import Link from 'next/link';
import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";

export interface Comment {
  id: number;
  text: string;
  replies: Comment[];
}

const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Add a new comment or reply
  const addComment = (text: string, parentId: number | null = null) => {
    const newComment: Comment = {
      id: Date.now(),
      text,
      replies: [],
    };

    if (!parentId) {
      setComments([...comments, newComment]);
    } else {
      setComments(addReply(comments, parentId, newComment));
    }
  };

  // Recursive helper function to insert reply
  const addReply = (commentList: Comment[], parentId: number, newComment: Comment): Comment[] => {
    return commentList.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newComment] };
      }
      return {
        ...comment,
        replies: addReply(comment.replies, parentId, newComment),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nested Comments</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Discussion</h2>
            <p className="mt-2 text-blue-100">
              Join the conversation! Add your thoughts and reply to others.
            </p>
          </div>

          <div className="p-6">
            <CommentForm submitLabel="Start Discussion" handleSubmit={addComment} />
            <div className="mt-8">
              <CommentList comments={comments} addComment={addComment} />
              {comments.length === 0 && (
                <p className="text-gray-500 text-center italic">
                  No comments yet. Be the first to start the discussion!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;