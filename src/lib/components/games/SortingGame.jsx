const SortingGame = ({ categories, items }) => {
    const [sortedItems, setSortedItems] = useState({});
    const [draggedItem, setDraggedItem] = useState(null);
    
    const handleDrop = (categoryId) => {
      if (draggedItem && draggedItem.correctCategory === categoryId) {
        // Correct placement
        setSortedItems({
          ...sortedItems,
          [categoryId]: [...(sortedItems[categoryId] || []), draggedItem]
        });
      } else {
        // Incorrect placement - show feedback
      }
      setDraggedItem(null);
    };
    
    return (
      <div className="sorting-game">
        <div className="item-container">
          {items.filter(item => !Object.values(sortedItems).flat().includes(item)).map(item => (
            <div
              key={item.id}
              className="draggable-item"
              draggable
              onDragStart={() => setDraggedItem(item)}
            >
              {item.symbol || item.name}
            </div>
          ))}
        </div>
        
        <div className="categories-container">
          {categories.map(category => (
            <div
              key={category.id}
              className="category-container"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(category.id)}
            >
              <h3>{category.name}</h3>
              <div className="category-items">
                {(sortedItems[category.id] || []).map(item => (
                  <div key={item.id} className="category-item">
                    {item.symbol || item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };