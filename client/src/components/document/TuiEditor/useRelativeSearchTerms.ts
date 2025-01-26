'use client';

import useSearchDocumentByQuery from '@hooks/fetch/useSearchDocumentByQuery';
import {EditorRef} from '@type/Editor.type';
import {useCallback, useState} from 'react';

type UseRelativeSearchTermArgs = {
  editorRef: EditorRef;
};

export const useRelativeSearchTerms = ({editorRef}: UseRelativeSearchTermArgs) => {
  const [referQuery, setReferQuery] = useState('');
  const [refStartPos, setRefStartPos] = useState<[number, number] | null>(null);
  const [refEndPos, setRefEndPos] = useState<[number, number] | null>(null);
  const [floatingAreaPosition, setFloatingAreaPosition] = useState<{top: number; left: number}>({top: 0, left: 0});

  const {titles} = useSearchDocumentByQuery(referQuery);
  const floatingArea = typeof document !== 'undefined' ? document.createElement('div') : null;

  if (floatingArea) {
    floatingArea.style.width = '320px';
    floatingArea.style.height = '100px';
    floatingArea.id = 'floating-area';
    floatingArea.style.position = 'relative';
  }

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!editorRef.current || !refStartPos || !refEndPos) return;
    const targetTitle = (event.target as HTMLElement).closest('button')?.id;

    if (targetTitle) {
      const replacement = `[${targetTitle}](https://crew-wiki.site/wiki/${encodeURI(targetTitle!)})`;
      editorRef.current.getInstance().replaceSelection(replacement, [refStartPos[0], refStartPos[1] - 1], refEndPos);
      setRefEndPos(null);
      setRefStartPos(null);
      setReferQuery('');
      setShowRelativeSearchTerms(false);
    }
  };

  const getFloatingArea = () => {
    const floatingAreaDom = document.querySelector('#floating-area');
    const css = floatingAreaDom?.getAttribute('style');
    if (!css) return null;
    const topRegex = /top:\s*([\d.]+)px/;
    const leftRegex = /left:\s*([\d.]+)px/;
    const topMatch = css.match(topRegex);
    const leftMatch = css.match(leftRegex);
    if (topMatch && leftMatch) {
      setFloatingAreaPosition({top: Number(topMatch[1]), left: Number(leftMatch[1])});
    }
    return null;
  };

  const [showRelativeSearchTerms, setShowRelativeSearchTerms] = useState(false);

  const recordRefStartPos = useCallback(() => {
    if (!editorRef.current) return;

    const currentPos = editorRef.current.getInstance().getSelection()[0] as [number, number];
    const letter = editorRef.current.getInstance().getSelectedText([currentPos[0], currentPos[1] - 1], currentPos);
    if (letter === ' ') {
      setRefStartPos(null);
      return;
    }
    if (letter !== '@') return;

    editorRef.current?.getInstance().addWidget(floatingArea, 'bottom', currentPos!);
    getFloatingArea();
    setRefStartPos(currentPos);
    setShowRelativeSearchTerms(true);
  }, [editorRef, floatingArea]);

  const recordRefEndPose = useCallback(() => {
    if (!editorRef.current) return;
    if (!refStartPos) return;
    const currentPos = editorRef.current.getInstance().getSelection()[1] as [number, number];

    setRefEndPos(currentPos);
    const text = editorRef.current.getInstance().getSelectedText(refStartPos, currentPos);
    setReferQuery(text);
  }, [editorRef, refStartPos]);

  return {
    ...floatingAreaPosition,
    titles,
    onClick,
    showRelativeSearchTerms,
    recordRefStartPos,
    recordRefEndPose,
  };
};
