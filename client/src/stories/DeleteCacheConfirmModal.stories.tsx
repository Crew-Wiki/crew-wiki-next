import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {Modal} from '@components/common/Modal/Modal';
import {useModal} from '@components/common/Modal/useModal';
import Button from '@components/common/Button';

const DeleteCacheConfirmModalWithButton = () => {
  const {open, close, component} = useModal<boolean>(
    <Modal>
      <div style={{minWidth: '300px'}} className="flex flex-col gap-8">
        <p className="font-pretendard text-lg">정말 캐시를 삭제하시겠습니까?</p>
        <div className="flex w-full flex-row justify-between gap-3">
          <Button size="s" style="primary" onClick={() => close(true)}>
            삭제
          </Button>
          <Button size="s" style="tertiary" onClick={() => close(false)}>
            취소
          </Button>
        </div>
      </div>
    </Modal>,
    {closeOnClickBackdrop: false},
  );

  const handleOpen = async () => {
    const result = await open();
    alert(result ? '삭제 확인' : '취소');
  };

  return (
    <>
      <Button size="m" style="secondary" onClick={handleOpen}>
        캐시 삭제
      </Button>
      {component}
    </>
  );
};

const meta: Meta = {
  title: 'Common/Modal/DeleteCacheConfirm',
  component: DeleteCacheConfirmModalWithButton,
  decorators: [
    Story => (
      <>
        <Story />
        <div id="modal-root" />
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
