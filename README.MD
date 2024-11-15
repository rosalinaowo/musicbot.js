# musicbot.js
## Usage
Clone the repository:
```bash
git clone https://github.com/rosalinaowo/musicbot.js
```

Download the required node.js packages:
```bash
npm install
```

Create a `config.json` file based on [this example](./config.example.json):
```json
{
    "token": "BOT_TOKEN_HERE",
    "clientId": "APPLICATION_ID_HERE"
}
```

Deploy the bots slash commands:
```bash
npm run deployCommands
```

Start the bot:
```bash
npm run bot
```

**(Optional)** Login with a throwaway YouTube account:
```bash
npx --no discord-player-youtubei
```