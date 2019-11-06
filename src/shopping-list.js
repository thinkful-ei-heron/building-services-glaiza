/* eslint-disable no-console */
require('dotenv').config();

const knex = require('knex');
const ShoppingListService = require('./shopping-list-service');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});
  
console.log(ShoppingListService.getAllItems());

  // use all the ArticlesService methods!!
//   ShoppingListService.getAllItems(knexInstance)
//   .then(items => console.log(items))
//   .then(() =>
//   ShoppingListService.insertItem(knexInstance, {
//       title: 'New title',
//       content: 'New content',
//       date_published: new Date(),
//     })
//   )
//   .then(newItem => {
//     console.log(newItem);
//     return ShoppingListService.updateItem(
//       knexInstance,
//       newItem.id,
//       { title: 'Updated title' }
//     ).then(() => ShoppingListService.getById(knexInstance, newItem.id));
//   })
//   .then(item => {
//     console.log(item);
//     return ShoppingListService.deleteArticle(knexInstance, item.id);
//   });