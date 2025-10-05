import {Chip} from '@components/common/Chip';

const Page = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <h1 className="font-bm text-2xl text-grayscale-800">테스트</h1>
        <Chip text="크루위키부흥위원회" />
      </div>
    </section>
  );
};

export default Page;
