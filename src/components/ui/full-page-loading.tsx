import { Loading } from './loading';

export const FullPageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" />
    </div>
  );
};
