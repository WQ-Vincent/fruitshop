(function() {
    const cookie = {
        get: function(key) {
            if (document.cookie) { //判断是否有cookie
                var arr = document.cookie.split('; '); //拆分cookie
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i].split('='); //将key和value进行拆分
                    if (item[0] === key) { //如果 key === 用户传入的key  则返回对应的value
                        return item[1];
                    }
                }
                return ''; //遍历结束没有找到  则返回空字符串
            }
        },
        set: function(key, value, day) {
            if (day) {
                var d = new Date();
                d.setDate(d.getDate() + day);
                document.cookie = `${key}=${value};expires=${d};path=/`;
            } else {
                document.cookie = `${key}=${value};path=/`;
            }
        },
        remove: function(key) {
            this.set(key, "", -1);
        }
    }
    window.cookie = cookie;
})();