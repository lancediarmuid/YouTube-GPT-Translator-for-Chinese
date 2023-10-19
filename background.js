/* eslint-disable no-undef */

const onInstallURL = 'https://www.youtube.com/watch?v=_-wjA4XlBl4';
const onInstallURL2 = 'https://www.youtube.com/watch?v=KE7qU0-ZDIQ';

const key = 'INPUT_YOUR_OPEN_AI_API_KEY_HERE';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ apikey: key });
    if (navigator.language === 'en') {
      chrome.tabs.create({ url: onInstallURL2 });
    } else {
      chrome.tabs.create({ url: onInstallURL });
    }
  }
});

