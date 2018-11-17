'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const name = require('./name.model')
const address = require('./address.model')

const recruiterSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: name.schema,
    required: true
  },
  address: {
    type: address.schema
  },
  phone_number: {
    type: Number
  },
  company: {
    type: String
  },
  profile_image: {
    type: String
  },
  banner_image: {
    type: String
  }
}, {
  timestamps: true
})

recruiterSchema.method({
  transform () {
    const transformed = {}
    const fields = ['id', 'name', 'address', 'city', 'state', 'zipcode', 'phone_number', 'company', 'profile_image', 'banner_image']
    fields.forEach((field) => {
      transformed[field] = this[field]
    })
    return transformed
  }
})

module.exports = mongoose.model('Recruiter', recruiterSchema)
