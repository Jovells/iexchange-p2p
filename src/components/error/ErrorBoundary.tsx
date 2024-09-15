'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorQueue: Error[];  // Store errors in a queue
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorQueue: [] };
  }

  // Update state when an error is encountered
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);

    // Add the error to the queue
    this.setState((prevState) => ({
      errorQueue: [...prevState.errorQueue, error],
    }));
  }

  handleNextError = () => {
    // Remove the first error from the queue and reset error state if no more errors are left
    this.setState((prevState) => {
      const [, ...remainingErrors] = prevState.errorQueue; // Remove the first error
      return {
        errorQueue: remainingErrors,
        hasError: remainingErrors.length > 0,
      };
    });
  };

  render() {
    const { hasError, errorQueue } = this.state;

    if (hasError && errorQueue.length > 0) {
      const currentError = errorQueue[0];  // Display the first error in the queue

      return (
        <div>
          <div>
            <h2>An error occurred:</h2>
            <pre>{currentError.message}</pre>
          </div>
          <button onClick={this.handleNextError}>Dismiss</button>  {/* Dismiss current error */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
