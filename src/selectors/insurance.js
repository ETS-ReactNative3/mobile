/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */

export const selectInsuranceDiscountRate = ({ insurance }) => {
  const { selectedInsurancePolicy } = insurance;
  const { discountRate = 0 } = selectedInsurancePolicy || {};
  return discountRate;
};
