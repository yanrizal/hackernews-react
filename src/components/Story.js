import React from "react";
import { Link } from "react-router-dom";

const Story = ({item}) => {

  return (
    <div className="box-border p-4 border-2 my-3">
      <a href={item.url} className="block text-lg leading-tight font-medium hover:underline">{item.title}</a>
      <span className="text-xs">{item.score} points by {item.by} {new Date(item.time * 1000).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: 'numeric'
          })} | </span>
      <Link to={`/comment/${item.id}`} className="text-xs font-medium">{item.descendants} comments</Link>
    </div>
  );
}

export default Story;
