class retarder{
    constructor(){
        this.logs = {}    //记录IP上一次操作时间
        this.bannedIPs = {}    //封禁IP记录
        this.interval = 0.5    //IP两次操作时间最小间隔，单位为秒，如果两次操作间隔小于该数字，则禁止操作
        this.autoBan = true    //自动封禁开关，如果某IP操作过于频繁则自动封禁10分钟
        this.warnings = {}    //警告记录
    }
    setThreshold(num){    //设置一个IP地址两次操作时间最小间隔，单位为秒，如果两次操作间隔小于该数字，则禁止操作
        if (num <= 0){
            throw '阈值必须大于0'
        }
        this.interval = num
    }
    resetRecords(){    //重置记录
        this.logs = {}    //清除IP操作记录
        this.bannedIPs = {}    //解封所有IP
        this.warnings = {}    //清除所有警告记录
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
        this.warnings[ip] = 0
        if (time === 0){
            this.bannedIPs[ip] = 0    //永久封禁
        }else{
            this.bannedIPs[ip] = this.getTime() + time    //添加封禁记录
        }
    }
    unban(ip){    //解封一个IP
        this.bannedIPs[ip] = undefined    //删除封禁记录
        this.warnings[ip] = 0
    }
    check(ip){    //判断一个IP是否操作频繁或被封禁，如果操作频繁或被封禁，则返回true，否则返回false
        if (typeof this.warnings[ip] !== 'number' && this.autoBan){    //初始化警告记录
            this.warnings[ip] = 0    //设置为0
        }
        if (typeof this.bannedIPs[ip] ==='number'){
            if (this.bannedIPs[ip] === 0){    //如果被永久封禁
                this.log(ip)    //记录
                return true    //返回true
            }
            if (this.bannedIPs[ip] > this.getTime()){    //如果未到解封时间
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
            this.warnings[ip] = 0    //重置警告记录
            return false    //返回false，放行
        }
        if ((this.getTime() - this.logs[ip]) < this.interval){    //如果操作间隔小于设置的阈值
            this.log(ip)    //记录本次操作时间
            if (this.autoBan){    //如果自动封禁是开着的
                this.warnings[ip] += 1
                if (this.warnings[ip] >= 10){
                    this.ban(ip,600)    //封禁10分钟
                    this.warnings[ip] = 0    //重置警告记录
                }
            }
            
            return true    //返回true
        }
        this.log(ip)    //记录操作时间
        return false    //返回false
    }
    
}

module.exports = retarder