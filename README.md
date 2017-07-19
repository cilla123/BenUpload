# BenUpload
pc、h5上传图片插件，依赖Jquery，或Zepto


# 用法

- 1.用的时候，请先引入JQuery或者Zepto

```js
<script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
```

- 2.引入BenUpload.js

```js
<script type="text/javascript" src="js/BenUpload.js"></script>
或
<script type="text/javascript" src="dist/BenUpload.min.js"></script>

```

- 3.使用

```js

	BenUploadUtils({
        dom: ".uploadfile",		// 需要挂在的DOM
        url: "/",				// 上传的服务器地址
        limitSize: 10240000,    // 1024000kb
        limitFormat: 'gif,jpg,jpeg,png,GIF,JPG,PNG', // 使用什么格式
        limitSizeCallback: function(err){	// 限制大小的回调事件
            console.log(err);
        },
        limitFormatCallback: function(err){	// 限制格式的回调事件
            console.log(err);
        },
        onUploadBeforeCallback: function(res){	// 上传图片之前的回调事件
            console.log(res);
        },
        onUploadSuccessCallback: function(res){	// 上传成功的回调事件
            console.log(res);
        },
        onUploadFailCallback: function(res){ // 上传失败的回调事件
            console.log(res);
        },
        onUploadAlwaysCallback: function(res){	// 上传无论什么结果的回调事件
            console.log(res);
        },
        onRenderResizerBefore: function(res){	// 压缩之前的回调事件
            $("#preview").attr("src",res);
        },
        onRenderResizerAfter: function(res){	// 压缩之后的回调事件
            $("#nextview").attr("src",res);
        }
    }).init();

```