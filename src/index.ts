import readlineSync from 'readline-sync';
import { PrismaClient, Movie, Genre } from '@prisma/client';

const prisma = new PrismaClient();

async function addMovie() {
    const title: string = readlineSync.question('Enter movie title: ');
    const year: number = readlineSync.questionInt('Enter movie year: ');

    const movie: Movie = await prisma.movie.create({
        data: {
            title,
            year,
        },
    });
    console.log(movie);
}

async function updateMovie() {
    // Expected:
    // 1. Prompt the user for movie ID to update.
    // 2. Prompt the user for new movie title, year, and genre ID.
    // 3. Use Prisma client to update the movie with the provided ID with the new details.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
    // 4. Print the updated movie details.
}

async function deleteMovie() {
    // Expected:
    // 1. Prompt the user for movie ID to delete.
    // 2. Use Prisma client to delete the movie with the provided ID.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
    // 3. Print a message confirming the movie deletion.
}

async function listMovies() {
    // Expected:
    // 1. Use Prisma client to fetch all movies.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    // 2. Include the genre details in the fetched movies.
    // 3. Print the list of movies with their genres.
}

async function listMovieById() {
    // Expected:
    // 1. Prompt the user for movie ID to list.
    // 2. Use Prisma client to fetch the movie with the provided ID.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
    // 3. Include the genre details in the fetched movie.
    // 4. Print the movie details with its genre.
}

async function listMoviesByYear() {
    // Expected:
    // 1. Prompt the user for the year to list movies.
    // 2. Use Prisma client to fetch movies from the provided year.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    // 3. Include the genre details in the fetched movies.
    // 4. Print the list of movies from that year with their genres.
}

async function listMoviesByGenre() {
    // Expected:
    // 1. Prompt the user for genre Name to list movies.
    // 2. Use Prisma client to fetch movies with the provided genre ID.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    // 3. Include the genre details in the fetched movies.
    // 4. Print the list of movies with the provided genre.
}

async function addGenre() {
    // Expected:
    // 1. Prompt the user for genre name.
    // 2. Use Prisma client to create a new genre with the provided name.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
    // 3. Print the created genre details.
}

async function addGenreToMovie() {
    // Expected:
    // 1. Prompt the user for multiple genres to add (comma separated).
    // 2. Split the input into an array of genre names.
    // 3. Use Prisma client to create multiple genres with the provided names.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
    // 4. Print the created genres details.
}

async function main() {
    let exit = false;

    while (!exit) {
        console.log("\n--- Movie Management System ---");
        console.log("1. Add Movie");
        console.log("2. Update Movie");
        console.log("3. Delete Movie");
        console.log("4. List All Movies");
        console.log("5. List Movie by ID");
        console.log("6. List Movies by Year");
        console.log("7. List Movies by Genre");
        console.log("8. Add Genre");
        console.log("9. Add Genre to Movie");
        console.log("0. Exit");

        const choice: number = readlineSync.questionInt('Enter your choice: ');

        switch (choice) {
            case 1:
                await addMovie();
                break;
            case 2:
                await updateMovie();
                break;
            case 3:
                await deleteMovie();
                break;
            case 4:
                await listMovies();
                break;
            case 5:
                await listMovieById();
                break;
            case 6:
                await listMoviesByYear();
                break;
            case 7:
                await listMoviesByGenre();
                break;
            case 8:
                await addGenre();
                break;
            case 9:
                await addGenreToMovie();
                break;
            case 0:
                exit = true;
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });