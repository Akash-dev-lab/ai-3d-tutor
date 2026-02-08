import { useState } from "react";
import Scene from "../canvas/scene";
import ChatInterface from "../components/chat/ChatInterface";
import LandingPage from "../components/LandingPage";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  const handleStart = () => {
    setShowLanding(false);
  };

  return (
    <>
      {showLanding ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <>
          <Scene />
          <ChatInterface />
        </>
      )}
    </>
  );
};

export default App;
