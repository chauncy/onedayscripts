/*
小程序：团油官方号
变量
export tyhd='token'
多号@或者换行
挂上别进小程序了
进一次token就刷新变一次
*/
const $ = new Env('团油');
const axios = require('axios');
const {
    log
} = console;
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
let tyhd = ($.isNode() ? process.env.tyhd : $.getdata("tyhd")) || ""
let tyhdArr = [];
let data = '';
let msg = '';
var hours = new Date().getMonth();
var timestamp = Math.round(new Date().getTime()).toString();
!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs()))
            return;
        else {

            log(`\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000).toLocaleString()} \n=============================================\n`);


            log(`\n============ 微信小程序：柠檬玩机 ============`)
            log(`\n=================== 共找到 ${tyhdArr.length} 个账号 ===================`)
            if (debug) {
                log(`【debug】 这是你的全部账号数组:\n ${tyhdArr}`);
            }
            for (let index = 0; index < tyhdArr.length; index++) {

                let num = index + 1
                addNotifyStr(`\n==== 开始【第 ${num} 个账号】====\n`, true)

                tyhd = tyhdArr[index];
                await checkin()
                await getDailyTaskList()
                await queryAccountDetails4App()
                await SendMsg(msg);
            }
        }
    }
})()
    .catch((e) => log(e))
    .finally(() => $.done())

async function checkin() {
    return new Promise((resolve) => {
        bodys = {
            cityCode: '021',
            app_key: 'mp1.0',
            timestamp: timestamp,
            token: tyhd,
            shumeiID: 'WC39ZUyXRgdEsOYtc3gRovk9gYdJEdRRCokuECFRqdPig0A1c1s+GvTAEslRQRwqzbuKRgV0eosjw2X2GjQBU2+ooFHLAYiW0tL/WmrP2Tauiuo9Z2Nzm4Q==1487577677129',
            black_box: 'uMPSB16832951619osLqfLZEqa',
        }
        bodys.sign = ss(bodys)
        var options = {
            method: 'POST',
            url: 'https://mpcs.czb365.com/services/v3/welfareCentreFacadeResource/signIn',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
            },
            data: bodys
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url ===============`);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {

            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】===============这是 返回data==============`);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 200) {
                    log(data.result.endReward)
                } else
                    log(data.message)


            } catch (e) {
                log(`异常：${data}，原因：${data.message}`)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            //这里处理正确返回
            resolve();
        });
    })

}

async function getDailyTaskList() {
    return new Promise((resolve) => {
        bodys = {
            app_key: 'mp1.0',
            timestamp: timestamp,
            token: tyhd,
            shumeiID: 'WC39ZUyXRgdEsOYtc3gRovk9gYdJEdRRCokuECFRqdPig0A1c1s+GvTAEslRQRwqzbuKRgV0eosjw2X2GjQBU2+ooFHLAYiW0tL/WmrP2Tauiuo9Z2Nzm4Q==1487577677129',
            black_box: 'uMPSB16832951619osLqfLZEqa',
        }
        bodys.sign = ss(bodys)
        var options = {
            method: 'POST',
            url: 'https://mpcs.czb365.com/services/v3/welfareCentreFacadeResource/getDailyTaskList',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
            },
            data: bodys
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url ===============`);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {

            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】===============这是 返回data==============`);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 200) {
                    list = data.result
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].taskStatus !== 2 && list[i].taskId !== null) {
                            log(list[i].taskTitle)
                            await sendReward(list[i].taskType, list[i].taskId)
                        } else
                            log('任务已完成')
                    }
                } else
                    log(data.message)


            } catch (e) {
                log(`异常：${data}，原因：${data.message}`)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            //这里处理正确返回
            resolve();
        });
    })

}

