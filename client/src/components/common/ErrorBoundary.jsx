import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-surface-muted p-6">
          <section className="card max-w-md p-6 text-center">
            <h1 className="text-xl font-bold text-ink">Something broke on this screen</h1>
            <p className="mt-2 text-sm text-ink-muted">Refresh the page and try again.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
