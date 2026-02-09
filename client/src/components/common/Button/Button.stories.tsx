import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import Button from '@components/common/Button';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    style: 'primary',
    size: 'm',
    children: '버튼',
  },
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    size: 'm',
    children: '버튼',
  },
};

export const Tertiary: Story = {
  args: {
    style: 'tertiary',
    size: 'm',
    children: '버튼',
  },
};

export const Text: Story = {
  args: {
    style: 'text',
    size: 'm',
    children: '버튼',
  },
  decorators: [
    Story => (
      <div style={{backgroundColor: '#f3f4f6', padding: '2rem'}}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    style: 'primary',
    size: 'm',
    children: '버튼',
    disabled: true,
  },
};
