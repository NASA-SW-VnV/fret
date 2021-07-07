
const db = require('electron').remote.getGlobal('sharedObj').db;

const setChangeRequirementFlag = (isChanging) => {
    return db.get('REAL_TIME_CONFIG').then((doc) => {
      return db.put({
        ...doc,
        changingReqs: isChanging
      })
    }).catch((err) => {
      if(err && err.message === 'missing') {
        return db.put({
          _id: 'REAL_TIME_CONFIG',
          changingReqs: isChanging
        })
      }
    })
  }; 

export {
  setChangeRequirementFlag
}
