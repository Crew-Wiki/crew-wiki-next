import timeConverter from '@utils/TimeConverter';

interface DocumentFooterProps {
  generateTime: string;
}

const DocumentFooter = ({generateTime}: DocumentFooterProps) => {
  const comment = `이 문서는 ${timeConverter(generateTime, 'YYYY년 M월 D일 (ddd) HH:mm')} 에 마지막으로 편집되었습니다.`;
  return (
    <footer className="flex w-full h-fit py-6 px-8 bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4">
      <p className="font-pretendard text-xs font-normal text-grayscale-800">{comment}</p>
    </footer>
  );
};

export default DocumentFooter;
