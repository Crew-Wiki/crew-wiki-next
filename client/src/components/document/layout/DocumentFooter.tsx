import timeConverter from '@utils/TimeConverter';

interface DocumentFooterProps {
  generateTime: string;
}

const DocumentFooter = ({generateTime}: DocumentFooterProps) => {
  const comment = `이 문서는 ${timeConverter(generateTime, 'YYYY년 M월 D일 (ddd) HH:mm')} 에 마지막으로 편집되었습니다.`;

  return (
    <footer className="flex h-fit w-full flex-col gap-2 rounded-xl border border-solid border-primary-100 bg-white p-8 px-8 py-6 max-[768px]:p-4">
      <p className="font-pretendard text-xs font-normal text-grayscale-800">{comment}</p>
      <p className="font-pretendard text-xs text-grayscale-800">
        질문, 제안, 오류 제보는{' '}
        <a
          href="https://forms.gle/qZAy58hCLk2u2Zbj7"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-primary hover:underline"
        >
          문의하기
        </a>
        를 이용해 주세요.
      </p>
    </footer>
  );
};

export default DocumentFooter;