async function sendReward(taskType, taskId) {
    return new Promise((resolve) => {
        bodys = {
            taskType: taskType,
            taskId: taskId,
            app_key: 'mp1.0',
            timestamp: timestamp,
            token: tyhd,
            shumeiID: 'WC39ZUyXRgdEsOYtc3gRovk9gYdJEdRRCokuECFRqdPig0A1c1s+GvTAEslRQRwqzbuKRgV0eosjw2X2GjQBU2+ooFHLAYiW0tL/WmrP2Tauiuo9Z2Nzm4Q==1487577677129',
            black_box: 'uMPSB16832951619osLqfLZEqa',
        }
        bodys.sign = ss(bodys)
        var options = {
            method: 'POST',
            url: 'https://mpcs.czb365.com/services/v3/welfareCentreFacadeResource/sendReward',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
            },
            data: bodys
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url ===============`);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {

            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】===============这是 返回data==============`);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 200) {
                    log(data.result)
                } else
                    log(data.message)


            } catch (e) {
                log(`异常：${data}，原因：${data.message}`)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            //这里处理正确返回
            resolve();
        });
    })

}

async function queryAccountDetails4App() {
    return new Promise((resolve) => {
        bodys = {
            accountType: 90,
            pageIndex: 1,
            pageSize: 10,
            app_key: 'mp1.0',
            timestamp: timestamp,
            token: tyhd,
            shumeiID: 'WC39ZUyXRgdEsOYtc3gRovk9gYdJEdRRCokuECFRqdPig0A1c1s+GvTAEslRQRwqzbuKRgV0eosjw2X2GjQBU2+ooFHLAYiW0tL/WmrP2Tauiuo9Z2Nzm4Q==1487577677129',
            black_box: 'pMPSM16832999114MBUSEvl655',
        }
        bodys.sign = ss(bodys)
        var options = {
            method: 'POST',
            url: 'https://mpcs.czb365.com/services/v3/accountFacade/queryAccountDetails4App',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
            },
            data: bodys
        };
        if (debug) {
            log(`\n【debug】=============== 这是  请求 url ===============`);
            log(JSON.stringify(options));
        }
        axios.request(options).then(async function (response) {

            try {
                data = response.data;
                if (debug) {
                    log(`\n\n【debug】===============这是 返回data==============`);
                    log(JSON.stringify(response.data));
                }
                if (data.code == 200) {
                    log(data.result.accounts[0].accountBalance+data.result.accounts[0].accountDesc)
                    log(data.result.accounts[0].noWithdrawalDesc)
                    msg +='\n'+data.result.accounts[0].accountBalance+data.result.accounts[0].accountDesc
                    msg +='\n'+data.result.accounts[0].noWithdrawalDesc
                } else
                    log(data.message)


            } catch (e) {
                log(`异常：${data}，原因：${data.message}`)
            }
        }).catch(function (error) {
            console.error(error);
        }).then(res => {
            //这里处理正确返回
            resolve();
        });
    })

}

function r(r, n) {
    return r << n | r >>> 32 - n
}

function n(r, n) {
    var t, o, e, u, f;
    return e = 2147483648 & r, u = 2147483648 & n, f = (1073741823 & r) + (1073741823 & n), (t = 1073741824 & r) & (o = 1073741824 & n) ? 2147483648 ^ f ^ e ^ u : t | o ? 1073741824 & f ? 3221225472 ^ f ^ e ^ u : 1073741824 ^ f ^ e ^ u : f ^ e ^ u
}

function t(t, o, e, u, f, i, a) {
    return t = n(t, n(n(function (r, n, t) {
        return r & n | ~r & t
    }(o, e, u), f), a)), n(r(t, i), o)
}

function o(t, o, e, u, f, i, a) {
    return t = n(t, n(n(function (r, n, t) {
        return r & t | n & ~t
    }(o, e, u), f), a)), n(r(t, i), o)
}

function e(t, o, e, u, f, i, a) {
    return t = n(t, n(n(function (r, n, t) {
        return r ^ n ^ t
    }(o, e, u), f), a)), n(r(t, i), o)
}

