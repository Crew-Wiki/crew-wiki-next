import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';

const meta: Meta<typeof RelativeSearchTerms> = {
  title: 'Common/RelativeSearchTerms',
  component: RelativeSearchTerms,
  decorators: [
    Story => (
      <div style={{position: 'relative', width: '400px', height: '240px', backgroundColor: '#f3f4f6'}}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchTerms: [
      {title: '연관 검색어1', uuid: '1', documentType: 'CREW'},
      {title: '연관 검색어2', uuid: '2', documentType: 'CREW'},
      {title: '연관 검색어3', uuid: '3', documentType: 'ORGANIZATION'},
    ],
    show: true,
  },
};

export const Empty: Story = {
  args: {
    searchTerms: [],
  },
};
