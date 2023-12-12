// ==UserScript==
// @name         新浪财经：去除新闻页面股票链接
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  清理新闻页面的股票链接，并且将上市公司的股票链接替换为纯文本，以便复制到其他地方时不会带上链接，避免干扰。
// @author       zungmou
// @match        https://finance.sina.com.cn/*.shtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sina.com.cn
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E6%96%B0%E6%B5%AA%E8%B4%A2%E7%BB%8F%EF%BC%9A%E5%8E%BB%E9%99%A4%E6%96%B0%E9%97%BB%E9%A1%B5%E8%82%A1%E7%A5%A8%E9%93%BE%E6%8E%A5.js
// @updateURL    https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E6%96%B0%E6%B5%AA%E8%B4%A2%E7%BB%8F%EF%BC%9A%E5%8E%BB%E9%99%A4%E6%96%B0%E9%97%BB%E9%A1%B5%E8%82%A1%E7%A5%A8%E9%93%BE%E6%8E%A5.js
// ==/UserScript==

(function () {
    'use strict';

    // 查找所有 span 标签
    for (const span of document.querySelectorAll('span')) {
        // 如果 span 的内容匹配类似于 “(4089.1838, 26.52, 0.65%)” 的格式，则删除 span
        if (span.textContent.match(/^\(\d+\.\d+, \d+\.\d+, \d+\.\d+%\)$/)) {
            span.remove();
        }
    }

    // 查找所有 a 标签
    for (const a of document.querySelectorAll('a')) {
        // 如果 a 的 href 匹配类似于：
        // https://finance.sina.com.cn/realstock/company/sz002736/nc.shtml
        // https://finance.sina.com.cn/realstock/company/sh602736/nc.shtml
        // 则将 a 的父元素替换为 a 的纯文本。
        if (a.href.match(/https:\/\/finance\.sina\.com\.cn\/realstock\/company\/(sz|sh)\d+\/nc\.shtml/)) {
            a.parentElement.replaceWith(a.textContent);
        }

    }
})();