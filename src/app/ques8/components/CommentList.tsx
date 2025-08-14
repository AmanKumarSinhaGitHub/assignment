import React from "react";
import Comment from "./Comment";
import { Comment as CommentType } from "../page";

interface CommentListProps {
  comments: CommentType[];
  addComment: (text: string, parentId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, addComment }) => {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-thread animate-fadeIn">
          <Comment comment={comment} addComment={addComment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
