import {LoadingSpinner} from '@components/common/LoadingSpinner';

const Loading = () => {
  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <section className="flex h-fit min-h-[864px] w-full flex-col items-center justify-center gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <LoadingSpinner />
      </section>
    </div>
  );
};

export default Loading;
