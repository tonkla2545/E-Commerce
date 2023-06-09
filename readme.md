API Specification for Retrieving Product Information
===============================================

Endpoint
--------
```
GET domain/home
```

Description
-----------
This endpoint retrieves information about a specific product.

Parameters
----------
None

Response
--------
- Status Code: 200 OK
- Content-Type: application/json

Response Body
-------------
```json
{
  "_id": "6475a64297672ee510e7ecb4",
  "name": "too",
  "priceUnit": 200,
  "size": [
    {
      "30": "30",
      "39": "39",
      "40": "40"
    }
  ],
  "category": "jordan",
  "sex": "ชาย",
  "image": null,
  "description": "ชาย",
  "date": "2023-05-30T07:31:14.299Z",
  "__v": 0
}
```

Note
----
- The response body contains the detailed information of the product.
- The "_id" field represents the unique identifier of the product.
- The "name" field indicates the name of the product.
- The "priceUnit" field represents the price of the product in the specified currency.
- The "size" field contains an array of sizes available for the product.
- The "category" field denotes the category to which the product belongs.
- The "sex" field indicates the target gender for the product.
- The "image" field may contain the URL or reference to the product image, but it is currently null in the provided data.
- The "description" field provides additional details or description of the product.
- The "date" field represents the date and time when the product information was created or updated.
- The "__v" field is a versioning field used internally and can be ignored for client-side usage.