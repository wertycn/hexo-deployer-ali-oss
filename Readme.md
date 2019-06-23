#  hexo-deployer-oss部署器使用说明

下载 [hexo-deployer-oss.zip](https://a.werty.cn/download/hexo-deployer-oss.zip)

手动放置到 hexo项目的 `node_modules`目录下

手动在hexo项目目录下的 `package.json` 的 `dependencies`选项中添加一行

```
    "hexo-deployer-oss": "^0.1.0",
```

在hexo项目配置文件`_config.yml`中添加如下配置：

```
deploy:
  type: oss
  region: <您的oss 区域代码>
  accessKeyId: <您的oss  accessKeyId>
  accessKeySecret: <您的oss accessKeySecret>
  bucket: <您的bucket name>
  
```

就这么简单 然后执行

```
hexo d
```

即可将项目部署到oss中 ，默认情况下，将文件上传到bucket的根目录下，如果需要部署到其他目录，请在deploy下添加remotePath选项进行指定

```
	remotePath:<您要部署的目录>
```



