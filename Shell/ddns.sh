#!/bin/bash

###############  授权信息（需修改成你自己的） ################
# CloudFlare 注册邮箱
auth_email="user@example.com"
# CloudFlare Global API Key
auth_key="c2547eb745079dac9320b638f5e225cf483cc5cfdda41"
# 做 DDNS 的根域名
zone_name="example.com"
# 做 DDNS 的域名，创建成功后就是通过该域名访问内网资源
record_name="www.example.com"

######################  修改配置信息 #######################
# 域名类型，IPv4 为 A，IPv6 则是 AAAA
record_type="AAAA"
# IPv6 检测服务
#ip=$(curl -s https://www.ip.la)
# IPv4 检测服务
ip=$(curl -s https://www.ip.la)
# 变动前的公网 IP 保存位置
ip_file="ip.txt"
# 域名识别信息保存位置
id_file="cloudflare.ids"
# 监测日志保存位置
log_file="cloudflare.log"

######################  监测日志格式 ########################
log() {
    if [ "$1" ]; then
        echo -e "[$(date)] - $1" >> $log_file
    fi
}
log "Check Initiated"

######################  判断 IP 是否变化 ####################
if [ -f $ip_file ]; then
    old_ip=$(cat $ip_file)
    if [ "$ip" == "$old_ip" ]; then
        echo "IP has not changed."
        exit 0
    fi
fi

######################  获取域名及授权 ######################
if [ -f $id_file ] && [ $(wc -l $id_file | cut -d " " -f 1) == 2 ]; then
    zone_identifier=$(head -1 $id_file)
    record_identifier=$(tail -1 $id_file)
else
    zone_identifier=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$zone_name" -H "X-Auth-Email: $auth_email" -H "X-Auth-Key: $auth_key" -H "Content-Type: application/json" | grep -Po '(?<="id":")[^"]*' | head -1 )
    record_identifier=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_identifier/dns_records?name=$record_name&type=$record_type" -H "X-Auth-Email: $auth_email" -H "X-Auth-Key: $auth_key" -H "Content-Type: application/json"  | grep -Po '(?<="id":")[^"]*')
    echo "$zone_identifier" > $id_file
    echo "$record_identifier" >> $id_file
fi

######################  更新 DNS 记录 ######################
update=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_identifier/dns_records/$record_identifier" -H "X-Auth-Email: $auth_email" -H "X-Auth-Key: $auth_key" -H "Content-Type: application/json" --data "{\"id\":\"$zone_identifier\",\"type\":\"$record_type\",\"name\":\"$record_name\",\"content\":\"$ip\"}")

#########################  更新反馈 #########################
if [[ $update == *"\"success\":false"* ]]; then
    message="API UPDATE FAILED. DUMPING RESULTS:\n$update"
    log "$message"
    echo -e "$message"
    exit 1
else
    message="IP changed to: $ip"
    echo "$ip" > $ip_file
    log "$message"
    echo "$message"
fi
