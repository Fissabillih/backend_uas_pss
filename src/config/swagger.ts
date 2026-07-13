import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TB Mulya Abadi Backend API',
      version: '1.0.0',
      description: `
# TB Mulya Abadi - Material Store REST API

Dokumentasi lengkap REST API untuk toko bangunan TB Mulya Abadi.

## Informasi Toko
- **Nama:** TB Mulya Abadi
- **Alamat:** Jl. Gatot Subroto No.113, Bojongbata, Pemalang, Jawa Tengah
- **Jam Buka:** Senin–Sabtu 07:30–17:00 WIB | Minggu 07:30–14:00 WIB
- **Keunggulan:** Gratis ongkos kirim untuk area Kota Pemalang

## Authentication
API ini menggunakan JWT Bearer Token. Untuk mengakses endpoint yang memerlukan autentikasi:
1. Lakukan login melalui \`POST /api/v1/auth/login\`
2. Salin **access_token** dari response
3. Klik tombol **Authorize** dan masukkan: \`Bearer <your_token>\`

## Rate Limiting
- 100 requests per 15 menit per IP address

## Standard Response Format
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}
\`\`\`
      `,
      contact: {
        name: 'TB Mulya Abadi',
        email: 'info@tbmulyaabadi.com',
        url: 'https://tbmulyaabadi.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${env.APP_URL}/api/${env.API_VERSION}`,
        description: env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
            meta: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
            errors: {
              type: 'array',
              items: { type: 'object', properties: { field: { type: 'string' }, message: { type: 'string' } } },
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Budi Santoso' },
            email: { type: 'string', format: 'email', example: 'budi@example.com' },
            phone: { type: 'string', example: '+6281234567890' },
            address: { type: 'string', example: 'Jl. Ahmad Yani No. 45, Pemalang' },
            avatarUrl: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['ADMIN', 'USER'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Semen' },
            slug: { type: 'string', example: 'semen' },
            description: { type: 'string', nullable: true },
            iconUrl: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            sortOrder: { type: 'integer' },
            productCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Semen Portland Holcim 50kg' },
            slug: { type: 'string', example: 'semen-portland-holcim-50kg' },
            description: { type: 'string', nullable: true },
            price: { type: 'number', example: 68000 },
            stock: { type: 'integer', example: 500 },
            weight: { type: 'number', nullable: true, example: 50 },
            imageUrl: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
            isFeatured: { type: 'boolean' },
            categoryId: { type: 'string', format: 'uuid' },
            category: { $ref: '#/components/schemas/Category' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Banner: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            subtitle: { type: 'string', nullable: true },
            imageUrl: { type: 'string' },
            linkUrl: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            sortOrder: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        StoreProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            address: { type: 'string' },
            city: { type: 'string' },
            province: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', nullable: true },
            openMonFri: { type: 'string' },
            openSaturday: { type: 'string' },
            openSunday: { type: 'string' },
            isDeliveryFree: { type: 'boolean' },
            deliveryNote: { type: 'string', nullable: true },
          },
        },
      },
    },
    tags: [
      { name: 'System', description: 'System health and version endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Store', description: 'Public store profile' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Products', description: 'Product management' },
      { name: 'Banners', description: 'Banner management' },
      { name: 'Favorites', description: 'User favorites' },
      { name: 'Users', description: 'User management (Admin)' },
      { name: 'Dashboard', description: 'Admin dashboard statistics' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/swagger/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
