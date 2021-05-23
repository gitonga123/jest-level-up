const bookService = require('../src/book.service');
const booksProvider = require('../src/books-provider');
const emailService = require('../src/email.service');

describe("Search Book", () => {
    describe("When one book matches the search test", () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    title: 'Test Book',
                    publishedDate: '2013-10-15T00:00:00.000-0700'
                }
            ]);
            emailService.sendMissingBookEmail = jest.fn();
        });
        test('It should return 1 book', () => {
            const books = bookService.searchBooks("Test");
            expect(books.length).toBe(1);
        });
        test("Should return the book title with year", () => {
            const books = bookService.searchBooks("Test");
            expect(books[0].title).toBe('Test Book 2013');
        });

        test("Should call not send email on finding test result", () => {
            bookService.searchBooks('Tes');
            expect(emailService.sendMissingBookEmail).not.toHaveBeenCalled();
        });
    });

    describe('When zero books match search test', () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    title: 'Test Book',
                    publishedDate: '2013-10-15T00:00:00.000-0700'
                }
            ]);
            emailService.sendMissingBookEmail = jest.fn();
        });
        test("Should return the 0 if title is missing", () => {
            const books = bookService.searchBooks("Anchorage");
            expect(books.length).toBe(0);
        });

        test("Should call send email on zero test result", () => {
            bookService.searchBooks('Anchorage');
            expect(emailService.sendMissingBookEmail).toHaveBeenCalled();
        });
    })
})