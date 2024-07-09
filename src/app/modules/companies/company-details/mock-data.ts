export const ROLES =
{
  "draw": 0,
  "recordsTotal": 8,
  "recordsFiltered": 8,
  "data": [
    {
      "id": 1,
      "name": "administrator",
      "guard_name": "web",
      "created_at": "2024-07-02T09:57:45.000000Z",
      "updated_at": "2024-07-02T09:57:45.000000Z",
      "description": "Best for business owners and company administrators",
      "permissions": [],
      "users": [
        {
          "id": 1,
          "name": "Trudie Langosh",
          "email": "demo@demo.com",
          "email_verified_at": "2024-07-02T09:57:45.000000Z",
          "avatar": null,
          "created_at": "2024-07-02T09:57:45.000000Z",
          "updated_at": "2024-07-09T13:33:33.000000Z",
          "last_login_at": "2024-07-09T13:33:33.000000Z",
          "last_login_ip": "193.255.92.36",
          "profile_photo_path": null,
          "pivot": {
            "model_type": "App\\Models\\User",
            "role_id": 1,
            "model_id": 1
          }
        },
        {
          "id": 2,
          "name": "Miss Katelyn Pfannerstill",
          "email": "admin@demo.com",
          "email_verified_at": "2024-07-02T09:57:45.000000Z",
          "avatar": null,
          "created_at": "2024-07-02T09:57:45.000000Z",
          "updated_at": "2024-07-02T09:57:45.000000Z",
          "last_login_at": null,
          "last_login_ip": null,
          "profile_photo_path": null,
          "pivot": {
            "model_type": "App\\Models\\User",
            "role_id": 1,
            "model_id": 2
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "developer",
      "guard_name": "web",
      "created_at": "2024-07-02T09:57:45.000000Z",
      "updated_at": "2024-07-09T03:03:17.000000Z",
      "description": "Best for developers or people primarily using the API",
      "permissions": [],
      "users": []
    },
    {
      "id": 3,
      "name": "analyst",
      "guard_name": "web",
      "created_at": "2024-07-02T09:57:45.000000Z",
      "updated_at": "2024-07-02T09:57:45.000000Z",
      "description": "Best for people who need full access to analytics data, but don't need to update business settings",
      "permissions": [],
      "users": [
        {
          "id": 15,
          "name": "Mr. Fermin Farrell Sr.",
          "email": "gtoy@example.org",
          "email_verified_at": "2024-07-02T09:57:45.000000Z",
          "avatar": null,
          "created_at": "2024-07-02T09:57:45.000000Z",
          "updated_at": "2024-07-02T09:57:45.000000Z",
          "last_login_at": null,
          "last_login_ip": null,
          "profile_photo_path": null,
          "pivot": {
            "model_type": "App\\Models\\User",
            "role_id": 3,
            "model_id": 15
          }
        }
      ]
    },
    {
      "id": 4,
      "name": "support",
      "guard_name": "web",
      "created_at": "2024-07-02T09:57:45.000000Z",
      "updated_at": "2024-07-02T09:57:45.000000Z",
      "description": "Best for employees who regularly refund payments and respond to disputes",
      "permissions": [],
      "users": [
        {
          "id": 2,
          "name": "Miss Katelyn Pfannerstill",
          "email": "admin@demo.com",
          "email_verified_at": "2024-07-02T09:57:45.000000Z",
          "avatar": null,
          "created_at": "2024-07-02T09:57:45.000000Z",
          "updated_at": "2024-07-02T09:57:45.000000Z",
          "last_login_at": null,
          "last_login_ip": null,
          "profile_photo_path": null,
          "pivot": {
            "model_type": "App\\Models\\User",
            "role_id": 4,
            "model_id": 2
          }
        }
      ]
    },
    {
      "id": 5,
      "name": "trial",
      "guard_name": "web",
      "created_at": "2024-07-02T09:57:45.000000Z",
      "updated_at": "2024-07-02T09:57:45.000000Z",
      "description": "Best for people who need to preview content data, but don't need to make any updates",
      "permissions": [],
      "users": [
        {
          "id": 2,
          "name": "Miss Katelyn Pfannerstill",
          "email": "admin@demo.com",
          "email_verified_at": "2024-07-02T09:57:45.000000Z",
          "avatar": null,
          "created_at": "2024-07-02T09:57:45.000000Z",
          "updated_at": "2024-07-02T09:57:45.000000Z",
          "last_login_at": null,
          "last_login_ip": null,
          "profile_photo_path": null,
          "pivot": {
            "model_type": "App\\Models\\User",
            "role_id": 5,
            "model_id": 2
          }
        }
      ]
    }
  ],
  "orderColumnName": "id"
}
