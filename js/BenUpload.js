/**
 * Ben图片工具，压缩工具。
 * @author Ben赖珏豪
 * @param {[type]} opts [description]
 */
var BenImageResizer = function(opts) {

    /**
     * 默认配置参数
     */
    var settings = {
        resizeMode: "auto", //压缩模式，总共有三种  auto,width,height auto表示自动根据最大的宽度及高度等比压缩，width表示只根据宽度来判断是否需要等比例压缩，height类似。
        dataSource: "", //数据源。数据源是指需要压缩的数据源，有三种类型，image图片元素，base64字符串，canvas对象，还有选择文件时候的file对象。。。
        dataSourceType: "image", //image  base64 canvas
        maxWidth: 150, //允许的最大宽度
        maxHeight: 200, //允许的最大高度。
        onTmpImgGenerate: function(img) {}, //当中间图片生成时候的执行方法。。这个时候请不要乱修改这图片，否则会打乱压缩后的结果。
        success: function(resizeImgBase64, canvas) {}, //压缩成功后图片的base64字符串数据。
        debug: false //是否开启调试模式。
    };

    var appData = {};

    // jquery扩展
    $.extend(settings, opts);

    // 调试模式
    var _debug = function(str, styles) {
        if (settings.debug == true) {
            if (styles) {
                console.log(str, styles);
            } else {
                console.log(str);
            }
        }
    };

    // 私有工具方法
    var innerTools = {

        /**
         * 获取图片的base64
         * @param  {[type]} file     [description]
         * @param  {[type]} callBack [description]
         * @return {[type]}          [description]
         */
        getBase4FromImgFile: function(file, callBack) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var base64Img = e.target.result;
                if (callBack) {
                    callBack(base64Img);
                }
            };
            reader.readAsDataURL(file);
        },

        /**
         * 处理数据源，将所有数据源都处理成为图片图片对象
         * @param  {[type]}   datasource     [description]
         * @param  {[type]}   dataSourceType [description]
         * @param  {Function} callback       [description]
         * @return {[type]}                  [description]
         */
        getImgFromDataSource: function(datasource, dataSourceType, callback) {
            var _me = this;
            var img1 = new Image();
            if (dataSourceType == "img" || dataSourceType == "image") {
                img1.src = $(datasource).attr("src");
                if (callback) {
                    callback(img1);
                }
            } else if (dataSourceType == "base64") {
                img1.src = datasource;
                if (callback) {
                    callback(img1);
                }
            } else if (dataSourceType == "canvas") {
                img1.src = datasource.toDataURL("image/jpeg");
                if (callback) {
                    callback(img1);
                }
            } else if (dataSourceType == "file") {
                _me.getBase4FromImgFile(function(base64str) {
                    img1.src = base64str;
                    if (callback) {
                        callback(img1);
                    }
                });
            }
        },

        /**
         * 计算图片的需要压缩的尺寸。当然，压缩模式，压缩限制直接从setting里面取出来。
         * @param  {[type]} img [description]
         * @return {[type]}     [description]
         */
        getResizeSizeFromImg: function(img) {
            var _img_info = {
                w: $(img)[0].naturalWidth,
                h: $(img)[0].naturalHeight
            };
            console.log("真实尺寸：");
            console.log(_img_info);
            var _resize_info = {
                w: 0,
                h: 0
            };
            if (_img_info.w <= settings.maxWidth && _img_info.h <= settings.maxHeight) {
                return _img_info;
            }
            if (settings.resizeMode == "auto") {
                var _percent_scale = parseFloat(_img_info.w / _img_info.h);
                var _size1 = {
                    w: 0,
                    h: 0
                };
                var _size_by_mw = {
                    w: settings.maxWidth,
                    h: parseInt(settings.maxWidth / _percent_scale)
                };
                var _size_by_mh = {
                    w: parseInt(settings.maxHeight * _percent_scale),
                    h: settings.maxHeight
                };
                if (_size_by_mw.h <= settings.maxHeight) {
                    return _size_by_mw;
                }
                if (_size_by_mh.w <= settings.maxWidth) {
                    return _size_by_mh;
                }

                return {
                    w: settings.maxWidth,
                    h: settings.maxHeight
                };

            }
            if (settings.resizeMode == "width") {
                if (_img_info.w <= settings.maxWidth) {
                    return _img_info;
                }
                var _size_by_mw = {
                    w: settings.maxWidth,
                    h: parseInt(settings.maxWidth / _percent_scale)
                };
                return _size_by_mw;
            }

            if (settings.resizeMode == "height") {
                if (_img_info.h <= settings.maxHeight) {

                    return _img_info;
                }
                var _size_by_mh = {
                    w: parseInt(settings.maxHeight * _percent_scale),
                    h: settings.maxHeight
                };
                return _size_by_mh;
            }
        },

        /**
         * --将相关图片对象画到canvas里面去。
         * @param  {[type]}   img      [description]
         * @param  {[type]}   theW     [description]
         * @param  {[type]}   theH     [description]
         * @param  {[type]}   realW    [description]
         * @param  {[type]}   realH    [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        drawToCanvas: function(img, theW, theH, realW, realH, callback) {
            var canvas = document.createElement("canvas");
            canvas.width = theW;
            canvas.height = theH;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,
                0, //sourceX,
                0, //sourceY,
                realW, //sourceWidth,
                realH, //sourceHeight,
                0, //destX,
                0, //destY,
                theW, //destWidth,
                theH //destHeight
            );
            //--获取base64字符串及canvas对象传给success函数。
            var base64str = canvas.toDataURL("image/jpeg");
            if (callback) {
                callback(base64str, canvas);
            }
        }
    };

    //--开始处理。
    (function() {

        innerTools.getImgFromDataSource(settings.dataSource, settings.dataSourceType, function(_tmp_img) {
            setTimeout(function() {
                var __tmpImg = _tmp_img;
                settings.onTmpImgGenerate(_tmp_img);
                //--计算尺寸。
                var _limitSizeInfo = innerTools.getResizeSizeFromImg(__tmpImg);
                console.log(_limitSizeInfo);
                var _img_info = {
                    w: $(__tmpImg)[0].naturalWidth,
                    h: $(__tmpImg)[0].naturalHeight
                };
                innerTools.drawToCanvas(__tmpImg, _limitSizeInfo.w, _limitSizeInfo.h, _img_info.w, _img_info.h, function(base64str, canvas) {
                    settings.success(base64str, canvas);
                });
            }, 1000);
        });
    })();

    var returnObject = {};

    return returnObject;
};

/**
 * Ben图片上传工具类
 */
