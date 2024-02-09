
import FretModel from '../model/FretModel';

async function callFretLib() {

    var fretModel = new FretModel();

    var res = await fretModel.initializeFromDB();
    res = await fretModel.addProject(null,['newFretLibProj5556']);

    console.log('testing calling FRET lib: ', res);

}

callFretLib();