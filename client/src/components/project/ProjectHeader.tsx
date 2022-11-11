import Button from '@components/shared/button';
import useToast from '@lib/hooks/useToast';
import { ProviderUser } from '@services/WebsocketService';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  sessionId: string;
  participants: ProviderUser[];
  leaveSession: () => void;
}

const ProjectHeader = ({ leaveSession, sessionId, participants }: Props) => {
  const { promise } = useToast();
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const sessionInviteLink = window.location.href;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    const copyPromise = new Promise((r) => setTimeout(r, 1000));
    promise(copyPromise, {
      loading: 'Copying...',
      success: 'Copied!',
      error: 'Error copying',
    });
    setShowCopyDropdown(false);
  };

  return (
    <div className="border-b w-full border-main_dark bg-main_black text-gray-200">
      <div className="flex flex-row items-center justify-between px-6 py-2">
        <div className="flex flex-row items-center justify-between gap-6">
          <Link to="/">
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="w-9 p-0.5 rounded-lg flex justify-center items-center">
                <i className="bx bx-terminal text-5xl text-main"></i>
              </div>
            </div>
          </Link>
          <div className="flex flex-row items-center justify-center -space-x-3">
            {participants.map((participant, index) => (
              <div
                key={index}
                style={{ backgroundColor: participant.color }}
                className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-800"
              >
                <span className="font-semibold text-white">{participant.initials}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="relative inline-block text-left">
              <div>
                <Button
                  classes="h-7"
                  text={'Share Session'}
                  onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                  isPrimary
                ></Button>
              </div>

              <div
                style={{ display: showCopyDropdown ? 'flex' : 'none' }}
                className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-main_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1 whitespace-nowrap" role="none">
                  <button
                    onClick={() => handleCopy(sessionId)}
                    className="hover:opacity-80 text-main_side block px-4 py-2 text-sm text-center w-full"
                    role="menuitem"
                  >
                    Copy Session Id
                  </button>
                  <button
                    onClick={() => handleCopy(sessionInviteLink)}
                    className="hover:opacity-80 text-main_side block px-4 py-2 text-sm text-center w-full"
                    role="menuitem"
                  >
                    Copy Session Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Button classes="h-7" text={'Leave'} onClick={leaveSession} backgroundColor="red" color="white"></Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
