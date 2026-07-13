import request from 'supertest';
import app from '../../app';

describe('Category Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let createdCategoryId: string;

  beforeAll(async () => {
    // Get admin token
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@tbmulyaabadi.com', password: 'Admin123!' });
    adminToken = adminRes.body.data?.accessToken ?? '';

    // Get user token
    const userRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@tbmulyaabadi.com', password: 'User123!' });
    userToken = userRes.body.data?.accessToken ?? '';
  });

  describe('GET /api/v1/categories', () => {
    it('should return categories list (public)', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta).toHaveProperty('total');
    });

    it('should filter by isActive=true', async () => {
      const res = await request(app).get('/api/v1/categories?isActive=true');
      expect(res.status).toBe(200);
      expect(res.body.data.every((c: { isActive: boolean }) => c.isActive === true)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/v1/categories?page=1&limit=3');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(3);
    });
  });

  describe('GET /api/v1/categories/slug/:slug', () => {
    it('should return category by slug', async () => {
      const res = await request(app).get('/api/v1/categories/slug/semen');
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe('semen');
    });

    it('should return 404 for unknown slug', async () => {
      const res = await request(app).get('/api/v1/categories/slug/unknown-slug-xyz');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/categories (Admin)', () => {
    it('should create category with admin token', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Test Category ${Date.now()}`,
          description: 'A test category',
          isActive: true,
          sortOrder: 99,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdCategoryId = res.body.data.id;
    });

    it('should reject category creation without admin token', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Should Fail', isActive: true });
      expect(res.status).toBe(403);
    });

    it('should reject without auth token', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'No Auth', isActive: true });
      expect(res.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(422);
    });
  });

  describe('PUT /api/v1/categories/:id (Admin)', () => {
    it('should update category', async () => {
      if (!createdCategoryId) return;
      const res = await request(app)
        .put(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Updated description' });

      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe('Updated description');
    });
  });

  describe('DELETE /api/v1/categories/:id (Admin)', () => {
    it('should soft delete category', async () => {
      if (!createdCategoryId) return;
      const res = await request(app)
        .delete(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
