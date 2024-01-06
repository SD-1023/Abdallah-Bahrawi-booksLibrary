import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import  { userLoginSchema, userRegisterSchema, userChangePasswordSchema } from '../validation_schema';
import isAuth from '../isAuth';
import { User } from '../Models/User';
import { Session } from '../Models/Session';
import { generateRandomString } from '../Services/userServices';


const router = express.Router();
let sessionId = 0;

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({message: 'Welcome to our website!' });
});

router.get('/register', async (req: Request, res: Response) => {
  res.status(200).render('register');
});

router.post('/register', async (req, res) => {
  try {
    await userRegisterSchema.validateAsync(req.body);
    const {name, email, password} = req.body;
    let user = await User.findOne({
      where: {
        email: email,
      }
    });

    if(user){
      return res.redirect('./register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await Session.create({
      sid: generateRandomString(10),
      user_id: newUser.user_id,
    });
    
    res.redirect('./login');
  } catch (error) {
    res.redirect('./register');
  }
});

router.get('/login', async (req: Request, res: Response) => {
  res.status(200).render('login');
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        await userLoginSchema.validateAsync(req.body);
        const {email, password} = req.body;
        const user = await User.findOne({
          where: {
            email: email,
          }
        });
      
        if(!user){
          return res.redirect('./login');
        }
      
        const isMatch = await bcrypt.compare(password, user.password);
      
        if(!isMatch){
          return res.redirect('./login');;
        }
    
        const session = await Session.findOne({
          where: {
            user_id: user.user_id,
          }
        });
        
        if(session){
          await session?.set(
            {
              isAuth: true,
            }
          )
          await session?.save();
        }else{
          await Session.create({
            sid: generateRandomString(10),
            user_id: user.user_id,
            isAuth: true,
          });
        }
        sessionId = session.sid;
        return res.redirect('./');
    } catch (error) {
        res.redirect('./login');
    }
});


router.get('/change-password', isAuth, async (req: Request, res: Response) => {
  res.status(200).render('changePassword');
});

router.post('/change-password', isAuth, async (req, res) => {
  try {
    await userChangePasswordSchema.validateAsync(req.body);
    const {newPassword} = req.body;
    let session = await Session.findOne({
      where: {
        sid: sessionId,
      }
    });

    let user = await User.findOne({
      where: {
        user_id: session.user_id,
      }
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user?.set(
    {
      password: hashedPassword,
    }
    )
    await user?.save();

    await Session.destroy({
      where: {
        user_id: user.user_id,
      },
    });
    sessionId = 0;
    res.redirect('./login');
  } catch (error: any) {
    res.redirect('./change-password');
  }
});

export {router, sessionId};

