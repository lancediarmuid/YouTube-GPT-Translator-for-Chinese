const readLocalStorage = async () => new Promise((resolve) => {
  // eslint-disable-next-line no-undef
  chrome.storage.local.get(['apikey'], (result) => {
    if (result.apikey === undefined) {
      resolve(null);
    } else {
      const openaiKeyRegex = /sk-\w{32}/;
      const isMatched = openaiKeyRegex.test(result.apikey);
      if (!isMatched) {
        resolve(null);
      }
      resolve(result.apikey);
    }
  });
});

export default readLocalStorage;