function u(t, o, e, u, f, i, a) {
    return t = n(t, n(n(function (r, n, t) {
        return n ^ (r | ~t)
    }(o, e, u), f), a)), n(r(t, i), o)
}

function f(r) {
    var n, t = "",
        o = "";
    for (n = 0; n <= 3; n++) t += (o = "0" + (r >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2);
    return t
}

function md5(r) {
    var i, a, c, C, h, g, d, m, S, s = Array();
    for (s = function (rr) {
        var n, t = rr.length,
            o = t + 8,
            e = 16 * ((o - o % 64) / 64 + 1),
            u = Array(e - 1),
            f = 0,
            i = 0;
        for (; i < t;) f = i % 4 * 8, u[n = (i - i % 4) / 4] = u[n] | r.charCodeAt(i) << f, i++;
        return f = i % 4 * 8, u[n = (i - i % 4) / 4] = u[n] | 128 << f, u[e - 2] = t << 3, u[e - 1] = t >>> 29, u
    }(r = function (rr) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = rr.charCodeAt(t);
            o < 128 ? n += String.fromCharCode(o) : o > 127 && o < 2048 ? (n += String.fromCharCode(o >> 6 | 192), n += String.fromCharCode(63 & o | 128)) : (n += String.fromCharCode(o >> 12 | 224), n += String.fromCharCode(o >> 6 & 63 | 128), n += String.fromCharCode(63 & o | 128))
        }
        return n
    }(r)), g = 1732584193, d = 4023233417, m = 2562383102, S = 271733878, i = 0; i < s.length; i += 16) a = g, c = d, C = m, h = S, g = t(g, d, m, S, s[i + 0], 7, 3614090360), S = t(S, g, d, m, s[i + 1], 12, 3905402710), m = t(m, S, g, d, s[i + 2], 17, 606105819), d = t(d, m, S, g, s[i + 3], 22, 3250441966), g = t(g, d, m, S, s[i + 4], 7, 4118548399), S = t(S, g, d, m, s[i + 5], 12, 1200080426), m = t(m, S, g, d, s[i + 6], 17, 2821735955), d = t(d, m, S, g, s[i + 7], 22, 4249261313), g = t(g, d, m, S, s[i + 8], 7, 1770035416), S = t(S, g, d, m, s[i + 9], 12, 2336552879), m = t(m, S, g, d, s[i + 10], 17, 4294925233), d = t(d, m, S, g, s[i + 11], 22, 2304563134), g = t(g, d, m, S, s[i + 12], 7, 1804603682), S = t(S, g, d, m, s[i + 13], 12, 4254626195), m = t(m, S, g, d, s[i + 14], 17, 2792965006), g = o(g, d = t(d, m, S, g, s[i + 15], 22, 1236535329), m, S, s[i + 1], 5, 4129170786), S = o(S, g, d, m, s[i + 6], 9, 3225465664), m = o(m, S, g, d, s[i + 11], 14, 643717713), d = o(d, m, S, g, s[i + 0], 20, 3921069994), g = o(g, d, m, S, s[i + 5], 5, 3593408605), S = o(S, g, d, m, s[i + 10], 9, 38016083), m = o(m, S, g, d, s[i + 15], 14, 3634488961), d = o(d, m, S, g, s[i + 4], 20, 3889429448), g = o(g, d, m, S, s[i + 9], 5, 568446438), S = o(S, g, d, m, s[i + 14], 9, 3275163606), m = o(m, S, g, d, s[i + 3], 14, 4107603335), d = o(d, m, S, g, s[i + 8], 20, 1163531501), g = o(g, d, m, S, s[i + 13], 5, 2850285829), S = o(S, g, d, m, s[i + 2], 9, 4243563512), m = o(m, S, g, d, s[i + 7], 14, 1735328473), g = e(g, d = o(d, m, S, g, s[i + 12], 20, 2368359562), m, S, s[i + 5], 4, 4294588738), S = e(S, g, d, m, s[i + 8], 11, 2272392833), m = e(m, S, g, d, s[i + 11], 16, 1839030562), d = e(d, m, S, g, s[i + 14], 23, 4259657740), g = e(g, d, m, S, s[i + 1], 4, 2763975236), S = e(S, g, d, m, s[i + 4], 11, 1272893353), m = e(m, S, g, d, s[i + 7], 16, 4139469664), d = e(d, m, S, g, s[i + 10], 23, 3200236656), g = e(g, d, m, S, s[i + 13], 4, 681279174), S = e(S, g, d, m, s[i + 0], 11, 3936430074), m = e(m, S, g, d, s[i + 3], 16, 3572445317), d = e(d, m, S, g, s[i + 6], 23, 76029189), g = e(g, d, m, S, s[i + 9], 4, 3654602809), S = e(S, g, d, m, s[i + 12], 11, 3873151461), m = e(m, S, g, d, s[i + 15], 16, 530742520), g = u(g, d = e(d, m, S, g, s[i + 2], 23, 3299628645), m, S, s[i + 0], 6, 4096336452), S = u(S, g, d, m, s[i + 7], 10, 1126891415), m = u(m, S, g, d, s[i + 14], 15, 2878612391), d = u(d, m, S, g, s[i + 5], 21, 4237533241), g = u(g, d, m, S, s[i + 12], 6, 1700485571), S = u(S, g, d, m, s[i + 3], 10, 2399980690), m = u(m, S, g, d, s[i + 10], 15, 4293915773), d = u(d, m, S, g, s[i + 1], 21, 2240044497), g = u(g, d, m, S, s[i + 8], 6, 1873313359), S = u(S, g, d, m, s[i + 15], 10, 4264355552), m = u(m, S, g, d, s[i + 6], 15, 2734768916), d = u(d, m, S, g, s[i + 13], 21, 1309151649), g = u(g, d, m, S, s[i + 4], 6, 4149444226), S = u(S, g, d, m, s[i + 11], 10, 3174756917), m = u(m, S, g, d, s[i + 2], 15, 718787259), d = u(d, m, S, g, s[i + 9], 21, 3951481745), g = n(g, a), d = n(d, c), m = n(m, C), S = n(S, h);
    return (f(g) + f(d) + f(m) + f(S)).toUpperCase()
};

