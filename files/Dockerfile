from justsong/one-api
EXPOSE 6000
WORKDIR /datas
ENTRYPOINT ["/one-api"]

#docker build -t oneapi . 
docker run --name one-api -d --restart always -p 6000:6000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/one-api:/data oneapi