import { useState, useEffect } from "react";
import VideoInput from "./VideoInput";
import VideoList from "./VideoList";
import ReactPlayer from "react-player";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:3000");

const VideoContainer = () => {
  const [videoList, setVideoList] = useState([]);
  useEffect(() => {
    socket.on("sendPlaylist", (playlist) => {
      setVideoList(playlist);
    });
  }, []);
  const addToList = (url) => {
    socket.emit("addToPlayList", url);
  };
  const onItemRemove = (index) => {
    socket.emit("removeFromPlaylist", index);
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
