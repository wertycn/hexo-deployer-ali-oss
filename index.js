/* global hexo */
'use strict';

hexo.extend.deployer.register('ali-oss', function (args) {
    //导入ali-oss sdk
    const OSS = require('ali-oss');
    const rd = require('rd');
    const path = require('path');
    const chalk = require('chalk');
    const crypto = require('crypto');
    const fs = require('fs');

    // 获取配置信息
    const oss_config = {
        region: args.region,
        accessKeyId: args.accessKeyId,
        accessKeySecret: args.accessKeySecret,
        bucket: args.bucket,
        secure: true,
    }

    if (!oss_config.accessKeySecret || !oss_config.accessKeyId || !oss_config.bucket || !oss_config.region) {
        let help = '';
        help += chalk.red('[Deployer error] 您应该在_config.yml 文件中进行部署配置的设置\n\n');
        help += chalk.rgb(42, 92, 170)('配置示例如下：\n');
        help += chalk.rgb(42, 92, 170)('  deploy:\n');
        help += chalk.rgb(42, 92, 170)('    type: ali-oss\n');
        help += chalk.rgb(42, 92, 170)('    region: <您的oss存储桶所在区域代码>\n');
        help += chalk.rgb(42, 92, 170)('    accessKeyId: <您的oss accessKeyId>\n');
        help += chalk.rgb(42, 92, 170)('    accessKeySecret: <您的oss accessKeySecret>\n');
        help += chalk.rgb(42, 92, 170)('    bucket: <您的oss存储桶名称>\n');
        help += '如需更多帮助，您可以查看文档：' + chalk.underline('http://github.com/wertycn/hexo-deployer-ali-oss/');
        console.log(help);
        return;
    }

    // 创建oss client实例
    var client = new OSS(oss_config)

    // 静态文件目录
    var localDir = hexo.public_dir

    // 获取上传后在OSS中保存的位置，默认为根目录
    var remoteDir = args.remotePath || '/'

    // 根据操作系统统一转换路径
    remoteDir = path.join(remoteDir)

    if (remoteDir == path.join("/")) {
        remoteDir = ""
    }

    // 上传文件到oss
    async function put(localPath) {
        // 生成对象KEY
        var objectKey = path.join(remoteDir, localPath.split(localDir)[1])

        // windows下替换\为/
        objectKey = objectKey.split('\\').join('/');

        // 判断远程文件存在，且size一致，且md5一致
        var shouldUpload = true;
        try {
            const res = (await client.head(objectKey)).res;
            const localSize = fs.statSync(localPath).size;
            const remoteSize = res.headers['content-length'];
            if (remoteSize == localSize) {
                const remoteMd5 = res.headers['content-md5'];
                const localMd5 = crypto.createHash('md5').update(fs.readFileSync(localPath)).digest('base64');
                if (remoteMd5 == localMd5) {
                    shouldUpload = false;
                }
            }
        } catch (e) {
            // NoSuchKey
        }

        if (shouldUpload) {
            var againNum = 0;
            while (againNum <= 3) {
                try {
                    let result = await client.put(objectKey, localPath);
                    if (result['res']['status'] == 200) {
                        console.log("[%s] 部署成功:%s", chalk.green('Deployer info'), localPath)
                        break;
                    }
                } catch (e) {
                    againNum += 1
                    if (againNum >= 3) {
                        console.log("[%s] 部署异常[ 文件路径 : %s,对象键 : %s] \n", chalk.green('Deployer error'), localPath, objectKey)
                        console.log(e);
                    }
                }
            }
        } else {
            console.log("[%s] 本地和远程文件一致，跳过部署:%s", chalk.green('Deployer info'), localPath)

        }

    }

    // 同步遍历公共目录下的所有文件
    rd.eachFileSync(localDir, function (f) {
        // 每找到一个文件都会调用一次此函数
        put(f)
    });
    console.log("oss部署器执行完毕！请稍后查看上传结果！")

});
