import VideoContainer from "../components/VideoContainer";
// import Head from "../components/head";
// import Nav from "../components/nav";

const Index = (props) => (
  <div className="container">
    <VideoContainer />
    <style jsx>{`
      .container {
        width: 99vw;
        height: 96vh;
        padding: 50px 100px;
        // margin: 0 auto;
        // padding: 50px;
        // margin: 0 auto;
      }
    `}</style>
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
);

export default Index;
