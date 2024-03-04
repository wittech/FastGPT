xinference安装
【Dify知识库】（12）：在autodl上，使用xinference部署chatglm3，embedding，rerank大模型，并在Dify上配置成功，3类接口xinference都是支持部署的
https://blog.csdn.net/freewebsys/article/details/135943148

https://github.com/xorbitsai/inference/issues/774
注意pip22版本会导致安装非常慢，失败，需要升级到23以上
python3 -m pip install --upgrade pip

ChatGLM2-6B + M3E-large + FastGPT + OneAPI
https://www.cnblogs.com/isdxh/p/18023170#%E5%AE%89%E8%A3%85m3e-large

flash_attn需要从github下载会比较慢，可以手动下载上传后安装；
pip3 install ./flash_attn-2.5.5+cu122torch2.2cxx11abiFALSE-cp310-cp310-linux_x86_64.whl

sudo docker run --name one-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data justsong/one-api
sk-sSOGh1GVYK2lMCpX98Ee1f1bF94645Eb8e6a1a4eCb231c6d

sudo nohup pip3 install "xinference[all]" -i https://pypi.tuna.tsinghua.edu.cn/simple &


nohup python3 -m pip3 install "xinference[all]" &

pip install "xinference[all]"==0.8.5

vi ~/.bashrc
export PATH=$PATH:/home/ubuntu/.local/bin
source ~/.bashrc

XINFERENCE_MODEL_SRC=modelscope XINFERENCE_HOME=/data/xinference xinference-local --host 0.0.0.0 

--port 6006


# 设置好环境变量：
export XINFERENCE_MODEL_SRC=modelscope
export XINFERENCE_HOME=/home/ubuntu/xinference

# 首先启动 xinference-local ：

export XINFERENCE_MODEL_SRC=modelscope
export XINFERENCE_HOME=/root/autodl-tmp/xinference
nohup xinference-local --host 0.0.0.0 --port 6006 &
nohup xinference-local --host 0.0.0.0 &


--log-level DEBUG
XINFERENCE_MODEL_SRC=modelscope XINFERENCE_HOME=/root/autodl-tmp/xinference xinference-local --host 0.0.0.0 --port 6006
ssh -CNg -L 6006:127.0.0.1:6006 root@region-9.autodl.pro -p 45175
ssh -p 45175 root@region-9.autodl.pro
ivOaaXSH/Iof
XINFERENCE_MODEL_SRC=modelscope xinference-local

nvidia-smi

curl http://localhost:9997/v1/chat/completions   -H "Content-Type: application/json" -d '{
     "model": "chatglm3",
     "messages": [{"role": "user", "content": "你是谁"}],
     "temperature": 0.7
}'

# 端口修改了重新设置环境变量
export XINFERENCE_ENDPOINT=http://127.0.0.1:6006
export XINFERENCE_ENDPOINT=http://127.0.0.1:9997
# 部署chatglm3
xinference launch --model-name chatglm3 --size-in-billions 6 --model-format pytorch --quantization 4-bit
xinference launch --model-name chatglm3-32k --size-in-billions 6 --model-format pytorch --quantization ${quantization}

xinference terminate --model-uid chatglm3 --endpoint http://127.0.0.1:6006


Linux 手动清除NVIDIA显存
apt-get install psmisc

#查找占用GPU资源的PID
fuser -v /dev/nvidia*

# 解除显存占用
kill -9 ***(PID)  

# 部署 bge-large-zh embedding
xinference launch --model-name bge-large-zh-v1.5 --model-type embedding

xinference launch --model-name bge-m3 --model-type embedding
# 部署 bge-reranker-large rerank
xinference launch --model-name bge-reranker-large --model-type rerank



curl http://127.0.0.1:6006/v1/models
{"qwen1.5-chat":{"model_type":"LLM","address":"0.0.0.0:42349","accelerators":["0"],"model_name":"qwen1.5-chat","model_lang":["en","zh"],"model_ability":["chat","tools"],"model_description":"Qwen1.5 is the beta version of Qwen2, a transformer-based decoder-only language model pretrained on a large amount of data.","model_format":"pytorch","model_size_in_billions":14,"model_family":"qwen1.5-chat","quantization":"8-bit","model_hub":"modelscope","revision":null,"context_length":32768},"bge-base-zh-v1.5":{"model_type":"embedding","address":"0.0.0.0:46329","accelerators":["0"],"model_name":"bge-base-zh-v1.5","dimensions":768,"max_tokens":512,"language":["zh"],"model_revision":"v0.0.1"},"bge-m3":{"model_type":"embedding","address":"0.0.0.0:40111","accelerators":["0"],"model_name":"bge-m3","dimensions":1024,"max_tokens":8192,"language":["zh","en"],"model_revision":null},"bge-reranker-large":{"model_type":"rerank","address":"0.0.0.0:38703","accelerators":["0"],"model_name":"bge-reranker-large","language":["en","zh"],"model_revision":"v0.0.1"}}

