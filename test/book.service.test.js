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
        test("Should return the book title with publish year", () => {
            const books = bookService.searchBooks("Test");
            expect(books[0].title).toBe('Test Book 2013');
        });

        test("Should call not send email on finding test result", () => {
            bookService.searchBooks('Test');
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
});

describe('Test Search Most Popular Book', () => {
    describe('When two books are given', () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    ordered: 100
                }, {
                    _id: 2,
                    ordered: 99
                }
            ])
        })
        it('Should return book with highest order count', () => {
            const book = bookService.getMostPopularBook();
            expect(book._id).toBe(1);
        });
    })
});

describe('Test Calculate Discount Logic', () => {
    describe('When book is given with id', () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    price: 100
                }
            ]);
        });
        it('Should return price with 20% discount', () => {
            const price = bookService.calculateDiscount(1);
            expect(price).toBe(80);
        });
    });

    describe('When book is given with id not found', () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => []);
        });
        it('Should throw an error', () => {
            expect(() =>bookService.calculateDiscount(1)).toThrow('Book with such id not found');
        });
    });

    describe('Calculate discount async operation', () => {
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    price: 100
                }
            ]);
        });
        it('Should return price with 20% discount', async () => {
            const price = await bookService.calculateDiscountAsync(1);
            expect(price).toBe(80);
        });

        it ('show throw an error', () => {
            expect(async () => await bookService.calculateDiscount(1))
            .rejects.toThrow('Book with such id not found');
        });
    })

});