var BenUploadUtils = function(options){

    // 设置参数
    var settings = {
        dom: '',
        url: '',
        limitSize: 1024,
        limitFormat: 'gif,jpg,jpeg,png,GIF,JPG,PNG',
        limitFormatCallback: function(res){},
        limitSizeCallback: function(res){},
        onUploadCallback: function(res){},
        onUploadBeforeCallback: function(res){},
        onUploadSuccessCallback: function(res){},
        onUploadFailCallback: function(res){},
        onUploadAlwaysCallback: function(res){}
    }
    $.extend(settings, options);

    /**
     * 获取文件大小
     */
    var getFileSize = function(dom){
        return $(dom)[0].files[0].size;
    }

    /**
     * 获取图片的格式
     */
    var getFileFormat = function(dom){
        return $(dom)[0].files[0].type;
    }

    /**
     * 获取文件类型
     */
    var getFileType = function(str){
        return str.split('/')[1]
    }

    /**
     * 限制与提交
     */
    var limitCallback = function(){
        $(settings.dom).on('change', function(event) {
            if (isSizeRange(this) && isFormatRange(this)) {
                var reader = new FileReader();
                var fileTemp =  $(this)[0].files[0];

                reader.onload = function(e) {
                    var base64Img= e.target.result;
                    if (settings.isCompress) {
                        // 压缩前的数据
                        settings.onRenderResizerBefore ? settings.onRenderResizerBefore(base64Img) : '';
    
                        //--执行resize。
                        BenImageResizer({
                            resizeMode:"auto",
                            dataSource:base64Img,
                            dataSourceType:"base64",
                            maxWidth:1200, //允许的最大宽度
                            maxHeight:600, //允许的最大高度。
                            debug:true,
                            onTmpImgGenerate:function(img){},
                            success:function(resizeImgBase64,canvas){
                                // //压缩后预览
                                settings.onRenderResizerAfter ? settings.onRenderResizerAfter(resizeImgBase64) : '';
                                uploadToServer(resizeImgBase64);
                            }
                        });
                    } else {
                        uploadToServer(base64Img);
                    }
                }

                reader.readAsDataURL(fileTemp);
            }
        });
    }

    /**
     * 是否在尺寸大小范围内
     */
    var isSizeRange = function(self){
        // 图片大小
        var fileSize = getFileSize(self);
        if (fileSize > settings.limitSize) {
            settings.limitSizeCallback({
                errorCode: 500,
                data: '',
                msg: '图片不能大于'+ settings.limitSize +'kb'
            });
            return false;
        }else{
            settings.limitSizeCallback({
                errorCode: 200,
                data: '',
                msg: '在设置的图片大小范围内'
            });
            return true;
        }
    }

    /**
     * 是否在格式范围内
     */
    var isFormatRange = function(self){
        // 图片格式
        var fileFormat = getFileFormat(self);
        var fileType = getFileType(fileFormat);

        var fileTypeArr = settings.limitFormat.split(',');
        var regexTemp = '';
        for (var index = 0; index < fileTypeArr.length; index++) {
            regexTemp += fileTypeArr[index] + '|';
        }
        regexTemp = regexTemp.substring(0, regexTemp.length - 1);
        var regexStr = '(' + regexTemp + ')$';

        if (!new RegExp(regexStr).test(fileType)) {
            settings.limitFormatCallback ? settings.limitFormatCallback({
                errorCode: 500,
                data: '',
                msg: '图片格式不正确，请上传' + settings.limitFormat + '的其中一个格式'
            }) : '';
            return false;
        }else{
            settings.limitFormatCallback ? settings.limitFormatCallback({
                errorCode: 200,
                data: '',
                msg: '在设置的图片格式范围内'
            }) : '';
            return true;
        }
    }

    /**
     * 上传
     */
    var onUploadCallback = function(){
        limitCallback();
    }

    /**
     * 是否是Jquery
     */
    var isJquery = function(){
        if ($.fn && $.fn.jquery) {
            return true
        }
        return false;
    }

    // 上传到服务器
    var uploadToServer = function(data){

        if (isJquery()) {
            $.ajax({
                url: settings.url,
                type: 'POST',
                dataType: 'JSON',
                data: data || '',
                beforeSend: function () {
                    settings.onUploadBeforeCallback ? settings.onUploadBeforeCallback() : '';
                }
            }).done(function (res) {
                settings.onUploadSuccessCallback ? settings.onUploadSuccessCallback(res) : '';
            }).fail(function (err) {
                settings.onUploadFailCallback ? settings.onUploadFailCallback(err) : '';
            }).always(function () {
                settings.onUploadAlwaysCallback ? settings.onUploadAlwaysCallback() : '';
            });
        }else{
            $.ajax({
    			url: settings.url,
    			type: 'POST',
    			dataType: 'JSON',
    			data: data || '',
    			beforeSend:function(){
                    settings.onUploadBeforeCallback ? settings.onUploadBeforeCallback() : '';
    			},
    			success: function(res){
                    settings.onUploadSuccessCallback ? settings.onUploadSuccessCallback(res) : '';
    			},
    			error: function(err){
                    settings.onUploadFailCallback ? settings.onUploadFailCallback(err) : '';
    			},
    			complete: function(){
                    settings.onUploadAlwaysCallback ? settings.onUploadAlwaysCallback() : '';
    			}
    		});
        }
    }

    /**
     * 初始化
     */
    var init = function(){
        onUploadCallback();
    }

    return {
        init: init
    };
};
