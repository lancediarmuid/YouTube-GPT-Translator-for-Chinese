/**
 *
 * @param {string} url
 * @returns {object}
 */

function getSearchParam(url) {
  const searchParam = (url && url !== '') ? url : window.location.search;
  if (!(/\?([a-zA-Z0-9_]+)/i.exec(searchParam))) return {};
  const pl = /\+/g;
  const search = /([^?&=]+)=?([^&]*)/g;
  const decode = (s) => decodeURIComponent(s.replace(pl, ' '));
  const index = /\?([a-zA-Z0-9_]+)/i.exec(searchParam).index + 1;
  const query = searchParam.substring(index);

  const urlParams = {};
  let match;
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  // 返回v属性的Youtube视频ID
  return urlParams;
}

export default getSearchParam;
