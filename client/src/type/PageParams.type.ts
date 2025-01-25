export type TitleParams = {
  params: Promise<{title: string}>;
};

export type LogParams = {
  params: Promise<{title: string; logId: string}>;
};
