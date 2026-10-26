import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {crewListFixture, graphFixture} from '@components/graph/graphFixture';
import {normalizeCrewGraph} from '@utils/normalizeCrewGraph';
import {filterCrewGraph} from '@utils/filterCrewGraph';
import GraphResults from './index';

const graph = filterCrewGraph(normalizeCrewGraph([{generation: '8기', crews: crewListFixture, graph: graphFixture}]), {
  selectedGenerations: ['8기'],
  selectedFields: [],
});

const meta = {
  title: 'Graph/GraphResults',
  component: GraphResults,
  args: {
    ...graph,
    references: [],
    showReferences: false,
    isMultiGeneration: false,
    hasSelectedGeneration: true,
    isLoading: false,
    errorMessage: null,
    onCrewActivate: () => {},
    onFieldToggle: () => {},
    onRetry: () => {},
    onReset: () => {},
  },
} satisfies Meta<typeof GraphResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};
export const Loading: Story = {args: {isLoading: true}};
export const Error: Story = {args: {errorMessage: '조회 실패'}};
export const NoGeneration: Story = {args: {hasSelectedGeneration: false, crews: [], fields: []}};
export const Empty: Story = {args: {crews: [], fields: []}};
