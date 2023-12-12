(function () {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
    const recognition = new SpeechRecognition();
    let voices = [];
    let question_func = null;
    const CHINESE_TO_ARABIC_NUMERALS_MAPPING = {
        零: '0',
        一: '1',
        二: '2',
        三: '3',
        四: '4',
        五: '5',
        六: '6',
        七: '7',
        八: '8',
        九: '9',
    }
    let auto_answer_result = false;
    let auto_answer_interval;

    speech.lang = "zh-CN";
    recognition.continuous = true;
    recognition.lang = 'cmn-Hans-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 10;

    class AssertionError extends Error { }

    function randint(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function assert(condition) {
        if (!condition) {
            throw new AssertionError("Assertion failed");
        }
    }

    function callable(func) {
        return typeof func === 'function';
    }

    function is_string(s) {
        return typeof s === 'string';
    }

    /**
     * 说话
     * @param {?String} text 
     */
    function say(text, listen) {
        setTimeout(function () {
            console.log('say', text);
            speech.text = text;
            synth.speak(speech)

            if (listen == true) {
                setTimeout(function () { start_recognition(); }, 5000)

            }
        }, 2000)
    }

    /**
     * 开启录音
     */
    function start_recognition() {
        try {
            recognition.start();
        } catch (ex) {
        }
    }

    /**
     * 设置问题
     * @param {function():int} question 用回调函数表示问题，函数执行后的结果表示为答案。
     * @param {String} description 问题描述，用于语音提示。
     */
    function set_question(question, description) {
        assert(callable(question))
        assert(is_string(description))

        question_func = question;
        console.log('Answer: ', question_func())
        document.getElementById('question').innerText = description;
        say(description, true)
    }

    /**
     * 展示新的问题
     */
    function show_new_question() {
        let N1, N2;
        let description;
        const method = document.querySelector('#method');
        const method_operator = method.options[method.selectedIndex].value;
        const method_name = method.options[method.selectedIndex].text;

        function generate_question() {
            let cb;

            if (method_operator === '+') {
                N1 = randint(1, 1000);
                N2 = randint(1, 1000);
                cb = () => N1 + N2;
            }
            else if (method_operator === '-') {
                N1 = randint(1, 1000);
                N2 = randint(10, N1);
                cb = () => N1 - N2;
            }
            else if (method_operator === '*') {
                N1 = randint(10, 100);
                N2 = randint(10, 100);
                cb = () => N1 * N2;
            }
            else if (method_operator === '/') {
                let tmp1 = randint(10, 1000);
                let tmp2 = randint(10, 100);
                N1 = tmp1 * tmp2;
                N2 = tmp2;
                cb = () => N1 / N2;
            }

            description = `${N1}${method_name}${N2}`;
            return cb;
        }

        start_recognition();
        set_question(generate_question(), description);
        clearInterval(auto_answer_interval)
        auto_answer_result = false;

        if (document.querySelector('#auto-answer').checked) {

            function answer() {
                if (auto_answer_result !== true) {
                    say(`${question_func()}`, true);
                } else {
                    clearInterval(auto_answer_interval)
                }
            }

            auto_answer_interval = setInterval(answer, 5000);
        }

    }

    function isInt(value) {
        return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
    }

    if (typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {
            return this.replace(new RegExp(match, 'g'), () => replace);
        }
    }

    recognition.onresult = function (event) {
        let last = event.results[event.results.length - 1];
        let transcript = last[last.length - 1].transcript;

        for (let key in CHINESE_TO_ARABIC_NUMERALS_MAPPING) {
            transcript = transcript.replaceAll(key, CHINESE_TO_ARABIC_NUMERALS_MAPPING[key]);
        }

        // if (transcript.includes(' ')) {
        //     let transcripts = transcript.split(' ');
        //     transcripts = transcripts.filter(x => x.trim() != '').filter(isInt).map(x => parseInt(x))

        //     if (transcripts.length == 2) {
        //         if (transcripts[0] < transcripts[1]) {
        //             transcript = (transcripts[0] * Math.pow(10, transcripts[1].toString().length - 1) + transcripts[1]).toString();
        //         } else {
        //             transcript = (transcripts[0] + transcripts[1]).toString();
        //         }
        //     }
        //     else if (transcripts.length > 0) {
        //         transcript = transcripts.map(x => parseInt(x)).reduce((x, y) => x + y).toString();
        //     }
        // }

        console.log(last)

        if (transcript.includes(`${question_func()}`)) {
            say('回答正确！');
            auto_answer_result = true;
            show_new_question();
        }
        else if (transcript.includes('跳过') || transcript.includes('下1题')) {
            show_new_question();
        }
        else if (transcript.includes('再说1次') || transcript.includes('没听清楚') || transcript.includes('重复1次') || transcript.includes('什么')) {
            // say();
        }
    }

    // recognition.onnomatch = function (event) {
    //     start_recognition();
    // }

    recognition.onerror = function (event) {
        // console.log('error')
        // start_recognition();
    }

    recognition.onend = function (event) {
        // console.log('end')
    }

    function init_voices() {
        voices = synth.getVoices();

        if (voices.length > 0) {
            synth.voice = voices[0];
        }

        let voiceSelect = document.querySelector("#voices");
        voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
    }

    synth.onvoiceschanged = init_voices;

    document.querySelector("#rate").addEventListener("input", () => {
        // Get rate Value from the input
        const rate = document.querySelector("#rate").value;

        // Set rate property of the SpeechSynthesisUtterance instance
        speech.rate = rate;

        // Update the rate label
        document.querySelector("#rate-label").innerHTML = rate;
    });

    document.querySelector("#volume").addEventListener("input", () => {
        // Get volume Value from the input
        const volume = document.querySelector("#volume").value;

        // Set volume property of the SpeechSynthesisUtterance instance
        speech.volume = volume;

        // Update the volume label
        document.querySelector("#volume-label").innerHTML = volume;
    });

    document.querySelector("#pitch").addEventListener("input", () => {
        // Get pitch Value from the input
        const pitch = document.querySelector("#pitch").value;

        // Set pitch property of the SpeechSynthesisUtterance instance
        speech.pitch = pitch;

        // Update the pitch label
        document.querySelector("#pitch-label").innerHTML = pitch;
    });

    document.querySelector("#voices").addEventListener("change", () => {
        // On Voice change, use the value of the select menu (which is the index of the voice in the global voice array)
        speech.voice = voices[document.querySelector("#voices").value];
    });

    document.querySelector("#start").addEventListener("click", () => {
        // Set the text property with the value of the textarea
        // speech.text = document.querySelector("textarea").value;

        // Start Speaking
        // synth.speak(speech);
        show_new_question()
    });

    document.querySelector("#answer").addEventListener("click", () => {
        say(`${question_func()}`);
    });
})();