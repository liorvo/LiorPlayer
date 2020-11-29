const VideoList = ({ list, onItemRemove }) => {
  return (
    <div className="video-list">
      {list &&
        list.map((item, i) => (
          <div key={i} className="list-item">
            <span>{item}</span>
            {onItemRemove && (
              <img
                src="/static/images/close.png"
                alt="close"
                width="10"
                height="10"
                className="close"
                onClick={() => onItemRemove(i)}
              />
            )}
          </div>
        ))}
      <style jsx>{`
        .video-list {
          border: 1px solid black;
          overflow-y: auto;
          flex-grow: 9;
        }
        .list-item {
          border: 1px solid black;
          padding: 5px;
          position: relative;
        }

        .list-item > span {
          max-width: 98%;
          display: inline-block;
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .close {
          display: none;
          position: absolute;
          right: 5px;
          width: 15px;
          height: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }

        .list-item:hover .close {
          display: block;
        }
      `}</style>
    </div>
  );
};
export default VideoList;
