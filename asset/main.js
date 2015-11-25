var options = {
	'bucket': 'hb-prd',
	'save-key': '/images/{year}/{mon}/{filemd5}{.suffix}',
	'expiration': Math.floor(new Date().getTime() / 1000) + 86400
};
// 查看更多参数：http://docs.upyun.com/api/form_api/#表单API接口简介
var policy = window.btoa(JSON.stringify(options));
// 从 UPYUN 用户管理后台获取表单 API
var form_api_secret = 'vASp1IRU30aRxg+gsFo55sifOws=';
// 计算签名
var signature = md5(policy + '&' + form_api_secret);

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'pickfiles', // you can pass in id...
	container: document.getElementById('container'), // ... or DOM Element itself
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

	url : 'http://v0.api.upyun.com/' + options.bucket,

	multipart_params: {
		'Filename': '${filename}', // adding this to keep consistency across the runtimes
		'Content-Type': '',
		'policy': policy,
		'signature': signature,
	},

	init: {
		PostInit: function() {
			document.getElementById('filelist').innerHTML = '';

			document.getElementById('uploadfiles').onclick = function() {
				uploader.start();
				return false;
			};
		},

		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				document.getElementById('filelist').innerHTML += '<div class=file-item id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <i></i><b></b></div>';
			});
		},

		

		UploadProgress: function(up, file) {
			var loading_pr = 100-file.percent;
			document.getElementById(file.id).getElementsByTagName('i')[0].innerHTML = '<span>' + file.percent + "%</span>" + '<div class=loading-bg' + ' ' + 'style=width:' + loading_pr + '% ></div>';
		},

		FileUploaded: function(up, file, info) {
			var response = JSON.parse(info.response);
			document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML += '<textarea class=img_url >' + ' http://hb-prd.b0.upaiyun.com' + response.url + '</textarea><textarea class=img_md>' + '![' + file.name +']' + '(http://hb-prd.b0.upaiyun.com' + response.url + ')' + '</textarea>';
		},

		Error: function(up, err) {
			document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
		}
	}
});

uploader.init();