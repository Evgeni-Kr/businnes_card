
FROM node:lts-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm install --production --silent

# Копируем весь проект
COPY . .

# Устанавливаем порт и разрешаем Docker проброс
ENV PORT=7000
EXPOSE 7000

# Даем права обычному пользователю Node
RUN chown -R node /usr/src/app
USER node

# Запуск приложения
CMD ["npm", "start"]
