
export function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-vapo-purple-primary/75"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
