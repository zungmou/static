// ==UserScript==
// @name         知乎：格式化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除复制的限制；去除图片的懒加载；去除链接的跳转；
// @author       zungmou
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E7%9F%A5%E4%B9%8E%EF%BC%9A%E6%A0%BC%E5%BC%8F%E5%8C%96.js
// @updateURL    https://raw.githubusercontent.com/zungmou/static/main/tampermonkey/%E7%9F%A5%E4%B9%8E%EF%BC%9A%E6%A0%BC%E5%BC%8F%E5%8C%96.js
// ==/UserScript==

(function () {
    'use strict';

    let originalAddEventListener = Element.prototype.addEventListener;

    Object.defineProperty(Element.prototype, 'addEventListener', {
        value: function (type, listener, options) {
            let element = this;

            if (type === 'copy') {
                return;
            }

            originalAddEventListener.call(element, type, listener, options);
        },
        writable: true,
        configurable: true
    });


    function format() {
        // 遍历所有 img 元素
        for (let img of document.querySelectorAll('img')) {
            let figure;

            try {
                // 引用 img 元素的爷元素：figure > div > img
                figure = img.parentNode.parentNode;

                // 测试引用的爷元素是否为 figure 元素
                if (figure.tagName !== 'FIGURE') {
                    throw new Error();
                }

                if (figure.style.display === 'none') {
                    continue;
                }
            }
            catch (e) {
                continue;
            }

            // 获取 img 元素的 data-original 属性
            const original = img.getAttribute('data-original');

            // 如果 img 元素没有 data-original 属性，则跳过
            if (!original) {
                continue;
            }

            // 查找 src 属性为 data-original 的 img 元素
            const src = document.querySelector(`img[src="${original}"]`);

            // 如果找到了，则将 src 属性替换为 data-original 属性
            if (!src) {
                // 将 img 元素的 src 属性替换为 data-original 属性
                const newImg = document.createElement('img');
                newImg.src = original;
                newImg.style.maxWidth = '100%';

                // 创建一个新的 p 元素
                const p = document.createElement('p');
                p.style.textAlign = 'center';

                // 将 img 元素的父元素替换为 p 元素
                p.appendChild(newImg);

                // 将 p 元素插入到 figure 元素的前面
                figure.parentNode.insertBefore(p, figure);

                // 隐藏 figure 元素
                figure.style.display = 'none';
            }
        }

        // 将所有 RichContent-EntityWord.css-pgtd2j 元素替换为纯文本
        for (let anchor of document.querySelectorAll('a.RichContent-EntityWord.css-pgtd2j')) {
            anchor.replaceWith(anchor.innerText);
        }

        // 遍历所有 a 元素
        for (let a of document.querySelectorAll('a')) {
            const href = a.getAttribute('href');

            if (!href) {
                continue;
            }

            // 如果 a 元素的 href 属性以 “https://link.zhihu.com/?target=” 开头，则将 a 元素的 href 属性替换为去掉前缀的链接
            if (href.startsWith('https://link.zhihu.com/?target=')) {
                a.href = decodeURIComponent(href.substring('https://link.zhihu.com/?target='.length));
            }
        }
    }

    setInterval(format, 5000);
    format();
})();