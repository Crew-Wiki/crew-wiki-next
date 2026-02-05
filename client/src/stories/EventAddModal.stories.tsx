import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import EventAddModal from '@components/group/EventAddModal';
import {useModal} from '@components/common/Modal/useModal';
import Button from '@components/common/Button';

const EventAddModalWithButton = () => {
  const {open, close, component} = useModal(
    <EventAddModal onCancel={() => close()} onSubmit={data => alert(JSON.stringify(data))} />,
  );

  return (
    <>
      <Button size="m" style="primary" onClick={open}>
        이벤트 추가
      </Button>
      {component}
    </>
  );
};

const meta: Meta = {
  title: 'Common/Modal/EventAddModal',
  component: EventAddModalWithButton,
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
