import React, { useEffect, useState } from "react";
import { useNews } from "../stores/News";
import { useComment } from "../stores/Comment";
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import Loader from "react-loader-spinner";

const Comment = () => {
  const newsStore = useNews();
  const commentStore = useComment();
  const [loading, setLoading] = useState(true)
  const [commentData, setCommentData] = useState([])
  const myparam = useParams();
  //const myparam = location.state;

  useEffect(() => {
    fetchData()
  },[newsStore])

  const fetchData = async () => {
    setLoading(true)
    await newsStore.getStory(myparam.id)
    if (newsStore.state === 'done_get_story') {
      const data = await Promise.all(newsStore.story.kids.map(getDataComment));
      setLoading(false)
      setCommentData(data)
    }
  }

  const getDataComment = async (id) => {
   const data = await commentStore.getComment(id)
   if (data.kids) {
      const c = await Promise.all(data.kids.map(getDataComment));
      data.comments = c
   }
   return data
  }


  const NestedComment = ({item}) => {
     return(
       <li className="my-10">
           <p className="text-xs">{item.by} {new Date(item.time * 1000).toLocaleDateString('en-US', {
          hour: 'numeric',
          minute: 'numeric'
        })}</p>
           <p className="text-sm">{ ReactHtmlParser(item.text) }</p>
           {item.comments &&
           <Comments data={item.comments} />
           }
       </li>
     )
  }

  const Comments = ({data}) => {
   return (
   <ul className="list-disc ml-10">
   {data.map((item) => {
      return (
        <NestedComment item={item} />
      )
    })}
   </ul>
   )
  }


  return (
    <div>
        {loading &&
          <div className="m-auto w-12 pt-52">
          <Loader
            type="Puff"
            color="#ff6600"
            height={100}
            width={48}
            timeout={3000} //3 secs
          />
          </div>
        }
        {!loading &&
        <div className="box-border p-4 border-2 my-3">
        <h1><a href={newsStore.story.url} className="block text-lg leading-tight hover:underline">{newsStore.story.title}</a></h1>
        <span className="text-xs">{newsStore.story.score} points by {newsStore.story.by} {new Date(newsStore.story.time * 1000).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: 'numeric'
          })}</span>
        </div>
        }
        <React.Fragment>
          <div className="-ml-4">
          <Comments data={commentData}/>
          </div>
        </React.Fragment>
        
    </div>
  );
}

export default Comment;
