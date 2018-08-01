import { Client as BugsnagClient } from 'bugsnag-react-native';
const bugsnagClient = new BugsnagClient();

export function compareVersions(versionOne, versionTwo) {
  try {
    const result = versionToInteger(versionOne) - versionToInteger(versionTwo);
    if (result > 0) return 1;
    if (result < 0) return -1;
    return 0;
  } catch (error) {
      // Errors thrown in migration method in dataMigration.js do not trickle down to bugsnag
      // so will need manually notify bug snag.
    error.message = `error verifying versions, versionOne: ${versionOne}, versionTwo ${versionTwo}`;
    bugsnagClient.notify(error);
  }
  return 0;
}
// versionToInteger logic is the same as ./android/app/build.gradle
function versionToInteger(version) {
  const [majorMinorPatch, provisional] = version.split('-');
  const [major, minor, patch] = majorMinorPatch.split('.');
  return Number(major) * 10000000 +
         Number(minor) * 100000 +
         Number(patch) * 100 +
         Number(!provisional ? '99' : provisional.match(/[0-9]+/)[0]);
        // Regex /[0-9]+/, '[0-9]' means match any digit
        // '+' means match one or more of the preceding token
}

export function test() {
  const testHelper = (versionOne, versionTwo, expectedResult) => {
    const testResult = compareVersions(versionOne, versionTwo);
    const testMessage = testResult === expectedResult ? 'pass' : 'FAIL';
    console.log(`checking ${versionOne} vs ${versionTwo}, status: ${testMessage}`);
    console.log(`expected result: ${expectedResult}, actual result: ${testResult}`);
  };

  testHelper('1.0.0', '1.0.1', -1);
  testHelper('1.0.0', '1.1.0', -1);
  testHelper('1.0.0', '2.0.0', -1);
  testHelper('2.0.0', '1.0.0', 1);
  testHelper('2.0.0', '2.0.0', 0);
  testHelper('2.1.0-RC2', '2.1.0-RC0', 1);
  testHelper('2.1.0-RC10', '2.1.0-RC0', 1);
  testHelper('2.1.0-RC10', '2.1.0-RC1', 1);
  testHelper('2.1.0-RC10', '2.1.0', -1);
  testHelper('2.10.11-RC10', '3.10.11', -1);
}

// TEST RESULTS:
/*
checking 1.0.0 vs 1.0.1, status: pass
expected result: -1, actual result: -1
checking 1.0.0 vs 1.1.0, status: pass
expected result: -1, actual result: -1
checking 1.0.0 vs 2.0.0, status: pass
expected result: -1, actual result: -1
checking 2.0.0 vs 1.0.0, status: pass
expected result: 1, actual result: 1
checking 2.0.0 vs 2.0.0, status: pass
expected result: 0, actual result: 0
checking 2.1.0-RC2 vs 2.1.0-RC0, status: pass
expected result: 1, actual result: 1
checking 2.1.0-RC10 vs 2.1.0-RC0, status: pass
expected result: 1, actual result: 1
checking 2.1.0-RC10 vs 2.1.0-RC1, status: pass
expected result: 1, actual result: 1
checking 2.1.0-RC10 vs 2.1.0, status: pass
expected result: -1, actual result: -1
checking 2.10.11-RC10 vs 3.10.11, status: pass
expected result: -1, actual result: -1
*/

