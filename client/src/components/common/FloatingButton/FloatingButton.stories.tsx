import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import FloatingButton from '@components/common/FloatingButton';

const meta: Meta<typeof FloatingButton> = {
  title: 'Common/FloatingButton',
  component: FloatingButton,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
