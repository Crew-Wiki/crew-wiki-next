import timeConverter from '@utils/TimeConverter';

interface DocumentFooterProps {
  generateTime: string;
}

const DocumentFooter = ({generateTime}: DocumentFooterProps) => {
  const comment = `이 문서는 ${timeConverter(generateTime, 'YYYY년 M월 D일 (ddd) HH:mm')} 에 마지막으로 편집되었습니다.`;
  return (
    <footer className="flex h-fit w-full rounded-xl border border-solid border-primary-100 bg-white p-8 px-8 py-6 max-[768px]:p-4">
      <p className="font-pretendard text-xs font-normal text-grayscale-800">{comment}</p>
    </footer>
  );
};

export default DocumentFooter;
