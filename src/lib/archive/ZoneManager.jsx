// ZoneManager.jsx - Manages entire zones
export const ZoneManager = ({ zoneId, children }) => {
  const [zoneData, setZoneData] = useState(null);
  const [unlockedScenes, setUnlockedScenes] = useState([]);
  
  useEffect(() => {
    // Load zone configuration
    const loadZoneData = async () => {
      const data = await import(`../../zones/${zoneId}/config.json`);
      setZoneData(data);
      
      // Check which scenes are unlocked
      const progress = GameStateManager.getZoneProgress(zoneId);
      setUnlockedScenes(progress.unlockedScenes);
    };
    
    loadZoneData();
  }, [zoneId]);
  
  return (
    <ZoneContext.Provider value={{ zoneData, unlockedScenes }}>
      {children}
    </ZoneContext.Provider>
  );
};