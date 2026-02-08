import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import RandomButton from '@components/common/RandomButton';

const meta: Meta<typeof RandomButton> = {
  title: 'Common/RandomButton',
  component: RandomButton,
  decorators: [
    Story => (
      <div style={{backgroundColor: '#f3f4f6', padding: '2rem'}}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
