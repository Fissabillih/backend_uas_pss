import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BannerRepository } from '../repositories/banner.repository';

export class DashboardService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly bannerRepo: BannerRepository,
  ) {}

  async getStatistics() {
    const [
      totalUsers, totalAdmins, totalProducts, activeProducts,
      inactiveProducts, outOfStockProducts, totalCategories, totalBanners,
      featuredProducts, newestProducts, lowStockProducts,
    ] = await Promise.all([
      this.userRepo.countAll(),
      this.userRepo.countByRole('ADMIN'),
      this.productRepo.countAll(),
      this.productRepo.countByStatus('ACTIVE'),
      this.productRepo.countByStatus('INACTIVE'),
      this.productRepo.countByStatus('OUT_OF_STOCK'),
      this.categoryRepo.countAll(),
      this.bannerRepo.countAll(),
      this.productRepo.getFeatured(5),
      this.productRepo.getNewest(5),
      this.productRepo.getLowStock(10, 5),
    ]);

    return {
      users: {
        total: totalUsers,
        admins: totalAdmins,
        customers: totalUsers - totalAdmins,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        outOfStock: outOfStockProducts,
      },
      categories: {
        total: totalCategories,
      },
      banners: {
        total: totalBanners,
      },
      recentFeaturedProducts: featuredProducts.map((p) => ({
        id: p.id, name: p.name, price: parseFloat(p.price.toString()),
        stock: p.stock, imageUrl: p.imageUrl, status: p.status,
      })),
      newestProducts: newestProducts.map((p) => ({
        id: p.id, name: p.name, price: parseFloat(p.price.toString()),
        stock: p.stock, imageUrl: p.imageUrl, status: p.status,
        createdAt: p.createdAt,
      })),
      lowStockAlerts: lowStockProducts.map((p) => ({
        id: p.id, name: p.name, stock: p.stock,
        category: p.category?.name ?? 'N/A',
      })),
    };
  }
}
