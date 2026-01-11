const Loading = () => {
  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <section className="flex h-fit min-h-[864px] w-full flex-col items-center justify-center rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:p-4">
        <div className="text-grayscale-lightText">그룹 정보를 불러오는 중...</div>
      </section>
    </div>
  );
};

export default Loading;
