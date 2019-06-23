#  hexo-deployer-ali-oss部署器使用说明

在hexo项目下执行安装命令：

```
    npm install hexo-deployer-ali-oss --save
```

在hexo项目配置文件`_config.yml`中添加如下配置：

```
deploy:
  type: ali-oss
  region: <您的oss 区域代码>
  accessKeyId: <您的oss  accessKeyId>
  accessKeySecret: <您的oss accessKeySecret>
  bucket: <您的bucket name>
  
```

就这么简单 然后执行部署命令：

```
hexo d
```

即可将项目部署到oss中 ，默认情况下，将文件上传到bucket的根目录下，如果需要部署到其他目录，请在deploy下添加remotePath选项进行指定

```
	remotePath:<您要部署的目录>
```



