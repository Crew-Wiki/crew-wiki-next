import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import Input from '@components/common/Input';

const meta: Meta<typeof Input> = {
  title: 'Common/Input',
  component: Input,
  args: {
    className: 'border border-solid rounded-lg px-3 py-2',
  },
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

export const Default: Story = {
  args: {
    input: '',
    placeholder: '텍스트를 입력하세요',
    handleChangeInput: () => {},
  },
};

export const WithValue: Story = {
  args: {
    input: '입력된 텍스트',
    handleChangeInput: () => {},
  },
};

export const Invalid: Story = {
  args: {
    input: '잘못된 입력',
    invalid: true,
    handleChangeInput: () => {},
  },
};

export const Disabled: Story = {
  args: {
    input: '비활성화',
    disabled: true,
    handleChangeInput: () => {},
  },
};
