/* eslint-disable camelcase */
export const formatProduct = ({
  product_distribution_id,
  product_id,
  distribute_to,
}) => ({
  productId: product_id,
  distributeTo: distribute_to,
  productDistributionId: product_distribution_id,
});

export const formatUpdatePayload = ({ productId, distributeTo }) => ({
  product_id: productId,
  distribute_to: distributeTo,
});
