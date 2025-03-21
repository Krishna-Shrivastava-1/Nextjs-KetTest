import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    aboutdecription: {
        type: String,


    },
    bannerimageurl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })
export const bannerModel = mongoose.models.BannerUrl || mongoose.model('BannerUrl', bannerSchema);