// ==UserScript==
// @name        雪球：标点符号格式化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  标点符号格式化，确保复制的一致性。
// @author       zungmou
// @match        https://xueqiu.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=xueqiu.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E9%9B%AA%E7%90%83%EF%BC%9A%E6%A0%87%E7%82%B9%E7%AC%A6%E5%8F%B7%E6%A0%BC%E5%BC%8F%E5%8C%96.js
// @updateURL    https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E9%9B%AA%E7%90%83%EF%BC%9A%E6%A0%87%E7%82%B9%E7%AC%A6%E5%8F%B7%E6%A0%BC%E5%BC%8F%E5%8C%96.js
// ==/UserScript==

(function () {
    'use strict';

    const location = window.location.href

    // 如果是雪球的股票页面
    if (/https:\/\/xueqiu.com\/\d+\/\d+/.test(location)) {
        // 遍历所有 h-char 标签，替换为文本
        for (const hchar of document.querySelectorAll('h-char')) {
            hchar.replaceWith(hchar.textContent)
        }

        // 遍历所有 a 标签，如果有 xq_stock 类，则替换为文本
        for (const anchor of document.querySelectorAll('a')) {
            if (anchor.classList.contains('xq_stock')) {
                anchor.replaceWith(anchor.textContent)
            }
        }
    }
})();