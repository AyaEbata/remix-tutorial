# Remixのチュートリアル
ソースコードにメモしながら以下をやっていくよ！  
https://remix.run/docs/en/main/start/tutorial

ついでに以下を参考にしてThree.jsもやってみる！  
https://zenn.dev/yuichkun/articles/minimal-three-js-setup

ついでについでにGraphQLもRemixに入れ込んでみる！  
https://www.apollographql.com/docs/apollo-server/getting-started  
https://www.apollographql.com/docs/react/get-started

## 使用技術
- Remix
- React
- Vite
- Three.js
- GraphQL

## 構成
remix-tutorial/   … 直下にRemixのチュートリアルとThree.jsの練習とGraphQL  
└ graphql-server/ … GraphQL Server（めんどくさいのでここに置いちゃう）

---
# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/server`
- `build/client`
