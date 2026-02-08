import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import CustomCalendar from '@components/common/CustomCalendar';

const meta: Meta<typeof CustomCalendar> = {
  title: 'Common/CustomCalendar',
  component: CustomCalendar,
  decorators: [
    Story => (
      <div style={{backgroundColor: '#f3f4f6', padding: '2rem', width: '420px', minHeight: '450px'}}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: null,
    placeholder: '날짜를 선택하세요',
    isClickableNextDays: true,
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: new Date(),
    isClickableNextDays: true,
    onChange: () => {},
  },
};

export const DisableFutureDates: Story = {
  args: {
    value: null,
    placeholder: '날짜를 선택하세요',
    isClickableNextDays: false,
    onChange: () => {},
  },
};
