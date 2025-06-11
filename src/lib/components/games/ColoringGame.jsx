const ColoringGame = ({ imageSrc, regions }) => {
    const [selectedColor, setSelectedColor] = useState('#FF0000');
    const [coloredRegions, setColoredRegions] = useState({});
    
    const colors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
      '#FF00FF', '#00FFFF', '#FFA500', '#800080'
    ];
    
    const handleRegionClick = (regionId) => {
      setColoredRegions({
        ...coloredRegions,
        [regionId]: selectedColor
      });
    };
    
    return (
      <div className="coloring-game">
        <div className="color-palette">
          {colors.map(color => (
            <div
              key={color}
              className={`color-swatch ${color === selectedColor ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        
        <div className="coloring-canvas">
          <img src={imageSrc} alt="Coloring outline" className="coloring-outline" />
          
          <svg className="coloring-regions">
            {regions.map(region => (
              <path
                key={region.id}
                d={region.path}
                fill={coloredRegions[region.id] || 'transparent'}
                stroke="black"
                strokeWidth="1"
                onClick={() => handleRegionClick(region.id)}
              />
            ))}
          </svg>
        </div>
        
        <button onClick={() => setColoredRegions({})}>Clear All</button>
      </div>
    );
  };