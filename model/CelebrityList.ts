import Fuse from "fuse.js";

export const celebrities : string[] = [
   "Taylor Swift",
   "Albert Einstein",
   "Dua Lipa",
   "Leonardo da Vinci",
   "Michael Jackson",
   "Madonna",
   "Elvis Presley",
   "Beyoncé",
   "Tom Cruise",
   "Angelina Jolie",
   "Brad Pitt",
   "Marilyn Monroe",
   "Barack Obama",
   "Oprah Winfrey",
   "Justin Bieber",
   "Rihanna",
   "Adele",
   "Emma Watson",
   "Kanye West",
   "Lady Gaga",
   "Jennifer Lopez",
   "Will Smith",
   "Britney Spears",
   "Johnny Depp",
   "Selena Gomez",
   "David Beckham",
   "Cristiano Ronaldo",
   "Katy Perry",
   "Steve Jobs",
   "Mark Zuckerberg",
   "Bill Gates",
   "Jeff Bezos",
   "Salvador Dalí",
   "Vincent van Gogh",
   "Walt Disney",
   "Angela Merkel",
   "Kylie Jenner",
   "Kim Kardashian",
   "Kendall Jenner",
   "Stephen Hawking",
   "Snoop Dogg",
   "Eminem",
   "Arnold Schwarzenegger",
   "Michael Jordan",
   "Muhammad Ali",
   "Celine Dion",
   "John Lennon",
   "Paul McCartney",
   "Ringo Starr",
   "George Harrison",
   "Bob Marley",
   "Elton John",
   "Freddie Mercury",
   "David Bowie",
   "Elizabeth II",
   "William, Prince of Wales",
   "Diana, Princess of Wales",
   "Nelson Mandela",
   "Malala Yousafzai",
   "Ellen DeGeneres",
   "Tom Hanks",
   "Robert Downey Jr.",
   "Jennifer Aniston",
   "Meryl Streep",
   "Leonardo DiCaprio",
   "Julia Roberts",
   "George Clooney",
   "Matt Damon",
   "Nicole Kidman",
   "Tom Hardy",
   "Daniel Radcliffe",
   "Emma Stone",
   "Scarlett Johansson",
   "Chris Hemsworth",
   "Jennifer Lawrence",
   "Gigi Hadid",
   "Zendaya",
   "Harry Styles",
   "Lionel Messi",
   "Neymar",
   "Serena Williams",
   "Roger Federer",
   "Lewis Hamilton",
   "Usain Bolt",
   "Tiger Woods",
   "Billie Eilish",
   "Ariana Grande",
   "Megan Fox",
   "Jessica Alba",
   "Gwyneth Paltrow",
   "Emmanuel Macron",
   "François Hollande",
   "Nicolas Sarkozy",
   "Carla Bruni",
   "Édith Piaf",
   "Marion Cotillard",
   "Ryan Reynolds",
   "Blake Lively",
   "Ryan Gosling",
   "Tom Holland",
   "Coco Chanel",
   "Christian Dior",
   "Jacques Brel",
   "Charles Aznavour",
   "Joe Biden",
   "Greta Thunberg",
    "John von Neumann"
];

/**
 * This function takes a string as input, which should be a celebrity name
 * and returns this name in its Wikipedia URL version. Might not be needed.
 * @param celebrity - the name of the celebrity whose URL we're interested in.
 */
export function toURL(celebrity : string) : string {
   return celebrity.replace(/ /g, "_");
}

/**
 * This functions takes a string as parameter and returns all
 * celbrities from our list whose name is close to the query.
 * It uses Fuse.js which is a powerful, lightweight fuzzy-search
 * library, fuzzy searching is the technique of finding strings
 * that are approximately equal to a given pattern (our query).
 * @param query - this string will filter the output of our
 * function to return only celebrities close to our input.
 */
export function getAutocompleteSuggestions(query: string): string[] {

    const fuseOptions: Fuse.IFuseOptions<string> = {
        threshold: 0.4,
    };

    // Initialize Fuse with the celebrity data and options and perform search
    const fuse = new Fuse(celebrities, fuseOptions);
    const suggestions = fuse.search(query).map(result => result.item);

    return suggestions;
}

