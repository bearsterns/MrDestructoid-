const axios = require('axios').default;

async function quote(request) {
    /*  Checks if the bot is available.
        Usage: !ping
        URL: `${API_URL}/${API_VERSION}/stock/{symbol}/quote/{field}`; 
    */

    if (request[1] === 'help') {
        return `Usage: ${process.env.PREFIX}quote [stock ticker]`;
    }
    const originalMessage = request.splice(1);
    const stockTicker = originalMessage.join(' ');

    const myURL = new URL(process.env.IEXCLOUD_API_URL);
    myURL.pathname += process.env.IEXCLOUD_API_VERSION;
    myURL.pathname += "/stock";
    myURL.pathname += "/" + stockTicker;
    myURL.pathname += "/quote";
    myURL.searchParams.append('token', process.env.IEXCLOUD_SECRET_KEY);
    const { data } = await axios.get(myURL.href);

    return `The latest price  of ${data.companyName} is $${data.latestPrice}`;
}

module.exports = {
    quote
};