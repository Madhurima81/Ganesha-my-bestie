// LazySceneLoader.jsx - Load scenes only when needed
export const LazySceneLoader = ({ zoneName, sceneName }) => {
  const Scene = React.lazy(() => 
    import(`../../zones/${zoneName}/scenes/${sceneName}/${sceneName}.jsx`)
  );
  
  return (
    <React.Suspense fallback={<SceneLoadingScreen />}>
      <Scene />
    </React.Suspense>
  );
};
