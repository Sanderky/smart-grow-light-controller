
export const fetchTime = async () => {
    const response = await fetch('https://aisenseapi.com/services/v1/datetime/+0200');
    const data = await response.json();
    return new Date(data.datetime);
};