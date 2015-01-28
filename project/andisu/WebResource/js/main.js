        seajs.config({
        // 别名配置
        alias: {
            "jQuery": "jquery/jquery.js",
            "bootstrap": "bootstrap/bootstrap.min.js",
            "pajax": "pjax/jquery.pjax.js",
            'es5-safe': "gallery/es5-safe.js",
            'json': "gallery/json.js",
            'minErrr':'angular/minErrr.js',
            'angular':'angular/angular.js',
            'bindhelper': 'gallery/bindhelper.js',
            'daterangepicker': "daterangepicker/daterangepicker.js",
            'moment': "daterangepicker/moment.js",
            'jqueryUIC': 'gallery/jquery.ui.custom.js',
            'ui': 'gallery/ui.js',
            'framework': 'gallery/framework.js',    
            'mootoolsCore': 'simplemodal/mootools-core-1.3.1.js',
            'mootoolsMore': 'simplemodal/mootools-more-1.3.1.1.js',
            'simpleModal': 'simplemodal/simple-modal.js',
            'ajaxpro': 'ajaxpro/ajaxpro.js',
            'ajaxproExtend': 'ajaxpro/ajaxpro_Extend.js',
            'AjaxProUI':'gallery/ajaxpro.js'
        },
        preload: [
          Function.prototype.bind ? '' : 'es5-safe',
          this.JSON ? '' : 'json'
        ]
        });
    