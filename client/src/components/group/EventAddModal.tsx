'use client';

import {useState} from 'react';
import {Modal} from '@components/common/Modal/Modal';
import Button from '@components/common/Button';
import CustomCalendar from '@components/common/CustomCalendar';

interface EventAddModalProps {
  onCancel: () => void;
  onSubmit: (data: {date: Date; title: string; contents: string; writer: string}) => void;
}

const EventAddModal = ({onCancel, onSubmit}: EventAddModalProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [writer, setWriter] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const handleWriterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriter(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setTitle(value);
    }
  };

  const handleContentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setContents(value);
    }
  };

  const handleSubmit = () => {
    if (!date || !writer.trim() || !title.trim() || !contents.trim()) return;
    onSubmit({date, writer: writer.trim(), title: title.trim(), contents: contents.trim()});
  };

  const isValid = date && writer.trim() && title.trim() && contents.trim();

  return (
    <Modal className="w-[450px]">
      <h2 className="mb-6 text-center text-xl font-bold text-grayscale-text">이벤트 추가하기</h2>

      <div className="mb-6 flex flex-col gap-2">
        <div>
          <label className="mb-2 block text-base font-bold text-grayscale-600">날짜</label>
          <CustomCalendar
            value={date}
            onChange={setDate}
            isClickableNextDays={true}
            placeholder="날짜를 선택해주세요"
          />
        </div>

        <div>
          <label className="mb-2 block text-base font-bold text-grayscale-600">편집자</label>
          <input
            type="text"
            value={writer}
            onChange={handleWriterChange}
            placeholder="편집자"
            className="w-full rounded-lg border border-grayscale-200 px-4 py-3 text-sm text-grayscale-text placeholder:text-grayscale-400 focus:border-primary-primary focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-base font-bold">
            <span className="text-grayscale-600">제목</span>
            <span className="text-sm font-normal text-grayscale-300">{title.length}/20</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="ex) 크루위키 팀 생성"
            className="w-full rounded-lg border border-grayscale-200 px-4 py-3 text-sm text-grayscale-text placeholder:text-grayscale-400 focus:border-primary-primary focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-base font-bold">
            <span className="text-grayscale-600">내용</span>
            <span className="text-sm font-normal text-grayscale-300">{contents.length}/50</span>
          </div>
          <textarea
            value={contents}
            onChange={handleContentsChange}
            placeholder="ex) 팀이 결성돼서 행복하다!"
            rows={3}
            className="w-full resize-none rounded-lg border border-grayscale-200 px-4 py-3 text-sm text-grayscale-text placeholder:text-grayscale-400 focus:border-primary-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 [&>button]:h-[35px] [&>button]:w-full [&>button]:rounded-[12px]">
          <Button style="tertiary" size="m" onClick={onCancel}>
            취소하기
          </Button>
        </div>
        <div className="flex-1 [&>button]:h-[35px] [&>button]:w-full [&>button]:rounded-[12px]">
          <Button style="secondary" size="m" onClick={handleSubmit} disabled={!isValid}>
            추가하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EventAddModal;
