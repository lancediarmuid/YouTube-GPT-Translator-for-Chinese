/* eslint-disable import/no-cycle */
import evtListenerOnCopy from './evtListenerOnCopy';
import evtListenerOnGPT from './evtListenerOnGPT';
import evtListenerOnHighlight from './evtListenerOnHighlight';
import evtListenerOnHover from './evtListenerOnHover';
import evtListenerOnKeys from './evtListenerOnKeys';
import evtListenerOnScreen from './evtListenerOnScreen';
import evtListenerOnStatus from './evtListenerOnStatus';
import evtListenerOnTimestamp from './evtListenerOnTimestamp';
import evtListenerOnWindow from './evtListenerOnWindow';
import evtListenerOnGoogleTranslate from './evtListenerOnGoogleTranslate';
import evtListenerOnChat from './evtListenerOnChat';
import evtListenerOnAudio from './evtListenerOnAudio';

export const addEventListenersOnTopBtns = () => {
  evtListenerOnHover();
  evtListenerOnStatus();
  evtListenerOnCopy();
  evtListenerOnGoogleTranslate();
  evtListenerOnGPT();
  evtListenerOnChat();
  evtListenerOnAudio();

  evtListenerOnWindow();
  evtListenerOnScreen();
  evtListenerOnHighlight();
};

export const addEventListenersOnTranscript = () => {
  evtListenerOnTimestamp();
  evtListenerOnKeys();
};
