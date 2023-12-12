function includeJs(jsFilePath) {
    let prefix;

    if (location.protocol === 'https:') {
        prefix = 'https://zungmou.github.io/static/%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5/';
    } else {
        if (location.pathname.split('/').slice(-2, -1) != '%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5') {
            prefix = '../';
        } else {
            prefix = './';
        }
    }

    const script = document.createElement('script');
    script.src = prefix + jsFilePath;
    document.querySelector('head').appendChild(script);
}

includeJs('pinyin_dict_withtone.js');
includeJs('pinyin_dict_polyphone.js');

const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
document.querySelector('head').appendChild(meta);

const 标点符号 = '，。！？；：、（）《》“”‘’——…—·「」『』〈〉〔〕【】〖〗〘〙〚〛～1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

window.onload = function () {
    function proc(elements) {
        for (const p of elements) {
            const text = p.textContent.split('');

            p.textContent = '';

            for (const t of text) {
                const ruby = document.createElement('ruby');

                ruby.innerText = t;

                if (!标点符号.includes(t)) {
                    const rt = document.createElement('rt');
                    const pinyin = pinyinUtil.getPinyin(t, ' ', true, true);

                    rt.innerText = pinyin;
                    rt.style.display = 'none';
                    ruby.addEventListener('click', function () {
                        this.style.display = this.style.display === 'none' ? 'block' : 'none';
                    }.bind(rt));
                    ruby.appendChild(rt);
                }

                p.appendChild(ruby);
            }
        }
    }

    function waitForDict() {
        if (typeof pinyin_dict_polyphone === 'undefined' || typeof pinyin_dict_withtone === 'undefined') {
            setTimeout(waitForDict, 1000);
        }
        else {
            includeJs('pinyinUtil.js');
            waitForUtil();
        }
    }

    function waitForUtil() {
        if (typeof pinyinUtil === 'undefined') {
            setTimeout(waitForUtil, 1000);
        }
        else {
            proc(document.querySelectorAll('p'));
            proc(document.querySelectorAll('h1'));
        }
    }

    waitForDict();
};