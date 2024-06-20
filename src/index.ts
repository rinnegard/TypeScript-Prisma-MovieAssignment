import readlineSync from "readline-sync";
import { PrismaClient, Movie, Genre } from "@prisma/client";

const prisma = new PrismaClient();

async function addMovie() {
    const title: string = readlineSync.question("Enter movie title: ");
    const year: number = readlineSync.questionInt("Enter movie year: ");

    const movie: Movie = await prisma.movie.create({
        data: {
            title,
            year,
        },
    });
    console.log(movie);
}

async function updateMovie() {
    const movieId: string = readlineSync.question("Enter movie ID: ");
    const updatedTitle: string = readlineSync.question("Enter updated title: ");
    const updatedYear: number = readlineSync.questionInt(
        "Enter updated year: "
    );
    const updatedGenreId: string = readlineSync.question(
        "Enter updated genre ID: "
    );

    const result = await prisma.movie.update({
        where: {
            id: movieId,
        },
        data: {
            title: updatedTitle,
            year: updatedYear,
            genreId: updatedGenreId,
            genre: {
                connect: {
                    id: updatedGenreId,
                },
            },
        },
    });

    console.table(result);
}

async function deleteMovie() {
    const movieId: string = readlineSync.question("Enter movie ID: ");

    const result = await prisma.movie.delete({
        where: { id: movieId },
    });

    console.log("Deleted", result);
}

async function listMovies() {
    const result = await prisma.movie.findMany();
    console.table(result);
}

async function listMovieById() {
    const movieId: string = readlineSync.question("Enter movie ID: ");

    const result = await prisma.movie.findUnique({
        where: { id: movieId },
        include: { genre: true },
    });

    console.log(result); //TODO Select without ids
}

async function listMoviesByYear() {
    const searchYear: number = readlineSync.questionInt("Enter a year: ");

    const result = await prisma.movie.findMany({
        where: {
            year: {
                equals: searchYear,
            },
        },
    });

    console.table(result);
}

async function listMoviesByGenre() {
    // Expected:
    // 1. Prompt the user for genre Name to list movies.
    // 2. Use Prisma client to fetch movies with the provided genre ID.
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    // 3. Include the genre details in the fetched movies.
    // 4. Print the list of movies with the provided genre.
    const genreName: string = readlineSync.question("Enter genre name: ");

    const result = await prisma.genre.findMany({
        where: {
            genre: genreName,
        },
    });
}

async function addGenre() {
    const genreName: string = readlineSync.question("Enter genre name: ");

    const result = await prisma.genre.create({
        data: {
            name: genreName,
        },
    });

    console.log(result);
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

        const choice: number = readlineSync.questionInt("Enter your choice: ");

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
                console.log("Invalid choice. Please try again.");
        }
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
