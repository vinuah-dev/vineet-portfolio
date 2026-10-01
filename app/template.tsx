/**
 * Route-level enter transition (templates re-mount on navigation).
 * CSS-only so server-rendered content is never hidden waiting for JavaScript.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
