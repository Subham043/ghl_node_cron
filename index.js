const ghl_path_data = "./ghl.json";
const { readFileSync, writeFileSync } = require("fs");
const request = require('request');
const mongoose = require('mongoose');
const Contact = require('./model/contact');
const cron = require('node-cron');
const axios = require('axios');

const mongoString = "mongodb+srv://ajay:p52n4DG6Px760y68@cluster0.vmggw.mongodb.net/tristarpt?retryWrites=true&w=majority"

mongoose.connect(mongoString);

const setToken = async () =>{

    const ghlData = JSON.parse(readFileSync(ghl_path_data));

    try {
        const token = await axios.post('https://services.leadconnectorhq.com/oauth/token', {
            client_id: '64931e6dfc4d8f31cd9d3f45-lj5wv18p',
            client_secret: '7988bdd3-eb06-4d87-9dd9-1dc26b50b6de',
            grant_type: 'refresh_token',
            refresh_token: ghlData.refresh_token
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        })

        await writeFileSync(ghl_path_data, JSON.stringify(token.data), "utf8");
    } catch (error) {
        console.log(error.response.data);
    }

};

const storeContacts = async () => {

    let page = 1;

    for (let index = 1; true; index++) {
        try {
            await setToken();
            const ghlData = await JSON.parse(readFileSync(ghl_path_data));
            const resp = await axios.get('https://services.leadconnectorhq.com/contacts/?locationId=4OhLjdxKCuBxvgs4TpUU&limit=100&page='+index,{
                headers: {
                    Accept: '*/*',
                    Token: ghlData.access_token,
                    Version: '2021-07-28',
                    Authorization: 'Bearer '+ghlData.access_token
                }
            })

            resp?.data?.contacts?.map(async (item) => {
                let updatedData = item;
                // delete updatedData.id;
                updatedData['contact_id'] = item.id
                console.log('updatedData: ', updatedData);
                let dt = await Contact.updateOne(
                    {contact_id: item.id}, 
                    { $set:{...updatedData}}, 
                    { upsert: true }
                )
            
                // console.log('dt: ', dt);
            })

            console.log('----------------------------------------')
            console.log('page: ', page);
            console.log('data: ', resp.data);
            console.log('----------------------------------------')

            await writeFileSync("./test.json", JSON.stringify(resp?.data?.contacts, null, 2), "utf8");

    
        } catch (error) {
            console.log('error: ', error.response.data);
            break;
        }
        
    }
}



const fetchContacts = async () => {
    await storeContacts();
}

const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// fetchContacts();
cron.schedule('59 23 * * *', function() {
    fetchContacts();
    console.log('running a task every minute');
});