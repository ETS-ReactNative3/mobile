/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import Realm from 'realm';

/**
 * A periodSchedule is a simple grouping table for periods. Related
 * to a MasterList and store through Program.programSettings.
 * @property  {string} id
 * @property  {string} name     A generic name field
 * @property  {Period} periods  Related Periods objects
 */
export class PeriodSchedule extends Realm.Object {
  /**
   * Finds the related periods for this periodSchedule, which
   * are available to use for the given orderType -- they have
   * less related requisitions to than orderType.maxOrdersPerPeriod.
   * @param {MasterList}  program    The related program
   * @param {object}      orderType  The maxOrdersPerPeriod of the orderType
   */
  getPeriodsForOrderType(program, orderType) {
    const periods = this.periods.filter(
      period => period.requisitionsForOrderType(program, orderType) < orderType.maxOrdersPerPeriod
    );
    return periods;
  }

  /**
   * Adds a period to this periodSchedule if it is not already
   * a part of this periodSchedule.
   * @param {Period} period
   */
  addPeriodIfUnique(period) {
    if (this.periods.filtered('id == $0', period.id).length > 0) return;
    this.periods.push(period);
  }
}

export default PeriodSchedule;

PeriodSchedule.schema = {
  name: 'PeriodSchedule',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', default: 'Placeholder Name' },
    periods: { type: 'list', objectType: 'Period' },
  },
};
