
import FretModel from '../model/FretModel';

async function callFretLib() {

    var fretModel = new FretModel();

    var res = await fretModel.initializeFromDB();


    //fretModel.importRequirements(null, listOfRequirements,' {}')
    res = await fretModel.addProject(null,['newFretLibProj55567']);

    console.log('testing calling FRET lib: ', res);

}

callFretLib();