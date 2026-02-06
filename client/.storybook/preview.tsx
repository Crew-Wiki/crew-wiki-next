import {definePreview} from '@storybook/nextjs-vite';
// @ts-expect-error: addon-docs types not resolved under current tsconfig
import addonDocs from '@storybook/addon-docs';
import '../src/app/globals.css';

export default definePreview({
  addons: [addonDocs()],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
