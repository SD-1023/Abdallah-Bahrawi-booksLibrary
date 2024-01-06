import { Session } from "./Models/Session";
import { sessionId } from  './routes/homeRoute'

const isAuth = async (req, res, next)  => {
  console.log(sessionId)
  if(sessionId){
    const session = await Session.findOne({
      where: {
        sid: sessionId,
      }
    }
    );
    if(!session.isAuth || !session){
      res.redirect('http://localhost:3000/login');
    }
    next();
  }else{
    res.redirect('http://localhost:3000/login');
  }
}

export default isAuth;


