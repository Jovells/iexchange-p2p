import { API_ENDPOINT } from "./constants";


async function storeAccountDetails(accountDetails: AccountDetails) {
    try {
        const response = await fetch(API_ENDPOINT + '/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountDetails),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Account details stored successfully:', data);
        return data.accountHash as `0x${string}`;
    } catch (error: any) {
        throw new Error('Error storing account details:', error);
    }
}

export default storeAccountDetails;