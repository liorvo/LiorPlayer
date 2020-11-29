import { useState, useEffect } from "react";
import VideoInput from "./VideoInput";
import VideoList from "./VideoList";
import ReactPlayer from "react-player";

const VideoContainer = () => {
  const [videoList, setVideoList] = useState([]);
  useEffect(() => {
    fetch("/getPlaylist") // in real apps we will use global state management and dispatch an action. then we will use useEffect on the playlist state that VideoContainer will get as prop and call setVideoList on it
      .then((data) => data.json())
      .then((playlist) => setVideoList(playlist))
      .catch((err) => {
        // log error to logger
      });
  }, []);
  const addToList = (url) => {
    fetch("/addToPlaylist", {
      // as written above
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    setVideoList([...videoList, url]);
  };
  const onItemRemove = (index) => {
    fetch("/removeFromPlaylist", {
      // as written above
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index, url: videoList[index] }),
    });
    setVideoList(videoList.slice(index + 1));
  };
  const onEnded = () => {
    onItemRemove(0);
  };
  return (
    <div className="container">
      <div className="list-wrapper">
        <VideoInput onClickAdd={addToList} />
        <VideoList list={videoList} onItemRemove={onItemRemove} />
      </div>

      <div className="player-wrapper">
        {videoList.length > 0 && (
          <ReactPlayer
            url={videoList[0]}
            width="100%"
            height="100%"
            playing={true}
            // controls={true}
            onEnded={onEnded}
          />
        )}
      </div>

      <style jsx>{`
        .container {
          position: relative;
          height: 100%;
        }

        .list-wrapper {
          width: 40%;
          height: 100%;
          padding: 2% 1%;
          border: 1px solid black;
          display: flex;
          flex-direction: column;
        }

        .player-wrapper {
          width: 58%;
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
};
export default VideoContainer;
