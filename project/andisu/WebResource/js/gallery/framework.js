
define(function (require, exports, module) {
    var $ = this.jQuery;
    $('.submenu > a').click(function (e) {
        e.preventDefault();
        var submenu = $(this).siblings('ul');
        var li = $(this).parents('li');
        var submenus = $('#sidebar li.submenu ul');
        var submenus_parents = $('#sidebar li.submenu');
        if (li.hasClass('open')) {
            if (($(window).width() > 768) || ($(window).width() < 479)) {
                submenu.slideUp();
            } else {
                submenu.fadeOut(250);
            }
            li.removeClass('open');
        } else {
            if (($(window).width() > 768) || ($(window).width() < 479)) {
                submenus.slideUp();
                submenu.slideDown();
            } else {
                submenus.fadeOut(250);
                submenu.fadeIn(250);
            }
            submenus_parents.removeClass('open');
            li.addClass('open');
        }
    });

    var ul = $('#sidebar > ul');

    $('#sidebar > a').click(function (e) {
        e.preventDefault();
        var sidebar = $('#sidebar');
        if (sidebar.hasClass('open')) {
            sidebar.removeClass('open');
            ul.slideUp(250);
        } else {
            sidebar.addClass('open');
            ul.slideDown(250);
        }
    });

    $("#a_logout").click(function () {
        exports.logout();
    });

    exports.cookie = {
        /**
　　        * @description 保存cookie，支持一维和二维
           * @param {string} name cookie名字
           * @param {string/json} value cookie值<br/>
           * 示例1二维：json格式 {Advalue:'x1',Type:'x2'}<br/>
           * 示例2一维：字符串格式 'x1'
           * @param {json} options 扩展参数<br/>
           * 示例：{topdomain:true,expires:10}
           * @returns void
　　        */
        set: function (name, value, options) {
            var cv = "";
            options = options || {};
            value = value || null;

            if (value == null) {
                options = $.extend({}, options);
                options.expires = -1;
            }

            if (value != null && typeof (value) == "string") {
                cv = escape(value).replace(/\+/g, "%2b");
            } else if (value != null && typeof (value) == "object") {
                var jsonv = $.hFramework.cookie.ToJson($.hFramework.cookie.get(name));
                if (jsonv == false) jsonv = {};
                for (var k in value) {
                    eval("jsonv." + k + "=\"" + value[k] + "\"");
                }
                for (var k in jsonv) {
                    cv += k + '=' + escape(jsonv[k]).replace(/\+/g, "%2b") + '&';
                }
                cv = cv.substring(0, cv.length - 1);
            }

            var expires = "";
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = "; expires=" + date.toUTCString();
            }
            var path = options.path ? "; path=" + (options.path) : "; path=/";
            var domain = options.domain ? "; domain=" + (options.domain) : "";
            if (options.topdomain) {
                var host = location.hostname
                hostindex = host.indexOf('.');
                if (hostindex > 0) {
                    host = host.substring(hostindex);
                    domain = "; domain=" + host;
                }
            }
            var secure = options.secure ? "; secure" : "";
            document.cookie = [name, '=', cv, expires, path, domain, secure].join('');
        },
        /**
　　        * @description 获取cookie
        * @param {string} n cookie名字
        * @param {string} k 二维cookie的子键名<br/>
        * @returns {string} 值
            $.hFramework.cookie.get("test");
　　        */
        get: function (n, k) {
            var reg = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
            var arr = document.cookie.match(reg);
            if (arguments.length == 2) {
                if (arr != null) {
                    var kArr, kReg = new RegExp("(^| |&)" + k + "=([^&]*)(&|$)");
                    var c = arr[2];
                    var c = c ? c : document.cookie;
                    if (kArr = c.match(kReg)) {
                        return unescape(kArr[2].replace(/\+/g, "%20"));
                    } else {
                        return "";
                    }
                } else {
                    return "";
                }
            } else if (arguments.length == 1) {
                if (arr != null) {
                    return unescape(arr[2].replace(/\+/g, "%20"));
                } else {
                    return "";
                }
            }
        },
        /**
　　        * @description 删除cookie
        * @param {string} name cookie名字
        * @param {json} options 指定domain<br/>
        * @returns {void}
　　        */
        clear: function (name, options) {
            var expires = ";expires=Thu, 01-Jan-1900 00:00:01 GMT";
            var path = options.path ? "; path=" + (options.path) : "; path=/";
            var domain = options.domain ? "; domain=" + (options.domain) : "";
            if (options.topdomain) {
                var host = location.hostname
                hostindex = host.indexOf('.');
                if (hostindex > 0) {
                    host = host.substring(hostindex);
                    domain = "; domain=" + host;
                }
            }
            var secure = options.secure ? "; secure" : "";
            document.cookie = [name, '=', expires, path, domain, secure].join('');
        }
    };
    exports.request = function(key){
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        else
            return null;
    };
    //退出登录
    exports.logout = function () {
        $.post("/ajax/common/logout.aspx?timer=" + Date.now, function () {

            exports.cookie.clear("HenryProjectUser", "/");
            location.reload();
        });
    }
});