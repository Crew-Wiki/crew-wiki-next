import {LoadingSpinner} from '@components/common/LoadingSpinner';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 transition-opacity duration-200">
      <LoadingSpinner size="m" thickness="thick" />
    </div>
  );
};

export default Loading;
