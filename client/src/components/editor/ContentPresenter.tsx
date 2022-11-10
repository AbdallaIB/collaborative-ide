import useToast from '@lib/hooks/useToast';
import { useRef, useEffect } from 'react';

interface Props {
  contentSrc: string;
}
const ContentPresenter = ({ contentSrc }: Props) => {
  const { errorMessage } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handleCombinedDocError = (err: any) => {
    errorMessage(err);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;
    iframe.contentDocument.domain = 'http://localhost:8080';
    iframe.onload = () => {
      console.log('loaded!');
    };
    iframe.onerror = (err) => {
      errorMessage(err);
    };
    iframe.contentDocument.onerror = (err) => {
      errorMessage(err);
    };
  }, [iframeRef]);

  return (
    <div className="flex h-full w-[35%] bg-white">
      <iframe
        ref={iframeRef}
        srcDoc={contentSrc}
        onError={handleCombinedDocError}
        onErrorCapture={handleCombinedDocError}
        title="output"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default ContentPresenter;
