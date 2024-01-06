import express, { Router } from 'express';
import { Publisher } from '../Models/Publisher'
import { Book } from '../Models/Book'
import  { publisherSchema } from '../validation_schema';
import isAuth from '../isAuth';


const router: Router = express.Router();

router.get('/', isAuth, async (req, res) => {
  try {
    const publisher = await Publisher.findAll();
    res.status(200).json(publisher);
  } catch (error) {
    res.json(error);
  }
})

router.get('/:id', isAuth, async (req, res)=> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid publisher ID' });
    }
    const publisher = await Publisher.findOne({
      where: {
        publisher_id: id,
      }
    });
  
    res.status(200).json(publisher);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id/books', isAuth, async (req, res)=> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid publisher ID' });
    }
    const books = await Book.findAll({
      where :{
        publisher_id: id,
      }
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', isAuth, async (req, res) => {
  try {
    await publisherSchema.validateAsync(req.body);
    const {name, country} = req.body;
  
    const newPublisher = Publisher.build({
      'name': name,
      'country': country,
    });
    await newPublisher.save();

    res.status(201).json(newPublisher);
  } catch (error: any) {
    if(error.isJoi === true){
      //the server can't proccess the content 
      error.status = 422;
    }
    res.status(error.status).json(error);
  }
});

router.delete('/:id', isAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid publisher ID' });
    }
    const publisher = await Publisher.findOne({
      where:{
        publisher_id: id,
      }
    });

    await publisher?.destroy();
    //204 delete
    res.status(204).json({});;
    
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;