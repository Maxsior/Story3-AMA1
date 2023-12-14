import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/*** data ***/

//          twist0        //
//         /   |   \      //
//  twist1 twist2 twist3  //
//                   |    //
//                twist31 //

// title should be from 1 to 80 chars
// body should be from 40 to 1200 chars

const twist0 = {
    "title": "It all starts from the root",
    "body": "All stories on Story3 are made of twists. But there is a special one among them. " +
        "We call it the root twist."
};

const twist1 = {
    "title": "First choice",
    "body": "Twists are arranged in a tree-like structure. Also one twist at each level is free."
};

const twist2 = {
    "title": "Second choice",
    "body": "Other twists are non-free and their price will be set dynamically."
};

const twist3 = {
    "title": "Third choice",
    "body": "Other twists are non-free and their price will be set dynamically."
};

const twist31 = {
    "title": "Dive deeper",
    "body": "This twist is at depth of 2. User must unlock twist1 first."
};
/*** /data ***/

async function main() {
    // Get api token on https://story3.com/profile
    // please DO NOT COMMIT your token, keep it safe
    // if token was leaked you can refresh it using API endpoint `/api/v2/users/me/api_key`
    const token = process.env.TOKEN;

    // We should create story first. In order to do that we do POST request with root twist data.
    const twist0res = await axios.post(
        'https://story3.com/api/v2/stories',
        twist0,
        {
            headers: {
                'x-auth-token': token
            }
        }
    );
    const rootHashId = twist0res.data.hashId;

    // We are ready to add twists. We do POST request with twist data and specify hashId of the parent.
    const twist1res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist1, // copy data from `twist1`
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // When we created story with at least one twist. We can publish it.
    const twist2res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist2,
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    const twist3res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist3,
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    const twist31res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist31,
            "hashParentId": twist3res.data.hashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // publish each twist at the 1st level
    for(const res of [twist0res, twist1res, twist2res, twist3res, twist31res]) {
        await axios.post(
            `https://story3.com/api/v2/twists/${res.data.hashId}/publish`,
            null,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
    }
}

main()
    .catch(e => console.error(e))
