import { Loading } from './loading';

export const FullPageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Loading size="lg" />
    </div>
  );
};
