'use client';

import Button from '@components/common/Button';
import {useModal} from '@components/common/Modal/useModal';
import {Chip} from '@components/common/Chip';
import {Modal} from '@components/common/Modal/Modal';

const Page = () => {
  const modal = useModal<boolean>(
    <Modal>
      <h1>안녕</h1>
      <div className="flex flex-row gap-2">
        <Button size="xs" style="primary" onClick={() => modal.close(true)}>
          확인
        </Button>
        <Button size="xs" style="tertiary" onClick={() => modal.close(false)}>
          취소
        </Button>
      </div>
    </Modal>,
    {
      closeOnClickBackdrop: true,
      onClose: () => {
        console.log('모달 종료');
      },
    },
  );

  const handleOpen = async () => {
    const response = await modal.open();
    console.log(response);
  };

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <h1 className="font-bm text-2xl text-grayscale-800">테스트</h1>
        <Button style="secondary" size="m" onClick={handleOpen}>
          모달 열기
        </Button>
        <Chip text="크루위키부흥위원회" />
      </div>
      {modal.component}
    </section>
  );
};

export default Page;
