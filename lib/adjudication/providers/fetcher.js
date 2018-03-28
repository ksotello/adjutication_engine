import fetch from 'node-fetch';
import Helpers from './helpers';

export default class Fetcher {
  static providerData() {
    return fetch('http://provider-data.beam.dental/beam-network.csv').then((csvData) => {
      return Helpers.convertCSVtoJSON(csvData);
    });
  }
}
