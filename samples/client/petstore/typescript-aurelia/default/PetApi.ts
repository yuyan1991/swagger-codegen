/**
 * Swagger Petstore
 * This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: apiteam@swagger.io
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { Api } from './Api';
import { AuthStorage } from './AuthStorage';
import {
  Array&lt;string&gt;,
  any,
  Pet,
  ApiResponse,
  Array&lt;&#39;available&#39; | &#39;pending&#39; | &#39;sold&#39;&gt;,
} from './models';

/**
 * addPet - parameters interface
 */
export interface IAddPetParams {
  body: Pet;
}

/**
 * deletePet - parameters interface
 */
export interface IDeletePetParams {
  petId: number;
  apiKey?: string;
}

/**
 * findPetsByStatus - parameters interface
 */
export interface IFindPetsByStatusParams {
  status: Array<'available' | 'pending' | 'sold'>;
}

/**
 * findPetsByTags - parameters interface
 */
export interface IFindPetsByTagsParams {
  tags: Array<string>;
}

/**
 * getPetById - parameters interface
 */
export interface IGetPetByIdParams {
  petId: number;
}

/**
 * updatePet - parameters interface
 */
export interface IUpdatePetParams {
  body: Pet;
}

/**
 * updatePetWithForm - parameters interface
 */
export interface IUpdatePetWithFormParams {
  petId: number;
  name?: string;
  status?: string;
}

/**
 * uploadFile - parameters interface
 */
export interface IUploadFileParams {
  petId: number;
  additionalMetadata?: string;
  file?: any;
}

/**
 * PetApi - API class
 */
@autoinject()
export class PetApi extends Api {

  /**
   * Creates a new PetApi class.
   *
   * @param httpClient The Aurelia HTTP client to be injected.
   */
  constructor(httpClient: HttpClient, authStorage: AuthStorage) {
    super(httpClient, authStorage);
  }

  /**
   * Add a new pet to the store
   * 
   * @param params.body Pet object that needs to be added to the store
   */
  async addPet(params: IAddPetParams): Promise<any> {
    // Verify required parameters are set
    this.ensureParamIsSet('addPet', params, 'body');

    // Create URL to call
    const url = `${this.basePath}/pet`;

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asPost()
      // Encode body parameter
      .withHeader('content-type', 'application/json')
      .withContent(JSON.stringify(params['body'] || {}))

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Deletes a pet
   * 
   * @param params.petId Pet id to delete
   * @param params.apiKey 
   */
  async deletePet(params: IDeletePetParams): Promise<any> {
    // Verify required parameters are set
    this.ensureParamIsSet('deletePet', params, 'petId');

    // Create URL to call
    const url = `${this.basePath}/pet/{petId}`
      .replace(`{${'petId'}}`, encodeURIComponent(String(${params['petId']})));

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asDelete()
      .withHeader('api_key', params['apiKey'])
      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Finds Pets by status
   * Multiple status values can be provided with comma separated strings
   * @param params.status Status values that need to be considered for filter
   */
  async findPetsByStatus(params: IFindPetsByStatusParams): Promise<Array<Pet>> {
    // Verify required parameters are set
    this.ensureParamIsSet('findPetsByStatus', params, 'status');

    // Create URL to call
    const url = `${this.basePath}/pet/findByStatus`;

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asGet()
      // Set query parameters
      .withParams({ 
        'status': params['status'],
      })

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Finds Pets by tags
   * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   * @param params.tags Tags to filter by
   */
  async findPetsByTags(params: IFindPetsByTagsParams): Promise<Array<Pet>> {
    // Verify required parameters are set
    this.ensureParamIsSet('findPetsByTags', params, 'tags');

    // Create URL to call
    const url = `${this.basePath}/pet/findByTags`;

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asGet()
      // Set query parameters
      .withParams({ 
        'tags': params['tags'],
      })

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Find pet by ID
   * Returns a single pet
   * @param params.petId ID of pet to return
   */
  async getPetById(params: IGetPetByIdParams): Promise<Pet> {
    // Verify required parameters are set
    this.ensureParamIsSet('getPetById', params, 'petId');

    // Create URL to call
    const url = `${this.basePath}/pet/{petId}`
      .replace(`{${'petId'}}`, encodeURIComponent(String(${params['petId']})));

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asGet()

      // Authentication 'api_key' required
      .withHeader('api_key', this.authStorage.getapi_key())
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Update an existing pet
   * 
   * @param params.body Pet object that needs to be added to the store
   */
  async updatePet(params: IUpdatePetParams): Promise<any> {
    // Verify required parameters are set
    this.ensureParamIsSet('updatePet', params, 'body');

    // Create URL to call
    const url = `${this.basePath}/pet`;

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asPut()
      // Encode body parameter
      .withHeader('content-type', 'application/json')
      .withContent(JSON.stringify(params['body'] || {}))

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * Updates a pet in the store with form data
   * 
   * @param params.petId ID of pet that needs to be updated
   * @param params.name Updated name of the pet
   * @param params.status Updated status of the pet
   */
  async updatePetWithForm(params: IUpdatePetWithFormParams): Promise<any> {
    // Verify required parameters are set
    this.ensureParamIsSet('updatePetWithForm', params, 'petId');

    // Create URL to call
    const url = `${this.basePath}/pet/{petId}`
      .replace(`{${'petId'}}`, encodeURIComponent(String(${params['petId']})));

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asPost()
      // Encode form parameters
      .withHeader('content-type', 'application/x-www-form-urlencoded')
      .withContent(this.queryString({ 
        'name': params['name'],
        'status': params['status'],
      }))

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

  /**
   * uploads an image
   * 
   * @param params.petId ID of pet to update
   * @param params.additionalMetadata Additional data to pass to server
   * @param params.file file to upload
   */
  async uploadFile(params: IUploadFileParams): Promise<ApiResponse> {
    // Verify required parameters are set
    this.ensureParamIsSet('uploadFile', params, 'petId');

    // Create URL to call
    const url = `${this.basePath}/pet/{petId}/uploadImage`
      .replace(`{${'petId'}}`, encodeURIComponent(String(${params['petId']})));

    const response = await this.httpClient.createRequest(url)
      // Set HTTP method
      .asPost()
      // Encode form parameters
      .withHeader('content-type', 'application/x-www-form-urlencoded')
      .withContent(this.queryString({ 
        'additionalMetadata': params['additionalMetadata'],
        'file': params['file'],
      }))

      // Authentication 'petstore_auth' required
      // Send the request
      .send();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(response.content);
    }

    // Extract the content
    return response.content;
  }

}

