define("bindhelper", function (require, exports, module) {

    (function (window) {
        var $ = jQuery;
        var framework = require('gallery/framework.js');
        exports.AjaxProObject = "";
        exports.trHtml = "";
        exports._callBak = null,
        exports._CurrentPageIndex = 1,
        require("AjaxProUI").init(window);
        exports.init = function (callBak) {
            $("#tbl_List [name='title-table-checkbox']").each(function () {
                $(this).parent().removeClass("checked");
            });
            exports.trHtml = $("#tbl_List tr").eq(1).html();
            $("#tbl_List").append('<tr name=\"tr_loading\"><td colspan="10"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></td><tr>');
            this.search(null, callBak);
            $("#btn_search").click(function () {
                exports.search(null, callBak);
            });
            $("#btn_clear").click(function () {
                $(".Consearch input").each(function () {
                    $(this).val("");
                });
                $(".Consearch select").each(function () {
                    $(this).val("-1");
                });
            });
            //回车事件,查询数据
            $(document).keyup(function (ev) {
                if (ev.keyCode == 13) {
                    exports.search();
                    return false;
                }
            });
            $("#div_condition").click(function () {
                exports._CurrentPageIndex = 1;
            });
        },
        exports.search = function (CurrentPage, callBak) {
            if (CurrentPage) {
                exports._CurrentPageIndex = CurrentPage;
            } else {
                CurrentPage = exports._CurrentPageIndex;
            }
            //获取搜索条件
            var SEntity = {
                Condition: {},
                PagingInfo: {}
            };
            //对象查询条件
            $(".controls input:text").each(function () {
                SEntity.Condition[$(this).attr("data-Name")] = $(this).val();
            });
            $(".controls select").each(function () {
                SEntity.Condition[$(this).attr("data-Name")] = $(this).val();
            });
            var conCheckbox = new Array();
            $(".controls input:checkbox").each(function () {
                if ($(this).attr("data-Name") && $(this).attr("data-Name").length > 0) {
                    conCheckbox.push($(this).attr("data-Name"));
                }
            });
            if (conCheckbox.length > 0) {

                for (var i = 0; i < conCheckbox.length; i++) {
                    var condataName = conCheckbox[i];
                    var conCheckboxVal = "";
                    $("[name='" + condataName + "']:checked").each(function () {
                        conCheckboxVal += $(this).val() + ",";
                    });
                    if (conCheckboxVal.length > 0) {
                        conCheckboxVal = conCheckboxVal.substring(0, conCheckboxVal.length - 1);
                        SEntity.Condition[condataName] = conCheckboxVal;
                    }
                }
            }
            //分页条件
            SEntity.PagingInfo["PageSize"] = 10;
            if (CurrentPage) {
                SEntity.PagingInfo["PageIndex"] = CurrentPage;
            }
            else {
                SEntity.PagingInfo["PageIndex"] = 1;
            }


            $("#pageIndex").val(SEntity.PagingInfo["PageIndex"]);
            exports.AjaxProObject.Search(SEntity, function (ajaxResult) {
                if (ajaxResult.error) {
                    //document.write(ajaxResult.error.Message);
                }
                else if (ajaxResult.value) {
                    var json = eval("(" + ajaxResult.value + ")");
                    if (json) {
                        exports.bindList(json, $("#tbl_List"), callBak);
                    }
                } else {
                    $("tr[name*='bind']").remove();
                    $("#tbl_List tr").eq(1).remove();
                    $("#tbl_List").append("<tr name=\"bind\"><td colspan='20'>暂无信息..!</td></tr>");
                }
            });
        },
        exports.bind = function (ajaxResult, dataControl) {
            $(dataControl).find("[name*='tr_loading']").remove();

            if (ajaxResult.error) {
                document.write(ajaxResult.error.Message);
            }
            else if (ajaxResult.value) {
                var json = eval("(" + ajaxResult.value + ")");
                if (json) {
                    exports.bindList(json, dataControl);
                }
            } else {
                $(dataControl).find("tr[name*='bind']").remove();
                $(dataControl).find("tr").eq(1).remove();
                $(dataControl).append("<tr name=\"bind\"><td colspan='20'>暂无信息..!</td></tr>");
            }
        },
        exports.bindList = function (data, dataControl, callBak) {
            $(dataControl).find("tr[name*='bind']").remove();
            $(dataControl).find("tr").eq(1).remove();
            $(dataControl).find("tr[name*='tr_loading']").remove();
            //循环数据源 给列表绑值
            if (data.length > 0) {
                $(data).each(function () {
                    var tData = this;
                    var replaceHtml = exports.trHtml;
                    if (replaceHtml == "") {
                        replaceHtml = trHtml;
                        exports.trHtml = trHtml;
                    }
                    $(exports.trHtml).filter("td").each(function () {
                        if ($(this).attr("bind") != "" && $(this).attr("bind") != null) {
                            var bindTag = $(this).attr("bind");
                            var newBindTag = bindTag.substring(2);
                            var oldTdHtml = $(this).context.outerHTML;
                            if (!tData[newBindTag]) {
                                console.log(newBindTag + " is null !");
                            }
                            if (tData[newBindTag].toString()) {
                                var html = $(this).html();
                                if (html == "") {
                                    if (newBindTag == "InDateStr") {
                                        tData[newBindTag] = tData[newBindTag].substr(0, 10);
                                    }
                                    var newTdHtml = $(this).html(tData[newBindTag]).context.outerHTML;
                                    replaceHtml = replaceHtml.replace(oldTdHtml, newTdHtml);
                                } else {
                                    var val = tData[newBindTag];
                                    html = html.replace("$.Value", val);
                                    html = html.replace("$.Value", val);
                                    html = html.replace("$.Value", val);
                                    var newTdHtml = $(this).html(html).context.outerHTML;
                                    replaceHtml = replaceHtml.replace(oldTdHtml, newTdHtml);
                                }
                            }
                        }
                    });
                    //$("#pageTotal").html(tData.TotalCount);
                    $("#pageTotal").val(tData.TotalCount);
                    var pageSize = $("#pageSize").val();
                    var pageCount = tData.TotalCount % pageSize == 0 ? tData.TotalCount / pageSize : parseInt(tData.TotalCount / pageSize) + 1;
                    //$("#pageCount").html(pageCount);
                    $("#pageCount").val(pageCount);
                    $(dataControl).append("<tr name=\"bind\">" + replaceHtml + "</tr>");


                });

                jQuery("#tbl_List [name='selectElement']").click(function () {
                    if (jQuery(this).is(":checked")) {
                        jQuery(this).parent().addClass("checked");
                    } else {
                        jQuery(this).parent().removeClass("checked");
                    }
                });

                $.get("/UserControls/UCPaginationBar_Ajax.aspx?PageSize=" + $("#pageSize").val() + "&RecordCount=" + $("#pageTotal").val() + "&CurrentPageNumber=" + $("#pageIndex").val(), function (result) {
                    $("#div_pager").html(result);
                    exports.bindPagerEvent();
                })

            } else {
                $(dataControl).append("<tr name=\"bind\"><td colspan='20'>暂无信息..!</td></tr>");
                $("#div_pager").html("");
            }
            $(".container-fluid .progress").remove();
            if (callBak) {
                callBak();
            }
        },
        exports.setPage = function (pageIndex) {
            //var pageIndex = $("#txt_pageIndex").val();
            var pageCount = $("#pageCount").val();
            if (pageIndex < 1) {
                pageIndex = 1;
            } else if (pageIndex > pageCount) {
                pageIndex = pageCount;
            }
            if (pageIndex != $("#pageIndex").val()) {
                this.search(pageIndex);
            }
        },
        exports.nextPage = function () {
            var pageCount = $("#pageCount").val();
            var pageIndex = $("#pageIndex").val();
            pageIndex = parseInt(pageIndex) + 1;
            if (pageIndex <= pageCount) {
                this.search(pageIndex);
            }
        },
        exports.prevPage = function () {
            var pageIndex = $("#pageIndex").val();
            pageIndex = parseInt(pageIndex) - 1;
            if (pageIndex >= 1) {
                this.search(pageIndex);
            }
        },
        exports.lastPage = function () {
            var pageIndex = $("#pageCount").val();
            if (pageIndex >= 1) {
                this.search(pageIndex);
            }
        },
        exports.firstPage = function () {
            this.search(1);
        },
        exports.selectElement = function (obj) {
            if ($(obj).is(":checked")) {

                $(obj).attr("checked", true);
                $(obj).parent().addClass("checked");
                $("#tbl_List [name='selectElement']").attr("checked", true);
                $("#tbl_List [name='selectElement']").each(function () {
                    $(this).parent().addClass("checked");
                });
            } else {
                $(obj).attr("checked", false);
                $(obj).parent().removeClass("checked");
                $("#tbl_List [name='selectElement']").attr("checked", false);
                $("#tbl_List [name='selectElement']").each(function () {
                    $(this).parent().removeClass("checked");
                });
            }
        },
        exports.getSelectElementSysNo = function () {
            var ids = "";
            $("[name='selectElement']:checked").each(function () {
                ids += $(this).val() + ",";
            });
            if (ids.length > 0) {
                ids = ids.substring(0, ids.length - 1)
            }
            return ids;
        }, exports.SetEntity = function () {
            var SEntity = {
            };
            $("[bind]").each(function () {
                if (!SEntity[$(this).attr("bind")]) {
                    if ($(this).get(0).type == "text") {
                        SEntity[$(this).attr("bind")] = $(this).val();
                    } else if ($(this).get(0).tagName == "TEXTAREA") {
                        SEntity[$(this).attr("bind")] = $(this).val();
                    }
                    else if ($(this).get(0).type == "radio") {
                        $("[bind='" + $(this).attr("bind") + "']").each(function () {
                            if ($(this).attr("checked") == "checked") {
                                SEntity[$(this).attr("bind")] = $(this).val();
                            }
                        });
                    } else if ($(this).get(0).tagName == "SELECT") {
                        SEntity[$(this).attr("bind")] = $("[bind='" + $(this).attr("bind") + "']").val();
                    }
                    else {
                        SEntity[$(this).attr("bind")] = $(this).html();
                    }
                }
            });
            return SEntity;
        }, exports.bindEntity = function (SEntity) {
            $("[bind]").each(function () {
                if ($(this).get(0).tagName == "DIV") {
                    $(this).html(SEntity[$(this).attr("bind")]);
                } else if ($(this).get(0).type == "radio") {
                    var val = SEntity[$(this).attr("bind")];
                    $("[bind='" + $(this).attr("bind") + "']").each(function () {
                        if ($(this).val() == val) {
                            $("[bind='" + $(this).attr("bind") + "']").removeAttr("checked");
                            $("[bind='" + $(this).attr("bind") + "']").parent().removeAttr("class");
                            $(this).attr("checked", "checked");
                            $(this).parent().attr("class", "checked");
                        }
                    });
                } else if ($(this).get(0).tagName == "SELECT") {
                    var bind = $(this).attr("bind");
                    $("[bind='" + bind + "'] option").each(function () {
                        if (SEntity[bind] == $(this).val()) {
                            $("[bind='" + bind + "']").parent().find(".select2-choice span").html($("[bind='" + bind + "']").find("[value='" + $(this).val() + "']").html());
                        }
                    });
                    $("[bind='" + bind + "']").val(SEntity[bind]);
                } else {
                    $(this).val(SEntity[$(this).attr("bind")]);
                }
            });
        },
        exports.bindPagerEvent = function (defaultText) {
            $("#div_pager a").on("click", function () {
                var txt = $(this).html();
                if (txt == "上一页") {
                    exports.prevPage();
                } else if (txt == "下一页") {
                    exports.nextPage();
                } else if (txt == "首页") {
                    exports.firstPage();
                } else if (txt == "尾页") {
                    exports.lastPage();
                }
            });
            if (!$("#setShowPageNav").length || !$("#btnSetShowPageNav").length) {
                return;
            }

            $("#setShowPageNav").focus(function () {
                $("#setShowPageNav").val("");
                $("#btnSetShowPageNav").show();
            });
            $("#setShowPageNav").blur(function () {
                if ($("#setShowPageNav").val() == "" || $("#setShowPageNav").val() == defaultText) {
                    $("#setShowPageNav").val(defaultText);
                    $("#btnSetShowPageNav").hide();
                }
            });

            $("#btnSetShowPageNav").click(function () {
                var url = $("#btnSetShowPageNav").attr("ref1");
                var qty = $.trim($("#setShowPageNav").val());
                var page = parseInt(qty, 10);
                var number = 1;
                var regexNumber = /^[0-9]*[1-9][0-9]*$/;

                if (regexNumber.test(qty) == false || isNaN(page) == true || page <= 0) {
                    number = 1;
                }
                else if (page > 9999) {
                    number = 9999;
                }
                else {
                    number = page;
                }
                url += number;
                window.location.href = url;
                return false;
            });
        }
    })(window);
});