function ss(e) {
    var n = function e(t) {
        var u = t.length;
        if (u < 2) return t;
        var n = [],
            a = [],
            o = t.splice(Math.floor(u / 2), 1)[0];
        return t.forEach((function (e) {
            return (e < o ? n : a).push(e)
        })),
            [].concat((e(n)), [o], (e(a)))
    }(Object.keys(e)).reduce((function (r, t) {
        return "".concat(r).concat(t).concat(e[t])
    }), "");

    return md5("".concat('aff7f768de81bb5f4e7c9bfba518c').concat(n).concat('aff7f768de81bb5f4e7c9bfba518c')).toLowerCase()
};

async function Envs() {
    if (tyhd) {
        if (tyhd.indexOf("@") != -1) {
            tyhd.split("@").forEach((item) => {

                tyhdArr.push(item);
            });
        } else if (tyhd.indexOf("\n") != -1) {
            tyhd.split("\n").forEach((item) => {
                tyhdArr.push(item);
            });
        } else {
            tyhdArr.push(tyhd);
        }
    } else {
        log(`\n 【${$.name}】：未填写变量 tyhd`)
        return;
    }

    return true;
}

function addNotifyStr(str, is_log = true) {
    if (is_log) {
        log(`${str}\n`)
    }
    msg += `${str}\n`
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        log(message);
    }
}

var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}

function randomString(m) {
    for (var e = m > 0 && void 0 !== m ? m : 21, t = ""; t.length < e;) t += Math.random().toString(36).slice(2);
    return t.slice(0, e)
}

function randomnum(e) {
    e = e || 32;
    var t = "1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}