import axios from 'axios';

async function main() {
    // Get api token on https://story3.com/profile
    // please DO NOT COMMIT your token, keep it safe
    // if token was leaked you can refresh it using API endpoint `/api/v2/users/me/api_key`
    const token = process.env.TOKEN;

    // We should create story first. In order to do that we do POST request with root twist data.
    const myStoriesResponse = await axios.get(
        'https://story3.com/api/v2/stories/my',
        {
            headers: {
                'x-auth-token': token
            }
        }
    );
    const hashId = myStoriesResponse.data[0].hashId;

    await axios.patch(
        `https://story3.com/api/v2/stories/${hashId}`,
        {
            "title": "new title",
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // Also we can hide stories from the catalog
    await axios.post(
        `https://story3.com/api/v2/twists/${hashId}/unpublish`,
        null,
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // Or delete the story forever if it's possible
    if (myStoriesResponse.data[0].isDeletable) {
        await axios.delete(
            `https://story3.com/api/v2/stories/${hashId}`,
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
