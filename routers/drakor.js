const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools.js');

router.get('/:plug', async (req, res, next) => {
    try {

        /* get Endpoint on param */
        const drakor = req.params.plug;

        /* get data from baseURL */
        const response = await Axios(`https://ratudrakor.co/${drakor}`);
        const $ = cheerio.load(response.data);
        const main = $('.site-main');

        /* Scrap Data */
        const data = {};

        data.title = $(main).find('.entry-content > ul li:nth-of-type(1)').text().split(':')[1].trim();
        data.alter_title = $(main).find('.entry-content > ul li:nth-of-type(2)').text().split(':')[1].trim();
        data.total_eps = $(main).find('.entry-content > ul li:nth-of-type(3)').text().split(':')[1].trim();
        data.genre = $(main).find('.entry-content > ul li:nth-of-type(4)').text().split(':')[1].trim().split(', ');
        data.airdate = $(main).find('.entry-content > ul li:nth-of-type(5)').text().split(':')[1].trim();
        data.airtime = $(main).find('.entry-content > ul li:nth-of-type(6)').text().split(':')[1].trim();
        data.duration = $(main).find('.entry-content > ul li:nth-of-type(7)').text().split(':')[1].trim();
        data.director = $(main).find('.entry-content > ul li:nth-of-type(8)').text().split(':')[1].trim();
        data.author = $(main).find('.entry-content > ul li:nth-of-type(9)').text().split(':')[1].trim();
        data.rating = $(main).find('.entry-content > ul li:nth-of-type(10)').text().split(':')[1].trim();
        data.channel = $(main).find('.entry-content > ul li:nth-of-type(11)').text().split(':')[1].trim();
        data.score = '⭐' + $(main).find('.entry-content > ul li:nth-of-type(12)').text().split(':')[1].trim();

        const temp = [];
        $(main).find('.dl_box_wowo').each((i, e) => {

            const temp_res = [];
            $(e).find('ul > li').each((ind, ele) => {

                const temp_dl = [];
                $(ele).find('a').each((ix, ex) => {
                    temp_dl.push([
                        $(ex).text(),
                        $(ex).attr('href')
                    ]);
                });

                temp_res.push(
                    $(ele).find('strong').text(),
                    temp_dl
                );

            });

            temp.push({ title: $(e).find('h4').text(), list_download: temp_res });

        });
        data.list_download = temp;

        res.send(data);

    } catch (err) {

        console.log(err);
        res.send(err);

    }
});

module.exports = router;
