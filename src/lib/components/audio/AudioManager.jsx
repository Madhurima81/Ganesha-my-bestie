// AudioManager.jsx - Handles all game sounds
export const AudioManager = ({ children }) => {
  const [audioContext] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const [sounds, setSounds] = useState({});
  
  const playSound = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName].play();
    }
  };
  
  const loadSound = async (name, url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    setSounds(prev => ({
      ...prev,
      [name]: audioBuffer
    }));
  };
  
  return (
    <AudioContext.Provider value={{ playSound, loadSound }}>
      {children}
    </AudioContext.Provider>
  );
};