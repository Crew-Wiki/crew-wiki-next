import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {Modal} from '@components/common/Modal/Modal';
import {useModal} from '@components/common/Modal/useModal';
import Button from '@components/common/Button';

const ModalWithButton = () => {
  const {open, close, component} = useModal(
    <div style={{minWidth: '300px'}}>
      <Modal>
        <h2 className="font-bm text-lg">모달 제목</h2>
        <p className="mt-2 font-pretendard text-sm text-grayscale-600">모달 내용입니다.</p>
        <div className="mt-4 flex justify-end">
          <Button size="s" style="primary" onClick={() => close()}>
            닫기
          </Button>
        </div>
      </Modal>
    </div>,
  );

  return (
    <>
      <Button size="m" style="primary" onClick={open}>
        모달 열기
      </Button>
      {component}
    </>
  );
};

const meta: Meta = {
  title: 'Common/Modal',
  component: ModalWithButton,
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