curl http://127.0.0.1:9997/v1/chat/completions   -H "Content-Type: application/json" -d '{
     "model": "qwen1.5-chat",
     "messages": [{"role": "user", "content": "北京景点"}],
     "temperature": 0.7,"stream": true
}'

curl http://127.0.0.1:9997/v1/chat/completions   -H "Content-Type: application/json" -d '{
     "model": "chatglm3",
     "messages": [{"role": "user", "content": "北京景点"}],
     "temperature": 0.7,"stream": true
}'

curl http://127.0.0.1:6006/v1/chat/completions   -H "Content-Type: application/json" -d '{
     "model": "qwen1.5-chat",
     "messages": [{"role": "user", "content": "北京景点"}],
     "temperature": 0.7,"stream": true
}'

FastGPT + Xinference：一站式本地 LLM 私有化部署和应用开发
https://zhuanlan.zhihu.com/p/677208959

sk-i3fRuvxbvvvAKxqX39Fc45CaE43a4d1c97E99159Ba70C459

# 端口修改了重新设置环境变量
export XINFERENCE_ENDPOINT=http://127.0.0.1:6006
# 部署chatglm3
xinference launch --model-name chatglm3 --size-in-billions 6 --model-format pytorch --quantization 8-bit

xinference launch --model-name qwen1.5-chat --size-in-billions 14 --model-format pytorch --quantization 4-bit
大约需要13g显存

xinference launch --model-name qwen1.5-chat --size-in-billions 14 --model-format pytorch --quantization 8-bit
大约20g显存

如果无量化的版本需要约39g显存

xinference terminate --model-uid qwen1.5-chat

 --endpoint http://127.0.0.1:6006

# 部署 bge-large-zh embedding
xinference launch --model-name bge-large-zh --model-type embedding

xinference launch --model-name bge-m3 --model-type embedding
# 部署 bge-reranker-large rerank
xinference launch --model-name bge-reranker-large --model-type rerank

Embedding 模型部署及效果评测
https://www.cnblogs.com/xiaoxi666/p/18014457

export MODELSCOPE_CACHE=/root/autodl-tmp/modelscope

docker run --name one-api -d --restart always -p 6006:3000 -e TZ=Asia/Shanghai -v /root/autodl-tmp/one-api:/data justsong/one-api


cd /usr/local
mkdir   go
cd go 
wget https://dl.google.com/go/go1.18.10.linux-amd64.tar.gz

tar -zxvf go1.18.10.linux-amd64.tar.gz
set GO111MODULE=on
go env -w GOPROXY=http://goproxy.cn,direct


source  /etc/environment

npm config set registry https://registry.npmmirror.com


docker run --name one-api -d --restart always -p 6000:6000 -e TZ=Asia/Shanghai -v /data/one-api:/data oneapi

如何导出dockerfile
alias dfimage="docker run -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/laniksj/dfimage"
dfimage registry.cn-hangzhou.aliyuncs.com/funasr_repo/funasr:funasr-runtime-sdk-online-cpu-0.1.9


arm安装docker25
https://www.cnblogs.com/jinanxiaolaohu/p/17799784.html

Kylin Linux Advanced Server release V10 (Lance)  docker build 时报如下错误：

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
DEPRECATED: The legacy builder is deprecated and will be removed in a future release.
            Install the buildx component to build images with BuildKit:
            https://docs.docker.com/go/buildx/
 
Sending build context to Docker daemon  204.6MB
Step 1/7 : FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
 ---> af095315a4eb
Step 2/7 : WORKDIR /app
 ---> Using cache
 ---> 3b8547702717
Step 3/7 : COPY . .
 ---> Using cache
 ---> 85c3058957e7
Step 4/7 : ENV TZ=Asia/Shanghai
 ---> Using cache
 ---> 83c659472410
Step 5/7 : RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
 ---> Running in 03ccb35ecf5d
failed to create task for container: failed to create shim task: OCI runtime create failed: container_linux.go:318: starting container process caused "permission                          denied": unknown
Kylin Linux Advanced Server release V10 (Sword)  操作系统没有以上报错，正常生成镜像

解决办法：

卸载Kylin Linux Advanced Server release V10 (Lance) 自带的Podman, 执行  yum remove podman 后，重新build 后可以正常生成镜像