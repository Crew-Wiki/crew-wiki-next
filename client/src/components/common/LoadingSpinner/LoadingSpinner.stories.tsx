import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {LoadingSpinner} from './index';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Common/LoadingSpinner',
  component: LoadingSpinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'm'],
    },
    thickness: {
      control: 'select',
      options: ['thin', 'normal', 'thick'],
    },
    colorClass: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 's',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
      <LoadingSpinner size="xxs" />
      <LoadingSpinner size="xs" />
      <LoadingSpinner size="s" />
      <LoadingSpinner size="m" />
    </div>
  ),
};

//////////////////////////////////////////////////
// 두께 비교
//////////////////////////////////////////////////

export const ThicknessVariants: Story = {
  render: () => (
    <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
      <LoadingSpinner thickness="thin" />
      <LoadingSpinner thickness="normal" />
      <LoadingSpinner thickness="thick" />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
      <LoadingSpinner colorClass="text-primary-primary" />
      <LoadingSpinner colorClass="text-red-500" />
      <LoadingSpinner colorClass="text-blue-500" />
      <LoadingSpinner colorClass="text-black" />
    </div>
  ),
};

export const CenteredOverlay: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px',
        height: '120px',
        backgroundColor: '#f3f4f6',
        borderRadius: '12px',
      }}
    >
      <LoadingSpinner size="m" />
    </div>
  ),
};
