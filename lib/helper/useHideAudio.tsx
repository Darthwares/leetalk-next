import React from "react";

const useHideAudio = () => {
  const [hideAudioinIphone, setHideAudioinIphone] = React.useState(true);

  const userAgent = navigator.userAgent;
  React.useEffect(() => {
    function checkOS() {
      let os = "";

      if (userAgent.includes("iPad") || userAgent.includes("iPhone")) {
        os = "iOS";
        setHideAudioinIphone(false);
      }

      return os;
    }

    checkOS();
  }, []);

  return {
    hideAudioinIphone,
  };
};

export default useHideAudio;
