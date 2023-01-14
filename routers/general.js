const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools.js');

router.get('/', async (req, res, next) => {
    try {

        const data = await Axios('/');
        res.send({ success: true, statusCode: data.status, statusMessage: data.statusText });

    } catch (err) {

        res.send({ success: false, statusCode: data.status, err_msg: err.message });

    }
});


router.get('/page/:pagination', async (req, res, next) => {
    try {

        /*get Params */
        const page = req.params.pagination;

        /* Get Data from baseURL */
        const response = await Axios(`/page/${page}`);
        const $ = cheerio.load(response.data);
        const main = $('.site-main');

        /* Scrap Data */
        const data_list = [];

        $(main).find('.post-wrapper').each((i, e) => {

            //kumpulin bareng
            const data = {};

            const info = $(e).find('.post-content-wrapper');
            data.title = info.find('.entry-title > a').text().replace('Drama Korea ', '');
            data.time = Date.parse(info.find('time').attr('datetime'));

            const link = $(e).find('.post-thumbnail');
            data.link = {
                url: link.find('a').attr('href'),
                endpoint: link.find('a').attr('href').replace('https://ratudrakor.co/', ''),
                thumbnail: link.find('img').attr('src')
            };

            /* send each data to array */
            data_list.push(data);
        })

        res.send(data_list);

    } catch (err) {

        res.send({ success: false, err_msg: err.message });

    }
});

router.get('/drakor-list', async (req, res, next) => {
    try {

        /* get Data from baseURL */
        const response = await Axios('/drakor-list');
        const $ = cheerio.load(response.data);
        const main = $('.site-main');

        /* Scrap Data */
        const data_list = [];

        $(main).find('ul > li').each((i, e) => {

            const data = {};
            const info = $(e).find('a');

            data.title = info.text();
            data.url = info.attr('href')

            data_list.push(data);

        });

        res.send(data_list);

    } catch (err) {

        res.send({ success: false, err_msg: err.message });

    }
});

router.get('/genres', async (req, res, next) => {
    try {

        /* get Data from BaseURL */
        const response = await Axios('/');
        const $ = cheerio.load(response.data);
        const main = $('.tagcloud');

        /* Scrap Data */
        const data_list = [];

        $(main).find('ul > li').each((i, e) => {

            const data = {};

            data.genre = $(e).find('a').text();
            data.link = {
                url: $(e).find('a').attr('href'),
                endpoint: $(e).find('a').attr('href').split('.net/')[1]
            }

            data_list.push(data);

        });

        res.send(data_list);

    } catch (err) {

        console.log(err);
        res.send(err);

    }
});

router.get('/genres/:genre/page/:page', async (req, res, next) => {
    try {

        /* Get Params */
        const genre = req.params.genre;
        const page = req.params.page;

        /* Get data from baseURL */
        const response = await Axios(`/genre/${genre}/page/${page}`);
        const $ = cheerio.load(response.data);
        const main = $('.site-main');

        /* Scrap Data */
        const data_list = [];

        $(main).find('.post-wrapper').each((i, e) => {

            //kumpulin bareng
            const data = {};

            const info = $(e).find('.post-content-wrapper');
            data.title = info.find('.entry-title > a').text().replace('Drama Korea ', '');
            data.time = Date.parse(info.find('time').attr('datetime'));

            const link = $(e).find('.post-thumbnail');
            data.link = {
                url: link.find('a').attr('href'),
                endpoint: link.find('a').attr('href').replace('https://ratudrakor.co/', ''),
                thumbnail: link.find('img').attr('src')
            };

            /* send each data to array */
            data_list.push(data);

        });

        res.send(data_list);

    } catch (err) {

        res.send(err);

    }
});

router.get('/recent', async (req, res, next) => {
    try {

        const response = await Axios('/');
        const $ = cheerio.load(response.data);
        const main = $('#recent-posts-3');

        const data_list = [];
        $(main).find('ul > li').each((i, e) => {

            const data = {};
            const info = $(e).find('a');
            data.title = info.text().replace('Drama Korea', '');
            data.link = info.attr('href');
            data.endpoint = info.attr('href').replace('https://ratudrakor.co/', '');

            data_list.push(data);
        });

        res.send(data_list);

    } catch (err) {

        res.send(err);

    }
});

router.get('/cari/:query', async (req, res, next) => {
    try {

        /* Get Params */
        const query = req.params.query;

        /** Get data from baseURL */
        const response = await Axios(`?s=${query}`);
        const $ = cheerio.load(response.data);
        const main = $('#main');

        /* Scrap Data */
        const list_data = [];

        $(main).find('.post-wrapper').each((i, e) => {
            const data = {};

            data.title = $(e).find('.entry-title').text().replace('Drama Korea ', '');
            const link = $(e).find('.post-thumbnail > a').attr('href');
            data.link = {
                url: link,
                endpoint: link.replace('https://ratudrakor.co/', ''),
                thumbnail: $(e).find('img').attr('src')
            }

            list_data.push(data);

        });

        res.send(list_data);

    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;

