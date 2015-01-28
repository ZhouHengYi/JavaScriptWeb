define(function (require, exports, module) {
    var AjaxProUI = {};
    (function () {
    var $ = jQuery;
    require('gallery/ui.js');

    if (typeof (AjaxPro) != "undefined" && typeof ui != "undefined") {
        AjaxPro.timeoutPeriod = 5000 * 60; //设置超时
    }
    AjaxProUI.ajax = {
        requestId: "ajax_globalId",
        onStart: function () {
            AjaxProUI.load.showOverlay({ bgColor: "#000", opacity: 0.2, zIndex: 1000 }, AjaxProUI.ajax.requestId);
            AjaxProUI.load.showNewLoading(AjaxProUI.ajax.requestId);
        },
        onStop: function () {
            AjaxProUI.load.hideOverlay(AjaxProUI.ajax.requestId);
            AjaxProUI.load.hideNewLoading(AjaxProUI.ajax.requestId);
        },
        onError: function (error) {
            ui.alert(AjaxProUI.error.Message + AjaxProUI.error.Detail);
        }
    };
    AjaxProUI.load = {
        showOverlay: function (options, overlayId, oncallback) {
            var settings = $.extend({
                bgColor: "#000",
                opacity: 0.2,
                zIndex: 499
            }, options)

            var elem = $("<div id='formMask_overlay'></div>")
                .prependTo("body")
                .attr("overlayId", overlayId)
                .css({
                    'backgroundColor': settings.bgColor,
                    'opacity': settings.opacity,
                    'z-index': settings.zIndex
                })
                .fadeIn("fast", oncallback);
            
        },
        showNewLoading: function (requestId, allowCancel) {
            var elem = $('<div id="NewLoading" class="loading"> \
                        <a href="#" class="close" title="正在处理 …… "></a> \
                        <p>正在处理 …… </p> \
                        <div class="loadImg"></div> \
                      </div>')
            .prependTo("body")
            .attr("requestId", requestId);

            $("a.close", elem).css({
                "display": allowCancel ? "" : "none"
            }).click(function () {
                $.ajaxPost.abort();
                if (typeof (AjaxPro) != "undefined") {
                    AjaxPro.abort();
                }
                return false;
            });
            setLocation();
            elem.show();
            $(window).resize(setLocation).scroll(setLocation);
            function setLocation() {
                elem.css({
                    "position": "absolute",
                    "top": $(window).scrollTop() + ($(window).height() - elem.height()) / 2,
                    "left": $(window).scrollLeft() + ($(window).width() - elem.width()) / 2
                });
            }
        },
        hideOverlay: function (overlayId, oncallback) {
            var elem = $("[id=formMask_overlay][overlayId=" + overlayId + "]").fadeOut("normal", oncallback);
            $(".bgiframe", elem).remove();
            elem.remove();
        },
        hideNewLoading: function (requestId) {
            $("[id=NewLoading][requestId=" + requestId + "]").hide().remove();
        }
    };
    window.AjaxProUI = AjaxProUI;
    })(window);

    exports.init = function (window) {
        if (typeof (window.AjaxPro) != "undefined") {
            window.AjaxPro.onLoading = function (b, request) {
                    //b ? AjaxProUI.ajax.onStart() : AjaxProUI.ajax.onStop();
            }
        }
    }
});