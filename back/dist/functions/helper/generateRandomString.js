export const generateRandomString = () => {
    // This helper function creates a random string of arbitrary number of characters.
    const randomStringLength = 16;
    const choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let string = "";
    for (let i = 0; i < randomStringLength; i++) {
        const randomIndex = Math.floor(Math.random() * choices.length);
        string += choices.charAt(randomIndex);
    }
    return string;
};
