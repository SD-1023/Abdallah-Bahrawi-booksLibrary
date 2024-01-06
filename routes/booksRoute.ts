import express, { Router } from 'express';
import { Book } from '../Models/Book'
import { Publisher } from '../Models/Publisher';
import { Comment } from '../Models/Comment';
import { sequelize } from '../db';
import { QueryTypes } from 'sequelize';
import  { bookSchema } from '../validation_schema';

import isAuth from '../isAuth';

const router: Router = express.Router();


//Endpoint to return all the books
router.get('/', isAuth, async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
})

//Endpoint to return top rated books based on the stars
router.get('/top-rated', isAuth, async (req, res)=> {
  const result = await sequelize.query(`SELECT b.*, AVG(c.stars) AS average_stars FROM books b
        JOIN comments c ON b.book_id = c.book_id
        WHERE c.stars IS NOT NULL
        GROUP BY b.book_id
        ORDER BY average_stars DESC
        LIMIT 10;
  `, { type: QueryTypes.SELECT});
  
  res.status(200).json(result);
})

//Endpoint to get a book by an id
router.get('/:id', isAuth, async (req, res)=> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
  
    const book = await Book.findByPk(id, {
      include: [Publisher, Comment]
    });
  
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error);
  }
})

router.put('/:id', isAuth, async (req, res) => {
  try {
    
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await Book.findOne({
      where: {
        book_id: id,
      }
    });
    const { publisher_id, isbn, title, year, author, pages } = req.body;

    await book?.set(
        {
          publisher_id: publisher_id,
          isbn: isbn,
          title: title,
          year: year,
          author: author,
          pages: pages
        }
    )
    await book?.save();

    res.status(200).json(book);
  } catch (error: any) {
    if(error.isJoi === true){
      //the server can't proccess the content 
      error.status = 422;
    }
    res.status(error.status).json(error);
  }
});

router.post('/', isAuth, async (req, res) => {
  try {
    await bookSchema.validateAsync(req.body);

    const {publisher_id, isbn, title, year, author, pages} = req.body;
    const newBook = Book.build({
      'publisher_id': publisher_id,
      'isbn': isbn,
      'title': title,
      'year': year,
      'author': author,
      'pages': pages
    });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error: any) {
    if(error.isJoi === true){
      //the server can't process the content 
      error.status = 422;
    }
    res.status(error.status).json(error);
  }
});

router.delete('/:id', isAuth, async (req, res) => {
  try {    
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const book = await Book.findOne({
      where:{
        book_id: id
      }
    });
    await book?.destroy();
    //204 delete , Success no Response 
    res.status(204).json({});;
  } catch (error) {
    res.status(500).json(error);
  }
})

export default router;
