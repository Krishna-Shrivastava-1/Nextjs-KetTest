import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    mainmovieurl: {
        type: String,
        required: true
    },
    aboutmovieurl: {
        type: String,

        required: true
    },
    movieimageurl: {
        type: String,
        default: ''
    },
    // wacthingby: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })
export const movieModel = mongoose.models.Movie || mongoose.model('Movie', movieSchema);