/* eslint-disable no-unused-vars */
import PRODUCT_CONFIGURATION from "./enums/product-configuration";
import { HAS_FOLLOWED } from "./enums/follow-global-participant-relationship";

const resolvers = {
  
  async updateProductDistributionTo(_source, { input }, { dataSources }) {
    return await dataSources.owsDistribution.updateProductDistributionTo(input);
  },
};

export default resolvers;
