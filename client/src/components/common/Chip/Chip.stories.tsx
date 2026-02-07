import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {Chip} from '@components/common/Chip';

const meta: Meta<typeof Chip> = {
  title: 'Common/Chip',
  component: Chip,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '태그',
  },
};
