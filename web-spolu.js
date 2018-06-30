const request = require('request-promise');
const cheerio = require('cheerio');

const url = `http://www.spolubydlici.cz/advertisement.php?filter_max_price=&filter_demand_offer=offer&filter_region=1&filter_ads_date=&filter_sex=nomatter&filter_order_by=nomatter`;

function load(lastSpoluId = 0) {
  return request(url)
    .then(html => {
      const $ = cheerio.load(html);
      const trs = $('.table.table-striped').find('tbody').children();
      const rows = [];

      // grab data
      trs.each((i, tr) => {
        // miss the head
        if (i === 0) return;

        const row = {};

        // remove empty elements
        const tds = tr.childNodes.reduce((arr, td) => {
          if (td.data && td.data.indexOf('\n ') !== -1) {
            return arr;
          }
          return [...arr, td];
        }, []);

        // row.id = tds[0].children[0].children[0].data;
        // row.owner = tds[1].children[0].children[0].data;
        // row.place = tds[2].children[0].children[0].data;
        // row.price = tds[3].children[0].data;
        // row.id = tds[4].children[0].children[0].data;
        // row.id = tds[5].children[0].children[0].data;
        // row.id = tds[6].children[0].children[0].data;
        // row.id = tds[7].children[0].children[0].data;
        // // pics
        // row.id = tds[8].children[0].children[0].data;


        // rows.push(row);
      });


      return rows;
    });

// $('h2.title').text();

// $.html()

};

module.exports = load;

load()
.then((data) => {
  console.log(data);
})