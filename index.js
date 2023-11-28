const fs = require('fs');
const { parse } = require('csv-parse');
let BTC_balance = 0;
let ETH_balance = 0;
let XRP_balance = 0;
async function getPrice(token){
    let url = 'https://min-api.cryptocompare.com/data/price?fsym='+token+'&tsyms=USD&api_key=92a473bed406a4e4831b5ccf715cb8bba2b53d67efb39fc99003904726f50d40'
    const price = await (await fetch(url)).json()
    return price['USD']
}
fs.createReadStream('./data/transactions.csv')
  .pipe(parse({
    delimiter:",", 
    from_line:2,
    ltrim:true
    }))
  .on("data", function(row){
    let i = 0;
    if(row[1] === 'DEPOSIT'){
        i = 1;
    }
    else{
        i = -1;
    }
    if(row[2] === 'BTC'){
        BTC_balance = BTC_balance + row[3]*i;
    }
    if(row[2] === 'ETH'){
        ETH_balance = ETH_balance + row[3]*i;
    }
    if(row[2] === 'XRP'){
        XRP_balance = XRP_balance + row[3]*i;
    }
  })
  .on('error', function(error){
    console.log(error.message);
  })
  .on('end', async function(){
    const BTC_price = await getPrice('BTC')
    const ETH_price = await getPrice('ETH')
    const XRP_price = await getPrice('XRP')
    console.log(BTC_price, ETH_price, XRP_price);
    console.log("BTC", BTC_balance*BTC_price,'$')
    console.log("ETH", ETH_balance*ETH_price,'$')
    console.log("XRP", XRP_balance*XRP_price,'$')
  })
