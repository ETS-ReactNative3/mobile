import Realm from 'realm';

export class NameNote extends Realm.Object {
  get data() {
    try {
      return JSON.parse(this._data);
    } catch {
      // swallow error, return a default
      return null;
    }
  }

  // Will throw if newValue is unable to be stringified
  set data(newValue) {
    this._data = JSON.stringify(newValue);
  }

  toObject() {
    return {
      id: this.id,
      entryDate: this.entryDate.getTime(),
      data: this.data,
      nameID: this.name.id,
      patientEventID: this.patientEvent.id,
    };
  }
}

NameNote.schema = {
  name: 'NameNote',
  primaryKey: 'id',
  properties: {
    id: 'string',
    entryDate: { type: 'date', default: new Date() },
    _data: { type: 'string', optional: true },
    name: 'Name',
    patientEvent: 'PatientEvent',
  },
};

export default NameNote;
