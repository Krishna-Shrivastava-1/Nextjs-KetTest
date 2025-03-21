import mongoose from 'mongoose'

const netflixSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,

        required: true
    },
    posterimage: {
        type: String,

        required: true
    },
    moviesrc: {
        type: String,

        required: true
    },
    genre: {
        type: String,
        default: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })
export const netflixModel = mongoose.model('NetflixM', netflixSchema)