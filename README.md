## ![github-cover](https://github.com/adaface-x/og-image/assets/2704679/7688bfd3-eae7-4fef-84b6-101483ad695b)

# Open Graph Image Generator

[OG Image Generator](https://open-source.adaface.com/og-image) is an open source open graph and meta image generator.

You can use it without installing anything. You can also use the open source version to self-host.

### Sample meta images generated using the generator:

- https://open-source.adaface.com/og-image/OG%20Image%20Generator.png?name=Adaface&tags=Open%20source&authorName=Sanjana&emoji=%E2%9C%A8&profilePicture=https://res.cloudinary.com/adaface/image/upload/v1692702368/sanjana_kumari.jpg&backgroundColor=%23011f8a&fontColor=%23ffffff

## Table of contents

- [Getting Started](#getting-started)
  - [Pre-requisites](#pre-requisites)
  - [Development](#development)
- [Access Control](#access-control)
  - [Enabling CORS Restrictions](#enabling-cors-restrictions)
  - [Configuration Examples](#configuration-examples)
- [Community](#community)
- [License](#license)

## Getting started

These instructions will help you to get a copy of the project up and running on your local machine

### Pre-requisites

- Install the latest version of Docker, Docker-compose on your system

### Development

1. Execute the following commands from the main folder:
   ```
   docker-compose -f docker-compose.dev.yml up
   ```
2. Visit localhost:4000

## Access Control

By default, the OG Image Generator is open and accessible from any domain. However, if you're running this in production and want to restrict access to specific domains (like your frontend applications), you can enable CORS restrictions.

### Enabling CORS Restrictions

CORS (Cross-Origin Resource Sharing) restrictions are perfect for controlling which domains can access your image generation service from web browsers.

1. Create or edit your `.env` file and set the following variables:

   ```bash
   # Enable CORS restrictions
   ENABLE_CORS_RESTRICTION=true

   # Set allowed origins (comma-separated)
   ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://staging.yourdomain.com
   ```

### Configuration Examples

#### Basic Domain Restriction

```bash
# Allow only your main domain
ENABLE_CORS_RESTRICTION=true
ALLOWED_ORIGINS=https://yourdomain.com
```

#### Multiple Domains

```bash
# Allow multiple specific domains
ENABLE_CORS_RESTRICTION=true
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://admin.yourdomain.com
```

#### Wildcard Subdomains

```bash
# Allow all subdomains of yourdomain.com
ENABLE_CORS_RESTRICTION=true
ALLOWED_ORIGINS=*.yourdomain.com
```

### How It Works

When CORS restrictions are enabled, they only apply to the `/og-image` endpoints. The queue monitoring and other APIs remain unrestricted.

**For OG Image Generation (`/og-image/*`):**

- ✅ **Allowed**: Requests from browsers on permitted domains
- ❌ **Blocked**: Direct server-to-server requests (no origin header)
- ❌ **Blocked**: Requests from browsers on non-permitted domains
- ❌ **Blocked**: Requests from unauthorized web applications

## Community

- [Twitter](https://twitter.com/AdafaceHQ): Adaface Open Source

## License

- GNU General Public License v3.0: [Full license here](https://github.com/adaface-x/og-image/blob/main/LICENSE)
