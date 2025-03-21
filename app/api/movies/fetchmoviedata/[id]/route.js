import { database } from '@/lib/dbConnect';
import { movieModel } from '@/Models/Movies';
import axios from 'axios';

export async function GET(req, { params }) {
    try {
        await database(); // Connect to MongoDB
        const { id } = params; // Extract movie ID from the URL

        // Find the movie by ID
        const movie = await movieModel.findById(id);
        if (!movie) {
            return Response.json({ success: false, error: "Movie not found" }, { status: 404 });
        }

        let aboutmovieData = 'nothing';
        let mainmovieData = 'nothing';

        // Fetch additional movie data
        try {
            if (movie.aboutmovieurl) {
                const aboutRes = await axios.get(movie.aboutmovieurl);
                aboutmovieData = aboutRes.data;
            }
        } catch (error) {
            console.error(`Error fetching aboutmovie for ${movie._id}:`, error);
        }

        try {
            if (movie.mainmovieurl) {
                const mainRes = await axios.get(movie.mainmovieurl);
                mainmovieData = mainRes.data;
            }
        } catch (error) {
            console.error(`Error fetching mainmovie for ${movie._id}:`, error);
        }

        return Response.json(
            { success: true, movie: { ...movie._doc, aboutmovieData, mainmovieData } },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching movie:', error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
