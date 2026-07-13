import { ProductService } from '../../services/product.service';
import { ProductRepository } from '../../repositories/product.repository';
import { CategoryRepository } from '../../repositories/category.repository';
import { FavoriteRepository } from '../../repositories/favorite.repository';
import { AppError } from '../../middlewares/error.middleware';

jest.mock('../../repositories/product.repository');
jest.mock('../../repositories/category.repository');
jest.mock('../../repositories/favorite.repository');

const MockProductRepo = ProductRepository as jest.MockedClass<typeof ProductRepository>;
const MockCategoryRepo = CategoryRepository as jest.MockedClass<typeof CategoryRepository>;
const MockFavoriteRepo = FavoriteRepository as jest.MockedClass<typeof FavoriteRepository>;

const mockCategory = { id: 'cat-1', name: 'Semen', slug: 'semen' };
const mockProduct = {
  id: 'prod-1', name: 'Semen Holcim 50kg', slug: 'semen-holcim-50kg',
  description: 'Semen Portland tipe I', price: { toString: () => '68000' },
  stock: 500, weight: { toString: () => '50' }, imageUrl: null,
  status: 'ACTIVE', isFeatured: true, viewCount: 0,
  categoryId: 'cat-1', category: mockCategory,
  deletedAt: null, createdAt: new Date(), updatedAt: new Date(),
};

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: jest.Mocked<ProductRepository>;
  let categoryRepo: jest.Mocked<CategoryRepository>;
  let favoriteRepo: jest.Mocked<FavoriteRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    productRepo = new MockProductRepo() as jest.Mocked<ProductRepository>;
    categoryRepo = new MockCategoryRepo() as jest.Mocked<CategoryRepository>;
    favoriteRepo = new MockFavoriteRepo() as jest.Mocked<FavoriteRepository>;
    service = new ProductService(productRepo, categoryRepo, favoriteRepo);
  });

  describe('getAll', () => {
    it('should return paginated products', async () => {
      productRepo.findAll.mockResolvedValue({ products: [mockProduct as any], total: 1, page: 1, limit: 10 });
      favoriteRepo.getFavoriteProductIds.mockResolvedValue([]);

      const result = await service.getAll({ page: 1, limit: 10 });
      expect(result.products).toHaveLength(1);
      expect(result.products[0].price).toBe(68000);
    });
  });

  describe('getById', () => {
    it('should return product by id and increment view count', async () => {
      productRepo.findById.mockResolvedValue(mockProduct as any);
      productRepo.incrementViewCount.mockResolvedValue(undefined);
      favoriteRepo.findByUserAndProduct.mockResolvedValue(null);

      const result = await service.getById('prod-1');
      expect(result.id).toBe('prod-1');
      expect(productRepo.incrementViewCount).toHaveBeenCalledWith('prod-1');
    });

    it('should throw 404 if product not found', async () => {
      productRepo.findById.mockResolvedValue(null);
      await expect(service.getById('non-existent')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      categoryRepo.findById.mockResolvedValue({ id: 'cat-1' } as any);
      productRepo.findBySlug.mockResolvedValue(null);
      productRepo.create.mockResolvedValue(mockProduct as any);

      const dto = {
        name: 'Semen Holcim 50kg', price: 68000, stock: 500,
        categoryId: 'cat-1', status: 'ACTIVE' as const, isFeatured: true,
      };
      const result = await service.create(dto);
      expect(result.name).toBe('Semen Holcim 50kg');
    });

    it('should throw 404 if category does not exist', async () => {
      categoryRepo.findById.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Test', price: 100, stock: 10, categoryId: 'bad-id' }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      productRepo.findById.mockResolvedValue(mockProduct as any);
      productRepo.update.mockResolvedValue({ ...mockProduct, price: { toString: () => '75000' } } as any);

      const result = await service.update('prod-1', { price: 75000 });
      expect(result.price).toBe(75000);
    });

    it('should throw 404 if product not found for update', async () => {
      productRepo.findById.mockResolvedValue(null);
      await expect(service.update('non-existent', { price: 1000 })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('delete', () => {
    it('should soft delete product', async () => {
      productRepo.findById.mockResolvedValue(mockProduct as any);
      productRepo.softDelete.mockResolvedValue({ ...mockProduct, deletedAt: new Date() } as any);

      await expect(service.delete('prod-1')).resolves.not.toThrow();
      expect(productRepo.softDelete).toHaveBeenCalledWith('prod-1');
    });
  });

  describe('getFeatured', () => {
    it('should return featured products', async () => {
      productRepo.getFeatured.mockResolvedValue([mockProduct as any]);
      const result = await service.getFeatured(8);
      expect(result).toHaveLength(1);
      expect(result[0].isFeatured).toBe(true);
    });
  });
});
