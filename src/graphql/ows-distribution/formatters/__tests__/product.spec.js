import { ProductDocumentFactory } from 'lib/test-helpers/factories/connectors/ows-product';
import formatProduct from '../product';

const product = ProductDocumentFactory();

const fieldMappings = {
    cLine: 'c_line',
    configuration: 'configuration',
    contextType: 'context_type',
    deletions: 'deletions',
    displayStatus: 'display_status',
    displayUpc: 'display_upc',
    distributionFormatId: 'distribution_format_id',
    preorderDate: 'preorder_date',
    format: 'format',
    genreId: 'genre_id',
    imprint: 'imprint',
    metaLanguage: 'meta_language',
    productConfiguration: 'product_configuration',
    productId: 'release_id',
    productName: 'release_name',
    productTypeId: 'product_type_id',
    releaseDate: 'release_date',
    releaseId: 'release_id',
    saleStartDate: 'sale_start_date',
    status: 'release_status',
    subaccountId: 'subaccount_id',
    subgenreId: 'subgenre_id',
    typeOfVideo: 'type_of_video',
    vendorId: 'vendor_id',
    version: 'version'
};

describe('formatProduct', () => {

    Object.keys(fieldMappings)
        .map(newField => [newField, fieldMappings[newField]])
        .forEach(([newField, oldField]) => {

            describe(oldField, () => {

                test(`maps to ${newField}`, () =>
                    expect(formatProduct(product)[newField]).toEqual(product[oldField]));
            });

        });

    describe('project', () => {
        const projectFieldMappings = {
            projectId: 'project_id',
            projectName: 'project_name',
            projectCode: 'project_code'
        };

        Object.keys(projectFieldMappings)
            .map(newField => [newField, projectFieldMappings[newField]])
            .forEach(([newField, oldField]) => {

                describe(oldField, () => {

                    test(`maps to ${newField}`, () =>
                        expect(formatProduct(product).project[newField])
                            .toEqual(product[oldField]));
                });

            });
    });

});
