import * as realizability from '../../analysis/realizabilityCheck';
const timeout = '86400';
const experimentsPath = '.';

realizability.checkRealizability(filePath, options +' -timeout '+timeout, function(checkOutput) {
checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
checkOutput.match(new RegExp('(Time = )(.*?)\\n'))[2];
});