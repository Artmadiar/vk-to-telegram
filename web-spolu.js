const request = require('request-promise');
const cheerio = require('cheerio');

const url = `http://www.spolubydlici.cz/advertisement.php?filter_max_price=&filter_demand_offer=offer&filter_region=1&filter_ads_date=&filter_sex=nomatter&filter_order_by=nomatter`;

//
function extractText(row, i) {
  if (!row) {
    return '';
  }

  if (row.type === 'text') {
    return row.data.trim();
  }

  let src = row;
  if (i !== undefined) {
    if (!src.length || src.length < i) {
      return '';
    }

    src = row[i];
  }

  if (src.children) {
    return src.children.map(child => extractText(child)).join(', ');
  }
  return '';
}

function load(lastSpoluId = 0) {
  return request(url)
    .then(html => {
      const $ = cheerio.load(html);
      const trs = $('.table.table-striped').find('tbody').children();
      const rows = [];
      let row = {};

      // grab data
      trs.each((i, tr) => {
        // miss the head
        if (i === 0) return;

        if (i % 2 === 0) {
          row.text = tr.childNodes.map((td, j) => extractText(td, j)).join('');

          return;
        }

        row = {};

        // remove empty elements
        const tds = tr.childNodes.reduce((arr, td) => {
          if (td.type === 'text') {
            return arr;
          }
          return [...arr, td];
        }, []);

        // row.id = tds[0].children[0].children[0].data;
        row.id = extractText(tds, 0);
        row.owner = extractText(tds, 1);
        row.place = extractText(tds, 2);
        row.price = extractText(tds, 3);
        // row.id = extractText(tds, 4);
        // row.id = tds[5].children[0].children[0].data;
        // row.id = tds[6].children[0].children[0].data;
        // row.id = tds[7].children[0].children[0].data;
        // // pics
        // row.id = tds[8].children[0].children[0].data;


        rows.push(row);
      });


      return rows;
    })
    .catch(err => console.error(err));

// $('h2.title').text();

// $.html()

};

module.exports = load;

load()
.then((data) => {
  console.log(data);
})