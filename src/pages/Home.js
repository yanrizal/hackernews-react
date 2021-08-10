import React, { useEffect, useState } from "react";
import { useNews } from "../stores/News";
import Story from "../components/Story";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import queryString from 'query-string';
import '../App.css';

const Home = (props) => {
  const newsStore = useNews();
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const history = useHistory()

  useEffect(() => {
    // parse page number from url
    const parsed = queryString.parse(props.location.search);
    fetchData((parsed.p)?parseInt(parsed.p):1)
  },[props.location.search])

  const fetchData = async (num) => {
    setLoading(true)
    setPage(num)
    // get data stories from api
    await newsStore.getStories(num)
    if (newsStore.state === 'done_get_stories') {
      setLoading(false)
    }
  }

  const handleClickMore = async () => {
    const stringified = queryString.stringify({p:page+1});
    history.push(`?${stringified}`)
    fetchData(page + 1)
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
        <div>
        <h1 className="font-bold text-lg">Hacker News</h1>
        <React.Fragment>
          {newsStore.stories.map((item,idx) => (
            <Story key={idx} item={item} />
          ))}
        </React.Fragment>

        <button onClick={handleClickMore} className="text-lg">More</button>
        </div>
        }

    </div>
  );
}

export default Home;
