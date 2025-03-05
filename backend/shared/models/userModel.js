const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema ({
    firstName: {
        type: String, 
        required: true, 
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String, 
        required: true, 
        trim: true,
        lowercase: true,
    },
    email: {
        type: String, 
        required: true, 
        uniqure: true,
    }, 
    password: {
        type: String, 
        required: true,
    }, 
    role: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        enum: ["admin", "driver", "paramedic", "callop", "manager"]
    }
})

// static signup method
userSchema.statics.createNew = async function(first, last, email, password, role) {

    //validation
    if (!first || !last || !email || !password || !role) {
        throw Error('All field must be filled ')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email should be valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const roles = ["admin", "driver", "paramedic", "callop", "manager"] 
    if (!roles.includes(role)) {
        throw Error("Role type doesn't exitst")
    }


    const exists = await this.findOne({ email })

    if (exists) {
        throw Error("Email already in use")
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ firstName: first, lastName: last, email, password: hash, role })

    return user
}

// static login method 
userSchema.statics.login = async function(email, password) {

    // validate 
    if (!email || !password) {
        throw Error('All field must be filled ')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error("incorrect email")
    } 

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error("incorrect password")
    }

    return user
}

module.exports = mongoose.model("User", userSchema)