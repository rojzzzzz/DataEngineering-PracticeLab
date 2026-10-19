import { Component, type ReactNode } from "react";

export default class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status">
        Visual preview unavailable. Use the saved summary or open the
        deliverable below.
      </p>
    ) : (
      this.props.children
    );
  }
}
