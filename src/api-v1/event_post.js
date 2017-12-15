
class V1EventPostHandler {
  constructor (eventMgr) {
    this.eventMgr = eventMgr
  }

  async handle(event,context, cb) {
    
    //Parse body
    let body;
    try{ 
        body = JSON.parse(event.body) 
    } catch(e){
        cb({code:403, message:'no json body: '+e.toString()})
        return;
    }

    // Check if event_token is present
    if (!(body.event_token)) {
      cb({code: 403, message: 'no event_token'})
      return
    } 

    let dtoken;
    try{
      dtoken=await this.uportMgr.decode(event_token)        
    } catch (error){
      console.log("Error on this.uportMgr.decode")
      console.log(error)
      cb({code: 401, message: 'Invalid token'})
      return;
    }

    // Check if previous is present
    if (!(dtoken.previous)) {
      cb({code: 403, message: 'no previous'})
      return
    } 

    // Check if event is present
    if (!(dtoken.event)) {
      cb({code: 403, message: 'no event'})
      return
    }
    
    
    let mnid=dtoken.iss
 
    //Check if previous is the last event
    try{
      let lastId=await this.eventMgr.lastId(mnid)        
      console.log("lastId for the mnid '"+mnid+"' is: "+lastId)
      if (lastId!=body.previous){
        cb({code: 409, message: 'previous is not the latest id'})
        return
      }
    } catch (error){
      console.log("Error on this.eventMgr.lastId")
      console.log(error)
      cb({code: 500, message: error.message})
      return;
    }

  }

}

module.exports = V1EventPostHandler
