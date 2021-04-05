FROM node:15 as builder

WORKDIR /wearmerge/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY validators ./dist/validators/


FROM node:15

WORKDIR /wearmerge/backend

COPY package*.json ./

RUN npm install --only=prod

COPY --from=builder /wearmerge/backend/dist ./

CMD npm run run