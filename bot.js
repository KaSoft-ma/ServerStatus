const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('bot-alive');
});

app.post('/send', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Missing 'content' in request body" });
  }

  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    await channel.send(content);
    res.status(200).json({ status: 'Message sent' });
  } catch (err) {
    console.error('Error sending message:', err.message || err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(port, () => {
  console.log(`✅ Heartbeat server running on port ${port}`);
});

require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { checkSqlConnection } = require('./sqlChecker');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  
    const pingAndSend = async () => {
      try{
        const result = await checkSqlConnection();
        const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    
        if (result.success) {
          //channel.send(`✅ SQL Server is online - ${new Date().toLocaleString()}`);
        } else {
          channel.send(`❌ SQL Server DOWN - ${new Date().toLocaleString()}\n<@&1359949894382518523>\n\`\`\`${result.message}\`\`\``);
        }
      }
      catch (err) {
        console.error('💥 Error during ping or message send:', err.message || err);
      }
    };
  
    // Ping immediately and then every 10 minutes
    pingAndSend();
    //setInterval(pingAndSend, 1 * 1 * 5000);
    setInterval(pingAndSend, 10 * 60 * 1000);
  });
  

client.login(process.env.DISCORD_BOT_TOKEN);


process.on('unhandledRejection', (reason) => {
  console.error('❗ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❗ Uncaught Exception:', err);
});
