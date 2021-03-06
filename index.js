import 'react-native-gesture-handler';
import { AppRegistry, Platform, LogBox } from 'react-native'
import App from './App'
import TrackPlayer from 'react-native-track-player';

LogBox.ignoreLogs(['Require cycle:'])

// fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     // console.log('-> fetch:', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };

AppRegistry.registerComponent('Sphinx', () => App)
TrackPlayer.registerPlaybackService(() => require('./src/trackPlayer.js'));

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main')
  AppRegistry.runApplication('Sphinx', { rootTag })
}
