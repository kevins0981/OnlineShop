const db= require("../data/database");
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

class User {
    constructor(email, password, fullname, street, zipcode, city){
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.address = {
            street: street,
            zipcode: zipcode,
            city: city
        };
    }

    getUserWithSameEmail(){
        return db.getDb().collection('users').findOne({email: this.email});
    }

    static findById(userId){
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({_id: uid}, { projection : {password: 0}});
    }

    async existsAccount(){
        const existingAccount = await this.getUserWithSameEmail();
        if(existingAccount)
        {
            return true;
        }
        return false;
    }
    async signUp(){
        const hashedPassword = await bcrypt.hash(this.password, 12);
        db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullname: this.fullname,
            address: this.address
        });
    }

    isMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;