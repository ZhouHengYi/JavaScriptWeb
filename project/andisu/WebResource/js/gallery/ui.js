define('ui', ['mootoolsCore', 'simpleModal'], function (require, exports, module) {
    exports.uiform = function () {
        seajs.use('gallery/jquery.uniform.js', function () {
            jQuery('input[type=checkbox],input[type=radio],input[type=file]').uniform();
        });
    };
    exports.alert = function (msg, title) {
        var simp = require('simpleModal');
        var SimpleModal = simp.init();
        exports.SM = new SimpleModal({ "btn_ok": "关闭" });
        if (!title) {
            title = "提示！";
        }
        exports.SM.show({
            "title": title,
            "contents": msg
        });
    };

    exports.confirm = function (msg, fn, title) {
        var simp = require('simpleModal');
        var SimpleModal = simp.init();
        exports.SM = new SimpleModal({ "btn_ok": "确定" });
        if (!title) {
            title = "提示！";
        }
        exports.SM.show({
            "model": "confirm",
            "callback": function () {
                fn();
            },
            "title": title,
            "contents": msg
        });
    }

    exports.model = function (url, width, height, successFn, title) {
        var simp = require('simpleModal');
        var SimpleModal = simp.init();
        exports.SM = new SimpleModal({ "hideFooter": true, "width": width });
        if (!title) {
            title = "信息编辑";
        }
        exports.SM.show({
            "title": title,
            "model": "modal",
            "contents": '<iframe src="' + url + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe>'
        });

    }
});