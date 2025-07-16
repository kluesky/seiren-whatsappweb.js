module.exports = {
  errorHandler: (error) => {
    console.error('Bot Error:', error);
  },
  messageLogger: (msg) => {
    console.log(`New message from ${msg.from}: ${msg.type}`);
  }
};