import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {Chip} from '@components/common/Chip';

const meta: Meta<typeof Chip> = {
  title: 'Common/Chip',
  component: Chip,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Removable: Story = {
  args: {
    text: '태그',
    variant: 'removable',
  },
};

export const Link: Story = {
  args: {
    text: '태그',
    variant: 'link',
  },
};
