import { uniqBy } from "lodash";
import * as RECOMMENDED_PARTICIPANTS from "../constants/recommended-participants";
import { withCache } from "../utils/cache";
import {
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_DEBOUNCE,
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_KEY,
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_TTL,
} from "../constants/cache";

/* eslint-disable no-unused-vars */
const resolvers = {
  async ProductDistributionSearch(_source, _arg, { dataSources }) {
    return await dataSources.owsDistribution.getProductDistribution(
      _arg.productId
    );
  },
};

export default resolvers;
