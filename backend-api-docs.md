# Resonance API Documentation

**Base URL**: `https://app.resonance.org.in/api`

## Authentication Protocol
- **Access Tokens**: Returned in the JSON response payload on login/register. Must be sent in the `Authorization: Bearer <token>` header for protected routes.
- **Refresh Tokens**: Automatically set as HTTP-Only cookies (`refreshToken`). No need to manually manage them on the frontend.
- **Optional Auth**: Some routes return more personalized data if an `Authorization` header is provided, but don't strictly require it.

---

## 1. Auth (`/api/auth`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST` | `/register` | Public | Register a new user | `{ email, username, password, displayName }` |
| `POST` | `/login` | Public | Login | `{ email, password }` |
| `POST` | `/logout` | Public | Clears the refresh token cookie | None |
| `POST` | `/refresh` | Public | Get a new access token (uses cookie) | None |
| `POST` | `/forgot-password` | Public | Request a reset token | `{ email }` |
| `POST` | `/reset-password` | Public | Reset password using token | `{ token, newPassword }` |
| `POST` | `/change-password` | **Req** | Change password while logged in | `{ oldPassword, newPassword }` |
| `GET`  | `/me` | **Req** | Get current authenticated user | None |

## 2. Users (`/api/users`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/:username` | Opt | Get public user profile | None |
| `PUT` | `/profile` | **Req** | Update current user's profile | `{ displayName, bio, avatar, coverImage, website, location }` |

## 3. Articles (`/api/articles`) - Long-form content
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/` | Opt | List all published articles | `?page, limit, username` |
| `GET` | `/my` | **Req** | List author's own articles (Drafts + Published) | `?page, limit` |
| `GET` | `/:slug` | Opt | Get a specific published article | None |
| `POST`| `/` | **Req** | Create article (Defaults to draft) | `{ title, content, coverImage, published? }` |
| `PUT` | `/:id` | **Req** | Update article content/metadata | `{ title, content, coverImage }` |
| `PATCH`| `/:id/publish` | **Req** | Set article status to Published | None |
| `PATCH`| `/:id/unpublish`| **Req** | Revert article back to Draft | None |
| `DELETE`| `/:id` | **Req** | Delete an article | None |

## 4. Posts (`/api/posts`) - Short-form content
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/` | Opt | List public posts | `?page, limit, username` |
| `GET` | `/:id` | Opt | Get specific post by ID | None |
| `POST`| `/` | **Req** | Create a new short-form post | `{ content, mediaUrl, mediaType }` |
| `DELETE`| `/:id`| **Req** | Delete a post | None |

## 5. Feeds (`/api/feeds`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/global` | Opt | Chronological feed of all public posts/articles | `?page, limit` |
| `GET` | `/home` | **Req** | Algorithmic/Timeline feed of followed users | `?page, limit` |

## 6. Follows (`/api/follows`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST`| `/:username` | **Req** | Toggle follow/unfollow for a user | None |
| `GET` | `/:username/followers` | Public | List followers of a user | `?page, limit` |
| `GET` | `/:username/following` | Public | List users this person follows | `?page, limit` |
| `GET` | `/:username/mutual` | Public | List mutual followers | `?page, limit` |
| `GET` | `/suggestions/users` | **Req** | Recommend users to follow | `?limit` |

## 7. Comments (`/api/comments`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/:entityType/:entityId` | Opt | Get root comments (`POST` or `ARTICLE`) | `?page, limit` |
| `GET` | `/:parentId/replies` | Opt | Get threaded replies to a comment | `?page, limit` |
| `POST`| `/` | **Req** | Create comment/reply | `{ entityType, entityId, content, parentId? }` |
| `DELETE`| `/:id` | **Req** | Delete comment | None |

## 8. Likes (`/api/likes`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST`| `/` | **Req** | Toggle like/unlike | `{ entityType, entityId }` |
| `GET` | `/:entityType/:entityId` | Public | Get users who liked an entity | `?page, limit` |

## 9. Bookmarks (`/api/bookmarks`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST`| `/` | **Req** | Toggle bookmark | `{ entityType, entityId }` |
| `GET` | `/posts` | **Req** | Get user's bookmarked posts | `?page, limit` |
| `GET` | `/articles` | **Req** | Get user's bookmarked articles | `?page, limit` |

## 10. Reposts (`/api/reposts`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST`| `/` | **Req** | Toggle repost/un-repost | `{ postId }` |
| `GET` | `/post/:postId` | Opt | Users who reposted this post | `?page, limit` |

## 11. Search (`/api/search`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/users` | Public | Search users by name/username | `?q, page, limit` |
| `GET` | `/posts` | Public | Search posts by content | `?q, page, limit` |
| `GET` | `/articles`| Public | Search articles by content/title | `?q, page, limit` |

## 12. Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `GET` | `/` | **Req** | Get current user's notifications | `?page, limit, unreadOnly=true` |
| `PUT` | `/read-all`| **Req** | Mark all as read | None |
| `PUT` | `/:id/read`| **Req** | Mark specific notification as read | None |

## 13. Uploads (`/api/uploads`)
| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|---|---|---|
| `POST`| `/image` | **Req** | Upload image to Cloudinary (returns URL) | Form-Data: `image=File` |
