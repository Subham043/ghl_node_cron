const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contact_id: {
        required: [true, 'Contact Id is required'],
        type: String,
        unique: [true, 'Contact Id is already taken']
    },
    dateUpdated: {
        required: [true, 'Date updated is required'],
        type: String
    },
    city: {
        required: [true, 'City is required'],
        type: String
    },
    address1: {
        required: [true, 'Address1 is required'],
        type: String
    },
    dateOfBirth: {
        required: [true, 'dateOfBirth is required'],
        type: String
    },
    type: {
        required: [true, 'Type is required'],
        type: String
    },
    locationId: {
        required: [true, 'Location Id is required'],
        type: String
    },
    dnd: {
        required: [true, 'DND is required'],
        type: Boolean
    },
    state: {
        required: [true, 'State is required'],
        type: String
    },
    firstName: {
        required: [true, 'First name is required'],
        type: String
    },
    email: {
        required: [true, 'Email is required'],
        type: String
    },
    contactName: {
        required: [true, 'Contact Name is required'],
        type: String
    },
    lastName: {
        required: [true, 'Last name is required'],
        type: String
    },
    dateAdded: {
        required: [true, 'Date added is required'],
        type: String
    },
    phone: {
        required: [true, 'Phone is required'],
        type: String
    },
    postalCode: {
        required: [true, 'Postal code is required'],
        type: String
    },
    source: {
        required: false,
        type: String
    },
    companyName: {
        required: false,
        type: String
    },
    assignedTo: {
        required: false,
        type: String
    },
    tags: {
        required: false,
        type: [String]
    },
    customFields: {
        required: false,
        // type: [{
        //     id: String,
        //     value: String||[String],
        // }]
        type: []
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
})

module.exports = mongoose.model('Contact', contactSchema)
