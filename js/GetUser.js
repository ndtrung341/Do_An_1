export default class Users {
    async getUsers() {
        try {
            let result = await fetch("http://localhost:3000/account");
            let data = await result.json();
            return data
        } catch (error) {
            console.log(error);
        }
    }
}