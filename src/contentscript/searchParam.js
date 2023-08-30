/* 
这段代码定义了一个名为getSearchParam的导出函数，它接受一个参数str。
该函数的作用是从给定的字符串中解析查询参数并返回一个包含查询参数键值对的对象。
如果没有提供str参数，则会使用window.location.search来获取当前页面的查询参数。
*/

export function getSearchParam(str) {
    // 检查是否传入了有效的字符串，并根据情况选择要解析的字符串
    const searchParam = (str && str !== "") ? str : window.location.search;

    // 如果传入的字符串不符合查询参数的格式，则返回一个空对象
    if (!(/\?([a-zA-Z0-9_]+)/i.exec(searchParam))) return {};

    // 定义正则表达式和方法
    let match,
        pl     = /\+/g,  // 匹配加号符
        search = /([^?&=]+)=?([^&]*)/g,  // 查询参数匹配规则
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },  // 解码函数
        index = /\?([a-zA-Z0-9_]+)/i.exec(searchParam)["index"]+1,  // 获取?后面的query部分的起始索引位置
        query  = searchParam.substring(index);  // 获取query部分

    // 定义一个空对象，用于存储解析后的查询参数键值对
    let urlParams = {};

    // 使用while循环，逐一匹配查询参数并添加到urlParams对象中
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }

    // 返回解析后的查询参数对象
    return urlParams;
}