# retarder  
## 简介
一个简易的频率限制器，可以限制用户的访问速度，来防止某些人轰炸你的网站。  

## 用法  
```js
const retarder = require('./retarder')    //引入模块
const http = require('http')

var limiter = new retarder()    //创建对象
var server = http.createServer(function(req,res){    //创建服务器
    const ip = req.connection.remoteAddress
    if (limiter.check(ip)){    //检查该IP是否操作频繁
        res.statusCode = 403    //操作频繁，状态码设置为403
        res.write('你的操作过于频繁或被封禁！\n请确保你的操作的时间间隔大于0.5秒，并且此IP没有被服务器封禁！')    //提示用户
        res.end()    //结束
    }else{
        res.statusCode = 200    //没有操作频繁，设置状态码为200
        res.write('您可以访问该页面！')    //提示
        res.end()    //结束
    }
})
server.listen(80)    //监听80端口
```

## 更多用法  
```js
limiter.ban('一个IP地址',5)    //封禁一个IP五秒，如果时间为0则为永久封禁
limiter.unban('一个IP地址')    //解除封禁一个IP
limiter.check('一个IP地址')    //检查目标IP地址是否被封禁或操作频繁，并记录其操作时间。如果被封禁或操作频繁则返回true，否则返回false
limiter.setThreshold(1)    //设置一个IP地址两次操作时间最小间隔为1秒，如果两次操作间隔小于1秒，则禁止操作
limiter.autoBan = true    //打开自动封禁功能，即检测到某IP操作频繁次数过多以后就封禁它10分钟
limiter.autoBan = false    //关闭自动封禁功能
limiter.resetRecords()    //重置频率限制器
limiter.setTolerance(5)    //设置容忍值为5。说明：当某IP地址连续10次操作频繁且自动封禁开关打开时则自动封禁。  
```

## 所有发布地址  
[GitHub](https://github.com/MrZhang365/retarder)  
[Gitee](https://gitee.com/MrZhang365/retarder)  
[NPM发布地址](https://www.npmjs.com/package/retarder)  

## 温馨提示  
~~这就一垃圾代码，还是不看为好~~  