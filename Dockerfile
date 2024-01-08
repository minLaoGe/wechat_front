# 第一阶段：构建React应用
# 使用特定版本的 Node.js 镜像
FROM node:16.20.2 as build

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器中
COPY . /app/

# 安装依赖并构建项目
RUN npm install
RUN npm run build

# 第二阶段：设置Nginx服务器
# 使用Nginx镜像
FROM nginx

# 将构建好的静态文件从构建阶段复制到Nginx容器的服务目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件到容器
COPY /app/nginx.config /etc/nginx/conf.d/default.conf


# 暴露80端口
EXPOSE 80

# 使用默认的Nginx启动命令
CMD ["nginx", "-g", "daemon off;"]