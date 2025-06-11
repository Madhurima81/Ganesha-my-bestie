const TracingGame = ({ pathPoints, imageSrc }) => {
    const [drawnPoints, setDrawnPoints] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [complete, setComplete] = useState(false);
    
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background image if provided
      if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          ctx.globalAlpha = 0.3;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
        };
      }
      
      // Draw path points (dots to connect)
      pathPoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        
        // Draw number
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, point.x, point.y);
      });
      
      // Draw user's line
      if (drawnPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
        
        for (let i = 1; i < drawnPoints.length; i++) {
          ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
        }
        
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      
      // Check if complete
      if (drawnPoints.length > 0) {
        const lastPoint = drawnPoints[drawnPoints.length - 1];
        const lastPathPoint = pathPoints[pathPoints.length - 1];
        
        const distance = Math.sqrt(
          Math.pow(lastPoint.x - lastPathPoint.x, 2) + 
          Math.pow(lastPoint.y - lastPathPoint.y, 2)
        );
        
        if (distance < 20) {
          setComplete(true);
        }
      }
    }, [drawnPoints, pathPoints, imageSrc]);
    
    const handleMouseDown = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Start from first path point if nothing drawn yet
      if (drawnPoints.length === 0) {
        const firstPoint = pathPoints[0];
        const distance = Math.sqrt(
          Math.pow(x - firstPoint.x, 2) + 
          Math.pow(y - firstPoint.y, 2)
        );
        
        if (distance < 20) {
          setDrawnPoints([firstPoint]);
          setIsDrawing(true);
        }
      } else {
        setIsDrawing(true);
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setDrawnPoints([...drawnPoints, { x, y }]);
    };
    
    const handleMouseUp = () => {
      setIsDrawing(false);
    };
    
    return (
      <div className="tracing-game">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {complete && (
          <div className="completion-message">
            <h2>Great job!</h2>
            <button onClick={() => {
              setDrawnPoints([]);
              setComplete(false);
            }}>Draw Again</button>
          </div>
        )}
      </div>
    );
  };