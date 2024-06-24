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
    let updatedTitle: string | undefined = readlineSync.question(
        "Enter updated title: "
    );
    let updatedYear: number = readlineSync.questionInt("Enter updated year: ");
    let updatedGenreId: string = readlineSync.question(
        "Enter updated genre ID: "
    );

    if (updatedTitle === "") {
        updatedTitle = undefined;
    }

    let genreConnect: {} | undefined;

    if (updatedGenreId === "") {
        genreConnect = undefined;
    } else {
        genreConnect = {
            connect: {
                id: updatedGenreId,
            },
        };
    }

    const result = await prisma.movie.update({
        where: {
            id: movieId,
        },
        data: {
            title: updatedTitle,
            year: updatedYear,
            genre: genreConnect,
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

type Display = {
    id: string;
    title: string;
    year: number;
    genre: string | Genre;
};

async function listMovies() {
    const result = await prisma.movie.findMany({
        include: { genre: true },
        orderBy: {
            year: "asc",
        },
    });

    let display: any = result.map((movie) => {
        return movie;
    });
    display.forEach((movie: Display) => {
        if (Array.isArray(movie.genre)) {
            movie.genre = movie.genre.reduce((total: string, genre: Genre) => {
                return total + `,${genre.name}`;
            }, "");
            if (typeof movie.genre === "string") {
                movie.genre = movie.genre.slice(1);
            }
        }
    });
    console.table(display);
}

async function listMovieById() {
    const movieId: string = readlineSync.question("Enter movie ID: ");

    const result = await prisma.movie.findUnique({
        where: { id: movieId },
        select: {
            title: true,
            year: true,
            genre: {
                select: {
                    name: true,
                },
            },
        },
    });
    console.log(result);
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
    const genreName: string = readlineSync.question("Enter genre name: ");

    const result = await prisma.movie.findMany({
        where: {
            genre: {
                some: {
                    name: genreName,
                },
            },
        },
        include: {
            genre: {
                select: {
                    name: true,
                },
            },
        },
    });
    result.forEach((row) => {
        console.log(row);
    });
}

async function addGenre() {
    const genreName: string = readlineSync
        .question("Enter genre name: ")
        .trim()
        .toLowerCase();

    const result = await prisma.genre.create({
        data: {
            name: genreName,
        },
    });

    console.log(result);
}

async function getGenreIdByName(name: string) {
    const result = await prisma.genre.findFirst({
        where: {
            name: name,
        },
    });

    return result?.id;
}

async function addGenreToMovie() {
    const movieId: string = readlineSync.question("Enter movie ID: ");
    const genreNames: string = readlineSync.question(
        "Enter genre names(comma seperated): "
    );
    let genreArr: string[] = genreNames.split(",").map((item) => {
        return (item = item.trim().toLowerCase());
    });
    console.log(genreArr);

    let genreData = await Promise.all(
        genreArr.map(async (item: string) => {
            const id = await getGenreIdByName(item);
            return { id: id };
        })
    );

    console.log(genreData);

    const result = await prisma.movie.update({
        where: {
            id: movieId,
        },
        data: {
            genre: {
                connect: genreData,
            },
        },
    });

    console.log(result);
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
        console.log("9. Add Genres to Movie");
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
