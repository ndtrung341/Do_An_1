export default class Products {
    async getProducts() {
        try {
            let result = await fetch("http://localhost:3000/items");
            let data = await result.json();
            return data
        } catch (error) {
            console.log(error);
        }
    }
}