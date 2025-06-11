// ErrorBoundary.jsx - Catch and handle errors
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo);
    // Send to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen 
          error={this.state.error}
          onRetry={() => window.location.reload()}
        />
      );
    }
    
    return this.props.children;
  }
}
