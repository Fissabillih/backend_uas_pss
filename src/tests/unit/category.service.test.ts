import { CategoryService } from '../../services/category.service';
import { CategoryRepository } from '../../repositories/category.repository';
import { AppError } from '../../middlewares/error.middleware';

jest.mock('../../repositories/category.repository');

const MockCategoryRepo = CategoryRepository as jest.MockedClass<typeof CategoryRepository>;

const mockCategory = {
  id: 'cat-1', name: 'Semen', slug: 'semen', description: null, iconUrl: null,
  isActive: true, sortOrder: 1, deletedAt: null, createdAt: new Date(), updatedAt: new Date(),
  _count: { products: 5 },
};

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new MockCategoryRepo() as jest.Mocked<CategoryRepository>;
    service = new CategoryService(repo);
  });

  describe('getAll', () => {
    it('should return paginated categories', async () => {
      repo.findAll.mockResolvedValue({ categories: [mockCategory as any], total: 1, page: 1, limit: 10 });
      const result = await service.getAll();
      expect(result.categories).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return category by id', async () => {
      repo.findById.mockResolvedValue(mockCategory as any);
      const result = await service.getById('cat-1');
      expect(result.id).toBe('cat-1');
      expect(result.name).toBe('Semen');
    });

    it('should throw 404 if category not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.getById('non-existent')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      repo.findByName.mockResolvedValue(null);
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockResolvedValue(mockCategory as any);

      const result = await service.create({ name: 'Semen', isActive: true, sortOrder: 1 });
      expect(result.name).toBe('Semen');
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw 409 if name already exists', async () => {
      repo.findByName.mockResolvedValue(mockCategory as any);
      await expect(service.create({ name: 'Semen' })).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      repo.findById.mockResolvedValue(mockCategory as any);
      repo.findByName.mockResolvedValue(null);
      repo.update.mockResolvedValue({ ...mockCategory, name: 'Semen Updated', _count: undefined } as any);

      const result = await service.update('cat-1', { name: 'Semen Updated' });
      expect(result.name).toBe('Semen Updated');
    });

    it('should throw 404 if category not found for update', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.update('non-existent', { name: 'Test' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('delete', () => {
    it('should soft delete category', async () => {
      repo.findById.mockResolvedValue(mockCategory as any);
      repo.softDelete.mockResolvedValue({ ...mockCategory, deletedAt: new Date(), _count: undefined } as any);

      await expect(service.delete('cat-1')).resolves.not.toThrow();
      expect(repo.softDelete).toHaveBeenCalledWith('cat-1');
    });

    it('should throw 404 if category not found for delete', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.delete('non-existent')).rejects.toThrow(AppError);
    });
  });
});
