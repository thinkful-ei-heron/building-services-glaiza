/* eslint-disable no-console */
/* eslint-disable quotes */
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

// describe('Shopping List service object', function() {
//     it('should run the tests', () => {
//       expect(true).to.eql(true);
//     });
//   });

describe('Shopping List service object', function() {
    let db;
    //create dummy data
    let testShoppingItems = [
       {
           id: 1,
           name: 'Banana Split',
           price: '10.00',
           date_added: new Date('2029-01-22T16:28:32.615Z'),
           checked: true,
           category: 'Snack',
           
        },
        {
            id: 2,
            name: 'Steak',
            price: '13.75',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
         },
         {
            id: 3,
            name: 'Milk and Donut',
            price: '5.25',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Breakfast'
         },
    ];
    //1 of 4 hooks in Mocha. It runs once before all tests in scope
    before(() => {
        //creates an instance of the test database
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());
    
    afterEach(() => db('shopping_list').truncate());
    
    //disconnect from the database after the tests run
    after(() => db.destroy());

    // //context has data
    context('Given \'shopping_list\' has data', () => {
        beforeEach(() => {
            return db
            .into('shopping_list')
            .insert(testShoppingItems);
        });

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const expectedItems = testShoppingItems.map(item => ({
                ...item
            }));
            return ShoppingListService.getAllItems(db)
            .then(actual => {
            expect(actual).to.eql(expectedItems)
            })
            console.log('get all items');
        });

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3;
            const thirdTestItem= testShoppingItems[thirdId - 1];
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                });
            });
        });
        //Delete
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3;
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(allItems => {
                // copy the test items array without the "deleted" item
                const expected = testShoppingItems.filter(item => item.id !== itemId);
                expect(allItems).to.eql(expected);
            });
        });

        //Update
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfAItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: '5.00',
                date_added: new Date(),
                checked: true,
                category: 'Snack'
            }
            return ShoppingListService.updateItem(db, idOfAItemToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idOfAItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idOfAItemToUpdate,
                    ...newItemData,
                })
            })
        });
    });

    //context has no data
    context('Given \'shopping_list\' has no data', () => {
        it('getAllItems() resolves an empty array', () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([]);
            });
        });
        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'updated name',
                price: '5.00',
                date_added: new Date(),
                checked: true,
                category: 'Snack'
            };
            return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: new Date(newItem.date_added),
                checked: newItem.checked,
                category: newItem.category
                });
            });
        });
    });
});
