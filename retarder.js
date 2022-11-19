const http = require('http')

class retarder{
    constructor(){
        this.logs = {}    //记录IP上一次操作时间
        this.bannedIPs = {}    //封禁IP记录
        this.interval = 0.5    //IP两次操作时间最小间隔，单位为秒，如果两次操作间隔小于该数字，则禁止操作
    }
    getTime(){    //获取时间戳，单位为秒
        return Date.now() / 1000    //转换单位
    }
    log(ip){    //记录操作时间
        this.logs[ip] = this.getTime()
    }
    ban(ip,time = 0){    //封禁一个IP。time单位为秒。如果time为0，则为永久封禁
        if (time < 0){
            throw '时间不能小于0'    //抛出异常
        }
        if (time === 0){
            this.bannedIPs[ip] = 0    //永久封禁
        }else{
            this.bannedIPs[ip] = this.getTime() + time    //添加封禁记录
        }
    }
    unban(ip){    //解封一个IP
        this.bannedIPs[ip] = undefined    //删除封禁记录
    }
    check(ip){    //判断一个IP是否操作频繁或被封禁，如果操作频繁或被封禁，则返回true，否则返回false
        if (typeof this.bannedIPs[ip] ==='number'){
            if (this.bannedIPs[ip] === 0){    //如果被永久封禁
                this.log(ip)    //记录
                return true    //返回true
            }
            if (this.bannedIPs[ip] > this.getTime() /* 单位转换为秒 */){    //如果未到解封时间
                this.log(ip)    //记录
                return true
            }else{    //如果到了解封时间
                this.unban(ip)    //解封
                this.log(ip)    //记录
                return false    //返回false
            }
        }
        if (typeof this.logs[ip] !== 'number'){    //如果没有操作记录
            this.log(ip)    //添加记录
            return false    //返回false，放行
        }
        if ((this.getTime() - this.logs[ip]) < this.interval){    //如果操作间隔小于设置的阈值
            this.log(ip)    //记录本次操作时间
            return true    //返回true
        }
        this.log(ip)    //记录操作时间
        return false    //返回false
    }
}

module.exports = retarder

http.createServer(function(req,res){
    const ip = req.connection.remoteAddress
    
    
})