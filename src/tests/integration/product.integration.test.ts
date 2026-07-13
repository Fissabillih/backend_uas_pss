import request from 'supertest';
import app from '../../app';

describe('Product Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let createdProductId: string;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@tbmulyaabadi.com', password: 'Admin123!' });
    adminToken = adminRes.body.data?.accessToken ?? '';

    const userRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@tbmulyaabadi.com', password: 'User123!' });
    userToken = userRes.body.data?.accessToken ?? '';
  });

  describe('GET /api/v1/products', () => {
    it('should return products list (public)', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
    });

    it('should support keyword search', async () => {
      const res = await request(app).get('/api/v1/products?keyword=semen');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/v1/products?categoryId=00000000-0000-0000-0000-000000000030');
      expect(res.status).toBe(200);
    });

    it('should filter by price range', async () => {
      const res = await request(app).get('/api/v1/products?minPrice=50000&maxPrice=100000');
      expect(res.status).toBe(200);
    });

    it('should sort by price ascending', async () => {
      const res = await request(app).get('/api/v1/products?sort=price_asc&limit=5');
      expect(res.status).toBe(200);
      const prices = res.body.data.map((p: { price: number }) => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('should sort alphabetically', async () => {
      const res = await request(app).get('/api/v1/products?sort=alphabetical&limit=5');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/products/featured', () => {
    it('should return featured products', async () => {
      const res = await request(app).get('/api/v1/products/featured');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/products/newest', () => {
    it('should return newest products', async () => {
      const res = await request(app).get('/api/v1/products/newest');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/products/slug/:slug', () => {
    it('should return product by slug', async () => {
      const res = await request(app)
        .get('/api/v1/products/slug/semen-portland-tipe-i-holcim-50kg');
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe('semen-portland-tipe-i-holcim-50kg');
    });

    it('should return 404 for unknown slug', async () => {
      const res = await request(app).get('/api/v1/products/slug/no-such-product');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/products (Admin)', () => {
    it('should create product with admin token', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', `Test Product ${Date.now()}`)
        .field('description', 'Integration test product')
        .field('price', '99000')
        .field('stock', '100')
        .field('weight', '5')
        .field('categoryId', '00000000-0000-0000-0000-000000000030')
        .field('status', 'ACTIVE')
        .field('isFeatured', 'false');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdProductId = res.body.data.id;
    });

    it('should reject product creation for regular user', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .field('name', 'Should Fail')
        .field('price', '1000')
        .field('stock', '10')
        .field('categoryId', '00000000-0000-0000-0000-000000000030');

      expect(res.status).toBe(403);
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('PUT /api/v1/products/:id (Admin)', () => {
    it('should update product price and stock', async () => {
      if (!createdProductId) return;
      const res = await request(app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('price', '110000')
        .field('stock', '200');

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(110000);
    });
  });

  describe('Favorites with Products', () => {
    it('should toggle a product as favorite', async () => {
      if (!createdProductId) return;
      const res = await request(app)
        .post(`/api/v1/favorites/${createdProductId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('isFavorited');
    });
  });

  describe('DELETE /api/v1/products/:id (Admin)', () => {
    it('should soft delete product', async () => {
      if (!createdProductId) return;
      const res = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
