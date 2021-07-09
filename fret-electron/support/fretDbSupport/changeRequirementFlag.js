
const db = require('electron').remote.getGlobal('sharedObj').db;

const setChangeRequirementFlag = (isChangingInBulk) => {
    return db.get('REAL_TIME_CONFIG').then((doc) => {
      return db.put({
        ...doc,
        changingReqsInBulk: isChangingInBulk
      })
    }).catch((err) => {
      if(err && err.message === 'missing') {
        return db.put({
          _id: 'REAL_TIME_CONFIG',
          changingReqsInBulk: isChangingInBulk
        })
      }
    })
  }; 

export {
  setChangeRequirementFlag
}
