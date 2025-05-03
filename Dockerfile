FROM node:21.7 AS builder

ENV NODE_ENV=production
# ENV DATABASE_URL="file:./dev.db"

WORKDIR /usr/src/titorelli/console

COPY . .

RUN npm install --include=dev
# RUN npx prisma db push
RUN npm run build

FROM node:21.7

ENV NODE_ENV=production
# ENV DATABASE_URL="file:./dev.db"

WORKDIR /usr/run/titorelli/console

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/.next/ ./.next
COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/public ./public
# COPY --from=builder --chown=nextjs:nodejs /usr/src/titorelli/console/prisma/dev.db ./data/dev.db

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD [ "npm", "start" ]
