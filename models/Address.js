class Address {
    constructor(street, number, zip, city, county, country) {
        this.street = street || "";
        this.number = number || "";
        this.zip = zip || "";
        this.city = city || "";
        this.county = county || "";
        this.country = country || "";
    }
    get() {
        return `${this.street} ${this.number}\n${this.zip} ${this.city}\n${this.county}\n${this.country}`; 
    }

    set(street, number, zip, city, county, country) {
         this.street = street;
         this.number = number;
         this.zip = zip;
         this.city = city;
         this.county = county;
         this.country = country;
    }
}
module.exports = Address;