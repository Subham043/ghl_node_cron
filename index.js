const ghl_path_data = "./ghl.json";
const { readFileSync, writeFileSync } = require("fs");
const request = require('request');
const mongoose = require('mongoose');
const Contact = require('./model/contact');
const cron = require('node-cron');

const mongoString = "mongodb+srv://ajay:p52n4DG6Px760y68@cluster0.vmggw.mongodb.net/tristarpt?retryWrites=true&w=majority"

mongoose.connect(mongoString);

const setToken = () =>{

    const ghlData = JSON.parse(readFileSync(ghl_path_data));

    const ghl_refresh_options = {
        method: 'POST',
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        form: {
            client_id: '64931e6dfc4d8f31cd9d3f45-lj5wv18p',
            client_secret: '7988bdd3-eb06-4d87-9dd9-1dc26b50b6de',
            grant_type: 'refresh_token',
            refresh_token: ghlData.refresh_token
        }
    };
    
    request(ghl_refresh_options, function (error, response, body) {
        if (error) throw new Error(error);
    
        try {
            writeFileSync(ghl_path_data, body, "utf8");
            console.log("Data successfully saved");
        } catch (error) {
            console.log("An error has occurred ", error);
        }
    });
};

const storeContacts = async () => {

    const ghlData = JSON.parse(readFileSync(ghl_path_data));

    let page = 1;

    const options = {
        method: 'GET',
        url: 'https://services.leadconnectorhq.com/contacts/',
        qs: {locationId: '4OhLjdxKCuBxvgs4TpUU', limit: 100, page},
        headers: {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          Token: ghlData.access_token,
          Version: '2021-07-28',
          Authorization: 'Bearer '+ghlData.access_token
        }
    };

    for (let index = 0; index <= page; index++) {
        request(options, async function (error, response, body) {
            if (error) {
                console.log(error);
                return;
            }
            const data = JSON.parse(body)
            try {
            
                data?.contacts?.map(async (item) => {
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
            
                try {
                    writeFileSync("./test.json", JSON.stringify(data?.contacts, null, 2), "utf8");
                    console.log("Data successfully saved");
                    page++
                    console.log('page: ', page);
                } catch (error) {
                    console.log("An error has occurred ", error);
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        
        });
        
    }
}



const fetchContacts = async () => {

    setToken();
    storeContacts();

}

const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


cron.schedule('59 23 * * *', function() {
    fetchContacts();
    console.log('running a task every minute');
});