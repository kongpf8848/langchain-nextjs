# langchain-nextjs

This demo show use [langchain](https://github.com/hwchase17/langchain) and  [Next.js](https://nextjs.org/) call llms(OpenAI，Azure OpenAI...)

## Precondition
```bash
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Run:

```bash
npm install

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API
| URL | Memo |
| --- | --- |
|[/api/chat](http://localhost:3000/api/chat) | Chat completions with Streaming output|
|[/api/translate](http://localhost:3000/api/translate) | Translate English to Chinese|
|[/api/chain](http://localhost:3000/api/chain) |process multiple tasks with chains|

## Docker

Build

```bash
docker build -t langchain-nextjs .
```
Run

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-xxxxx -d langchain-nextjs
```
