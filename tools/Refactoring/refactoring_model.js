// refactoring_model.js
// Matt Luckcuck 2022


function ReplaceFragment(req, fragment, replacement)
{
  let	originalFretish = req.getFretish();

  let updatedFretish = originalFretish.replace(fragment, replacement);

  req.setFretish(updatedFretish);

  return req;

}

function MoveFragment(sourceReq, fragment, destinationReq)
{
  // Use CopyFragment, then delete fragment from srouceReq's fretish with ReplaceFragment(sourceReq, "", destinationReq)
}

function CopyFragment(fragment, destinationReq)
{
  // Either this needs to assume we're only moving fragments from the condition
  // or we need a more sophisticated aproach, that knows where to copy it to.
  let destinationFretish = destinationReq.getFretish();

  // get the right part of the fretish requirement
  // Maybe asssume it's the condition
  var newFretish;
  // eg newFretish = condition + " AND " + fragment;

  destinationReq.setFretish(newFretish);

  return destinationReq;
}




module.exports = { ReplaceFragment, CopyFragment, MoveFragment }
