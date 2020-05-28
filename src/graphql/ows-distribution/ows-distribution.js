import { OWS_DISTRIBUTION_URL } from "../../constants/urls";
import OwsDataSource from "../ows-data-source";
import { formatProduct, formatUpdatePayload } from "./formatters/product";

class OwsDistribution extends OwsDataSource {
  constructor() {
    super();
    this.baseURL = OWS_DISTRIBUTION_URL;
  }

  async getProductDistribution(productId) {
    const data = await this.get(`/product-distribution/${productId}`);
    console.log(data);
    const a = data.items.map((item) => formatProduct(item));
    const result = { items: a };
    console.log(result, "ows");
    return result;
  }

  async updateProductDistributionTo(input) {
    const body = input;
    const response = await this.post(
      `/${body.productId}`,
      formatUpdatePayload(body)
    );
    console.log(response);
    return response;
  }

}

export default OwsDistribution;
