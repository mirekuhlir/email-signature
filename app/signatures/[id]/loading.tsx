// TODO - sjednotit do jedné komponenty
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-400/60"></div>
    </div>
  );
}
