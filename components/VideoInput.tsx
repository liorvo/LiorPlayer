import { useState } from "react";
const VideoInput = ({ onClickAdd }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const handleChange = (event) => {
    setVideoUrl(event.target.value);
  };
  const handleClick = () => {
    setVideoUrl("");
    onClickAdd(videoUrl);
  };
  return (
    <div className="container">
      <input type="text" onChange={handleChange} value={videoUrl} />
      <button onClick={handleClick}>Add</button>
      <style jsx>{`
        .container {
          margin-bottom: 5%;
          flex-basis: 4%;
        }

        .container > input {
          width: 88%;
          height: 100%;
          margin-right: 2%;
        }

        .container > button {
          width: 10%;
          height: 100%;
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </div>
  );
};
export default VideoInput;
