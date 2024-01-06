import express, { Router } from 'express';
import { Comment } from '../Models/Comment'
import  { commentSchema } from '../validation_schema';
import isAuth from '../isAuth';


const router: Router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const comment = await Comment.findAll();
  res.status(200).json(comment);
})

router.post('/', isAuth, async (req, res) => {
  try {
    await commentSchema.validateAsync(req.body);
    const {book_id, name, comment, stars} = req.body;
    // joi library for validation
    const newComment = Comment.build({
      'book_id': book_id,
      'name': name,
      'comment': comment,
      'stars': stars,
    });
    await newComment.save();

    //created
    res.status(201).json(newComment);
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
      return res.status(400).json({ error: 'Invalid commect ID' });
    }
  
    const comment = await Comment.findOne({
      where:{
        comment_id: id
      }
    });
    await comment?.destroy();
    //204 delete , Success no Response 
    res.status(204).json({});;
  } catch (error) {
    res.status(500).json(error);
  }
})

export default router;