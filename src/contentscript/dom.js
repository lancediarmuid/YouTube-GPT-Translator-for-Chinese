// 等待页面元素加载完成
export function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) { // 如果指定选择器的元素存在，则直接返回该元素
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => { // 创建一个MutationObserver实例监听DOM变化
            if (document.querySelector(selector)) { // 如果指定选择器的元素存在，则返回该元素
                resolve(document.querySelector(selector));
                observer.disconnect(); // 停止观察DOM变化
            }
        });

        observer.observe(document.body, { // 开始观察document.body元素的子节点和后代节点的变化
            childList: true,
            subtree: true
        });
    });
}